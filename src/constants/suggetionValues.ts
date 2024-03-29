const lookup = `"$lookup": {
    "from": "collection",
    "localField": "field",
    "foreignField": "field",
    "as": "result"
  }`;

const project = `"$project": {
    "specification(s)": ""
  }`;

const newField = `"$addFields": {
    "newField": "expression"
  }
`;

const match = `"$match": {
    "query": ""
}`;

const count = `"$count": 'string'`;
const bucket = `"$bucket": {
    "groupBy": "expression",
    "boundaries": [ "lowerbound" ],
    "default": "literal",
    "output": {
      "outputN": { accumulator }
    }
  }`;
const bucketAuto = `"$bucketAuto": {
    "groupBy": "expression",
    "buckets": "number",
    "output": {
      "outputN": "accumulator"
    },
    "granularity": 'string'
  }`;
const colStats = `"$collStats": {
    "latencyStats": {
      "histograms": "boolean"
    },
    "storageStats": {},
  }`;
const densify = `$densify: {
    "field": string,
    "partitionByFields": ["string", "string", "..."],
    "range": {
      "step": "number",
      "unit": "string",
      "bounds": ["lowerbound", "upperbound"]
    }
  }`;
const documents = `"$documents": {
    expression
  }`;
const facet = `"$facet": {
    "outputFieldN": [ stageN, ... ]
  }`;
const fill = `$fill: {
    "sortBy": sortSpec,
    "partitionBy": expression,
    "partitionByFields": [string, string, ...],
    "output": {
      "field1": {"value": expression},
      "field2": {"method": string},
      ...
    }
  }
  `;
export const suggestionsAutoFillObject = {
  $project: project,
  $newField: newField,
  $match: match,
  $lookup: lookup,
  $count: count,
  $bucket: bucket,
  $bucketAuto: bucketAuto,
  $collStats: colStats,
  $densify: densify,
  $documents: documents,
  $facet: facet,
  $fill: fill,
};
