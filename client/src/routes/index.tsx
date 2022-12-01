import React, { lazy, ReactNode } from "react";
import { useRoutes } from "react-router-dom";
import Loadable from "../components/general/Loadable";
import { Provider as AdminAuthProvider } from "../contexts/admin/AuthContext";
import { Provider as SocketIoProvider } from "../contexts/SocketIoContext";
import { Provider as UserAuthProvider } from "../contexts/user/AuthContext";
import AdminActivateGuard from "../guards/AdminActivateGuard";
import AdminAuthGuard from "../guards/AdminAuthGuard";
import AdminGuestGuard from "../guards/AdminGuestGuard";
import RespondentRoleGuard from "../guards/RespondentRoleGuard";
import { RootRoleGuard } from "../guards/RootRoleGuard";
import UserAuthGuard from "../guards/UserAuthGuard";
import UserGuestGuard from "../guards/UserGuestGuard";
import UserIsMeGuard from "../guards/UserIsMeGuard";
import UserRoleGuard from "../guards/UserRoleGuard";
import MainLayout from "../layouts/main";
import { PATH_DASHBOARD } from "./paths";

// import pages
const Login = Loadable(lazy(() => import("../pages/user/Login")));
const Register = Loadable(lazy(() => import("../pages/user/Register")));
const RespondentProfile = Loadable(
  lazy(() => import("../pages/qa/RespondentProfile"))
);
const RespondentList = Loadable(
  lazy(() => import("../pages/qa/RespondentList"))
);
const DashboardLayout = Loadable(lazy(() => import("../layouts/dashboard")));
const QuestionList = Loadable(lazy(() => import("../pages/user/QuestionList")));
const OrderList = Loadable(lazy(() => import("../pages/user/OrderList")));
const AdminLogin = Loadable(lazy(() => import("../pages/admin/Login")));
const QuestionCensor = Loadable(
  lazy(() => import("../pages/admin/QuestionCensor"))
);
const RespondentCensor = Loadable(
  lazy(() => import("../pages/admin/RespondentCensor"))
);
const AddAdmin = Loadable(lazy(() => import("../pages/admin/AddAdmin")));
const AdminChangePassword = Loadable(
  lazy(() => import("../pages/admin/ChangePassword"))
);
const ApplyRespondentForm = Loadable(
  lazy(() => import("../pages/user/ApplyRespondentForm"))
);
const PostQuestion = Loadable(lazy(() => import("../pages/qa/PostQuestion")));
const InitialAnswer = Loadable(lazy(() => import("../pages/qa/InitialAnswer")));
const GeneralInfo = Loadable(lazy(() => import("../pages/user/GeneralInfo")));
const ResetPassword = Loadable(
  lazy(() => import("../pages/user/ResetPassword"))
);
const RateOrder = Loadable(lazy(() => import("../pages/qa/RateOrder")));
const QADetail = Loadable(lazy(() => import("../pages/qa/QADetail")));
const PublicQA = Loadable(lazy(() => import("../pages/qa/PublicQA")));
const UserExpense = Loadable(lazy(() => import("../pages/user/UserExpense")));
const UserIncome = Loadable(lazy(() => import("../pages/user/UserIncome")));
const Chat = Loadable(lazy(() => import("../pages/user/Chat")));
const Repository = Loadable(lazy(() => import("../pages/qa/Repository")));
const AcceptOrder = Loadable(lazy(() => import("../pages/qa/AcceptOrder")));
const OrderInfo = Loadable(lazy(() => import("../pages/qa/OrderInfo")));
const UserProfile = Loadable(lazy(() => import("../pages/user/UserProfile")));
const Calendar = Loadable(lazy(() => import("../pages/user/Calendar")));
const UserChangePassword = Loadable(
  lazy(() => import("../pages/user/UserChangePassword"))
);
const RespondentInfo = Loadable(
  lazy(() => import("../pages/user/RespondentInfo"))
);
const SetArgs = Loadable(lazy(() => import("../pages/admin/SetArgs")));

type Role = "EVERYONE" | "GUEST" | "AUTH";

function UserProviders({
  roleAllowed,
  children,
}: {
  roleAllowed: Role | "USER" | "RESPONDENT";
  children: ReactNode;
}): JSX.Element {
  const Inner = () => {
    switch (roleAllowed) {
      case "EVERYONE":
        return <>{children}</>;
      case "GUEST":
        return <UserGuestGuard>{children}</UserGuestGuard>;
      case "AUTH":
        return (
          <UserAuthGuard>
            <SocketIoProvider>{children}</SocketIoProvider>
          </UserAuthGuard>
        );
      case "USER":
        return (
          <UserAuthGuard>
            <UserRoleGuard>
              <SocketIoProvider>{children}</SocketIoProvider>
            </UserRoleGuard>
          </UserAuthGuard>
        );
      case "RESPONDENT":
        return (
          <UserAuthGuard>
            <RespondentRoleGuard>
              <SocketIoProvider>{children}</SocketIoProvider>
            </RespondentRoleGuard>
          </UserAuthGuard>
        );
    }
  };
  return (
    <UserAuthProvider>
      <Inner />
    </UserAuthProvider>
  );
}

function AdminProviders({
  roleAllowed,
  children,
}: {
  roleAllowed: Role | "ROOT";
  children: ReactNode;
}): JSX.Element {
  const Inner = () => {
    switch (roleAllowed) {
      case "EVERYONE":
        return <>{children}</>;
      case "GUEST":
        return <AdminGuestGuard>{children}</AdminGuestGuard>;
      case "AUTH":
        return <AdminAuthGuard>{children}</AdminAuthGuard>;
      case "ROOT":
        return (
          <AdminAuthGuard>
            <RootRoleGuard>{children}</RootRoleGuard>
          </AdminAuthGuard>
        );
    }
  };
  return (
    <AdminAuthProvider>
      <Inner />
    </AdminAuthProvider>
  );
}

