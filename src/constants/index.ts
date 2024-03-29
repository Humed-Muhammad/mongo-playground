import { Settings } from "@/types";

export const themeBGColor = (settings: Settings) =>
  settings.theme === "vs-dark"
    ? "bg-[#1E1E1E] text-white"
    : "bg-white text-gray-700";

export const themeTextColor = (settings: Settings) =>
  settings.theme === "vs-dark" ? "text-white" : "text-[#1E1E1E]";

export const settingsInitial: Settings = {
  collectionName: "test",
  dbName: "test",
  query: "[]",
  theme: "vs-dark",
  url: "mongodb://localhost:27017",
};

export const suggestions = (monaco: any) => [
  { label: "$abs", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$accumulator", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$add", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$addToSet", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$allElementsTrue",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$and", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$anyElementTrue",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$arrayElemAt", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$arrayToObject",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$asin", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$atan", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$atan2", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$avg", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$bedgeoIntersects",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$bgeoWithin", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$bin", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$bit", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$bsonSize", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$bucket", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$bucketAuto", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$ceil", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$cmp", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$concat", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$concatArrays", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$cond", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$convert", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$cos", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$dateFromParts",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$dateToParts", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$dateFromString",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$dateToString", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$dayOfMonth", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$dayOfWeek", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$dayOfYear", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$degreesToRadians",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$divide", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$each", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$elemMatch", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$exp", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$exists", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$expr", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$filter", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$first", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$floor", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$function", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$geoIntersects",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$geoWithin", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$group", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$gt", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$gte", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$hour", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$ifNull", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$in", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$indexOfArray", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$indexOfBytes", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$indexOfCP", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$isArray", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$isoDayOfWeek", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$isoWeek", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$isoWeekYear", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$jsonSchema", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$last", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$let", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$literal", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$ln", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$log", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$log10", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$lt", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$lte", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$ltrim", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$map", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$match", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$max", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$mergeObjects", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$meta", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$millisecond", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$minute", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$mod", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$month", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$multiply", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$ne", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$not", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$objectToArray",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$or", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$pow", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$push", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$project", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$range", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$reduce", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$regexFind", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$regexFindAll", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$regexMatch", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$replaceOne", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$replaceAll", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$reverseArray", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$round", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$rtrim", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$second", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$setDifference",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$setEquals", kind: monaco.languages.CompletionItemKind.Keyword },
  {
    label: "$setIntersection",
    kind: monaco.languages.CompletionItemKind.Keyword,
  },
  { label: "$setIsSubset", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$setUnion", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$size", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$sin", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$slice", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$split", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$sqrt", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$stdDevPop", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$stdDevSamp", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$strcasecmp", kind: monaco.languages.CompletionItemKind },
  { label: "$substr", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$substrBytes", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$substrCP", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$subtract", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$sum", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$switch", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$tan", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toBool", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toDate", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toDecimal", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toDouble", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toInt", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toLong", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toObjectId", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$toString", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$trim", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$trunc", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$type", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$unset", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$unwind", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$week", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$year", kind: monaco.languages.CompletionItemKind.Keyword },
  { label: "$zip", kind: monaco.languages.CompletionItemKind.Keyword },
];
