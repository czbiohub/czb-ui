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

      const url =
        "https://public.czbiohub.org/royerlab/zebrahub/sequencing/3d-umaps/integrated_full_umap_3d";

      async function loadData() {
        if (!scatterplotRef.current || !url) return;
        await scatterplotRef.current.loadZarr(
          url,
          "coords.zarr",
          "coordinates",
          "positions",
          "Coordinates"
        );
        await scatterplotRef.current.loadZarr(
          url,
          "attribute_timepoint.zarr",
          "timepoints",
          "colors",
          "Timepoints"
        );
        await scatterplotRef.current.loadZarr(
          url,
          "attribute_celltype.zarr",
          "cell_types",
          "colors",
          "Cell types"
        );
      }

      loadData();
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
