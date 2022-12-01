import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";

type Expense = {
  expense: number;
  balance: number;
};

const initialState: Expense = {
  expense: -1,
  balance: -1,
};

const useExpense = (): Expense => {
  const [expense, setExpense] = useState(initialState);

  useEffect(() => {
    axios
      .get(PATH_API_USER.expense)
      .then(response => {
        const data = response.data as ApiResponse<Expense>;
        setExpense(data.data);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, []);

  return expense;
};
export default useExpense;
