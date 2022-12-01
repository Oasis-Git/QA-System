// material
import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import Page from "../../components/general/Page";
import RateOrder from "../../components/qa/RateOrder";
import { PATH_DASHBOARD } from "../../routes/paths";

export default function RateOrderPage(): JSX.Element {
  const { id = "" } = useParams();

  return (
    <Page title="订单评分">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading={"订单评分"}
          links={[
            { name: "订单列表", href: PATH_DASHBOARD.questions },
            { name: id },
          ]}
        />

        <RateOrder id={id} />
      </Container>
    </Page>
  );
}
