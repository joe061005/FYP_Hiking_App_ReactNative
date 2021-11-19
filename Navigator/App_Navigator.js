import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Landing from "../Login/Landing";
import Login from "../Login/Login";
import Intro from "../Login/Intro"
import Tabs from "../Tab/Tabs"

function App_Navigator() {
  const Stack = createStackNavigator();

  const landingComponent = (navigation) => (
    <Landing navigation={navigation.navigation} />
  );

  const loginComponent = (navigation) => (
      <Login navigation={navigation.navigation} route={navigation.route}/>
  )

  const introComponent = (navigation) => (
    <Intro navigation={navigation.navigation} />
  )

  const tabComponent = (navigation) => (
    <Tabs navigation={navigation.navigation} />
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
        <Stack.Screen
          name="intro"
          component={introComponent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name = "tab"
          component = {tabComponent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App_Navigator;
