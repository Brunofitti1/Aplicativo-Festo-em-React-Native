import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
    const navigation = useNavigation<NavigationProps>();
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    const fazerLogin = () => {
        if (usuario === 'admin' && senha === '1234') {
            navigation.replace('SensorList'); // navega e remove o login da pilha
        } else {
            Alert.alert('Erro', 'Usuário ou senha inválidos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tela de Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Usuário"
                placeholderTextColor="#ccc"
                value={usuario}
                onChangeText={setUsuario}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor="#ccc"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
            />

            <Button title="ENTRAR" onPress={fazerLogin} />

            <Text style={styles.link}>Ainda não tem uma conta? Cadastre-se</Text>
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
        fontSize: 22,
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
    link: {
        color: '#b3d4fc',
        textAlign: 'center',
        marginTop: 12,
        textDecorationLine: 'underline',
    },
});
