import { useFocusEffect } from "expo-router";
import { PropsWithChildren, useCallback, useState } from "react";

export default function UnmountWrapper({
  children,
}: Readonly<PropsWithChildren>) {
  const [isMounted, setIsMounted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsMounted(true);

      return () => {
        setIsMounted(false);
      };
    }, []),
  );

  return <>{isMounted && children}</>;
}
