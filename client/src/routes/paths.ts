export const PATH_USER_BASE = "/user";
export const PATH_USER = {
  login: `${PATH_USER_BASE}/login`, //用户登录
  register: `${PATH_USER_BASE}/signup`, //用户注册
  resetPassword: `${PATH_USER_BASE}/reset-password`, //用户忘记密码
};

export const PATH_QA_BASE = "/qa";
export const PATH_QA = {
  profile: `${PATH_QA_BASE}/:name/profile`, //回答者详情
  post: `${PATH_QA_BASE}/:name/post-question`, //1-2-3页面
  repo: `${PATH_QA_BASE}/repo`, //问答库
  detail: `${PATH_QA_BASE}/repo/:id/detail`, //从问答库进入的问题详情
};

export const PATH_ADMIN_BASE = "/admin";
export const PATH_ADMIN = {
  login: `${PATH_ADMIN_BASE}/login`, //管理员登录
  questions: `${PATH_ADMIN_BASE}/questions`, //管理员问题审核
  respondents: `${PATH_ADMIN_BASE}/respondents`, //管理员回答者审核
  addAdmin: `${PATH_ADMIN_BASE}/add-admin`, //添加管理员
  changePassword: `${PATH_ADMIN_BASE}/change-password`, //管理员更改密码
  setArgs: `${PATH_ADMIN_BASE}/set-args`, //管理员修改参数
};

export const PATH_DASHBOARD_BASE = "/user/dashboard";
export const PATH_DASHBOARD = {
  root: PATH_DASHBOARD_BASE,
  apply: `${PATH_DASHBOARD_BASE}/apply`, //用户申请成为回答者
  profile: `${PATH_DASHBOARD_BASE}/profile`, //用户主页
  banking: {
    expense: `${PATH_DASHBOARD_BASE}/banking/expense`, //用户支出
    income: `${PATH_DASHBOARD_BASE}/banking/income`, //用户(回答者)收入
  },
  orders: `${PATH_DASHBOARD_BASE}/orders`, //用户订单(普通用户看到的)
  questions: `${PATH_DASHBOARD_BASE}/questions`, //提问列表(回答者看到的)
  accept: `${PATH_DASHBOARD_BASE}/questions/:id/accept`, //接单页面
  answer: `${PATH_DASHBOARD_BASE}/questions/:id/answer`, //首次回答
  qdetail: `${PATH_DASHBOARD_BASE}/questions/:id/detail`, //回答者方问答详情
  rating: `${PATH_DASHBOARD_BASE}/orders/:id/rating`, //订单评分
  detail: `${PATH_DASHBOARD_BASE}/orders/:id/detail`, //问答详情
  info: `${PATH_DASHBOARD_BASE}/orders/:id/info`, //查看提问内容（无回答）
  settings: {
    editBasicInfo: `${PATH_DASHBOARD_BASE}/settings/basic`, //用户设置个人信息
    editPassword: `${PATH_DASHBOARD_BASE}/settings/password`, //用户修改密码
    editRespondentInfo: `${PATH_DASHBOARD_BASE}/settings/respondent`, //回答者修改信息
  },
  chat: `${PATH_DASHBOARD_BASE}/chat/:id`, //聊天
  app: {
    calendar: `${PATH_DASHBOARD_BASE}/app/calendar`, //日历
    community: `${PATH_DASHBOARD_BASE}/app/community`, //社区
  },
};

export const PATH_API_BASE = "/api"; // 后端接口
export const PATH_API_SOCKET = (token: string): string => `/?token=${token}`;

