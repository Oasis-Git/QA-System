import { Avatar, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { PATH_USER } from "../../routes/paths";

export default function ResetPasswordComplete(): JSX.Element {
  const [leftTime, setLeftTime] = useState(3);
  useEffect(() => {
    const timer = setInterval(() => {
      setLeftTime(leftTime => {
        return leftTime - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [leftTime]);

  return leftTime > 0 ? (
    <Stack>
      <Avatar
        src="/complete.png"
        sx={{ alignSelf: "center", width: 80, height: 80, mb: 5 }}
      />
      <Typography variant="h3" sx={{ alignSelf: "center" }}>
        密码重置成功
      </Typography>
    </Stack>
  ) : (
    <Navigate to={PATH_USER.login} />
  );
}
