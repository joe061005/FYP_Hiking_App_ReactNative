import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Landing from "../Login/Landing";
import Login from "../Login/Login";

function App_Navigator() {
  const Stack = createStackNavigator();

  const landingComponent = (navigation) => (
    <Landing navigation={navigation.navigation} />
  );

  const loginComponent = (navigation) => (
      <Login navigation={navigation.navigation} />
  )

  return (
    <NavigationContainer initialRouteName="landing">
      <Stack.Navigator>
        <Stack.Screen
          name="landing"
          component={landingComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="login"
          component={loginComponent}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App_Navigator;