export const PATH_API_USER_BASE = `${PATH_API_BASE}/user`;
export const PATH_API_USER = {
  login: `${PATH_API_USER_BASE}/login`,
  register: `${PATH_API_USER_BASE}/signup`,
  isSuper: `${PATH_API_USER_BASE}/isSuper`,
  apply: `${PATH_API_USER_BASE}/apply`,
  profile: (username: string): string => `/api/user/${username}/profile`,
  expense: `${PATH_API_USER_BASE}/dashboard/banking/expense`,
  income: `${PATH_API_USER_BASE}/dashboard/banking/income`,
  updateProfile: `${PATH_API_USER_BASE}/settings/basic`,
  changePassword: `${PATH_API_USER_BASE}/settings/password`,
  updateRespondentProfile: `${PATH_API_USER_BASE}/settings/respondent`,
  validateResetPasswordEmail: `${PATH_API_USER_BASE}/resetPassword/validateEmail`,
  resetPassword: `${PATH_API_USER_BASE}/resetPassword`,
  deposit: `${PATH_API_USER_BASE}/banking/deposit`,
  questionInfoForChat: (id: string): string =>
    `${PATH_API_USER_BASE}/chat/${id}/question`,
  chatInfoForQuestioner: (id: string): string =>
    `${PATH_API_USER_BASE}/chat/${id}/respondent`,
  chatInfoForRespondent: (id: string): string =>
    `${PATH_API_USER_BASE}/chat/${id}/questioner`,
  chatMessages: (id: string): string =>
    `${PATH_API_USER_BASE}/chat/${id}/message`,
  chatRole: (id: string): string => `${PATH_API_USER_BASE}/chat/${id}/role`,
  navbar: `${PATH_API_USER_BASE}/navbar`,
  sidebar: `${PATH_API_USER_BASE}/sidebar`,
  orderList: `${PATH_API_USER_BASE}/orders`,
  questionsList: `${PATH_API_USER_BASE}/questions`,
  calendar: `${PATH_API_USER_BASE}/dashboard/calendar`,
};

export const PATH_API_QA_BASE = `${PATH_API_BASE}/qa`;
export const PATH_API_QA = {
  finishOrder: (id: string): string => `${PATH_API_QA_BASE}/${id}/finish`,
  questionDetail: (id: string): string => `${PATH_API_QA_BASE}/${id}/detail`,
  openDetail: (id: string): string => `${PATH_API_QA_BASE}/${id}/public/detail`,
  questionInfo: (id: string): string => `${PATH_API_QA_BASE}/${id}/question`,
  rateOrder: (id: string): string => `${PATH_API_QA_BASE}/${id}/rate`,
  gotoChat: (id: string): string => `${PATH_API_QA_BASE}/${id}/chat`,
  acceptOrder: (id: string): string => `${PATH_API_QA_BASE}/${id}/accept`,
  refuseOrder: (id: string): string => `${PATH_API_QA_BASE}/${id}/refuse`,
  postQuestion: `${PATH_API_QA_BASE}/new-question`,
  getRespondentProfileToConfirm: (username: string): string =>
    `${PATH_API_QA_BASE}/confirm/${username}`, // 确认回答者
  answerQuestion: (id: string): string => `${PATH_API_QA_BASE}/${id}/response`, // 首次回答
  status: (id: string): string => `${PATH_API_QA_BASE}/${id}/status`,
  respondentList: `${PATH_API_QA_BASE}/respondents`,
  repo: `${PATH_API_QA_BASE}/repo`,
};

export const PATH_API_ADMIN_BASE = `${PATH_API_BASE}/admin`;
export const PATH_API_ADMIN = {
  login: `${PATH_API_ADMIN_BASE}/login`,
  isSuper: `${PATH_API_ADMIN_BASE}/isSuper`,
  activated: `${PATH_API_ADMIN_BASE}/activated`,
  question: (id: string): string => `${PATH_API_ADMIN_BASE}/questions/${id}`,
  questionList: `${PATH_API_ADMIN_BASE}/questions`,
  respondent: (username: string): string =>
    `${PATH_API_ADMIN_BASE}/respondents/${username}`,
  respondentList: `${PATH_API_ADMIN_BASE}/respondents`,
  questionStatus: (id: string): string =>
    `${PATH_API_ADMIN_BASE}/questions/${id}/status`,
  userRole: (username: string): string =>
    `${PATH_API_ADMIN_BASE}/users/${username}/role`,
  addAdmin: `${PATH_API_ADMIN_BASE}/addAdmin`,
  censorRespondent: (username: string): string =>
    `${PATH_API_ADMIN_BASE}/users/${username}/censor`,
  changePassword: `${PATH_API_ADMIN_BASE}/password`,
  updateArgs: `${PATH_API_ADMIN_BASE}/args`,
};

export const PATH_API_UPLOAD = `${PATH_API_BASE}/upload`;

export const PATH_ASSETS_BASE = ""; // public/ 下的图片资源等
export const PATH_AVATAR_LOADING = "";
