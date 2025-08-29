import { MaskedViewProps } from "@react-native-masked-view/masked-view";
import { domToPng } from "modern-screenshot";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";

export default function MaskedView({
  children,
  maskElement,
  style,
  ...rest
}: MaskedViewProps) {
  const maskRef = useRef(null);
  const [mask, setMask] = useState("");

  const snapShot = useCallback(() => {
    if (!maskRef.current) return;

    domToPng(maskRef.current).then((dataUrl) => {
      setMask(dataUrl);
    });
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(snapShot);
    observer.observe(maskRef.current!);
    return () => {
      observer.disconnect();
    };
  }, [maskElement, snapShot]);

  return (
    <>
      <View
        style={{
          position: "absolute",
          transform: [{ translateX: "-200%" }, { translateY: "-200%" }],
        }}
      >
        <div ref={maskRef}>{maskElement}</div>
      </View>

      <View
        style={[
          style,
          {
            //@ts-ignore
            mask: `url(${mask}) center no-repeat`,
          },
        ]}
        {...rest}
      >
        {children}
      </View>
    </>
  );
}
