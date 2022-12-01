import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";

type Income = {
  income: number;
  balance: number;
};

const initialState: Income = {
  income: -1,
  balance: -1,
};

const useIncome = (): Income => {
  const [income, setIncome] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_USER.income)
      .then(response => {
        const data = response.data as ApiResponse<Income>;
        setIncome(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, []);

  return income;
};
export default useIncome;
