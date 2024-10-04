import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { Checkbox } from "react-native-paper";

interface CustomCheckboxProps {
  selected: boolean;
  onSelect: (id: string) => void;
  order: {
    id: string;
  };
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  selected,
  onSelect,
  order,
}) => {
  const containerStyle: StyleProp<ViewStyle> = {
    borderWidth: selected ? 0 : 2, // Add a border only when unchecked
    borderColor: selected ? "transparent" : "#FF0000", // Custom border color when unchecked
    borderRadius: 5, // Match the border-radius of the checkbox
  };

  return (
    <View style={containerStyle}>
      <Checkbox
        status={selected ? "checked" : "unchecked"}
        onPress={() => onSelect(order.id)}
        color="#A1011A" // Color when checked
      />
    </View>
  );
};

export default CustomCheckbox;
