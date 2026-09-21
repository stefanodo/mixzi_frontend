import AuthStore from "@/stores/AuthStore";

import HttpRequestTypes, { type HttpRequestType } from "./types/HttpRequestType";
import RequestUtil from "@/utils/RequestUtil";
import { APP_MODE, MIXZI_API_BASE } from "@/config/envVariables";

export interface FetchRejectionResult {
  ok: false;
  fetchRejection: true;
  error?: Error | Response;
}

type HeadersType = {
  [key: string]: string | undefined;
};
type RequestParams = {
  [key: string]: string | undefined;
};

export default class ApiService {
  authStore: AuthStore;

  constructor(authStore: AuthStore) {
    this.authStore = authStore;
  }

  async GET(path: string): Promise<Response> {
    return this.request(path, HttpRequestTypes.GET);
  }

  async GETWithParams(path: string, params: object): Promise<Response> {
    return this.request(path, HttpRequestTypes.GET, undefined, undefined, params as RequestParams);
  }

  async PUT(path: string, body?: unknown, headers?: HeadersType, timeout = 10000): Promise<Response> {
    return this.request(path, HttpRequestTypes.PUT, headers, body, undefined, timeout);
  }

  async PUTWithParams(
    path: string,
    body?: unknown,
    params?: object,
    headers?: HeadersType,
    timeout = 10000
  ): Promise<Response> {
    return this.request(path, HttpRequestTypes.PUT, headers, body, params as RequestParams, timeout);
  }

  async POST(path: string, body?: unknown): Promise<Response> {
    return this.request(path, HttpRequestTypes.POST, undefined, body);
  }

  async PATCH(path: string, body?: unknown): Promise<Response> {
    return this.request(path, HttpRequestTypes.PATCH, undefined, body);
  }

  async DELETE(path: string, body?: unknown): Promise<Response> {
    return this.request(path, HttpRequestTypes.DELETE, undefined, body);
  }

  async request(
    path: string,
    method: HttpRequestType = HttpRequestTypes.GET,
    headers?: HeadersType,
    body?: unknown,
    params?: RequestParams,
    timeout = 100000,
    additionalRequestConfig?: Partial<Request>
  ): Promise<Response> {
    await this.authStore.onStartedRequest();

    let url = this._getApiBase();
    if (path.match(/(http:\/\/.+)|(https:\/\/)/)) {
      url = path;
    }
    const requestStats: RequestStatistics = {
      success: false,
      firedAt: Date.now(),
      executionCount: 1,
    };

    const customHeaders: { [key: string]: string } = {};
    if (headers)
      for (const header of Object.getOwnPropertyNames(headers)) {
        const val = headers[header];
        if (val) customHeaders[header] = val;
      }

    let encodedBody: string | undefined;
    if (method === HttpRequestTypes.GET) {
      url = params ? RequestUtil.appendParametersToUrl(url, params) : url;
    } else if (method === HttpRequestTypes.PUT) {
      url = params ? RequestUtil.appendParametersToUrl(url, params) : url;
      encodedBody = body instanceof Object ? JSON.stringify(body) : undefined;
    } else if (typeof body !== "string") {
      encodedBody = JSON.stringify(body);
    }

    let response: Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const request: Promise<Response> = fetch(url, {
        headers: {
          ...customHeaders,
          ...((APP_MODE === "dev") ? { "Content-Type": "application/json" } : undefined),
          
        },
        method,
        body: encodedBody,
        signal: controller.signal,
        ...additionalRequestConfig,
      });
      response = await request;
      clearTimeout(timeoutId);
    } catch (e) {
      const responseCode = 400;
      requestStats.success = false;
      requestStats.responseCode = e instanceof Response ? e.status : responseCode;
      requestStats.durationMs = Date.now() - requestStats.firedAt;
      const failedResult: FetchRejectionResult = {
        ok: false,
        fetchRejection: true,
        error: e as Response,
      };
      throw failedResult;
    }
    requestStats.success = response.ok;
    requestStats.responseCode = response.status;
    requestStats.durationMs = Date.now() - requestStats.firedAt;
    if (response?.ok) {
      this.authStore.onSuccessfulRequest();
      return response;
    } else {
      this.authStore.onUnsuccessfulRequest(requestStats);
      throw response;
    }
  }

  /**
   * Private method to get the API base url from the app settings.
   * @return {string}
   * @private
   */
  _getApiBase() {
      return MIXZI_API_BASE;
  }
}