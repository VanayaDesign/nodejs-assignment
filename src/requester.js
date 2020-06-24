const got = require("got")

class RequestParams {
  constructor(config, headers = {}) {
    this.config = config;

    this._headers = Object.assign(headers, {
      'Accept': this.config.content_type,
      'Content-Type': this.config.content_type
    });
  }

  /**
   *
   * @returns {Object}
   *
   */
  async get_all_headers() {
    return Object.assign(this._headers, {});
  }


  /**
   *
   * @returns {Object}
   *
   */
  async GET() {
    return {
      headers: await this.get_all_headers(),
      method: 'GET'
    }
  }

  /**
   *
   * @returns {Object}
   *
   */
  async DELETE() {
    return {
      headers: await this.get_all_headers(),
      method: 'DELETE'
    }
  }

  /**
   *
   * @param {Object} object
   * @returns {Object}
   *
   */
  async POST(object) {
    return {
      headers: Object.assign(await this.get_all_headers()),
      method: 'POST',
      body: JSON.stringify(object)
    }
  }
}

class RequestSender {
  constructor(config, headers = {}) {
    this.config = config;
    this.RequestParams = new RequestParams(config, headers);
  }

  /**
   *
   * @param {String} endpoint
   * @param {Enumerator} method
   * @param {Object} post_obj
   * @returns {Object}
   *
   */
  async SendRequest(endpoint, method, post_obj = null, headers = null) {
    const method_reference = this.RequestParams[method].bind(this.RequestParams);
    let request_headers = await method_reference(post_obj);

    if (headers != null) {

      request_headers.headers = Object.assign(request_headers.headers, headers);
    }
    headers = request_headers;
    const response = await got(endpoint, headers)
    return response
  }
}
class RequestEndpoins {
  constructor(config) {
    const {
      api_host
    } = config;
    this.routes = {
      GetCSV: `${api_host}lemon-1/scooter_1337.csv`,
      GetRatePerMinute: `${api_host}lemon-1/rate.json`,
    }
  }

  GetRoute(route_name) {
    return this.routes[route_name];
  }

}
class Requester {
  constructor(config, headers = {}) {
    this.request_sender = new RequestSender(config, headers);
    this.request_endpoints = new RequestEndpoints(config);
  }

  /**
   *
   * @returns {Promise}
   *
   */
  get_csv() {
    return this.request_sender.SendRequest(
      this.request_endpoints.GetRoute("GetCSV"),
      "GET").then(res => res);
  }

  /**
   *
   * @returns {Promise}
   *
   */
  get_rate_per_minute() {
    return this.request_sender.SendRequest(
      this.request_endpoints.GetRoute("GetRatePerMinute"),
      "GET").then(res => res);
  }
}