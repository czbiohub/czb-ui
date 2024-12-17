import React, { useState, useEffect, useMemo } from "react";
import { ImageLoader } from "@loaders.gl/images";
import { load } from "@loaders.gl/core";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import DeckGL from "@deck.gl/react";
import { BitmapLayer } from "@deck.gl/layers";
import { OrthographicView, OrthographicViewState } from "@deck.gl/core";

interface imageDimensions {
  width: number;
  height: number;
}

interface ImageProps {
  imageUrl: string;
  imageDimensions: imageDimensions;
}

// TODO: Address "any" type
const imageCache: Record<string, any> = {};

// Hook to load an image and cache it
function useCachedImage(imageUrl: string) {
  // TODO: Address "any" type
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (imageUrl in imageCache) {
      setImage(imageCache[imageUrl]);
      setIsLoading(false);
    } else {
      setImage(null);
      if (imageUrl) {
        setIsLoading(true);
        load(imageUrl, ImageLoader).then((res) => {
          imageCache[imageUrl] = res;
          setImage(res);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [imageUrl]);

  return { image, isLoading };
}
export default function Image({ imageUrl, imageDimensions }: ImageProps) {
  const [viewportDimensions, setViewportDimensions] = useState({
    width: 1000,
    height: 1000,
  });
  const { image, isLoading } = useCachedImage(imageUrl);

  // Get the viewport width on mount
  // so we can adjust the starting zoom accordingly
  useEffect(() => {
    // Due to server-side rendering, window may not be defined.
    // If window isn't defined somehow in the client, the default value of 1000 will be used
    // (as set in the useState() call above)
    if (window) {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  const layer = new BitmapLayer({
    id: "bitmap-layer",
    bounds: [0, imageDimensions.height, imageDimensions.width, 0],
    image: image,
  });

  // Based on the viewport and image width, determine a zoom percentage that will **fit** the image to the viewport.
  // Fit means that the image will be as large as possible without being cut-off.
  // "The zoom level of the viewport. zoom: 0 maps one unit distance to one pixel on screen,
  //  and increasing zoom by 1 scales the same object to twice as large."
  // https://deck.gl/docs/api-reference/core/orthographic-view#view-state
  const zoomLevelToFitWidth = Math.log2(
    viewportDimensions.width / imageDimensions.width
  );
  const zoomLevelToFitHeight = Math.log2(
    viewportDimensions.height / imageDimensions.height
  );
  const startingZoomLevel = Math.min(zoomLevelToFitWidth, zoomLevelToFitHeight);

  const INITIAL_VIEW_STATE: OrthographicViewState = {
    target: [imageDimensions.width / 2, imageDimensions.height / 2, 0], // Start at the center of the image
    zoom: startingZoomLevel,
    minZoom: startingZoomLevel - 1,
  };

  return (
    <>
      {isLoading && <LoadingComponent />}
      <DeckGL
        views={[new OrthographicView({ id: "ortho" })]}
        controller={true}
        initialViewState={{ ortho: INITIAL_VIEW_STATE }}
        layers={[layer]}
      />
    </>
  );
}
