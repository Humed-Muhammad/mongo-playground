import { Settings } from "@/types";

export const themeBGColor = (settings: Partial<Settings>) =>
  settings.theme === "vs-dark"
    ? "bg-[#1E1E1E] text-white"
    : "bg-white text-gray-700";

export const themeTextColor = (settings: Partial<Settings>) =>
  settings.theme === "vs-dark" ? "text-white" : "text-[#1E1E1E]";

export const settingsInitial: Settings = {
  collectionName: "test",
  dbName: "test",
  query: "[]",
  theme: "vs-dark",
  url: "mongodb://127.0.0.1:27017",
};

export const suggestions = (monaco: any) => {
  const kind = monaco.languages.CompletionItemKind.Keyword;

  return [
    { label: "$newField", kind },
    { label: "$geoNear", kind },
    { label: "$graphLookup", kind },
    { label: "$count", kind },
    { label: "$collStats", kind },
    { label: "$densify", kind },
    { label: "$lookup", kind },
    { label: "$abs", kind },
    { label: "$documents", kind },
    { label: "$facet", kind },
    { label: "$fill", kind },
    {
      label: "$accumulator",
      kind,
    },
    { label: "$add", kind },
    { label: "$addToSet", kind },
    {
      label: "$allElementsTrue",
      kind,
    },
    { label: "$and", kind },
    {
      label: "$anyElementTrue",
      kind,
    },
    {
      label: "$arrayElemAt",
      kind,
    },
    {
      label: "$arrayToObject",
      kind,
    },
    { label: "$asin", kind },
    { label: "$atan", kind },
    { label: "$atan2", kind },
    { label: "$avg", kind },
    {
      label: "$bedgeoIntersects",
      kind,
    },
    { label: "$bgeoWithin", kind },
    { label: "$bin", kind },
    { label: "$bit", kind },
    { label: "$bsonSize", kind },
    { label: "$bucket", kind },
    { label: "$bucketAuto", kind },
    { label: "$ceil", kind },
    { label: "$cmp", kind },
    { label: "$concat", kind },
    {
      label: "$concatArrays",
      kind,
    },
    { label: "$cond", kind },
    { label: "$convert", kind },
    { label: "$cos", kind },
    {
      label: "$dateFromParts",
      kind,
    },
    {
      label: "$dateToParts",
      kind,
    },
    {
      label: "$dateFromString",
      kind,
    },
    {
      label: "$dateToString",
      kind,
    },
    { label: "$dayOfMonth", kind },
    { label: "$dayOfWeek", kind },
    { label: "$dayOfYear", kind },
    {
      label: "$degreesToRadians",
      kind,
    },
    { label: "$divide", kind },
    { label: "$each", kind },
    { label: "$elemMatch", kind },
    { label: "$exp", kind },
    { label: "$exists", kind },
    { label: "$expr", kind },
    { label: "$filter", kind },
    { label: "$first", kind },
    { label: "$floor", kind },
    { label: "$function", kind },
    {
      label: "$geoIntersects",
      kind,
    },
    { label: "$geoWithin", kind },
    { label: "$group", kind },
    { label: "$gt", kind },
    { label: "$gte", kind },
    { label: "$hour", kind },
    { label: "$ifNull", kind },
    { label: "$in", kind },
    {
      label: "$indexOfArray",
      kind,
    },
    {
      label: "$indexOfBytes",
      kind,
    },
    { label: "$indexOfCP", kind },
    { label: "$indexStats", kind },
    { label: "$isArray", kind },
    {
      label: "$isoDayOfWeek",
      kind,
    },
    { label: "$isoWeek", kind },
    {
      label: "$isoWeekYear",
      kind,
    },
    { label: "$jsonSchema", kind },
    { label: "$last", kind },
    { label: "$let", kind },
    { label: "$limit", kind },
    { label: "$literal", kind },
    { label: "$ln", kind },
    { label: "$log", kind },
    { label: "$log10", kind },
    { label: "$lt", kind },
    { label: "$lte", kind },
    { label: "$ltrim", kind },
    { label: "$map", kind },
    { label: "$match", kind },
    { label: "$max", kind },
    { label: "$merge", kind },
    { label: "$mergeInto", kind },
    {
      label: "$mergeObjects",
      kind,
    },
    { label: "$meta", kind },
    {
      label: "$millisecond",
      kind,
    },
    { label: "$minute", kind },
    { label: "$mod", kind },
    { label: "$month", kind },
    { label: "$multiply", kind },
    { label: "$ne", kind },
    { label: "$not", kind },
    {
      label: "$objectToArray",
      kind,
    },
    { label: "$or", kind },
    { label: "$pow", kind },
    { label: "$push", kind },
    { label: "$project", kind },
    { label: "$range", kind },
    { label: "$reduce", kind },
    { label: "$regexFind", kind },
    {
      label: "$regexFindAll",
      kind,
    },
    { label: "$regexMatch", kind },
    { label: "$replaceOne", kind },
    { label: "$replaceAll", kind },
    {
      label: "$reverseArray",
      kind,
    },
    { label: "$round", kind },
    { label: "$rtrim", kind },
    { label: "$search", kind },
    { label: "$second", kind },
    {
      label: "$setDifference",
      kind,
    },
    { label: "$setEquals", kind },
    {
      label: "$setIntersection",
      kind,
    },
    {
      label: "$setIsSubset",
      kind,
    },
    { label: "$setUnion", kind },
    { label: "$size", kind },
    { label: "$sin", kind },
    { label: "$slice", kind },
    { label: "$split", kind },
    { label: "$sqrt", kind },
    { label: "$stdDevPop", kind },
    { label: "$stdDevSamp", kind },
    { label: "$strcasecmp", kind: monaco.languages.CompletionItemKind },
    { label: "$substr", kind },
    {
      label: "$substrBytes",
      kind,
    },
    { label: "$substrCP", kind },
    { label: "$subtract", kind },
    { label: "$sum", kind },
    { label: "$switch", kind },
    { label: "$tan", kind },
    { label: "$toBool", kind },
    { label: "$toDate", kind },
    { label: "$toDecimal", kind },
    { label: "$toDouble", kind },
    { label: "$toInt", kind },
    { label: "$toLong", kind },
    { label: "$toObjectId", kind },
    { label: "$toString", kind },
    { label: "$trim", kind },
    { label: "$trunc", kind },
    { label: "$type", kind },
    { label: "$unset", kind },
    { label: "$unwind", kind },
    { label: "$week", kind },
    { label: "$year", kind },
    { label: "$zip", kind },
  ];
};
