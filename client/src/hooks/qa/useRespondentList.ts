import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { PATH_API_QA } from "../../routes/paths";
import { Respondent } from "../../types/Respondent";

const useRespondentList = (
  page: number,
  size: number
): [[Respondent[], number], () => void] => {
  const [respondents, setRespondents] = useState<Respondent[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const refreshRespondents = useCallback(() => {
    axios
      .get(PATH_API_QA.respondentList, { params: { page, size } })
      .then(response => {
        setRespondents(response.data.data.respondents);
        setTotalPage(response.data.data.page);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, [page, size]);
  useEffect(refreshRespondents, [refreshRespondents]);
  return [[respondents, totalPage], refreshRespondents];
};
export default useRespondentList;
