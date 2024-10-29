# @czb-ui/core

## 2.0.0-next.19

### Minor Changes

- 2023441: Rename NextJSThemeProvider to ExperimentalThemeV2Provider
- 2023441: ExperimentalThemeV2Provider now has mode prop to set theme

## 2.0.0-next.18

### Patch Changes

- 54eccc4: Remove console.logs

## 2.0.0-next.17

### Minor Changes

- 3f21abd: New experimental theme to use Inter font and more SDS default styles

## 2.0.0-next.16

### Patch Changes

- 69bbb31: Change gray shade for MUI borders

## 2.0.0-next.15

### Patch Changes

- 3fd7563: Fix scroll bars showing in Info Box, even if there was no overflow

## 2.0.0-next.14

### Patch Changes

- 501667e: Improved NavBar and Footer link functionality

## 2.0.0-next.13

### Minor Changes

- 41036bf: add `desktopContentContainerSxProps` prop to FilterView

## 2.0.0-next.12

### Minor Changes

- add `small` prop back for info boxes backwards compatibility

## 2.0.0-next.11

### Minor Changes

- aad0d29: Add logoLink prop for footer

## 2.0.0-next.10

### Major Changes

- Add dark mode support with SDS v21

## 2.0.0-next.9

### Major Changes

- Use SDS v21

## 2.0.0-next.8

### Major Changes

- 1da8dbd: Add CJS support

## 2.0.0-next.7

### Minor Changes

- a2c1049: Hide NavBar menu items if there are no pages
- dc7c05d: Improved experimental dark mode

## 2.0.0-next.6

### Major Changes

- 0e5b39f: Improved info box

## 2.0.0-next.5

### Patch Changes

- 2321a0f: Remove unnecessary styles in FilterView

## 2.0.0-next.4

### Minor Changes

- e6c9794: Expose sx props for custom styling in FilterView

## 2.0.0-next.3

### Minor Changes

- 1ab70f8: FilterView component

## 2.0.0-next.2

### Patch Changes

- 8051015: Fix small prop being passed to MUI Box component in InfoBox

## 2.0.0-next.1

### Major Changes

- cc97274: Remove deprecated Banner components

## 2.0.0-next.0

### Major Changes

