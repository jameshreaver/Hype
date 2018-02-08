import dispatch from "../dispatch";


export default class EventMetric {

  constructor(e) {
    this.event = e;
    this.data = {};
  }

  withId() {
    this.data.id = this.event.target.id;
    return this;
  }

  withURL() {
    this.data.url = this.event.view.document.URL;
    return this;
  }

  withTimeStamp() {
    this.data.timestamp = this.event.timeStamp;
    return this;
  }

  log() {
    dispatch(this.data);
  }
}
