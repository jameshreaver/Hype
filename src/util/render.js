export function renderUnit(unit) {
  switch (unit) {
    case "percentage": return "%";
    case "magnitude": return "";
    default: return "";
  }
}

export function renderType(type) {
  switch(type) {
    case "click": return "Clicks";
    case "pageview": return "Page views";
    case "clicksvisit": return "Clicks per visit";
    case "conversion": return "Conversion rate";
    default: return "";
  }
}

export function renderValue(value, unit) {
  return (value === "-") ? value : value.toFixed(2) + unit;
}
