// material
import { Box, Card, Container, Grid, Pagination, Stack } from "@mui/material";
import { useState } from "react";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
// components
import Page from "../../components/general/Page";
import {
  BlogPostCard,
  BlogPostsSearch,
  BlogPostsSort,
} from "../../components/qa/blog";
import RepoPageHead from "../../components/qa/blog/RepoPageHead";
import useRepo from "../../hooks/qa/useRepo";

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "oldest", label: "Oldest" },
];

export default function Repository(): JSX.Element {
  const [filters, setFilters] = useState("latest");
  const [page, setpage] = useState(1);
  const [sortedPosts, totPage] = useRepo(page - 1, 12);

  const handleChangeSort = (value?: string) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title="问答库">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="问答库"
          links={[{ name: "qa", href: "/" }, { name: "repo" }]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <RepoPageHead avatar={"/avatar.png"} username={"刘华强"} />
        </Card>
        <Stack
          mb={5}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <BlogPostsSearch />
          <BlogPostsSort
            query={filters}
            options={SORT_OPTIONS}
            onSort={handleChangeSort}
          />
        </Stack>
        <Grid container sm={12} md={12} spacing={3}>
          {sortedPosts.map((post, index) => (
            <BlogPostCard key={post.title} post={post} index={index} />
          ))}
        </Grid>

        <Box height={30}></Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            page={page}
            count={totPage}
            color="primary"
            onChange={(event, value) => setpage(value)}
          />
        </Box>
        <Box height={30}></Box>
      </Container>
    </Page>
  );
}
