import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react"
import { FontAwesome, MaterialIcons, Ionicons, Fontisto } from '@expo/vector-icons'
import { StyleSheet, Platform } from "react-native";
import {
    HomeNavigator,
    InfoNavigator,
    MatchNavigator,
    GroupNavigator,
    SettingNavigator
} from "./TabNavigator"

const Tab = createBottomTabNavigator();

class Tabs extends React.Component{
    constructor(props){
        super(props);
        this.state={
        }
    }

    render(){
        return(
          <Tab.Navigator 
          screenOptions={{
            tabBarStyle:
              {
                  height: (Platform.OS === 'ios')? 100: 70
              },
              headerShown: false
          }}
          >
              <Tab.Screen
                 name = "home"
                 component={HomeNavigator}
                 options={{
                     tabBarLabel: "主頁",
                     tabBarLabelStyle: localStyles.TabLabel,
                     tabBarIcon: ({focused}) =>(
                         <Ionicons
                         size={30}
                         color = "black"
                         name = {`home-${focused? 'sharp':'outline'}`}
                         />
                     ),
                 }}
              />
              <Tab.Screen
                 name = "info"
                 component={InfoNavigator}
                 options={{
                    tabBarLabel: "遠足資訊",
                    tabBarLabelStyle: localStyles.TabLabel,
                    tabBarIcon: ({focused}) =>(
                        <MaterialIcons
                        size={30}
                        color = "black"
                        name = {`info${focused? '':'-outline'}`}
                        />
                    ),
                }}
              />
              <Tab.Screen
                 name = "match"
                 component={MatchNavigator}
                 options={{
                    tabBarLabel: "群組配對",
                    tabBarLabelStyle: localStyles.TabLabel,
                    tabBarIcon: ({focused}) =>(
                        <Fontisto
                        size={40}
                        color = "red"
                        name = "flag"
                        />
                    ),
                }}
              />
              <Tab.Screen
                 name = "group"
                 component={GroupNavigator}
                 options={{
                    tabBarLabel: "遠足群組",
                    tabBarLabelStyle: localStyles.TabLabel,
                    tabBarIcon: ({focused}) =>(
                        <Ionicons
                        size={30}
                        color = "black"
                        name = {`people-${focused? 'sharp':'outline'}`}
                        />
                    ),
                }}
              />
              <Tab.Screen
                 name = "setting"
                 component={SettingNavigator}
                 options={{
                    tabBarLabel: "設定",
                    tabBarLabelStyle: localStyles.TabLabel,
                    tabBarIcon: ({focused}) =>(
                        <Ionicons
                        size={30}
                        color = "black"
                        name = {`settings${focused? '':'-outline'}`}
                        />
                    ),
                }}
              />

          </Tab.Navigator>
        )
    }
}

const localStyles = StyleSheet.create({
    TabLabel: {
       fontSize: 15
    }
})

export default Tabs;