//router
export default function Router(): React.ReactElement | null {
  return useRoutes([
    {
      path: "user",
      children: [
        {
          path: "login",
          element: (
            <UserProviders roleAllowed="GUEST">
              <Login />
            </UserProviders>
          ),
        },
        {
          path: "signup",
          element: (
            <UserProviders roleAllowed="GUEST">
              <Register />
            </UserProviders>
          ),
        },
        {
          path: "reset-password",
          element: (
            <UserProviders roleAllowed="GUEST">
              <ResetPassword />
            </UserProviders>
          ),
        },
        {
          path: "dashboard",
          element: (
            <UserProviders roleAllowed="AUTH">
              <DashboardLayout />
            </UserProviders>
          ),
          children: [
            {
              path: "apply",
              element: (
                <UserRoleGuard>
                  <ApplyRespondentForm />
                </UserRoleGuard>
              ),
            },
            {
              path: "profile",
              element: <UserProfile />,
            },
            {
              path: "banking",
              children: [
                {
                  path: "expense",
                  element: <UserExpense />,
                },
                {
                  path: "income",
                  element: (
                    <RespondentRoleGuard>
                      <UserIncome />
                    </RespondentRoleGuard>
                  ),
                },
              ],
            },
            {
              path: "questions",
              element: (
                <RespondentRoleGuard>
                  <QuestionList />
                </RespondentRoleGuard>
              ),
            },
            {
              path: "orders",
              element: <OrderList />,
            },
            {
              path: "settings/basic",
              element: <GeneralInfo />,
            },
            {
              path: "settings/password",
              element: <UserChangePassword />,
            },
            {
              path: "settings/respondent",
              element: (
                <RespondentRoleGuard>
                  <RespondentInfo />
                </RespondentRoleGuard>
              ),
            },
            {
              path: "orders/:id/rating",
              element: <RateOrder />,
            },
            {
              path: "questions/:id/answer",
              element: (
                <RespondentRoleGuard>
                  <InitialAnswer />
                </RespondentRoleGuard>
              ),
            },
            {
              path: "questions/:id/accept",
              element: (
                <RespondentRoleGuard>
                  <AcceptOrder />
                </RespondentRoleGuard>
              ),
            },
            {
              path: "orders/:id/detail",
              element: <QADetail />,
            },
            {
              path: "questions/:id/detail",
              element: (
                <RespondentRoleGuard>
                  <QADetail />
                </RespondentRoleGuard>
              ),
            },
            {
              path: "orders/:id/info",
              element: <OrderInfo />,
            },
            {
              path: "chat/:id",
              element: <Chat />,
            },
            {
              path: "app/calendar",
              element: <Calendar />,
            },
          ],
        },
      ],
    },
    {
      path: "qa",
      children: [
        {
          path: ":name/profile",
          element: (
            <UserProviders roleAllowed="AUTH">
              <UserIsMeGuard isMe={false} redirectUrl={PATH_DASHBOARD.profile}>
                <RespondentProfile />
              </UserIsMeGuard>
            </UserProviders>
          ),
        },
        {
          path: ":name/post-question",
          element: (
            <UserProviders roleAllowed="AUTH">
              <UserIsMeGuard
                isMe={false}
                redirectUrl={"/"}
                snackbarWarning={"你不能向自己提问"}
              >
                <PostQuestion />
              </UserIsMeGuard>
            </UserProviders>
          ),
        },
        {
          path: "repo",
          element: (
            <UserProviders roleAllowed="EVERYONE">
              <Repository />
            </UserProviders>
          ),
        },
        {
          path: "repo/:id/detail",
          element: (
            <UserProviders roleAllowed="AUTH">
              <PublicQA />
            </UserProviders>
          ),
        },
      ],
    },
    {
      path: "admin",
      children: [
        {
          path: "login",
          element: (
            <AdminProviders roleAllowed="GUEST">
              <AdminLogin />
            </AdminProviders>
          ),
        },
        {
          path: "questions",
          element: (
            <AdminProviders roleAllowed="AUTH">
              <AdminActivateGuard>
                <QuestionCensor />
              </AdminActivateGuard>
            </AdminProviders>
          ),
        },
        {
          path: "respondents",
          element: (
            <AdminProviders roleAllowed="AUTH">
              <AdminActivateGuard>
                <RespondentCensor />
              </AdminActivateGuard>
            </AdminProviders>
          ),
        },
        {
          path: "add-admin",
          element: (
            <AdminProviders roleAllowed="ROOT">
              <AdminActivateGuard>
                <AddAdmin />
              </AdminActivateGuard>
            </AdminProviders>
          ),
        },
        {
          path: "change-password",
          element: (
            <AdminProviders roleAllowed="AUTH">
              <AdminChangePassword />
            </AdminProviders>
          ),
        },
        {
          path: "set-args",
          element: (
            <AdminProviders roleAllowed="ROOT">
              <AdminActivateGuard>
                <SetArgs />
              </AdminActivateGuard>
            </AdminProviders>
          ),
        },
      ],
    },
    {
      path: "/",
      element: (
        <UserProviders roleAllowed="EVERYONE">
          <MainLayout />
        </UserProviders>
      ),
      children: [
        {
          path: "/",
          element: <RespondentList />,
        },
      ],
    },
  ]);
}
