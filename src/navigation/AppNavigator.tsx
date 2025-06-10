import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import InsertDataScreen from '../screens/InsertDataScreen';
import RiskViewScreen from '../screens/RiskViewScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MitigationScreen from '../screens/MitigationScreen';
import SensorListScreen from '../screens/SensorListScreen';
import SensorDetailScreen from '../screens/SensorDetailScreen';
import SensorHistoryScreen from '../screens/SensorHistoryScreen';
import ConfigScreen from '../screens/ConfigScreen'; 

export type RootStackParamList = {
    Login: undefined;
    InsertData: undefined;
    RiskView: undefined;
    History: undefined;
    Mitigation: undefined;
    SensorList: undefined;
    SensorDetail: { sensor: { id: string; nome: string; status: string } };
    SensorHistory: { sensor: { id: string; nome: string; status: string } };
    Config: undefined; // ✅ Adicionado
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="InsertData" component={InsertDataScreen} />
                <Stack.Screen name="RiskView" component={RiskViewScreen} />
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="Mitigation" component={MitigationScreen} />
                <Stack.Screen name="SensorList" component={SensorListScreen} />
                <Stack.Screen name="SensorDetail" component={SensorDetailScreen} />
                <Stack.Screen name="SensorHistory" component={SensorHistoryScreen} />
                <Stack.Screen name="Config" component={ConfigScreen} /> 
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
