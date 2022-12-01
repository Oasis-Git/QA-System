import { useCallback, useRef, useState, useEffect } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { Icon } from "@iconify/react";
import bellFill from "@iconify/icons-eva/bell-fill";
import clockFill from "@iconify/icons-eva/clock-fill";
import doneAllFill from "@iconify/icons-eva/done-all-fill";
// material
import {
  Box,
  List,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from "@mui/material";
// components
import Scrollbar from "../../components/general/Scrollbar";
import MenuPopover from "../../components/general/MenuPopover";
import { MIconButton } from "../../components/@material-extend";
import useSocketIo from "../../hooks/useSocketIo";
import { ChatMessageType } from "../../types/user/Chat";
import { QuestionStatus } from "../../types/Question";
import { PATH_DASHBOARD_BASE, PATH_DASHBOARD } from "../../routes/paths";

type TNotificationPopover = {
  description: string;
  type: string;
  createdAt: Date;
  link: string;
  isUnRead: boolean;
};

function renderContent(
  notification: TNotificationPopover
): Record<string, JSX.Element> {
  const title = (
    <Typography variant="subtitle2">{notification.description}</Typography>
  );

  if (notification.type === "order") {
    return {
      avatar: (
        <img
          alt={notification.description}
          src="/static/icons/ic_notification_package.svg"
        />
      ),
      title,
    };
  } else if (notification.type === "chat") {
    return {
      avatar: (
        <img
          alt={notification.description}
          src="/static/icons/ic_notification_chat.svg"
        />
      ),
      title,
    };
  } else {
    return {
      avatar: (
        <img
          alt={notification.description}
          src="/static/icons/ic_notification_mail.svg"
        />
      ),
      title,
    };
  }
}

function NotificationItem({
  notification,
}: {
  notification: TNotificationPopover;
}): JSX.Element {
  const { avatar, title } = renderContent(notification);

  const handleClick = () => {
    notification.isUnRead = false;
  };

  return (
    <ListItemButton
      to={notification.link}
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        ...(true && {
          bgcolor: "action.selected",
        }),
      }}
      onClick={handleClick}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Box
              component={Icon}
              icon={clockFill}
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {notification.createdAt}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover(): JSX.Element {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const socketio = useSocketIo();
  const [notifications, setNotifications] = useState<TNotificationPopover[]>(
    []
  );
  const totalUnRead = notifications.filter(
    item => item.isUnRead === true
  ).length;

  const notify = useCallback((notification: TNotificationPopover) => {
    setNotifications(notifications => notifications.concat(notification));
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  const chatMessageListener = useCallback(
    (id: string, type: ChatMessageType, content: string, timestamp: Date) => {
      if (!pathname.includes(id)) {
        notify({
          description: "订单" + id + "有新消息！",
          type: "chat",
          createdAt: timestamp,
          link: `${PATH_DASHBOARD_BASE}/chat/` + id,
          isUnRead: true,
        });
      }
    },
    [notify, pathname]
  );

  useEffect(() => {
    socketio.subscribeChatMessageReceive(chatMessageListener);
    return () => {
      socketio.unsubscribeChatMessageReceive(chatMessageListener);
    };
  }, [chatMessageListener, socketio]);

  const orderCreateListener = useCallback(
    (id: string, timestamp: Date) => {
      if (!pathname.includes(id)) {
        notify({
          description: "您有一个新订单！",
          type: "order",
          createdAt: timestamp,
          link: `${PATH_DASHBOARD.questions}/${id}/accept`,
          isUnRead: true,
        });
      }
    },
    [notify, pathname]
  );

  useEffect(() => {
    socketio.subscribeOrderCreate(orderCreateListener);
    return () => {
      socketio.unsubscribeOrderCreate(orderCreateListener);
    };
  }, [orderCreateListener, socketio]);

  const orderStatusChangeListener = useCallback(
    (id: string, status: QuestionStatus, timestamp: Date) => {
      if (!pathname.includes(id)) {
        notify({
          description: "您的订单" + id + "有新动态！",
          type: "order",
          createdAt: timestamp,
          link: "#",
          isUnRead: true,
        });
      }
    },
    [notify, pathname]
  );

  useEffect(() => {
    socketio.subscribeOrderStatusChange(orderStatusChangeListener);
    return () => {
      socketio.unsubscribeOrderStatusChange(orderStatusChangeListener);
    };
  }, [orderStatusChangeListener, socketio]);

  const applyCensoredListener = useCallback(
    (approved: boolean, timestamp: Date) => {
      if (approved) {
        notify({
          description: "回答者申请已审核通过！",
          type: "other",
          createdAt: timestamp,
          link: "#",
          isUnRead: true,
        });
      } else {
        notify({
          description: "回答者申请审核失败！",
          type: "other",
          createdAt: timestamp,
          link: "#",
          isUnRead: true,
        });
      }
    },
    [notify]
  );

  useEffect(() => {
    socketio.subscribeRespondentApplyCensored(applyCensoredListener);
    return () => {
      socketio.unsubscribeRespondentApplyCensored(applyCensoredListener);
    };
  }, [applyCensoredListener, socketio]);

  return (
    <>
      <MIconButton
        ref={anchorRef}
        size="large"
        color={open ? "primary" : "default"}
        onClick={handleOpen}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Icon icon={bellFill} width={20} height={20} />
        </Badge>
      </MIconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">通知</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              你有{totalUnRead}条未读信息
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title="全部设为已读">
              <MIconButton color="primary" onClick={handleMarkAllAsRead}>
                <Icon icon={doneAllFill} width={20} height={20} />
              </MIconButton>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
                消息
              </ListSubheader>
            }
          >
            {notifications.map((notification, idx) => (
              <NotificationItem key={idx} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider />
      </MenuPopover>
    </>
  );
}
