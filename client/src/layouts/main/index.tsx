import { Icon } from "@iconify/react";
import { Link as ScrollLink } from "react-scroll";
import { Outlet } from "react-router-dom";
import arrowheadUpFill from "@iconify/icons-eva/arrowhead-up-fill";
// material
import { Box, Container } from "@mui/material";
// components
import MainNavbar from "./MainNavbar";

export default function MainLayout(): JSX.Element {
  return (
    <>
      <MainNavbar />
      <div>
        <Outlet />
      </div>
      <Box
        sx={{
          py: 5,
          textAlign: "center",
          position: "relative",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="lg">
          <ScrollLink to="move_top" spy smooth>
            <Icon icon={arrowheadUpFill} cursor="pointer" />
          </ScrollLink>
        </Container>
      </Box>
    </>
  );
}
