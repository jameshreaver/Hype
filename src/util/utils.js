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
