import { Image, ImageProps } from "expo-image";
import { PropsWithChildren, ReactNode, useState } from "react";
import { ActivityIndicator, StyleSheet, View, ViewStyle } from "react-native";

export interface ImageViewProps extends ImageProps {
  containerStyle?: ViewStyle;
  fallbackSource?: ImageProps["source"];
  fallbackContent?: ReactNode;
  showLoading?: boolean;
}

export default function ImageView({
  containerStyle,
  fallbackSource,
  fallbackContent,
  showLoading = true,
  ...imageProps
}: Readonly<PropsWithChildren<ImageViewProps>>) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const { source, onLoadStart, onLoadEnd, onError, ...restImageProps } =
    imageProps;

  const hasDisplaySource = !!source;

  const shouldRenderFallbackContent =
    (!hasDisplaySource || (hasError && !fallbackSource)) && !!fallbackContent;

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
    onLoadEnd?.();
  };

  const handleError: ImageProps["onError"] = (error) => {
    setHasError(true);
    setIsLoading(false);
    onError?.(error);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {hasDisplaySource && (
        <Image
          style={styles.image}
          source={source}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          {...restImageProps}
        />
      )}

      {shouldRenderFallbackContent && (
        <View style={styles.fallbackContainer}>{fallbackContent}</View>
      )}

      {showLoading && isLoading && hasDisplaySource && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    borderWidth: 0,
  },
  fallbackContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
