import { getKeys } from "./utils";

type RequestParams = {
  [k: string]: string | undefined;
};

export default class RequestUtil {
  static appendParametersToUrl(url: string, params: RequestParams): string {
    if (getKeys(params).length === 0) {
      return url;
    }

    let prefix = "?";
    const builtUrl = url;

    if (url.includes("?")) {
      prefix = "&";
    }

    const paramsStr = Object.entries(params)
      .map(([key, value = ""]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join("&");

    return builtUrl + prefix + paramsStr;
  }

  static parseUrlParameters(url: string): {
    [key: string]: string;
  } {
    if (!url.includes("?")) {
      return {};
    }
    const parts = url.split("?");
    const parameterPart = parts[1];
    const params = parameterPart.split("&");
    const urlParams: { [key: string]: string } = {};
    for (const param of params) {
      const keyVal = param.split("=");
      urlParams[keyVal[0]] = keyVal[1];
    }
    return urlParams;
  }
}