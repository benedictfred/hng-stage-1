export const parseNaturalQuery = (text: string): Record<string, any> => {
  const query = text.toLowerCase();
  const filters: any = {};

  if (query.includes("palindromic")) filters["properties.is_palindrome"] = true;
  if (query.includes("single word")) filters["properties.word_count"] = 1;

  const matchLonger = query.match(/longer than (\d+)/);
  if (matchLonger) filters["properties.length"] = { $gte: +matchLonger[1] + 1 };

  const matchContains = query.match(/containing the letter (\w)/);
  if (matchContains)
    filters.value = { $regex: matchContains[1], $options: "i" };

  return filters;
};
