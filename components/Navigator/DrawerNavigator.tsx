// DrawerNavigator.js
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../Pages/HomeScreen";
import ProfileScreen from "../Pages/ProfileScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
