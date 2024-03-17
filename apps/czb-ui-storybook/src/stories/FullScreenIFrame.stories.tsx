import {
  FullScreenIFrame as CZBUIFullScreenIFrame,
  FullScreenIFrameProps,
} from "@czb-ui/core";

export default {
  title: "Full Screen Iframe",
  component: CZBUIFullScreenIFrame,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    fullScreenButtonLocation: {
      options: ["topleft", "topright", "bottomleft", "bottomright"],
      control: { type: "radio" },
    },
  },
};

const Template = (args: FullScreenIFrameProps) => (
  <div style={{ height: "100vh" }}>
    <CZBUIFullScreenIFrame {...args} />
  </div>
);

export const FullScreenIframe = Template.bind({});
FullScreenIframe.args = {
  src: "https://onclass-dash-development.ds.czbiohub.org/onclass",
  fullScreenButtonLocation: "topright",
  fullScreenButtonMargin: "20px",
};
