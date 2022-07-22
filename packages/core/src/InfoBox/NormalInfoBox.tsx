import { Typography, styled } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { Link } from "czifui";
import { InfoBoxProps } from "./InfoBox";

interface NormalInfoBoxContainerProps extends BoxProps {
  imageOnRight?: boolean;
}

const NormalInfoBoxContainer = styled(Box, {
  shouldForwardProp: (prop) => prop != "imageOnRight",
})<NormalInfoBoxContainerProps>(({ imageOnRight, theme }) => ({
  zIndex: 1,
  background: "#f9f9f9",
  height: "100%",
  display: "flex",
  gap: "50px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
  [theme.breakpoints.up("sm")]: {
    flexDirection: imageOnRight ? "row-reverse" : "row",
  },
}));

export default function NormalInfoBox({ image, imageOnRight }: InfoBoxProps) {
  return (
    <NormalInfoBoxContainer imageOnRight={imageOnRight}>
      <Box flex={3} height="100%">
        {image}
      </Box>
      <Box
        flex={2}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h2" component="div">
          The Tabula Sapiens: A multiple-organ, single-cell transcriptomic atlas
          of humans
        </Typography>
        <Typography>
          The Tabula Sapiens Consortium, Science 376, eabl4896 (2022).
        </Typography>
        <Link sx={{ marginTop: "1rem" }}>Explore Tools</Link>
      </Box>
    </NormalInfoBoxContainer>
  );
}
