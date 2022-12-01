import attach2Fill from "@iconify/icons-eva/attach-2-fill";
import roundAddPhotoAlternate from "@iconify/icons-ic/round-add-photo-alternate";
import roundSend from "@iconify/icons-ic/round-send";
import { Icon } from "@iconify/react";
import { Box, Divider, IconButton, Input, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useFileUpload from "../../../hooks/useFileUpload";
import { ChatMessageType } from "../../../types/user/Chat";
import EmojiPicker from "./EmojiPicker";

const StyledDiv = styled("div")(({ theme }) => ({
  minHeight: 56,
  display: "flex",
  position: "relative",
  alignItems: "center",
  paddingLeft: theme.spacing(2),
}));

interface PickerProps {
  onSend: (url: string) => void;
}

function useHandleDrop(onSend: (url: string) => void) {
  const { enqueueSnackbar } = useSnackbar();
  const uploadFile = useFileUpload();
  return useCallback(
    async (acceptedFiles: File[]) => {
      const response = await uploadFile(...acceptedFiles);
      if (typeof response === "string") {
        enqueueSnackbar(response, { variant: "error" });
      } else {
        response.forEach(file => {
          if (file.url !== undefined) {
            onSend(file.url);
          }
        });
      }
    },
    [enqueueSnackbar, onSend, uploadFile]
  );
}

function ImagePicker({ onSend }: PickerProps): JSX.Element {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useHandleDrop(onSend),
    accept: "image/*",
  });

  return (
    <IconButton size="small" {...getRootProps()}>
      <input {...getInputProps()} />
      <Icon icon={roundAddPhotoAlternate} width={24} height={24} />
    </IconButton>
  );
}

function FilePicker({ onSend }: PickerProps): JSX.Element {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useHandleDrop(onSend),
  });

  return (
    <IconButton size="small" {...getRootProps()}>
      <input {...getInputProps()} />
      <Icon icon={attach2Fill} width={24} height={24} />
    </IconButton>
  );
}

type ChatMessageInputProps = {
  id: string;
  onChatMessageSend: (
    id: string,
    type: ChatMessageType,
    content: string
  ) => void;
};
export default function ChatMessageInput({
  id,
  onChatMessageSend,
}: ChatMessageInputProps): JSX.Element {
  const [textMessage, setTextMessage] = useState("");

  const handleSendTextMessage = () => {
    if (textMessage === "") {
      return;
    }
    onChatMessageSend(id, "TEXT", textMessage);
    setTextMessage("");
  };

  const handleKeyDownCapture = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (event.ctrlKey) {
        setTextMessage(message => message + "\n");
      } else {
        handleSendTextMessage();
      }
    }
  };

  return (
    <StyledDiv>
      <Input
        fullWidth
        rows={1}
        multiline={true}
        value={textMessage}
        disableUnderline
        onChange={e => setTextMessage(e.target.value)}
        placeholder="输入消息..."
        onKeyUpCapture={handleKeyDownCapture}
        startAdornment={
          <InputAdornment position="start">
            <EmojiPicker setValue={setTextMessage} />
          </InputAdornment>
        }
        endAdornment={
          <Box sx={{ flexShrink: 0, mr: 1.5, "& > *": { mx: 0.5 } }}>
            <ImagePicker onSend={url => onChatMessageSend(id, "IMG", url)} />
            <FilePicker onSend={url => onChatMessageSend(id, "FILE", url)} />
          </Box>
        }
      />

      <Divider orientation="vertical" flexItem />

      <IconButton
        color="primary"
        disabled={!textMessage}
        onClick={handleSendTextMessage}
        sx={{ mx: 1 }}
      >
        <Icon icon={roundSend} width={24} height={24} />
      </IconButton>
    </StyledDiv>
  );
}
