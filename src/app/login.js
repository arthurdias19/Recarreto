
import { useRouter } from "expo-router";
import { useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet } from 'react-native';

import { login } from "../services/auth";

export default function TelaLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function handleLogin() {
        try {
            const tipo = await login(email, senha);

            if (tipo === "cliente") {
                router.replace("/cliente/home");
            } else if (tipo === "motorista") {
                router.replace("/motorista/home");
            }

        } catch (erro) {
            alert("Erro ao fazer login: " + erro.message);
        }
    }

    function TelaCadastro() {
        router.push("/cadastro");
    }

    return (
        <View style={styles.container}>
            <View style={styles.conteudo}>
                <Text style={styles.titulo}>Bem Vindo Ao ReCarreto</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu Email"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Digite Sua Senha"
                    value={senha}
                    onChangeText={setSenha}
                />

                <View style={styles.botao}>
                    <Button
                        title="login"
                        color="#22C55E"
                        onPress={handleLogin}
                    />
                </View>

                <View style={styles.botao}>
                    <Button
                        title="cadastrar"
                        color="#0F766E"
                        onPress={TelaCadastro}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center"
    },

    conteudo: {
        padding: 25,
        marginTop: 0
    },

    titulo: {
        fontSize: 25,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 30
    },

    input: {
        borderWidth: 1,
        borderColor: "#0F766E",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15
    },

    botao: {
        marginTop: 10
    }
});
