import MaterialAppBar, { AppBarProps } from "@mui/material/AppBar";
import Toolbar, { ToolbarProps } from "@mui/material/Toolbar";
import { styled } from "@mui/material/styles";

const AppBarComponent = styled(MaterialAppBar)<AppBarProps>(({ theme }) => ({
  backgroundColor: "inherit",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: "1px solid",
  borderColor: theme.palette.divider,
})) as typeof MaterialAppBar;

const minAppBarHeight = "80px";

const ToolbarComponent = styled(Toolbar)<ToolbarProps>(({ theme }) => ({
  minHeight: minAppBarHeight,
  [theme.breakpoints.down("sm")]: {
    minHeight: minAppBarHeight,
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(6),
  },
  [theme.breakpoints.up("sm")]: {
    minHeight: minAppBarHeight,
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
  },
})) as typeof Toolbar;

// TODO: Make nav component prop/option for this AppBar component
export const AppBar = (props: AppBarProps) => {
  return (
    <AppBarComponent {...props}>
      <ToolbarComponent component="nav">{props.children}</ToolbarComponent>
    </AppBarComponent>
  );
};
