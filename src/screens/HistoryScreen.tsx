import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfigScreen() {
    const [url, setUrl] = useState('');

    useEffect(() => {
        const carregar = async () => {
            const salva = await AsyncStorage.getItem('API_URL');
            if (salva) setUrl(salva);
        };
        carregar();
    }, []);

    const salvar = async () => {
        if (!url.startsWith('http')) {
            Alert.alert('Erro', 'Insira uma URL válida (comece com http)');
            return;
        }
        await AsyncStorage.setItem('API_URL', url);
        Alert.alert('Sucesso', 'URL salva!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>URL da API:</Text>
            <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://meuservidor.com/sensors"
                style={styles.input}
            />
            <Button title="Salvar URL" onPress={salvar} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', gap: 20 },
    label: { fontSize: 18, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        padding: 12,
        borderRadius: 6,
    },
});
