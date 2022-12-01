import { useContext } from "react";
import {
  CollapseDrawerContext,
  CollapseDrawerContextProps,
} from "../../contexts/user/CollapseDrawerContext";

// ----------------------------------------------------------------------

const useCollapseDrawer = (): CollapseDrawerContextProps =>
  useContext(CollapseDrawerContext);

export default useCollapseDrawer;
