import type { ResponseError } from "@/_generated";
import type { ErrorDto, ErrorType } from "../interfaces/CommonInterfaces";
import { EMAIL_NOT_FOUND_ERROR_MESSAGE } from "@/utils/errors";

export const getErrorObject = async (error: ResponseError): Promise<ErrorType> => {
  const data = await error.response.json();
  if (Array.isArray(data)) {
    return data.map((error) => error as ErrorDto);
  }
  return data;
};

export const is401EmailNotFoundError = (error: string | Error | undefined) => {
  let errorMessage: string | undefined;
  
  if (typeof error === "object" && error !== null && "message" in error) {
    errorMessage = error.message;
  } else {
    errorMessage = error;
  }
  
  return errorMessage ? errorMessage.startsWith(EMAIL_NOT_FOUND_ERROR_MESSAGE) : false;
};

export const isErrorDto = (error: ErrorType): error is ErrorDto => {
  return (error as ErrorDto).error !== undefined;
};