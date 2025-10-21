import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import crypto from "crypto";
import { StringModel } from "../models/string.model";
import AppError from "../utils/app-error";

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
