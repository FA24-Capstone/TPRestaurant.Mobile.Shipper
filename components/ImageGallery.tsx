import ImageViewing from "react-native-image-viewing";
import React, { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity } from "react-native";

const ImageGallery: React.FC<{ image: string }> = ({ image }) => {
  const [visible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImagePress = (index: number) => {
    setCurrentIndex(index);
    setIsVisible(true);
  };

  return (
    <View>
      {/* Hàng ngang với ảnh nhỏ */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity onPress={() => handleImagePress(0)}>
          <Image
            source={{ uri: image }}
            style={{
              width: 60,
              height: 60,
              margin: 10,
              borderRadius: 10,
              shadowRadius: 10,
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Modal hiển thị ảnh phóng to */}
      <ImageViewing
        images={[{ uri: image }]}
        imageIndex={currentIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default ImageGallery;
