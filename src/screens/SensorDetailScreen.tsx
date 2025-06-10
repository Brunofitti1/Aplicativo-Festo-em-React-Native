import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type SensorDetailRouteProp = RouteProp<RootStackParamList, 'SensorDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SensorDetailScreen() {
    const route = useRoute<SensorDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { sensor } = route.params;

    const [valor, setValor] = useState(Number(sensor.valor || (Math.random() * 100).toFixed(1)));

    const atualizarValor = () => {
        const novo = parseFloat((Math.random() * 100).toFixed(1));
        setValor(novo);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{sensor.nome}</Text>
            <Text>Status: {sensor.status}</Text>
            <Text>Valor atual: {valor}</Text>

            <View style={styles.buttons}>
                <Button title="Atualizar Valor" onPress={atualizarValor} />
                <Button title="Ver Histórico" onPress={() => navigation.navigate('SensorHistory', { sensor })} />
                <Button title="Voltar aos Sensores" onPress={() => navigation.navigate('SensorList')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
        padding: 24,
        gap: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    buttons: {
        marginTop: 24,
        gap: 12,
    },
});
