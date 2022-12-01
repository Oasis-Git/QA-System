import { render, screen, waitFor } from "../../utils/test/test_utils";
import userEvent from "@testing-library/user-event";
import Login from "../../pages/user/Login";

describe("Formik 表单验证", () => {
  test("检验信息是否填入", async () => {
    render(<Login />);

    userEvent.click(screen.getByRole("textbox"));
    userEvent.tab();
    expect(await screen.findByText("请填写用户名")).toBeInTheDocument();

    userEvent.tab();
    expect(await screen.findByText("请填写密码")).toBeInTheDocument();
  });

  test("检验填入内容是否正确", async () => {
    render(<Login />);

    userEvent.type(screen.getByRole("textbox"), "huaqiang");
    await waitFor(() => {
      expect(screen.queryByText("请填写用户名")).not.toBeInTheDocument();
    });

    userEvent.tab();
    userEvent.keyboard("abc");
    userEvent.tab();
    expect(await screen.findByText("密码长度至少为6")).toBeInTheDocument();

    userEvent.click(screen.getByRole("textbox"));
    userEvent.tab();
    userEvent.keyboard("abcdef");
    await waitFor(() => {
      expect(screen.queryByText("密码长度至少为6")).not.toBeInTheDocument();
    });
  });
});

// describe("验证登录请求和返回", () => {
//   const server = setupServer(
//     rest.post("/api/user/login", (req, res, ctx) => {
//       return res(
//         ctx.json({
//           data: {
//             token:
//               "Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJicmFjZSIsInN1YiI6InJvb3RAR1JPVVBfQURNSU4iLCJhdWQiOiJicmFjZSIsImV4cCI6MTg0NDY3NDQwNzM3MDk1NTIwMDAsIm5iZiI6MCwiaWF0IjowLCJqdGkiOiIzMWUxOWY1OC0yOGZiLTQ3Y2UtYmYwMS02YjFlZTExYzEwOTAifQ.AKCfbXXQyC4-MF6-eYtSjCH0kYfHBsVjrptcPWXvc5GxOK9Eqs-zsYuEPPKX71UCehwGineE7wHFu0HqWdMXGHjCAQWILngMGUYLrm2hlxYYi_GczttRCz6xcXhbyjTVc32gSnCOLE_QVCImUYrxCmU5luqPp0KfIoX_N1P0EYmbbzlt",
//           },
//         })
//       );
//     })
//   );

//   beforeAll(() => server.listen());
//   afterEach(() => server.resetHandlers());
//   afterAll(() => server.close());

//   test("登录成功正确提示", async () => {
//     render(<Login />);

//     userEvent.type(screen.getByRole("textbox"), "huaqiang");
//     userEvent.tab();
//     userEvent.keyboard("123456aaa");

//     userEvent.click(screen.getByRole("button", { name: "登录" }));

//     const alert = await screen.findByRole("alert");
//     expect(alert).toHaveTextContent("登录成功");

//     expect(window.localStorage.getItem("userAccessToken")).toEqual(
//       JSON.stringify(
//         "Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJicmFjZSIsInN1YiI6InJvb3RAR1JPVVBfQURNSU4iLCJhdWQiOiJicmFjZSIsImV4cCI6MTg0NDY3NDQwNzM3MDk1NTIwMDAsIm5iZiI6MCwiaWF0IjowLCJqdGkiOiIzMWUxOWY1OC0yOGZiLTQ3Y2UtYmYwMS02YjFlZTExYzEwOTAifQ.AKCfbXXQyC4-MF6-eYtSjCH0kYfHBsVjrptcPWXvc5GxOK9Eqs-zsYuEPPKX71UCehwGineE7wHFu0HqWdMXGHjCAQWILngMGUYLrm2hlxYYi_GczttRCz6xcXhbyjTVc32gSnCOLE_QVCImUYrxCmU5luqPp0KfIoX_N1P0EYmbbzlt"
//       )
//     );
//   });
// });
