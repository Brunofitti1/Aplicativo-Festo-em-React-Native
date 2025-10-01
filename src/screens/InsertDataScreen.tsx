import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Button, 
    Alert, 
    TextInput, 
    ScrollView,
    ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ApiService from '../services/ApiService';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function InsertDataScreen() {
    const navigation = useNavigation<NavigationProps>();
    
    const [sensorId, setSensorId] = useState('1');
    const [valor, setValor] = useState('');
    const [salvando, setSalvando] = useState(false);

    const sensores = [
        { id: '1', nome: 'Reed Switch' },
        { id: '2', nome: 'Pressão Absoluta' },
        { id: '3', nome: 'Pressão Diferencial' },
        { id: '4', nome: 'Acelerômetro' },
        { id: '5', nome: 'Temperatura' },
        { id: '6', nome: 'Strain Gauge' },
        { id: '7', nome: 'Contador de Ciclos' },
        { id: '8', nome: 'Qualidade do Ar' },
    ];

    const salvarLeitura = async () => {
        if (!valor || isNaN(parseFloat(valor))) {
            Alert.alert('Erro', 'Digite um valor numérico válido');
            return;
        }

        setSalvando(true);
        
        try {
            await ApiService.createReading(sensorId, parseFloat(valor));
            Alert.alert('Sucesso', 'Leitura registrada com sucesso!', [
                {
                    text: 'OK',
                    onPress: () => {
                        setValor('');
                        navigation.navigate('SensorList');
                    }
                }
            ]);
        } catch (error: any) {
            Alert.alert('Erro', 'Falha ao registrar leitura: ' + error.message);
        } finally {
            setSalvando(false);
        }
    };

    const gerarValorAleatorio = () => {
        const valorAleatorio = (20 + Math.random() * 60).toFixed(1);
        setValor(valorAleatorio);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>📝 Registrar Nova Leitura</Text>
                
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Sensor:</Text>
                    <View style={styles.sensorSelector}>
                        {sensores.map((sensor) => (
                            <Button
                                key={sensor.id}
                                title={`${sensor.nome} (${sensor.id})`}
                                onPress={() => setSensorId(sensor.id)}
                                color={sensorId === sensor.id ? '#0066cc' : '#ccc'}
                            />
                        ))}
                    </View>

                    <Text style={styles.label}>Valor da Leitura:</Text>
                    <TextInput
                        style={styles.input}
                        value={valor}
                        onChangeText={setValor}
                        placeholder="Digite o valor (ex: 45.2)"
                        keyboardType="numeric"
                        editable={!salvando}
                    />

                    <Button
                        title="🎲 Gerar Valor Aleatório"
                        onPress={gerarValorAleatorio}
                        disabled={salvando}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    {salvando ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#0066cc" />
                            <Text style={styles.loadingText}>Salvando leitura...</Text>
                        </View>
                    ) : (
                        <>
                            <Button
                                title="✅ Salvar Leitura"
                                onPress={salvarLeitura}
                                disabled={!valor}
                            />
                            <Button
                                title="⬅️ Voltar aos Sensores"
                                onPress={() => navigation.navigate('SensorList')}
                            />
                        </>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoTitle}>ℹ️ Informações</Text>
                    <Text style={styles.infoText}>
                        • Use valores entre 0 e 100 para leituras normais{'\n'}
                        • Valores acima de 80: Status de alerta{'\n'}
                        • Valores entre 60-80: Status de aviso{'\n'}
                        • Valores abaixo de 60: Status ok
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    formContainer: {
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    sensorSelector: {
        marginBottom: 16,
        gap: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 16,
    },
    buttonContainer: {
        gap: 12,
        marginBottom: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
    },
    infoContainer: {
        backgroundColor: '#e3f2fd',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#0066cc',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0066cc',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});
