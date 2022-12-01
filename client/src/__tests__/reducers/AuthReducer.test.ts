import {
  actions as authActions,
  reducer as authReducer,
} from "../../redux/slices/userAuth";

type State = {
  accessToken: string | null;
  isSuper: boolean;
};

const testToken =
  "Bearer eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJicmFjZSIsInN1YiI6InJvb3RAR1JPVVBfQURNSU4iLCJhdWQiOiJicmFjZSIsImV4cCI6MTg0NDY3NDQwNzM3MDk1NTIwMDAsIm5iZiI6MCwiaWF0IjowLCJqdGkiOiIzMWUxOWY1OC0yOGZiLTQ3Y2UtYmYwMS02YjFlZTExYzEwOTAifQ.AKCfbXXQyC4-MF6-eYtSjCH0kYfHBsVjrptcPWXvc5GxOK9Eqs-zsYuEPPKX71UCehwGineE7wHFu0HqWdMXGHjCAQWILngMGUYLrm2hlxYYi_GczttRCz6xcXhbyjTVc32gSnCOLE_QVCImUYrxCmU5luqPp0KfIoX_N1P0EYmbbzlt";

describe("AuthReducer功能测试", () => {
  test("state应正确变化", () => {
    let state: State = {
      accessToken: null,
      isSuper: false,
    };

    state = authReducer(
      state,
      authActions.login({
        accessToken: testToken,
        isSuper: true,
      })
    );
    expect(state).toEqual({
      accessToken: testToken,
      isSuper: true,
    });

    state = authReducer(state, authActions.logout());
    expect(state).toEqual({
      accessToken: null,
      isSuper: false,
    });
  });
});
