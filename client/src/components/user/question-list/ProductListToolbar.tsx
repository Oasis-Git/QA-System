import { Icon } from "@iconify/react";
import searchFill from "@iconify/icons-eva/search-fill";
import roundRefreshList from "@iconify/icons-ic/round-refresh";
// material
import { useTheme, styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  Tooltip,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

type ProductListToolbarProps = {
  filterName: string;
  onFilterName: (value: string) => void;
};

export default function ProductListToolbar({
  filterName,
  onFilterName,
}: ProductListToolbarProps): JSX.Element {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <RootStyle
      sx={{
        ...{
          color: isLight ? "primary.main" : "text.primary",
          bgcolor: isLight ? "primary.lighter" : "primary.dark",
        },
      }}
    >
      <SearchStyle
        value={filterName}
        onChange={e => onFilterName(e.target.value)}
        placeholder="Search question..."
        startAdornment={
          <InputAdornment position="start">
            <Box
              component={Icon}
              icon={searchFill}
              sx={{ color: "text.enabled" }}
            />
          </InputAdornment>
        }
      />

      <Tooltip title="刷新">
        <IconButton>
          <Icon icon={roundRefreshList} />
        </IconButton>
      </Tooltip>
    </RootStyle>
  );
}
