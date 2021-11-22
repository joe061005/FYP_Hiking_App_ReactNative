import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import * as Icon from "@expo/vector-icons";
import {
    Image,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";
import Home from "../Home/Home"
import Info from "../Info/Info"
import Match from "../Match/Match"
import Group from "../Group/Group"
import Setting from "../Setting/Setting"
import TrailDetail from "../Home/Detail"
import District from "../Home/District"

//Home page

const HomeComponent = (navigation) => (
    <Home navigation={navigation.navigation} />
)

const TrailDetailComponent = (navigation) => (
    <TrailDetail navigation={navigation.navigation} route={navigation.route} />
)

const TrailDistrictComponent = (navigation) => (
    <District navigation={navigation.navigation} route={navigation.route} />
)

// Info page
const InfoComponent = (navigation) => (
    <Info navigation={navigation.navigation} />
)

// match page
const MatchComponent = (navigation) => (
    <Match navigation={navigation.navigation} />
)

// group page
const GroupComponent = (navigation) => (
    <Group navigation={navigation.navigation} />
)

//setting page
const SettingComponent = (navigation) => (
    <Setting navigation={navigation.navigation} />
)

const HomeStack = createStackNavigator();

const HomeNavigator = ({ navigation, route }) => {
    return (
        <HomeStack.Navigator initialRouteName="Home">
            <HomeStack.Screen
                name="Home"
                component={HomeComponent}
                options={{
                    title: "主頁"
                }}
            />

            <HomeStack.Screen
                name="TrailDetail"
                component={TrailDetailComponent}
                options={({ route }) => ({
                    title: route.params.title
                })}
            />

            <HomeStack.Screen
                name="TrailByDistrict"
                component={TrailDistrictComponent}
                options={({ route }) => ({
                   title: route.params.district
                })}

            />
        </HomeStack.Navigator>
    )
}

const InfoStack = createStackNavigator();

const InfoNavigator = ({ navigation, route }) => {
    return (
        <InfoStack.Navigator initialRouteName="Info">
            <InfoStack.Screen
                name="Info"
                component={InfoComponent}
                options={{
                    title: "遠足資訊"
                }}
            />
        </InfoStack.Navigator>
    )
}

const MatchStack = createStackNavigator();

const MatchNavigator = ({ navigation, route }) => {
    return (
        <MatchStack.Navigator initialRouteName="Match">
            <MatchStack.Screen
                name="Match"
                component={MatchComponent}
                options={{
                    title: "群組配對"
                }}
            />
        </MatchStack.Navigator>
    )
}

const GroupStack = createStackNavigator();

const GroupNavigator = ({ navigation, route }) => {
    return (
        <GroupStack.Navigator initialRouteName="Group">
            <GroupStack.Screen
                name="Group"
                component={GroupComponent}
                options={{
                    title: "遠足群組"
                }}
            />
        </GroupStack.Navigator>
    )
}

const SettingStack = createStackNavigator();

const SettingNavigator = ({ navigation, route }) => {
    return (
        <SettingStack.Navigator initialRouteName="Setting">
            <SettingStack.Screen
                name="Setting"
                component={SettingComponent}
                options={{
                    title: "設定"
                }}
            />
        </SettingStack.Navigator>
    )
}

export {
    HomeNavigator,
    InfoNavigator,
    MatchNavigator,
    GroupNavigator,
    SettingNavigator
}


