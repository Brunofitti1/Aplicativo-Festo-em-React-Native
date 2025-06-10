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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function ConfigScreen() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProps>();

    useEffect(() => {
        AsyncStorage.getItem('apiURL').then((valorSalvo) => {
            if (valorSalvo) setUrl(valorSalvo);
        });
    }, []);

    const salvar = async () => {
        if (!url.startsWith('http')) {
            Alert.alert('Erro', 'Digite uma URL válida (ex: http://192.168.0.10:3000)');
            return;
        }
        await AsyncStorage.setItem('apiURL', url);
        Alert.alert('Sucesso', 'URL salva com sucesso!');
    };

    const testarConexao = async () => {
        if (!url) {
            Alert.alert('Erro', 'Digite ou salve uma URL antes de testar');
            return;
        }

        setLoading(true);
        console.log(`Testando conexão com ${url}/sensores`);
        try {
            const response = await axios.get(`${url}/sensores`);
            if (Array.isArray(response.data)) {
                Alert.alert('✅ Conexão OK', `Recebidos ${response.data.length} sensores`);
            } else {
                Alert.alert('⚠️ Resposta inesperada', 'A URL respondeu, mas não com uma lista');
            }
        } catch (error: any) {
            console.error('Erro na conexão:', error.message);
            Alert.alert('❌ Falha na conexão', error.message || 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Configurações de Conexão</Text>

            <TextInput
                style={styles.input}
                placeholder="Digite a URL da API"
                placeholderTextColor="#ccc"
                value={url}
                onChangeText={setUrl}
                autoCapitalize="none"
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
    input: {
        borderColor: '#fff',
        borderWidth: 1,
        padding: 12,
        color: '#fff',
        borderRadius: 4,
    },
});
