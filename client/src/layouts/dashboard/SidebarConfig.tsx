// routes
import { PATH_DASHBOARD, PATH_QA } from "../../routes/paths";
// components
import SvgIconStyle from "../../components/general/SvgIconStyle";

const getIcon = (name: string) => (
  <SvgIconStyle
    src={`/static/icons/navbar/${name}.svg`}
    sx={{ width: "100%", height: "100%" }}
  />
);

const ICONS = {
  blog: getIcon("ic_blog"),
  cart: getIcon("ic_cart"),
  chat: getIcon("ic_chat"),
  mail: getIcon("ic_mail"),
  user: getIcon("ic_user"),
  kanban: getIcon("ic_kanban"),
  banking: getIcon("ic_banking"),
  calendar: getIcon("ic_calendar"),
  ecommerce: getIcon("ic_ecommerce"),
  analytics: getIcon("ic_analytics"),
  dashboard: getIcon("ic_dashboard"),
  booking: getIcon("ic_booking"),
};

const sidebarConfig = [
  // PROFILE
  {
    subheader: "我的",
    items: [
      {
        title: "个人主页",
        path: PATH_DASHBOARD.profile,
        icon: ICONS.kanban,
      },
      {
        title: "钱包",
        path: PATH_DASHBOARD.banking.expense,
        icon: ICONS.ecommerce,
        children: [
          { title: "支出", path: PATH_DASHBOARD.banking.expense },
          { title: "回答者收入", path: PATH_DASHBOARD.banking.income },
        ],
      },
      {
        title: "订单",
        path: PATH_DASHBOARD.orders,
        icon: ICONS.cart,
        children: [
          { title: "我的订单", path: PATH_DASHBOARD.orders },
          { title: "我回答的问题", path: PATH_DASHBOARD.questions },
        ],
      },
    ],
  },

  // SETTINGS
  {
    subheader: "设置",
    items: [
      // MANAGEMENT : USER
      {
        title: "修改信息",
        path: PATH_DASHBOARD.settings.editBasicInfo,
        icon: ICONS.user,
        children: [
          { title: "基本信息", path: PATH_DASHBOARD.settings.editBasicInfo },
          { title: "修改密码", path: PATH_DASHBOARD.settings.editPassword },
          {
            title: "回答者相关信息",
            path: PATH_DASHBOARD.settings.editRespondentInfo,
          },
        ],
      },
    ],
  },

  // APP
  {
    subheader: "应用",
    items: [
      {
        title: "日历",
        path: PATH_DASHBOARD.app.calendar,
        icon: ICONS.calendar,
      },
      {
        title: "社区",
        path: PATH_QA.repo,
        icon: ICONS.banking,
      },
    ],
  },
];

export default sidebarConfig;
