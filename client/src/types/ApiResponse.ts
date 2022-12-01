export type ApiResponse<Data = null> = {
  data: Data extends null ? never : Data;
  message: Data extends null ? string : never;
};
