// app/TestJwtDecode.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import jwtDecode from "jwt-decode";

const TestJwtDecode: React.FC = () => {
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9tb2JpbGVwaG9uZSI6IjkzNzM2NTYzMiIsImp0aSI6ImZiNzk4YzY1LTNiMjktNDM2YS1iZTJhLTU0MDI5ODNhMWMwOCIsIkFjY291bnRJZCI6IjU4NGFkZmMxLWIzZDItNGFlZS1iMmVlLWU5MDA3YWNhMDhjNSIsInJvbGUiOiJTSElQUEVSIiwiZXhwIjoxNzMwNzY0ODAwLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MDIyIiwiYXVkIjoiTW9uIn0.jeUD3iickdoRePOYiHHwTdxa3J7CYikRHyyGa_NgkpE";
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  return (
    <View>
      <Text>Check console for jwtDecode result.</Text>
    </View>
  );
};

export default TestJwtDecode;
