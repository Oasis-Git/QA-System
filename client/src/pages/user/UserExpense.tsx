// material
import { Container, Grid, Stack } from "@mui/material";
// components
import Page from "../../components/general/Page";
import {
  BankingBalanceStatistics,
  BankingCurrentBalance,
  BankingExpenses,
  GetMoney,
} from "../../components/user/banking";
import useExpense from "../../hooks/user/useExpense";

export default function UserExpense(): JSX.Element {
  const { balance, expense } = useExpense();

  const monthlyExpense = [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, expense];
  return (
    <Page title="用户开支">
      <Container maxWidth={"xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <BankingExpenses total={expense} />
              <GetMoney balance={balance} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <BankingCurrentBalance balance={balance} />
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <BankingBalanceStatistics
                type={"支出"}
                monthlyNumbers={monthlyExpense}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
