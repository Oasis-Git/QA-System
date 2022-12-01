// material
import { Container, Grid, Stack } from "@mui/material";
// components
import Page from "../../components/general/Page";
import {
  BankingBalanceStatistics,
  BankingCurrentBalance,
  BankingIncome,
} from "../../components/user/banking";
import useIncome from "../../hooks/user/useIncome";

export default function UserIncome(): JSX.Element {
  const { income, balance } = useIncome();

  const monthlyIncome = [10, 41, 35, 151, 49, 62, 69, 91, 48, 13, income];
  return (
    <Page title="回答者收入">
      <Container maxWidth={"xl"}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
              <BankingIncome total={income} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <BankingCurrentBalance balance={balance} />
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              <BankingBalanceStatistics
                type="收入"
                monthlyNumbers={monthlyIncome}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
