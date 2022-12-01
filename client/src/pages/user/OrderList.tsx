import {
  Box,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
// material
import { useTheme } from "@mui/material/styles";
import { filter } from "lodash";
import { useState } from "react";
// components
import Page from "../../components/general/Page";
import Label from "../../components/general/Label";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import {
  ProductListHead,
  ProductListToolbar,
  Countdown,
} from "../../components/user/question-list";
import useOrderList from "../../hooks/user/useOrderList";
// redux
// @types
import { Question } from "../../types/Question";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const TABLE_HEAD = [
  { id: "title", label: "题目", alignRight: false },
  { id: "questioner", label: "提问者", alignRight: false },
  { id: "respondent", label: "回答者", alignRight: false },
  { id: "status", label: "问题状态", alignRight: false },
  { id: "timeout", label: "剩余时间", alignRight: false },
];

function descendingComparator(a: Anonymous, b: Anonymous, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Anonymous = Record<string | number, string>;

function getComparator(order: string, orderBy: string) {
  return order === "desc"
    ? (a: Anonymous, b: Anonymous) => descendingComparator(a, b, orderBy)
    : (a: Anonymous, b: Anonymous) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(
  array: Question[],
  comparator: (a: Question, b: Question) => number,
  query: string
) {
  const stabilizedThis = array.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });

  if (query) {
    return filter(
      array,
      _product =>
        _product.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map(el => el[0]);
}

// ----------------------------------------------------------------------

export default function QuestionList(): JSX.Element {
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("status");
  const navigate = useNavigate();

  const [[products, count]] = useOrderList(page, rowsPerPage);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (status: string, id: string) => {
    if (status === "聊天中" || status === "订单完成") {
      navigate("/user/dashboard/chat/" + id);
    } else if (status === "已回答") {
      navigate("/user/dashboard/orders/" + id + "/detail");
    } else {
      navigate("/user/dashboard/orders/" + id + "/info");
    }
    //TODO: 编辑中怎么办？
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (filterName: string) => {
    setFilterName(filterName);
  };

  const filteredProducts = applySortFilter(
    products,
    getComparator(order, orderBy),
    filterName
  );

  return (
    <Page title="Order List">
      <Container maxWidth={"lg"}>
        <HeaderBreadcrumbs
          heading="订单列表"
          links={[{ name: "Order List" }]}
        />

        <Card>
          <ProductListToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ProductListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={products.length}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {filteredProducts.map((row, index) => {
                  const { title, questioner, respondent, status, timeout, id } =
                    row;

                  return (
                    <TableRow
                      hover
                      key={index}
                      tabIndex={-1}
                      role="checkbox"
                      selected={false}
                      aria-checked={false}
                      onClick={() => handleClick(status, id)}
                    >
                      <TableCell component="th" scope="row" padding="none">
                        <Box
                          sx={{
                            py: 2,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2" noWrap>
                            {title}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell style={{ minWidth: 160 }}>
                        {questioner}
                      </TableCell>
                      <TableCell style={{ minWidth: 160 }}>
                        {respondent}
                      </TableCell>
                      <TableCell style={{ minWidth: 160 }}>
                        <Label
                          variant={
                            theme.palette.mode === "light" ? "ghost" : "filled"
                          }
                          color={
                            (status === "订单失败" && "error") ||
                            (status === "待审核" && "warning") ||
                            (status === "待接单" && "warning") ||
                            (status === "审核不通过" && "warning") ||
                            (status === "订单完成" && "success") ||
                            (status === "回答中" && "success") ||
                            (status === "聊天中" && "success") ||
                            "success"
                          }
                        >
                          {status}
                        </Label>
                      </TableCell>
                      <TableCell style={{ minWidth: 160 }}>
                        {(status === "回答中" ||
                          status === "已回答" ||
                          status === "待接单" ||
                          status === "聊天中" ||
                          (status === "订单失败" &&
                            moment.duration(timeout).asSeconds() <= 0)) && (
                          <Countdown duration={moment.duration(timeout)} />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, value) => setPage(value)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
