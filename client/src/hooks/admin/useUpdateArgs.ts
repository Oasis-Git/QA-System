import axios from "axios";
import { duration } from "moment";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { Args } from "../../types/admin/Args";
import { ApiResponse } from "../../types/ApiResponse";
import { handleAxiosException } from "../../utils/exception";

const initialState: Args = {
  timeout: {
    beforeAccept: duration(0),
    acceptToAnswer: duration(0),
    answerToChat: duration(0),
    chat: duration(0),
  },
  fee: 0,
};

const useUpdateArgs = (): [Args, (args: Args) => Promise<null | string>] => {
  const [args, setArgs] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_ADMIN.updateArgs)
      .then(response => {
        const data = response.data as ApiResponse<Args>;
        setArgs(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, []);

  const updateArgs = useCallback(async (args: Args): Promise<null | string> => {
    try {
      await axios.put(PATH_API_ADMIN.updateArgs, args);
      return null;
    } catch (exception) {
      return handleAxiosException(exception);
    }
  }, []);

  return [args, updateArgs];
};
export default useUpdateArgs;
