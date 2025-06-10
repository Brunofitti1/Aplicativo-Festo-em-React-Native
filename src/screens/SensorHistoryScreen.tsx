import React from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const screenWidth = Dimensions.get('window').width;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'SensorHistory'>;

export default function SensorHistoryScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { sensor } = route.params;

    // Simula 7 leituras passadas
    const dadosHistorico = Array.from({ length: 7 }, () => parseFloat((Math.random() * 100).toFixed(1)));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Histórico: {sensor.nome}</Text>

            <LineChart
                data={{
                    labels: dadosHistorico.map((_, i) => `T${i + 1}`),
                    datasets: [{ data: dadosHistorico }],
                }}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                    backgroundColor: '#0e1621',
                    backgroundGradientFrom: '#0e1621',
                    backgroundGradientTo: '#0e1621',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 150, 255, ${opacity})`,
                    labelColor: () => '#fff',
                }}
                bezier
                style={styles.chart}
            />

            <Button title="Voltar" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#0e1621',
    },
    title: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 16,
        textAlign: 'center',
    },
    chart: {
        borderRadius: 16,
    },
});
