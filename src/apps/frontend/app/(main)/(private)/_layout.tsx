import TabButton, {
  Icon,
} from "@/components/molecules/tab-button/tab-button-ui";
import Colors from "@/constants/colors";
import Sizes from "@/constants/sizes";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function PrivateLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: Colors.surface,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="grid" />
          ),
        }}
      />
      <Tabs.Screen
        name="properties/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="tenants/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="person" />
          ),
        }}
      />
      <Tabs.Screen
        name="payments/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="cash" />
          ),
        }}
      />
      <Tabs.Screen
        name="requests/index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="file-tray" />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, navigation }: Readonly<BottomTabBarProps>) {
  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

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
              key={index}
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
