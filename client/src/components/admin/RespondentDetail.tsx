import {
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import React from "react";
import useRespondentDetail from "../../hooks/admin/useRespondentDetail";
import { fDateTime } from "../../utils/formatTime";

interface RespondentDetailProps {
  username: string;
  handleApproveClick: React.MouseEventHandler<HTMLButtonElement>;
  handleRejectClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function RespondentDetail({
  username,
  handleApproveClick,
  handleRejectClick,
}: RespondentDetailProps): JSX.Element {
  const respondent = useRespondentDetail(username);

  return (
    <List sx={{ maxWidth: 350 }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            alt={respondent.username}
            src={respondent.avatar}
            sx={{ width: 60, height: 60 }}
          />
        </ListItemAvatar>
      </ListItem>

      <ListItem>
        <ListItemText
          primary={respondent.username}
          secondary={respondent.description}
          primaryTypographyProps={{ variant: "subtitle1" }}
          secondaryTypographyProps={{ variant: "caption" }}
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary="个人简介"
          primaryTypographyProps={{ variant: "button" }}
          secondary={respondent.detail}
          secondaryTypographyProps={{ variant: "caption" }}
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary="专长"
          primaryTypographyProps={{ variant: "button" }}
          secondary={
            <>
              {respondent.specialities.map((speciality, idx) => (
                <Chip
                  label={speciality}
                  color="info"
                  key={idx}
                  sx={{ height: 20, mr: 2, mt: 1 }}
                />
              ))}
            </>
          }
        />
      </ListItem>

      <ListItem>
        <ListItemText
          primary="申请时间"
          primaryTypographyProps={{ variant: "button" }}
          secondary={fDateTime(respondent.updatedAt)}
          secondaryTypographyProps={{ variant: "caption" }}
        />

        <ListItemText
          primary="咨询费"
          primaryTypographyProps={{ variant: "button" }}
          secondary={`￥${respondent.fee}`}
          secondaryTypographyProps={{ variant: "caption" }}
        />
      </ListItem>

      <ListItem>
        <Button color="success" variant="outlined" onClick={handleApproveClick}>
          通过
        </Button>
        <Button
          color="error"
          variant="outlined"
          sx={{ ml: 16 }}
          onClick={handleRejectClick}
        >
          驳回
        </Button>
      </ListItem>
    </List>
  );
}
