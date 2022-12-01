import Page from "../../components/general/Page";
import ApplyForm from "../../components/user/ApplyForm";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import { PATH_DASHBOARD } from "../../routes/paths";
import { Container } from "@mui/material";

export default function ApplyRespondentForm(): JSX.Element {
  return (
    <Page title="申请成为回答者">
      <Container maxWidth={"lg"} sx={{ my: 10 }}>
        <HeaderBreadcrumbs
          heading={"申请成为回答者"}
          links={[{ name: "个人主页", href: PATH_DASHBOARD.profile }]}
        />
        <ApplyForm />
      </Container>
    </Page>
  );
}
