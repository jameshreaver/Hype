import { computeUntilDate } from './compute';

export function processMetrics(exp, data) {
  return exp.metrics.map(metric => {
    return processMetric(metric, exp, data)
  });
};

function processMetric(m, exp, data) {
  let metric = data.find((metric) => {
    return metric["type"] === m["type"]
      && metric["elem"] ===m["elem"];
  });
  if (!metric) return emptyMetric;
  if (m["type"] === "clicksvisit"
   || m["type"] === "conversion") {
    return processAverageMetric(m, metric, exp);
  } else {
    return processCumulativeMetric(m, metric, exp);
  }
}

function processAverageMetric(m, metric, exp) {
  let agg = aggregateAverageMetric(metric, exp);
  let totalA = sum(agg.valuesA)/sum(agg.countsA);
  let totalB = sum(agg.valuesB)/sum(agg.countsB);
  let value = processValue(m["unit"], totalA, totalB);
  let status = processMetricStatus(m["change"], m["value"], value);
  return {
    labels: agg.labels,
    datasetA: agg.datasetA,
    datasetB: agg.datasetB,
    totalA: totalA,
    totalB: totalB,
    weightedA: "-",
    weightedB: "-",
    value: value,
    status: status
  }
}

function processCumulativeMetric(m, metric, exp) {
  let perc = parseFloat(exp["settings"]["percentage"]);
  let agg = aggregateCumulativeMetric(metric, exp);
  let totalA = sum(agg.datasetA);
  let totalB = sum(agg.datasetB);
  let weightedA = processWeighted(totalA, perc);
  let weightedB = processWeighted(totalB, 100-perc);
  let value = processValue(m["unit"], weightedA, weightedB);
  let status = processMetricStatus(m["change"], m["value"], value);
  return {
    labels: agg.labels,
    datasetA: agg.datasetA,
    datasetB: agg.datasetB,
    totalA: totalA,
    totalB: totalB,
    weightedA: weightedA,
    weightedB: weightedB,
    value: value,
    status: status
  }
}

function aggregateCumulativeMetric(metric, exp) {
  let agg = {
    labels:  [],
    datasetA:[],
    datasetB:[]
  };
  let today = new Date().setDate(new Date().getDate() + 1);
  for (let date = new Date(exp["time"]["started"]);
    date <= Math.min(today, computeUntilDate(exp));
    date.setDate(date.getDate()+1)) {
    let label = date.toLocaleDateString('en-US');
    agg.labels.push(label);
    if (metric.data[label]) {
      let datum = metric.data[label][exp["settings"]["main-branch"]];
      agg.datasetA.push((datum) ? datum["count"] : 0);
      datum = metric.data[label][exp["settings"]["exp-branch"]];
      agg.datasetB.push((datum) ? datum["count"] : 0);
    } else {
      agg.datasetA.push(0);
      agg.datasetB.push(0);
    }
  }
  return agg;
}

function aggregateAverageMetric(metric, exp) {
  let agg = {
    labels:  [],
    datasetA:[],
    datasetB:[],
    valuesA: [],
    valuesB: [],
    countsA: [],
    countsB: []
  };
  let today = new Date().setDate(new Date().getDate() + 1);
  for (let date = new Date(exp["time"]["started"]);
    date <= Math.min(today, computeUntilDate(exp));
    date.setDate(date.getDate()+1)) {
    let label = date.toLocaleDateString('en-US');
    agg.labels.push(label);
    if (metric.data[label]) {
      let datum = metric.data[label][exp["settings"]["main-branch"]];
      agg.countsA.push((datum) ? datum["count"] : 0);
      agg.valuesA.push((datum) ? datum["value"] : 0);
      agg.datasetA.push((datum) ? (
        datum["count"] ? datum["value"]/datum["count"] : 0) : 0);
      datum = metric.data[label][exp["settings"]["exp-branch"]];
      agg.countsB.push((datum) ? datum["count"] : 0);
      agg.valuesB.push((datum) ? datum["value"] : 0);
      agg.datasetB.push((datum) ? (
        datum["count"] ? datum["value"]/datum["count"] : 0) : 0);
    } else {
      agg.countsA.push(0); agg.valuesA.push(0); agg.datasetA.push(0);
      agg.countsB.push(0); agg.valuesB.push(0); agg.datasetB.push(0);
    }
  }
  return agg;
}

function processValue(unit, a, b) {
  let diff = b - a;
  switch(unit) {
    case "percentage": return diff*100/(a ? a : diff);
    case "magnitude" : return diff;
    default: return diff;
  }
}

function processWeighted(total, perc) {
  return (perc) ? (total * 50)/perc : 0;
}

function sum(array) {
  return array.reduce((x, y) => x + y, 0);
}

function processMetricStatus(change, expected, current) {
  if (current === "-") return false;
  switch (change) {
    case "+" : return current >= expected;
    case "-" : return current <= -expected;
    case ">-": return current >= -expected;
    case "<+": return current <= expected;
    default: return false;
  }
}

const emptyMetric = {
  labels: [],
  datasetA: [],
  datasetB: [],
  totalA: "-",
  totalB: "-",
  weightedA: "-",
  weightedB: "-",
  value: "-",
  status: false
};