- f9657f4: Drop CJS support
- 458c708: Remove withButton style on Info Box
- 12da0c7: Use `href=` instead of `to=` for buttons and link components. This is related to using routers for navigation (e.g. Next.js' `Link` component). If using Next.js, you'll need to use Next.js' `Link` component for the `pagesComponent` prop:

  ```jsx
  import NextLink from "next/link";
  import { InfoBox } from "@czb-ui/core";

  // ...

  <InfoBox
    page={{
      title: "About page",
      to: "/about",
    }}
    pagesComponent={NextLink}
  />;
  ```

- 12da0c7: Add Hanken Grotesk font weight. Please import the following fonts in your project:

  ```jsx
  import "@fontsource/hanken-grotesk/400.css";
  import "@fontsource/hanken-grotesk/600.css";
  import "@fontsource/hanken-grotesk/700.css";
  import "@fontsource/stix-two-text/600.css";
  import "@fontsource/lato/700.css";
  import "@fontsource/barlow/600.css";
  import "@fontsource/barlow/400.css";
  import "@fontsource/jetbrains-mono/400.css";
  ```

- 8e322f0: Update to SDS v20, refactor most components to use emotion/styled customization

### Minor Changes

- f9657f4: Support RSC/Client Components

### Patch Changes

- a81748c: Fix externalLink having wrong type

## 1.3.1

### Patch Changes

- ec4945c: Fix key for improved mobile nav bar

## 1.3.0

### Minor Changes

- d082517: Improve mobile nav bar list

## 1.2.0

### Minor Changes

- f6caa34: Code block syntax highlighting, inline code styles

### Patch Changes

- e314a31: Info boxes better height styling

## 1.1.1

### Patch Changes

- 5bafbf7: Support React 17

## 1.1.0

### Minor Changes

- 37429fc: Add FullScreenIFrame

## 1.0.1

### Patch Changes

- 60de8b3: Update tinacms. Update react if needed

## 1.0.0

### Major Changes

- b066109: Rebrand 2023

### Minor Changes

- a9db0ac: Add nobackground banner type
- d384253: Change settings when hamburger menu shows, to avoid squished/two columns of text in NavBar
- 066d4af: Add external link feature to nav bar (https://github.com/czbiohub/czb-ui/pull/30)
- ce5c610: Add small footer variant
- af3d8aa: Change settings when hamburger menu shows, to avoid squished/two columns of text in NavBar
- 8827c68: Make navbar height adjustable
- 22a3acb: If there's more than 7 pages, switch to mobile menu at md breakpoint instead of sm breakpoint
- 39fd98a: Use Barlow font in buttons, **breaking change**: Please update the font imports:

  ```js
  import "@fontsource/hanken-grotesk/400.css";
  import "@fontsource/hanken-grotesk/700.css";
  import "@fontsource/stix-two-text/600.css";
  import "@fontsource/lato/700.css";
  import "@fontsource/barlow/600.css";
  import "@fontsource/barlow/400.css";
  ```

- 8827c68: Add functions to customize Biohub theme

### Patch Changes

- 121d01b: Use ESM and CJS
- c951b69: Update czifui
- 04e9810: Move common devDependencies to root package.json
- 350a232: Fix NavBar long menu titles taking two lines
- 3fe423a: Use Classic Holy Grail Layout on NavBarAndFooterPlacer
- 52ee322: Adjust footer spacings
- ad956d2: Update czifui
- 1daafaf: Update czifui
- a8d4a19: Remove unused textinput component
- 8827c68: More responsive legacy info boxes. Titles and subtitles taking up multiple lines will expand the whole box now instead of overflowing
- 7694db7: Use hex in contrastText to avoid bugs with other components not parsing color string
- a8d4a19: Use lists correctly for nav bars, fix key errors
- 6c3efa5: Remove rjsf dependencies

## 0.3.0

### Minor Changes

- 248e5f3: Add "Legacy Info Box" which is the info box component styled to look like the Info Box from the previous UI library. It is also available through Tina CMS.
- 1cf462d: Add Heading Separator component. It is available as a block in Tina CMS also.

### Patch Changes

- 85bd321: Fix legacy info box component overflowing over other elements in smaller breakpoints
- db5a67a: Add new tab prop/option to legacy info box
- ca03f3f: Add additional margin-top on grand banner on mobile
- edee8d9: Text is now white on primary button (add explicit contrastText to primary color palette)
- 7976260: Adjust footer menu items spacing
- c5cddc8: Grand banner component: make image smaller, switch to column variant on smaller breakpoint
- e3f3055: Change grand banner text styles
- e3f3055: Add new "ultimateHeading" typography variant
- 07f9433: Make footer cz biohub logo go to czbiohub.org (for now)
- 68711db: Add small and square variants/props to legacy info box
- 280e241: Shrink legacy info box a bit to better suit smaller mobile devices
- c5cddc8: Add ability to switch title font on Grand Banner component between Butler and Lato
- 95258f5: Add id prop to Heading Separator component

## 0.2.0

### Minor Changes

- f7e2fce:
  - Add experimental dark mode
  - Work on info box styles
  - Change global container maxWidth
  - Change global body font size
  - Add small variant of info box (useful for grids)
  - Add pages for footer
  - Style footer for mobile
  - Use bold fonts for links on info box and image button
  - Remove Box and Stack components that were just re-exported from mui

### Patch Changes

- 2899f14: czifui is now a peer dependency
- 0844538: Add nav tag to appbar component
- 1e7dbf7: Use czifui v7.0.0
- 1e0faa0: Improve info box styles, work on styling Grand banner
- e31cbad: Adjust sm breakpoint on container, style grid info boxes
- 2f1b7b7: Set rollup plugin delete to run once
- b2039c3: Close mobile menu on link click and outside click, add nav bar home link (for Next.js only for now), fix additional margin with info box in rich text
- df0c1b0: Create prop to disable Y margins on InfoBoxBlock, fix mobile menu flex grow, only make clickable area for home button on the actual logo and title text on nav bar

## 0.1.2

### Patch Changes

- Edit package.json to only get czifui beta with mui v5
- 36c92fb: Add rollup-plugin-delete and add external deps to rollup config

## 0.1.1

### Patch Changes

- Build with correct config before publishing

## 0.1.0

### Minor Changes

- 996ba93: Add starting READMEs for npm page

## 0.0.2

### Patch Changes

- 93a9147: init
