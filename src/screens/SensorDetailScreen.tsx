import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Button, 
    ActivityIndicator, 
    Alert, 
    ScrollView,
    Dimensions 
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LineChart } from 'react-native-chart-kit';
import ApiService from '../services/ApiService';

type SensorDetailRouteProp = RouteProp<RootStackParamList, 'SensorDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Reading {
    id: number;
    sensorId: string;
    value: number;
    timestamp: string;
}

export default function SensorDetailScreen() {
    const route = useRoute<SensorDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { sensor } = route.params;

    const [readings, setReadings] = useState<Reading[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const carregarHistorico = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await ApiService.getSensorReadings(sensor.id);
            setReadings(data);
        } catch (error: any) {
            Alert.alert('Erro', 'Falha ao carregar histórico do sensor: ' + error.message);
            setReadings([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const registrarLeitura = async () => {
        try {
            setRefreshing(true);
            const novoValor = 20 + Math.random() * 60; // Valor simulado entre 20 e 80
            await ApiService.createReading(sensor.id, novoValor);
            Alert.alert('Sucesso', 'Nova leitura registrada!');
            // Recarrega o histórico
            await carregarHistorico(false);
        } catch (error: any) {
            Alert.alert('Erro', 'Falha ao registrar leitura: ' + error.message);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        carregarHistorico();
    }, [sensor.id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ok': return '#4CAF50';
            case 'aviso': return '#FFC107';
            case 'alerta': return '#F44336';
            default: return '#666';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'ok': return '✅';
            case 'aviso': return '⚠️';
            case 'alerta': return '❗';
            default: return '📊';
        }
    };

    const screenWidth = Dimensions.get('window').width;

    // Preparar dados para o gráfico
    const chartData = () => {
        if (readings.length === 0) return null;

        const últimas10 = readings.slice(-10);
        return {
            labels: últimas10.map((_, index) => `${index + 1}`),
            datasets: [{
                data: últimas10.map(r => r.value),
                strokeWidth: 2,
                color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            }]
        };
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{sensor.nome}</Text>
                <View style={styles.statusContainer}>
                    <Text style={[styles.status, { color: getStatusColor(sensor.status) }]}>
                        {getStatusIcon(sensor.status)} {sensor.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.valueContainer}>
                <Text style={styles.valueLabel}>Valor Atual</Text>
                <Text style={styles.value}>{(sensor as any).valor?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.unit}>unidades</Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>ID do Sensor: {sensor.id}</Text>
                <Text style={styles.infoLabel}>Total de Leituras: {readings.length}</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0066cc" />
                    <Text style={styles.loadingText}>Carregando histórico...</Text>
                </View>
            ) : (
                <>
                    {chartData() && (
                        <View style={styles.chartContainer}>
                            <Text style={styles.chartTitle}>Histórico das Últimas 10 Leituras</Text>
                            <LineChart
                                data={chartData()!}
                                width={screenWidth - 32}
                                height={220}
                                yAxisSuffix=""
                                chartConfig={{
                                    backgroundColor: '#fff',
                                    backgroundGradientFrom: '#fff',
                                    backgroundGradientTo: '#fff',
                                    decimalPlaces: 1,
                                    color: (opacity = 1) => `rgba(0, 102, 204, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16
                                    },
                                    propsForDots: {
                                        r: "4",
                                        strokeWidth: "2",
                                        stroke: "#0066cc"
                                    }
                                }}
                                bezier
                                style={styles.chart}
                            />
                        </View>
                    )}

                    {readings.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>📊 Nenhuma leitura encontrada</Text>
                            <Text style={styles.emptySubtext}>
                                Registre uma nova leitura para ver o histórico
                            </Text>
                        </View>
                    )}
                </>
            )}

            <View style={styles.buttons}>
                <Button 
                    title="🔄 Atualizar Histórico" 
                    onPress={() => carregarHistorico()} 
                    disabled={loading || refreshing}
                />
                <Button 
                    title="📝 Registrar Nova Leitura" 
                    onPress={registrarLeitura} 
                    disabled={refreshing}
                />
                <Button 
                    title="📋 Ver Histórico Completo" 
                    onPress={() => navigation.navigate('SensorHistory', { sensor })} 
                />
                <Button 
                    title="⬅️ Voltar aos Sensores" 
                    onPress={() => navigation.navigate('SensorList')} 
                />
            </View>

            {refreshing && (
                <View style={styles.refreshingContainer}>
                    <ActivityIndicator size="small" color="#0066cc" />
                    <Text style={styles.refreshingText}>Atualizando...</Text>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    statusContainer: {
        alignItems: 'center',
    },
    status: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    valueContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    valueLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    value: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#0066cc',
    },
    unit: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    infoContainer: {
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
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
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
        marginVertical: 8,
        borderRadius: 16,
    },
    loadingContainer: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    buttons: {
        gap: 12,
        marginBottom: 20,
    },
    refreshingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    refreshingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
});
