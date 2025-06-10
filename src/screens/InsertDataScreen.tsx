import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function InsertDataScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [salvando, setSalvando] = useState(false);

    const gerarLeitura = () => ({
        timestamp: Date.now(),
        umidade: parseFloat((Math.random() * 100).toFixed(1)),
        inclinacao: parseFloat((Math.random() * 45).toFixed(1)),
    });

    const salvarLeitura = async () => {
        setSalvando(true);
        const novaLeitura = gerarLeitura();

        try {
            const dadosExistentes = await AsyncStorage.getItem('leituras');
            const leituras = dadosExistentes ? JSON.parse(dadosExistentes) : [];

            leituras.push(novaLeitura);
            await AsyncStorage.setItem('leituras', JSON.stringify(leituras));

            Alert.alert('Sucesso', 'Leitura salva com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar os dados.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inserir Leitura Simulada</Text>
            <Button title={salvando ? "Salvando..." : "Salvar Leitura"} onPress={salvarLeitura} disabled={salvando} />
            <Button title="Voltar ao Início" onPress={() => navigation.navigate('SensorList')} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
    },
});
