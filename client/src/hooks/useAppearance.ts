import { Context } from "../contexts/AppearanceContext";
import hookContext from "./hookContext";

const useAppearance = hookContext(Context, "ThemeContext");
export default useAppearance;
