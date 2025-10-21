import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import crypto from "crypto";
import { StringModel } from "../models/string.model";
import AppError from "../utils/app-error";
import { parseNaturalQuery } from "../utils/nlpParser";

export const createString = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { value }: { value: string } = req.body;

    if (typeof value !== "string") {
      return next(new AppError("The 'value' field must be a string", 422));
    }

    const length = value.length;
    const is_palindrome = value === value.split("").reverse().join("");
    const trimmed_value = value.replaceAll(" ", "");
    const unique_characters = new Set(trimmed_value).size;
    const word_count =
      value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
    const sha256_hash = crypto.createHash("sha256").update(value).digest("hex");

    const character_frequency_map: Record<string, number> = {};
    for (const char of trimmed_value) {
      character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
    }

    const string = await StringModel.create({
      id: sha256_hash,
      value,
      properties: {
        length,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map,
      },
      created_at: new Date(),
    });

    res.status(201).json({
      status: "success",
      data: {
        string: string.getPublicFields(),
      },
    });
  }
);

export const getString = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { string_value } = req.params;

    if (string_value === "filter-by-natural-language") {
      return next();
    }

    const string = await StringModel.findOne({ value: string_value });
    if (!string) {
      return next(new AppError("String not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        string: string.getPublicFields(),
      },
    });
  }
);

export const getStringByQuery = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters: any = {};
    if (req.query.is_palindrome)
      filters["properties.is_palindrome"] = req.query.is_palindrome === "true";
    if (req.query.min_length)
      filters["properties.length"] = { $gte: +req.query.min_length };
    if (req.query.max_length)
      filters["properties.length"] = {
        ...filters["properties.length"],
        $lte: +req.query.max_length,
      };
    if (req.query.word_count)
      filters["properties.word_count"] = +req.query.word_count;
    if (req.query.contains_character)
      filters.value = { $regex: req.query.contains_character, $options: "i" };

    if (Object.keys(filters).length === 0) {
      return next(
        new AppError("At least one query parameter must be provided", 400)
      );
    }

    const results = await StringModel.find(filters);

    res.status(200).json({
      data: results,
      count: results.length,
      filters_applied: req.query,
    });
  }
);

export const filterByNaturalLanguage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.query;
    if (typeof query !== "string" || query.trim() === "") {
      return next(
        new AppError("A valid 'query' parameter must be provided", 400)
      );
    }

    const filters = parseNaturalQuery(query as string);
    const results = await StringModel.find(filters);

    res.status(200).json({
      data: results,
      count: results.length,
      interpreted_query: { original: query, parsed_filters: filters },
    });
  }
);
