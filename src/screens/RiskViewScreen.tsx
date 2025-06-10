import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function RiskViewScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [dados, setDados] = useState<{ umidade: number; inclinacao: number } | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const carregarUltimaLeitura = async () => {
            try {
                const armazenado = await AsyncStorage.getItem('leituras');
                if (armazenado) {
                    const todas = JSON.parse(armazenado);
                    const ultima = todas[todas.length - 1];
                    setDados({ umidade: ultima.umidade, inclinacao: ultima.inclinacao });
                }
            } catch (e) {
                console.error('Erro ao carregar dados:', e);
            } finally {
                setCarregando(false);
            }
        };

        carregarUltimaLeitura();
    }, []);

    const calcularRisco = () => {
        if (!dados) return 'Sem dados';

        const { umidade, inclinacao } = dados;

        if (umidade > 80 || inclinacao > 30) return '🔥 Risco Alto';
        if (umidade >= 60 || inclinacao >= 15) return '⚠️ Risco Moderado';
        return '🌿 Risco Baixo';
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Visualização de Risco</Text>

            {carregando ? (
                <ActivityIndicator size="large" color="#000" />
            ) : dados ? (
                <>
                    <Text>Umidade: {dados.umidade}%</Text>
                    <Text>Inclinação: {dados.inclinacao}°</Text>
                    <Text style={styles.risco}>{calcularRisco()}</Text>
                </>
            ) : (
                <Text>Nenhuma leitura encontrada.</Text>
            )}

            <Button title="Voltar ao Início" onPress={() => navigation.navigate('SensorList')} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
    },
    risco: {
        fontSize: 20,
        marginTop: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
