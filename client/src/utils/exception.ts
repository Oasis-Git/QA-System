import axios from "axios";
import { ApiResponse } from "../types/ApiResponse";

export const handleAxiosException = (exception: unknown): string => {
  if (!axios.isAxiosError(exception)) {
    throw exception;
  }
  if (exception.response !== undefined) {
    return (exception.response.data as ApiResponse).message;
  } else if (exception.request !== undefined) {
    return `无法连接到服务器：\`${exception.message}\``;
  } else {
    return `未知的错误：\`${exception.message}\``;
  }
};
