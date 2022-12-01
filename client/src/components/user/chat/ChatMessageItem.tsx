import { ChatMessage } from "../../../types/user/Chat";
import { styled } from "@mui/material/styles";
import { Typography, Box, Avatar, Link } from "@mui/material";
import { fDateTimeSuffix } from "../../../utils/formatTime";
import { getFileFullName, getFileThumb } from "../../../utils/fileFormat";

const StyledRoot = styled("div")(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const StyledInfo = styled(Typography)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const StyledImage = styled("img")(({ theme }) => ({
  width: "100%",
  cursor: "pointer",
  objectFit: "cover",
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up("md")]: {
    height: 200,
    minWidth: 296,
  },
}));

const StyledFileItem = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2.5),
}));

const StyledFileThumb = styled("div")(({ theme }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));

function FileMessageItem({ fileUrl }: { fileUrl: string }): JSX.Element {
  return (
    <StyledFileItem key={fileUrl}>
      <StyledFileThumb>{getFileThumb(fileUrl)}</StyledFileThumb>
      <Box sx={{ ml: 1.5, maxWidth: 150 }}>
        <Typography variant="body2" noWrap>
          {getFileFullName(fileUrl)}
        </Typography>
        <Typography
          noWrap
          variant="caption"
          sx={{ color: "text.secondary", display: "block" }}
        >
          <Link href={fileUrl}>下载</Link>
        </Typography>
      </Box>
    </StyledFileItem>
  );
}

interface ChatMessageItemProps {
  message: ChatMessage;
  avatar: string;
  username: string;
  handleOpenLightbox: (url: string) => void;
}

export default function ChatMessageItem({
  message,
  avatar,
  username,
  handleOpenLightbox,
}: ChatMessageItemProps): JSX.Element {
  return (
    <StyledRoot>
      <Box
        sx={{
          display: "flex",
          ...(message.isMe && {
            ml: "auto",
          }),
        }}
      >
        {!message.isMe && (
          <Avatar
            alt={username}
            src={avatar}
            sx={{ width: 32, height: 32, mr: 2 }}
          />
        )}

        <div>
          <StyledInfo
            variant="caption"
            sx={{ ...(message.isMe && { justifyContent: "flex-end" }) }}
          >
            {!message.isMe && username}&nbsp;
            {fDateTimeSuffix(message.timestamp)}
          </StyledInfo>

          <StyledContent
            sx={{
              ...(message.isMe && {
                color: "grey.800",
                bgcolor: "primary.lighter",
              }),
              ...(message.messageType === "IMG" && { p: 0 }),
            }}
          >
            {message.messageType === "IMG" && (
              <StyledImage
                alt="image"
                src={message.content}
                onClick={() => handleOpenLightbox(message.content)}
              />
            )}
            {message.messageType === "TEXT" && (
              <Typography variant="body2">{message.content}</Typography>
            )}
            {message.messageType === "FILE" && (
              <FileMessageItem fileUrl={message.content} />
            )}
          </StyledContent>
        </div>
      </Box>
    </StyledRoot>
  );
}
