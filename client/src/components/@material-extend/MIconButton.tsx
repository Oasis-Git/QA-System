import { forwardRef } from "react";
// material
import { IconButton, IconButtonProps } from "@mui/material";
//
import { ButtonAnimate } from "../general/animate";
import PropTypes from "prop-types";

const MIconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, ...other }, ref) => (
    <ButtonAnimate>
      <IconButton ref={ref} {...other}>
        {children}
      </IconButton>
    </ButtonAnimate>
  )
);

MIconButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MIconButton;
