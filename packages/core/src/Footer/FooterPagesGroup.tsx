import { Box, Typography } from "@mui/material";
import { Link } from "czifui";

// TODO: Create one page interface that has support
// for external links, use that one for all the components
// that require links
interface FooterPages {
  title: string;
  to: string;
  externalLink?: boolean;
}

interface PageGroup {
  pages: Array<FooterPages>;
  title: string;
}

interface FooterPagesGroupProps {
  pages: Array<PageGroup>;
  pagesComponent?: any;
}

// TODO: Create component for link
// that handles inner routes and external
// links (like the one in here)
export const FooterPagesGroup = ({
  pages,
  pagesComponent,
}: FooterPagesGroupProps) => {
  return (
    <>
      {pages.map((pageGroup, i) => {
        return (
          <Box key={i}>
            <Typography
              sx={{ textTransform: "uppercase", fontWeight: "bold" }}
              component="b"
            >
              {pageGroup.title}
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyleType: "none",
                padding: "0px",
                marginBottom: "0px",
              }}
            >
              {pageGroup.pages.map((page, j) => {
                return (
                  <li key={j}>
                    {!page.externalLink && (
                      <Link
                        sx={{ marginTop: "1rem", color: "white" }}
                        to={page?.to}
                        component={page?.to ? pagesComponent : undefined}
                      >
                        {page?.title}
                      </Link>
                    )}
                    {/* If target="_blank" needs to be added also add rel="noopener" */}
                    {page.externalLink && (
                      <Link
                        sx={{ marginTop: "1rem", color: "white" }}
                        href={page?.to}
                      >
                        {page?.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </>
  );
};