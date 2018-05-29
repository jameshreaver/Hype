export function computePercentage(exp) {
  let started = new Date(exp["time"]["started"]);
  let difference = new Date() - started;
  let result = difference/(computeUntilDate(exp)-started);
  return Math.min(parseInt(result * 100, 10), 100);
};

export function computeUntilDate(exp) {
  let duration = parseInt(exp["info"]["duration"], 10);
  let result = new Date(exp["time"]["started"]);
  switch (exp["info"]["durationunit"]) {
    case "d":
      result.setDate(result.getDate() + duration); break;
    case "w":
      result.setDate(result.getDate() + 7 * duration); break;
    case "m":
      result.setMonth(result.getMonth() + duration); break;
    default:
  }
  return result;
};

export function renderUnit(unit) {
  switch (unit) {
    case "percentage": return "%";
    case "magnitude": return "";
    default: return "";
  }
}

export function processMetrics(exp, data) {
  return exp.metrics.map(m => {
    return processMetric(m, exp, data)
  });
};

function processMetric(m, exp, data) {
  let metric = data.find((metric) => {
    return metric["type"] === m["type"]
      && metric["elem"] ===m["elem"];
  });
  if (!metric) {
    return {
      labels: [],
      datasetA: [],
      datasetB: [],
      totalA: "-",
      totalB: "-",
      value: "-",
      status: false
    }
  }
  let labels = [];
  let datasetA = [];
  let datasetB = [];
  for (let date = new Date(exp["time"]["started"]);
    date <= new Date().setDate(new Date().getDate() + 1);
    date.setDate(date.getDate()+1)) {
    let label = date.toLocaleDateString('en-US');
    labels.push(label);
    if (metric.data[label]) {
      let datum = metric.data[label][exp["settings"]["main-branch"]];
      datasetA.push((datum) ? datum : 0);
      datum = metric.data[label][exp["settings"]["exp-branch"]];
      datasetB.push((datum) ? datum : 0);
    } else {
      datasetA.push(0);
      datasetB.push(0);
    }
  }
  let totalA = datasetA.reduce((x, y) => x + y, 0);
  let totalB = datasetB.reduce((x, y) => x + y, 0);
  let value = ((totalB - totalA)*100/totalA).toFixed(2);
  let status = getMetricStatus(m["change"], m["value"], value);
  return {
    labels: labels,
    datasetA: datasetA,
    datasetB: datasetB,
    totalA: totalA,
    totalB: totalB,
    value: value,
    status: status
  }
}

function getMetricStatus(change, expected, current) {
  if (current === "-") return false;
  switch (change) {
    case "+" : return current >= expected;
    case "-" : return current <= -expected;
    case ">-": return current >= -expected;
    case "<+": return current <= expected;
    default: return false;
  }
}
