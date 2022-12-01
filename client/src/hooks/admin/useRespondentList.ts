import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_ADMIN } from "../../routes/paths";
import { RespondentSummary } from "../../types/admin/Respondent";

const useRespondentList = (
  page: number,
  size: number
): [[RespondentSummary[], number], () => void] => {
  const [respondents, setRespondents] = useState<RespondentSummary[]>([]);
  const [count, setCount] = useState(0);

  const refreshRespondentList = useCallback(() => {
    axios
      .get(PATH_API_ADMIN.respondentList, { params: { page, size } })
      .then(response => {
        setRespondents(response.data.data.content);
        setCount(response.data.data.totalElements);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [page, size]);
  useEffect(refreshRespondentList, [refreshRespondentList]);
  return [[respondents, count], refreshRespondentList];
};
export default useRespondentList;
