import Loading from "@/components/atoms/loading/loading";
import { TextH1, TextH3 } from "@/components/atoms/text";
import { BaseStyles } from "@/constants";
import { Colors } from "@/constants/colors";
import { Href, useRouter } from "expo-router";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

interface ProgressNavigationProps extends PropsWithChildren {
  currrentStep: number;
  totalSteps: number;
  titles?: string[];

  onSubmit?: () => void;
  isLoading: boolean;
  submitButtonLabel?: string;
  backButtonLabel?: string;
  backFallBackUrl?: Href;
}

export default function ProgressNavigation({
  currrentStep,
  totalSteps,
  children,

  isLoading,
  backFallBackUrl = "/",
  titles = [],
}: ProgressNavigationProps) {
  const router = useRouter();

  const handleOnBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(backFallBackUrl);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={BaseStyles.wrapper}>
        <View style={[BaseStyles.container, styles.container]}>
          <View style={styles.progressBarTitleContainer}>
            <TextH1>{`Step ${currrentStep} of ${totalSteps}`}</TextH1>

            <TextH3 style={{ color: Colors.secondary }}>
              {titles.at(currrentStep - 1)}
            </TextH3>
          </View>

          <View style={styles.progressBar}>
            {Array.from({ length: totalSteps }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.step,
                  i < currrentStep
                    ? styles.stepCompleted
                    : styles.stepIncomplete,
                ]}
              />
            ))}
          </View>
        </View>

        <Loading visible={isLoading} />
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.neutral,
  },
  container: {
    gap: 0,
  },
  progressBarTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  progressBar: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 12,
  },
  step: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepCompleted: {
    backgroundColor: Colors.primary,
  },
  stepIncomplete: {
    backgroundColor: Colors.inputBackground,
  },
  content: {
    flex: 1,
  },
});
