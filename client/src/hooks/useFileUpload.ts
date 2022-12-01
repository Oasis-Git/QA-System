import axios from "axios";
import { useCallback } from "react";
import { PATH_API_UPLOAD } from "../routes/paths";
import { ApiResponse } from "../types/ApiResponse";
import { handleAxiosException } from "../utils/exception";

export type Resource = {
  filename: string;
  url?: string;
};

const useFileUpload = (): ((
  ...files: File[]
) => Promise<Resource[] | string>) =>
  useCallback(async (...files) => {
    const data = new FormData();
    files.forEach(file => data.append("files", file));
    try {
      const response = await axios.post(PATH_API_UPLOAD, data);
      return (response.data as ApiResponse<Resource[]>).data;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);
export default useFileUpload;
