import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function SensorListScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [sensores, setSensores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarSensores = async () => {
            try {
                const url = await AsyncStorage.getItem('apiURL');
                if (!url) throw new Error('URL da API não configurada');

                const response = await axios.get(`${url}/sensores`);
                setSensores(response.data);
            } catch (error: any) {
                Alert.alert('Erro ao carregar sensores', error.message || 'Erro desconhecido');
            } finally {
                setLoading(false);
            }
        };

        carregarSensores();
    }, []);

    const renderItem = ({ item }: any) => {
        const cor = item.status === 'ok' ? '#4CAF50' : item.status === 'aviso' ? '#FFC107' : '#F44336';

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('SensorDetail', { sensor: item })}
            >
                <Text style={styles.nome}>{item.nome}</Text>
                <Text style={{ color: cor }}>
                    {item.status === 'ok' ? '✅ Ok' : item.status === 'aviso' ? '⚠️ Aviso' : '❗ Alerta'}
                </Text>
                <Text style={styles.valor}>Valor: {item.valor}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Monitoramento Industrial Festo</Text>

            <Button title="⚙️ Configurações de API" onPress={() => navigation.navigate('Config')} />

            {loading ? (
                <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={sensores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    style={{ marginTop: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e1621',
        padding: 16,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        justifyContent: 'space-between',
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    valor: {
        fontSize: 14,
        color: '#333',
    },
});
