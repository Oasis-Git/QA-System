import roundAddAPhoto from "@iconify/icons-ic/round-add-a-photo";
import { Icon } from "@iconify/react";
import { Box, Typography } from "@mui/material";
// material
import { styled, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import { ReactNode } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
// utils

const RootStyle = styled("div")(({ theme }) => ({
  width: 144,
  height: 144,
  margin: "auto",
  borderRadius: "50%",
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.grey[500_32]}`,
}));

const DropZoneStyle = styled("div")({
  zIndex: 0,
  width: "100%",
  height: "100%",
  outline: "none",
  display: "flex",
  overflow: "hidden",
  borderRadius: "50%",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  "& > *": { width: "100%", height: "100%" },
  "&:hover": {
    cursor: "pointer",
    "& .placeholder": {
      zIndex: 9,
    },
  },
});

const PlaceholderStyle = styled("div")(({ theme }) => ({
  display: "flex",
  position: "absolute",
  alignItems: "center",
  flexDirection: "column",
  justifyContent: "center",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&:hover": { opacity: 0.72 },
}));

interface UploadAvatarProps extends DropzoneOptions {
  error?: boolean;
  file: string;
  caption?: ReactNode;
  sx?: SxProps<Theme>;
}

export default function UploadAvatar({
  error,
  file,
  caption,
  sx,
  ...other
}: UploadAvatarProps): JSX.Element {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      multiple: false,
      ...other,
    });

  return (
    <>
      <RootStyle sx={sx}>
        <DropZoneStyle
          {...getRootProps()}
          sx={{
            ...(isDragActive && { opacity: 0.72 }),
            ...((isDragReject || error) && {
              color: "error.main",
              borderColor: "error.light",
              bgcolor: "error.lighter",
            }),
          }}
        >
          <input {...getInputProps()} />

          {file && (
            <Box
              component="img"
              alt="avatar"
              src={file}
              sx={{ zIndex: 8, objectFit: "cover" }}
            />
          )}

          <PlaceholderStyle
            className="placeholder"
            sx={{
              ...(file && {
                opacity: 0,
                color: "common.white",
                bgcolor: "grey.900",
                "&:hover": { opacity: 0.72 },
              }),
            }}
          >
            <Box
              component={Icon}
              icon={roundAddAPhoto}
              sx={{ width: 24, height: 24, mb: 1 }}
            />
            <Typography variant="caption">Upload photo</Typography>
          </PlaceholderStyle>
        </DropZoneStyle>
      </RootStyle>

      {caption}
    </>
  );
}
