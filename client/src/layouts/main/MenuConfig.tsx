import { Icon } from "@iconify/react";
import gridFill from "@iconify/icons-eva/grid-fill";
import bookOpenFill from "@iconify/icons-eva/book-open-fill";
import { PATH_QA } from "../../routes/paths";

const ICON_SIZE = {
  width: 22,
  height: 22,
};

const menuConfig = [
  {
    title: "回答者列表",
    icon: <Icon icon={gridFill} {...ICON_SIZE} />,
    path: "/",
  },
  {
    title: "问答库",
    icon: <Icon icon={bookOpenFill} {...ICON_SIZE} />,
    path: PATH_QA.repo,
  },
];

export default menuConfig;
