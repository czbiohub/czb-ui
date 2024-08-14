import React, { useRef, useEffect, useState } from "react";
import { ThreeDimScatterPlot } from "./three-dim-scatterplot";

export const ThreeDUmap = () => {
  const scatterplotRef = useRef<ThreeDimScatterPlot | null>(null);
  const scatterplotContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // https://react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents
    if (
      scatterplotRef.current === null &&
      scatterplotContainerRef.current !== null
    ) {
      scatterplotRef.current = new ThreeDimScatterPlot(
        scatterplotContainerRef.current!
      );

      scatterplotRef.current.debug = true;

      scatterplotRef.current.loadZarr(
        "https://public.czbiohub.org/royerlab/zebrahub/sequencing/3d-umaps/3d_umap_nmp",
        "coords.zarr",
        "first_timepoint",
        "positions",
        "First Timepoint"
      );

      setTimeout(() => {
        // Delay to demonstrate loading of multiple layers
        scatterplotRef.current!.loadZarr(
          "https://public.czbiohub.org/royerlab/zebrahub/sequencing/3d-umaps/3d_umap_nmp",
          "attribute_celltype.zarr",
          "cell_types",
          "colors",
          "Cell types"
        );
      }, 2000);

      setTimeout(() => {
        scatterplotRef.current!.loadZarr(
          "https://public.czbiohub.org/royerlab/zebrahub/sequencing/3d-umaps/3d_umap_nmp",
          "attribute_random.zarr",
          "random",
          "colors",
          "Random"
        );
      }, 4000);
    }
  }, [scatterplotContainerRef]);

  return (
    <>
      <div
        ref={scatterplotContainerRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
        }}
      />
    </>
  );
};
