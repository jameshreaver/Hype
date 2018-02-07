'use strict';

import EventMetric from "./metrics/EventMetric";


export function logEvent(event) {
  return new EventMetric(event);
}
