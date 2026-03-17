import Card from "@/components/atoms/card/card-ui";
import TextH4 from "@/components/atoms/text/text-h4-ui";
import Colors from "@/constants/colors-old";
import Sizes from "@/constants/sizes";
import baseStyles from "@/constants/styles";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  TAnimationStyle,
} from "react-native-reanimated-carousel";

interface MockData {
  id: number;
  title: string;
  value: string;
}

export default function DashboardSummaryCard() {
  const pressAnim = useSharedValue<number>(0);
  const { width: deviceWidth } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<ICarouselInstance | null>(null);

  const { width, padding } = useMemo(() => {
    const width = Math.min(deviceWidth, Sizes.maxWidth);

    return {
      width,
      padding: 20,
    };
  }, [deviceWidth]);

  const data: MockData[] = [
    { id: 1, title: "Upcoming rent due", value: "$2,500" },
    { id: 2, title: "Collection summary", value: "$2,500" },
    { id: 3, title: "Rent this period", value: "$2,500" },
  ];

  const animationStyle: TAnimationStyle = useCallback(
    (value: number) => {
      "worklet";
      const zIndex = interpolate(value, [-1, 0, 1], [-1000, 0, 1000]);
      const translateX = interpolate(value, [-1, 0, 1], [-width, 0, width]);
      return { transform: [{ translateX }], zIndex };
    },
    [width],
  );

  const goToIndex = (next: number) => {
    if (next < 0 || next >= data.length) return;
    setCurrentIndex(next);
    carouselRef.current?.scrollTo({ index: next, animated: true });
  };

  const goPrev = () => {
    goToIndex(currentIndex - 1);
  };
  const goNext = () => {
    goToIndex(currentIndex + 1);
  };

  return (
    <View>
      <Carousel
        key={width}
        ref={carouselRef}
        loop={false}
        style={{
          width: width,
          height: 240,
          paddingHorizontal: padding,
          paddingBottom: 20,
        }}
        width={width - 40}
        containerStyle={{ gap: 20 }}
        data={data}
        onScrollStart={() => {
          pressAnim.value = withTiming(1);
        }}
        onScrollEnd={() => {
          pressAnim.value = withTiming(0);
        }}
        onSnapToItem={(index) => {
          setCurrentIndex(index);
        }}
        renderItem={({ item, index }) => (
          <CardItem
            item={item}
            key={index}
            pressAnim={pressAnim}
            isFirst={index === 0}
            isLast={index === data.length - 1}
          />
        )}
        customAnimation={animationStyle}
        scrollAnimationDuration={1200}
      />

      {currentIndex > 0 && (
        <Pressable
          accessibilityLabel="Previous summary"
          onPress={goPrev}
          style={[
            baseStyles.shadow,
            styles.controlWidth,
            styles.control,
            { left: 20 },
          ]}
        >
          <AntDesign size={20} name="left" color={Colors.neutrals[600]} />
        </Pressable>
      )}

      {currentIndex < data.length - 1 && (
        <Pressable
          accessibilityLabel="Next summary"
          onPress={goNext}
          style={[
            baseStyles.shadow,
            styles.controlWidth,
            styles.control,
            { right: 20 },
          ]}
        >
          <AntDesign size={20} name="right" color={Colors.neutrals[600]} />
        </Pressable>
      )}
    </View>
  );
}

interface ItemProps {
  pressAnim: SharedValue<number>;
  isFirst: boolean;
  isLast: boolean;
  item: MockData;
}

function CardItem({ item, pressAnim, isFirst, isLast }: Readonly<ItemProps>) {
  const animStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressAnim.value, [0, 1], [1, 0.9]);
    const borderRadius = interpolate(pressAnim.value, [0, 1], [0, 30]);
    return { transform: [{ scale }], borderRadius };
  }, []);

  return (
    <Animated.View style={[{ flex: 1, paddingBottom: 20 }, animStyle]}>
      <View style={{ flex: 1, flexDirection: "row", gap: 12 }}>
        {!isFirst && <View style={styles.controlWidth} />}
        <View style={{ flex: 1 }}>
          <Card>
            <View>
              <TextH4>{item.title}</TextH4>
            </View>
          </Card>
        </View>
        {!isLast && <View style={styles.controlWidth} />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: 360 },
  controlWidth: { width: 40 },
  control: {
    backgroundColor: "white",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    position: "absolute",
    top: 0,
    bottom: 20,
  },
});
