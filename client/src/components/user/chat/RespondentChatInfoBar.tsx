import { useEffect, useState } from "react";
import { ChatInfoForRespondent } from "../../../types/user/Chat";
import { useTheme, styled } from "@mui/material/styles";
import {
  IconButton,
  IconButtonProps,
  useMediaQuery,
  Box,
  Hidden,
  Drawer,
  Divider,
} from "@mui/material";
import QuestionerInfo from "./QuestionerInfo";
import { Icon } from "@iconify/react";
import arrowIosBackFill from "@iconify/icons-eva/arrow-ios-back-fill";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import QuestionInfo from "./QuestionInfo";

interface RespondentChatInfoBarProps {
  info: ChatInfoForRespondent;
}

const DRAWER_WIDTH = 240;

const StyledToggleButton = styled(props => (
  <IconButton disableRipple {...props} />
))<IconButtonProps>(({ theme }) => ({
  right: 0,
  zIndex: 9,
  width: 32,
  height: 32,
  position: "absolute",
  top: theme.spacing(1),
  boxShadow: theme.customShadows.z8,
  backgroundColor: theme.palette.background.paper,
  border: `solid 1px ${theme.palette.divider}`,
  borderRight: 0,
  borderRadius: `12px 0 0 12px`,
  transition: theme.transitions.create("all"),
  "&:hover": {
    backgroundColor: theme.palette.background.neutral,
  },
}));

export default function QuestionerChatInfoBar({
  info,
}: RespondentChatInfoBarProps): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  useEffect(() => {
    if (isMobile) {
      return handleCloseSidebar();
    }
    return handleOpenSidebar();
  }, [isMobile]);

  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [showContact, setShowContact] = useState(true);

  const handleOpenSidebar = () => {
    setSideBarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSideBarOpen(false);
  };

  const handleToggleSidebar = () => {
    setSideBarOpen(prev => !prev);
  };

  const render = (
    <>
      <div>
        <QuestionerInfo
          questioner={info.questioner}
          isContactCollapse={showContact}
          onContactCollapse={() => setShowContact(prev => !prev)}
        />
      </div>

      <Divider />

      <QuestionInfo question={info.question} />
    </>
  );

  return (
    <Box sx={{ position: "relative" }}>
      <StyledToggleButton
        onClick={handleToggleSidebar}
        sx={{
          ...(sideBarOpen && !isMobile && { right: DRAWER_WIDTH }),
        }}
      >
        <Icon
          width={16}
          height={16}
          icon={sideBarOpen ? arrowIosForwardFill : arrowIosBackFill}
        />
      </StyledToggleButton>

      <Hidden lgUp>
        <Drawer
          anchor="right"
          ModalProps={{ keepMounted: true }}
          open={sideBarOpen}
          onClose={handleCloseSidebar}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
            },
          }}
        >
          {render}
        </Drawer>
      </Hidden>

      <Hidden lgDown>
        <Drawer
          open={sideBarOpen}
          anchor="right"
          variant="persistent"
          sx={{
            height: 1,
            width: DRAWER_WIDTH,
            transition: theme.transitions.create("width"),
            ...(!sideBarOpen && { width: "0px" }),
            "& .MuiDrawer-paper": {
              position: "static",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {render}
        </Drawer>
      </Hidden>
    </Box>
  );
}
