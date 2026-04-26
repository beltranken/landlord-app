import TabButton from "@/components/molecules/tab-button/tab-button-ui";
import CustomTabBar from "@/components/organisms/custom-tab-bar/custom-tab-bar";
import CustomTabLayout from "@/components/organisms/custom-tab-layout/custom-tab-layout";
import { Colors } from "@/constants";
import { Tabs } from "expo-router";

export default function PrivateLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenLayout={(props) => (
        <CustomTabLayout
          name={props.route.name}
          title={props.options.title ?? "No title"}
        >
          {props.children}
        </CustomTabLayout>
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      <Tabs.Screen
        name="properties/index"
        options={{
          title: "Properties",
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="tenants/index"
        options={{
          title: "Tenants",
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="person" />
          ),
        }}
      />
      <Tabs.Screen
        name="contracts/index"
        options={{
          title: "Contracts",
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="cash" />
          ),
        }}
      />
      <Tabs.Screen
        name="requests/index"
        options={{
          title: "Requests",
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="file-tray" />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => (
            <TabButton isFocused={focused} icon="grid" />
          ),
        }}
      />

      {/** inner */}
      <Tabs.Screen
        name="properties/(inner)/add"
        options={{
          title: "Properties",
          href: null,
        }}
      />
      <Tabs.Screen
        name="properties/(inner)/[id]"
        options={{
          title: "Property Details",
          href: null,
        }}
      />

      <Tabs.Screen
        name="tenants/[id]/index"
        options={{
          title: "Tenant Details",
          href: null,
        }}
      />

      <Tabs.Screen
        name="contracts/[id]/index"
        options={{
          title: "Contract Details",
          href: null,
        }}
      />
      <Tabs.Screen
        name="contracts/(inner)/add/index"
        options={{
          title: "Contracts",
          href: null,
        }}
      />
      <Tabs.Screen
        name="contracts/(inner)/add/step1"
        options={{
          title: "Contracts",
          href: null,
        }}
      />
      <Tabs.Screen
        name="contracts/(inner)/add/step2"
        options={{
          title: "Contracts",
          href: null,
        }}
      />
      <Tabs.Screen
        name="contracts/(inner)/add/step3"
        options={{
          title: "Contracts",
          href: null,
        }}
      />
    </Tabs>
  );
}
