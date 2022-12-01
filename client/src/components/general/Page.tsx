import { Helmet } from "react-helmet-async";
import { ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

interface PageProps extends BoxProps {
  title?: string;
  children: ReactNode;
}

export default function Page(props: PageProps): JSX.Element {
  const { title, children, ...other } = props;
  return (
    <Box {...other}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {children}
    </Box>
  );
}
