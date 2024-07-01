"use client";
// Based off example: https://mui.com/material-ui/react-drawer/#full-height-navigation
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import { FilterViewProps } from "./FilterView";

export const DesktopDrawer = ({
  drawerComponent,
  contentComponent,
  desktopDrawerWidth,
}: FilterViewProps) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: desktopDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: desktopDrawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {drawerComponent}
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        {contentComponent}
      </Box>
    </Box>
  );
};