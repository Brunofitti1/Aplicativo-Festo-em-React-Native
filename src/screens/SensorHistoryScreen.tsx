import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    Button, 
    ActivityIndicator, 
    Alert,
    FlatList,
    ScrollView 
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ApiService from '../services/ApiService';

const screenWidth = Dimensions.get('window').width;

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, 'SensorHistory'>;

interface Reading {
    id: number;
    sensorId: string;
    value: number;
    timestamp: string;
}

export default function SensorHistoryScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { sensor } = route.params;

    const [readings, setReadings] = useState<Reading[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarHistorico();
    }, []);

    const carregarHistorico = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getSensorReadings(sensor.id);
            setReadings(data);
        } catch (error: any) {
            Alert.alert('Erro', 'Falha ao carregar histórico: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const obterEstatisticas = () => {
        if (readings.length === 0) return null;

        const valores = readings.map(r => r.value);
        return {
            min: Math.min(...valores),
            max: Math.max(...valores),
            media: valores.reduce((a, b) => a + b, 0) / valores.length,
            total: readings.length
        };
    };

    const preparaDadosGrafico = () => {
        if (readings.length === 0) return null;

        const dadosGrafico = readings.slice(-12); // Últimas 12 leituras
        return {
            labels: dadosGrafico.map((_, index) => `${index + 1}`),
            datasets: [{
                data: dadosGrafico.map(r => r.value),
                strokeWidth: 3,
                color: (opacity = 1) => `rgba(0, 150, 255, ${opacity})`,
            }]
        };
    };

    const renderItem = ({ item }: { item: Reading }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemValue}>{item.value.toFixed(1)}</Text>
                <Text style={styles.itemDate}>{formatarData(item.timestamp)}</Text>
            </View>
        </View>
    );

    const estatisticas = obterEstatisticas();
    const dadosGrafico = preparaDadosGrafico();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Histórico Completo</Text>
            <Text style={styles.subtitle}>{sensor.nome}</Text>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0096ff" />
                    <Text style={styles.loadingText}>Carregando histórico...</Text>
                </View>
            ) : (
                <>
                    {estatisticas && (
                        <View style={styles.statsContainer}>
                            <Text style={styles.statsTitle}>📊 Estatísticas</Text>
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Total</Text>
                                    <Text style={styles.statValue}>{estatisticas.total}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Mínimo</Text>
                                    <Text style={styles.statValue}>{estatisticas.min.toFixed(1)}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Máximo</Text>
                                    <Text style={styles.statValue}>{estatisticas.max.toFixed(1)}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>Média</Text>
                                    <Text style={styles.statValue}>{estatisticas.media.toFixed(1)}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {dadosGrafico && (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Últimas 12 Leituras</Text>
                            <LineChart
                                data={dadosGrafico}
                                width={screenWidth - 32}
                                height={250}
                                chartConfig={{
                                    backgroundColor: '#1e3a8a',
                                    backgroundGradientFrom: '#1e3a8a',
                                    backgroundGradientTo: '#3b82f6',
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "5",
                                        strokeWidth: "2",
                                        stroke: "#ffffff"
                                    }
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </View>
                    )}

                    <View style={styles.listContainer}>
                        <Text style={styles.listTitle}>📋 Todas as Leituras</Text>
                        {readings.length === 0 ? (
                            <Text style={styles.emptyText}>Nenhuma leitura encontrada</Text>
                        ) : (
                            <FlatList
                                data={readings.slice().reverse()} // Mais recentes primeiro
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={renderItem}
                                style={styles.list}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                </>
            )}

            <View style={styles.buttonContainer}>
                <Button title="🔄 Atualizar" onPress={carregarHistorico} />
                <Button title="⬅️ Voltar" onPress={() => navigation.goBack()} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        color: '#333',
        fontSize: 24,
        marginBottom: 8,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#666',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    statsContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        minWidth: '20%',
        marginVertical: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0066cc',
    },
    chartContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 16,
    },
    chart: {
        borderRadius: 16,
        marginVertical: 8,
    },
    listContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    list: {
        maxHeight: 300,
    },
    itemContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#0066cc',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0066cc',
    },
    itemDate: {
        fontSize: 12,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 16,
        marginTop: 16,
        marginBottom: 20,
    },
});
