import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import ApiService from '../services/ApiService';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function ConfigScreen() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        const loadConfig = async () => {
            const savedURL = await ApiService.getBaseURL();
            setUrl(savedURL);
        };
        loadConfig();
    }, []);

    const salvar = async () => {
        if (!url.startsWith('http')) {
            Alert.alert('Erro', 'Digite uma URL válida (ex: http://192.168.0.10:8080)');
            return;
        }
        
        try {
            await ApiService.updateBaseURL(url);
            Alert.alert('Sucesso', 'URL salva com sucesso!');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar URL');
        }
    };

    const testarConexao = async () => {
        if (!url) {
            Alert.alert('Erro', 'Digite ou salve uma URL antes de testar');
            return;
        }

        setLoading(true);
        
        try {
            // Atualiza temporariamente a URL para teste
            await ApiService.updateBaseURL(url);
            const result = await ApiService.testConnection();
            
            if (result.success) {
                Alert.alert(
                    '✅ Conexão OK', 
                    `${result.message}\nSensores encontrados: ${result.count || 0}`
                );
            } else {
                Alert.alert('❌ Falha na conexão', result.message);
            }
        } catch (error: any) {
            Alert.alert('❌ Erro na conexão', error.message || 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurações de Conexão</Text>
            
            <Text style={styles.subtitle}>
                Configure a URL do backend Spring Boot
            </Text>

            <TextInput
                style={styles.input}
                placeholder="http://192.168.0.10:8080"
                placeholderTextColor="#ccc"
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
                keyboardType="url"
            />

            <Button title="SALVAR URL" onPress={salvar} />

            <View style={{ marginTop: 12 }}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Button title="Testar Conexão" onPress={testarConexao} />
                )}
            </View>

            <View style={{ marginTop: 12 }}>
                <Button title="Voltar aos Sensores" onPress={() => navigation.navigate('SensorList')} />
            </View>
            
            <Text style={styles.info}>
                💡 Dica: Use o IP da sua máquina onde o backend está rodando na porta 8080
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e1621',
        padding: 24,
        justifyContent: 'center',
        gap: 16,
    },
    title: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 24,
    },
    subtitle: {
        color: '#ccc',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    input: {
        borderColor: '#fff',
        borderWidth: 1,
        padding: 12,
        color: '#fff',
        borderRadius: 4,
    },
    info: {
        color: '#888',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        fontStyle: 'italic',
    },
});
