import { alpha } from "@mui/material/styles";
import {
  Box,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  CardActionArea,
  FormControlLabel,
} from "@mui/material";
// hooks
import useAppearance from "../../../hooks/useAppearance";
import { PaletteColor } from "../../../types/palette";
// ----------------------------------------------------------------------

export default function SettingColor(): JSX.Element {
  const { getThemeColor, setThemeColor } = useAppearance();

  const colorOption: PaletteColor = getThemeColor();
  const colors = [
    { name: "green", value: "#00AB55" },
    { name: "purple", value: "#7635dc" },
    { name: "cyan", value: "#1CCAFF" },
    { name: "blue", value: "#0045FF" },
    { name: "orange", value: "#fda92d" },
    { name: "red", value: "#FF3030" },
  ];

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setThemeColor((event.target as HTMLInputElement).value as PaletteColor);
  };

  return (
    <RadioGroup
      name="paletteColor"
      value={colorOption}
      onChange={onChangeColor}
    >
      <Grid container spacing={1.5} dir="ltr">
        {colors.map(color => {
          const colorName = color.name;
          const colorValue = color.value;
          const isSelected = colorOption === colorName;

          return (
            <Grid item xs={4} key={colorName}>
              <Paper
                variant={isSelected ? "elevation" : "outlined"}
                sx={{
                  ...(isSelected && {
                    bgcolor: alpha(colorValue, 0.12),
                    border: `solid 2px ${colorValue}`,
                    boxShadow: `inset 0 4px 8px 0 ${alpha(colorValue, 0.24)}`,
                  }),
                }}
              >
                <CardActionArea sx={{ borderRadius: 1, color: colorValue }}>
                  <Box
                    sx={{
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 14,
                        borderRadius: "50%",
                        bgcolor: colorValue,
                        transform: "rotate(-45deg)",
                        transition: theme =>
                          theme.transitions.create("all", {
                            easing: theme.transitions.easing.easeInOut,
                            duration: theme.transitions.duration.shorter,
                          }),
                        ...(isSelected && { transform: "none" }),
                      }}
                    />
                  </Box>

                  <FormControlLabel
                    label=""
                    value={colorName}
                    control={<Radio sx={{ display: "none" }} />}
                    sx={{
                      top: 0,
                      margin: 0,
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                    }}
                  />
                </CardActionArea>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
}
