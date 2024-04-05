const $lookup = `$lookup: {
    from: collection,
    localField: field,
    foreignField: field,
    as: result
  }`;

const $project = `$project: {
    specification(s): 
  }`;

const $newField = `$addFields: {
    newField: expression
  }
`;

const $match = `$match: {
    query: 
}`;

const $count = `$count: 'string'`;
const $bucket = `$bucket: {
    groupBy: expression,
    boundaries: [ lowerbound, ... ],
    default: literal,
    output: {
      outputN: { accumulator } ...
    }
  }`;
const $bucketAuto = `$bucketAuto: {
    groupBy: expression,
    buckets: number,
    output: {
      outputN: accumulator
    },
    granularity: 'string'
  }`;
const $collStats = `$collStats: {
    latencyStats: {
      histograms: boolean
    },
    storageStats: {},
  }`;
const $densify = `$densify: {
    field: string,
    partitionByFields: [string, string, ...],
    range: {
      step: number,
      unit: string,
      bounds: [lowerbound, upperbound]
    }
  }`;
const $documents = `$documents: {
    expression
  }`;
const $facet = `$facet: {
    outputFieldN: [ stageN, ... ]
  }`;
const $fill = `$fill: {
    sortBy: sortSpec,
    partitionBy: expression,
    partitionByFields: [string, string, ...],
    output: {
      field1: {value: expression},
      field2: {method: string},
      ...
    }
  }
  `;

const $geoNear = `$geoNear: {
    near: { type: 'Point', coordinates: [ number, number ] },
    distanceField: 'string',
    maxDistance: number,
    query: {},
    includeLocs: '',
    num: number,
    spherical: boolean
  }`;
const $graphLookup = `$graphLookup: {
    from: 'string',
    startWith: expression,
    connectFromField: 'string',
    connectToField: 'string',
    as: 'string',
    maxDepth: number,
    depthField: 'string',
    restrictSearchWithMatch: {}
  }`;
const $group = `$group: {
    _id: expression,
    fieldN: {
      accumulatorN: expressionN
    }
  }`;
const $merge = `$merge: {
    into: 'string',
    on: 'string',
    let: 'specification(s)',
    whenMatched: 'string',
    whenNotMatched: 'string'
  }`;
const $mergeInto = `$merge: {
    into: {
      atlas: {
        clusterName: 'atlasClusterName',
        db: 'database',
        coll: 'collection',
        projectId: 'optionalAtlasProjectId'
      }
    },
    on: 'identifier',
    let: { specification(s) },
    whenMatched: 'string',
    whenNotMatched: 'string'
  }`;
const $search = ` $search: {
    index: 'string',
    text: {
      query: 'string',
      path: 'string'
    }
  }`;
export const suggestionsAutoFillObject = {
  $project,
  $newField,
  $match,
  $lookup,
  $count,
  $bucket,
  $bucketAuto,
  $collStats,
  $densify,
  $documents,
  $facet,
  $fill,
  $geoNear,
  $graphLookup,
  $group,
  $indexStats: `$indexStats: {}`,
  $limit: `$limit: number`,
  $merge,
  $mergeInto,
  $search,
};
