import type { Meta, StoryObj } from "@storybook/react";
import { ThreeDUmap as CZBUIThreeDUmap } from "@czb-ui/viz";

const meta: Meta<typeof CZBUIThreeDUmap> = {
  title: "core/3D UMAP",
  component: CZBUIThreeDUmap,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

export const Preview: StoryObj<typeof CZBUIThreeDUmap> = {
  args: {},
  render: (args) => (
    <div style={{ height: "100vh" }}>
      <CZBUIThreeDUmap {...args} />
    </div>
  ),
};
