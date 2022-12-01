import smilingFaceFill from "@iconify/icons-eva/smiling-face-fill";
import { Icon } from "@iconify/react";
import { Box, BoxProps, ClickAwayListener, IconButton } from "@mui/material";
import { alpha, styled, useTheme } from "@mui/material/styles";
import { BaseEmoji, Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import React, { useState } from "react";

const StyledBox = styled(Box)({
  position: "relative",
});

const StyledDiv = styled("div")(({ theme }) => ({
  bottom: 40,
  overflow: "hidden",
  position: "absolute",
  left: theme.spacing(-2),
  boxShadow: theme.customShadows.z20,
  borderRadius: theme.shape.borderRadiusMd,
  "& .emoji-mart": {
    border: "none",
    backgroundColor: theme.palette.background.paper,
  },
  "& .emoji-mart-anchor": {
    color: theme.palette.text.disabled,
    "&:hover, &:focus, &.emoji-mart-anchor-selected": {
      color: theme.palette.text.primary,
    },
  },
  "& .emoji-mart-bar": { borderColor: theme.palette.divider },
  "& .emoji-mart-search input": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    borderColor: theme.palette.grey[500_32],
    "&::placeholder": {
      ...theme.typography.body2,
      color: theme.palette.text.disabled,
    },
  },
  "& .emoji-mart-search-icon svg": {
    opacity: 1,
    fill: theme.palette.text.disabled,
  },
  "& .emoji-mart-category-label span": {
    ...theme.typography.subtitle2,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)", // Fix on Mobile
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
  },
  "& .emoji-mart-title-label": { color: theme.palette.text.primary },
  "& .emoji-mart-category .emoji-mart-emoji:hover:before": {
    backgroundColor: theme.palette.action.selected,
  },
  "& .emoji-mart-emoji": { outline: "none" },
  "& .emoji-mart-preview-name": {
    color: theme.palette.text.primary,
  },
  "& .emoji-mart-preview-shortname, .emoji-mart-preview-emoticon": {
    color: theme.palette.text.secondary,
  },
}));

// ----------------------------------------------------------------------

interface EmojiPickerProps extends BoxProps {
  disabled?: boolean;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  alignRight?: boolean;
}

export default function EmojiPicker({
  setValue,
  alignRight = false,
  ...other
}: EmojiPickerProps): JSX.Element {
  const theme = useTheme();
  const [emojiPickerState, SetEmojiPicker] = useState(false);

  let emojiPicker;
  if (emojiPickerState) {
    emojiPicker = (
      <Picker
        color={theme.palette.primary.main}
        title="选择表情包..."
        emoji="point_up"
        onSelect={(emoji: BaseEmoji) => {
          setValue(value => value + emoji?.native);
        }}
      />
    );
  }

  const triggerPicker = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    SetEmojiPicker(!emojiPickerState);
  };

  const handleClickAway = () => {
    SetEmojiPicker(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <StyledBox {...other}>
        <StyledDiv
          sx={{
            ...(alignRight && {
              right: -2,
              left: "auto !important",
            }),
          }}
        >
          {emojiPicker}
        </StyledDiv>
        <IconButton size="small" onClick={triggerPicker}>
          <Icon icon={smilingFaceFill} width={20} height={20} />
        </IconButton>
      </StyledBox>
    </ClickAwayListener>
  );
}
