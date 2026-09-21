import { action, makeObservable, observable } from "mobx";
import ApiService from "../api/ApiService";
import { ResponseError } from "@/_generated";
import type { ErrorType } from "@/shared/interfaces/CommonInterfaces";
import { getErrorObject, is401EmailNotFoundError } from "@/shared/utils/ResponseError.utils";

export default class AuthStore {
  isLoading: boolean = false;
  apiStatusOk = false;
  emailNotFoundError = false;


  apiService?: ApiService;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      emailNotFoundError: observable,
      setIsLoading: action,
      setEmailNotFoundError: action,

    });
  }

  setEmailNotFoundError = (value: boolean) => {
    this.emailNotFoundError = value;
  };

  init(apiService: ApiService) {
    this.apiService = apiService;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  onSuccessfulRequest() {
    this.setApiStatusOk(true);
    this.setIsLoading(false);
  }

  onUnsuccessfulRequest(stats: RequestStatistics) {
    if (!stats.responseCode || stats.responseCode >= 400) {
      this.setApiStatusOk(false);
    }
    this.setIsLoading(false);
  }

  checkEmailNotFoundError = (errorMessage: string | undefined) => {
    if (errorMessage && is401EmailNotFoundError(errorMessage)) {
      this.setEmailNotFoundError(true);
    }
  };

  handleError = async (error: unknown): Promise<string> => {
    if (error instanceof ResponseError) {
      const result: ErrorType = await getErrorObject(error);
      return Promise.reject(Array.isArray(result) ? result[0].error : result.error);
    }
    return Promise.reject(error);
  };

  async onStartedRequest() {
    this.setIsLoading(true);
  }

  setApiStatusOk(value: boolean) {
    this.apiStatusOk = value;
  }
}