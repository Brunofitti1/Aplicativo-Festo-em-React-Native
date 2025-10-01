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
    RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ApiService from '../services/ApiService';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

interface Sensor {
    id: string;
    nome: string;
    status: 'ok' | 'aviso' | 'alerta';
    valor: number;
}

export default function SensorListScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [sensores, setSensores] = useState<Sensor[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const carregarSensores = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await ApiService.getSensores();
            setSensores(data);
        } catch (error: any) {
            Alert.alert(
                'Erro ao carregar sensores', 
                error.message + '\n\nVerifique se o backend está rodando e a URL está configurada corretamente.'
            );
            setSensores([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        carregarSensores(false);
    };

    // Carrega dados quando a tela é focada
    useFocusEffect(
        React.useCallback(() => {
            carregarSensores();
        }, [])
    );

    const renderItem = ({ item }: { item: Sensor }) => {
        const cor = item.status === 'ok' ? '#4CAF50' : item.status === 'aviso' ? '#FFC107' : '#F44336';
        const icone = item.status === 'ok' ? '✅' : item.status === 'aviso' ? '⚠️' : '❗';

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('SensorDetail', { sensor: item })}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.nome}>{item.nome}</Text>
                    <Text style={[styles.status, { color: cor }]}>
                        {icone} {item.status.toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.valor}>Valor: {item.valor.toFixed(1)}</Text>
                <Text style={styles.id}>ID: {item.id}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Monitoramento Industrial Festo</Text>

            <View style={styles.buttonContainer}>
                <Button 
                    title="⚙️ Configurações" 
                    onPress={() => navigation.navigate('Config')} 
                />
                <Button 
                    title="🔄 Atualizar" 
                    onPress={() => carregarSensores()} 
                    disabled={loading}
                />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Carregando sensores...</Text>
                </View>
            ) : sensores.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        📡 Nenhum sensor encontrado
                    </Text>
                    <Text style={styles.emptySubtext}>
                        Verifique se o backend está rodando e configure a URL da API
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={sensores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    style={{ marginTop: 20 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#fff']}
                            tintColor="#fff"
                        />
                    }
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
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    valor: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    id: {
        fontSize: 12,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    emptyText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    emptySubtext: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
    },
});
