import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
// Ionicons from @expo/vector-icons is the Expo build of react-native-vector-icons.
// Same icon names and props, but its fonts load in Expo Go without native linking.
import Icon from "@expo/vector-icons/Ionicons";
import { BottomBarIconProps } from "../types";

const BottomBarIcon: React.FC<BottomBarIconProps> = ({
  iconName,
  size,
  onPress,
}: BottomBarIconProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon
        name={iconName as React.ComponentProps<typeof Icon>["name"]}
        size={size}
        style={styles.iconButton}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
    color: "dodgerblue",
  },
});

export default BottomBarIcon;
