import { useEffect } from "react";
import {
  LogLevel,
  NotificationClickEvent,
  NotificationWillDisplayEvent,
  OneSignal,
} from "react-native-onesignal";

export default function useOneSignal() {
  useEffect(() => {
    const NOTIF_MODE = process.env.EXPO_PUBLIC_NOTIF_MODE ?? "development";

    OneSignal.Debug.setLogLevel(
      NOTIF_MODE === "production" ? LogLevel.Error : LogLevel.Verbose,
    );
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID!);
    OneSignal.Notifications.requestPermission(false);

    OneSignal.Notifications.addEventListener(
      "click",
      (_event: NotificationClickEvent) => {
        // TODO: Handle notification click events
      },
    );

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      (event: NotificationWillDisplayEvent) => {
        event.preventDefault();

        // TODO: Handle foreground notification events

        event.getNotification().display();
      },
    );
  }, []);
}
