
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { cadastro } from "../services/auth";
import { useRouter } from "expo-router";

export default function Cadasto() {
    const router = useRouter();

    async function Cadastrar() {
        await cadastro(nome, email, senha, tipo);
        router.replace("/login");
    }

    function Voltar() {
        router.replace("/login");
    }

    const [tipo, setTipo] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.conteudo}>
                <Text style={styles.titulo}>Cadastro</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite Seu Nome"
                    value={nome}
                    onChangeText={setNome}
                />

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

                <View style={styles.picker}>
                    <Picker
                        selectedValue={tipo}
                        onValueChange={(itemValue) => setTipo(itemValue)}
                    >
                        <Picker.Item label="Selecione" value="" />
                        <Picker.Item label="Cliente" value="cliente" />
                        <Picker.Item label="Motorista" value="motorista" />
                    </Picker>
                </View>

                <View style={styles.botao}>
                    <Button
                        title="Cadastrar"
                        color="#22C55E"
                        onPress={Cadastrar}
                    />
                </View>

                <View style={styles.botao}>
                    <Button
                        title="Voltar"
                        color="#0F766E"
                        onPress={Voltar}
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
        paddingHorizontal: 25,
        marginTop: 60
    },

    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 30
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#0F766E",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15
    },

    picker: {
        borderWidth: 1,
        borderColor: "#0F766E",
        borderRadius: 8,
        marginBottom: 15
    },

    botao: {
        marginTop: 10
    }
});
