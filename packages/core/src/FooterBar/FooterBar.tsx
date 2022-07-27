import MaterialAppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar, { ToolbarProps } from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

const AppBarComponent = styled(MaterialAppBar)<AppBarProps>(({ theme }) => ({
  backgroundColor: theme.palette.grey[300],
  color: "white",
  boxShadow: "none",
})) as typeof MaterialAppBar;

const minAppBarHeight = "100px";

const ToolbarComponent = styled(Toolbar)<ToolbarProps>(({ theme }) => ({
  minHeight: minAppBarHeight,
  [theme.breakpoints.down("sm")]: {
    minHeight: minAppBarHeight,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  [theme.breakpoints.up("sm")]: {
    minHeight: minAppBarHeight,
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
  },
}));

export const FooterBar = (props: AppBarProps) => {
  return (
    <AppBarComponent {...props}>
      <ToolbarComponent sx={{ alignItems: "flex-start", padding: "10px" }}>
        {props.children}
      </ToolbarComponent>
    </AppBarComponent>
  );
};
