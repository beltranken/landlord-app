import TabButton, {
  Icon,
} from "@/components/molecules/tab-button/tab-button-ui";
import { Colors } from "@/constants";
import Sizes from "@/constants/sizes";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, View } from "react-native";

export default function CustomTabBar({
  state,
  navigation,
}: Readonly<BottomTabBarProps>) {
  const focusedRoute = state.routes[state.index];

  if (focusedRoute.name.includes("[id]") || focusedRoute.name.includes("add")) {
    return null;
  }

  const filteredRoutes = useMemo(
    () =>
      state.routes.filter((route) => {
        return !route.name.includes("[id]") && !route.name.includes("add");
      }),
    [state.routes],
  );

  const focusedIndex = filteredRoutes.findIndex(
    (route) => route.key === focusedRoute.key,
  );

  const TAB_WIDTH = 48;
  const [tabBarWidth, setTabBarWidth] = useState(0);

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focusedIndex < 0 || tabBarWidth === 0) return;

    const count = filteredRoutes.length;
    if (count <= 1) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      return;
    }

    const PADDING = 4;
    const innerWidth = tabBarWidth - PADDING * 2;
    const maxOffset = innerWidth - TAB_WIDTH;
    const step = maxOffset / (count - 1);
    const target = step * focusedIndex;

    Animated.spring(translateX, {
      toValue: target,
      useNativeDriver: true,
    }).start();
  }, [focusedIndex, tabBarWidth, filteredRoutes.length, translateX]);

  const handleTabBarLayout = (event: LayoutChangeEvent) => {
    setTabBarWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar} onLayout={handleTabBarLayout}>
        <Animated.View
          style={{
            position: "absolute",
            left: 4,
            top: 4,
            width: TAB_WIDTH,
            height: TAB_WIDTH,
            borderRadius: 100,
            backgroundColor: Colors.surface,
            transform: [{ translateX }],
          }}
        />

        {filteredRoutes.map((route, index) => {
          const isFocused = route.key === focusedRoute.key;

          let icon: Icon = "grid";
          switch (route.name) {
            case "dashboard/index":
              icon = "grid";
              break;
            case "properties/index":
              icon = "home";
              break;
            case "tenants/index":
              icon = "person";
              break;
            case "payments/index":
              icon = "cash";
              break;
            case "requests/index":
              icon = "file-tray";
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <TabButton
              key={route.key}
              icon={icon}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#00000000",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    padding: 4,
    borderRadius: 100,
    backgroundColor: "#404040F0",
    width: "100%",
    maxWidth: Sizes.maxWidth,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  mainContentWrapper: {
    flex: 1,
  },
});
