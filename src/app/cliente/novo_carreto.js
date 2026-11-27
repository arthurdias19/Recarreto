
import {
    Modal,
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    StyleSheet
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useState } from "react";

export default function NovoCarreto({ visivel, fechar }) {

    const [origem, setOrigem] = useState("");
    const [destino, setDestino] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");
    const [observacoes, setObservacoes] = useState("");

    async function publicarCarreto() {
        try {
            if (!origem || !destino || !descricao || !data) {
                alert("Preencha os campos obrigatórios!");
                return;
            }

            await addDoc(collection(db, "carretos"), {
                origem: origem,
                destino: destino,
                descricao: descricao,
                data: data,
                observacoes: observacoes,
                clienteId: auth.currentUser.uid,
                status: "disponivel",
                criadoEm: new Date()
            });

            alert("Carreto publicado com sucesso!");

            setOrigem("");
            setDestino("");
            setDescricao("");
            setData("");
            setObservacoes("");

            fechar();

        } catch (erro) {
            console.log("Erro ao publicar:", erro);
            alert("Não foi possível publicar o carreto.");
        }
    }

    return (
        <Modal
            visible={visivel}
            animationType="slide"
            transparent={false}
            onRequestClose={fechar}
        >
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.conteudo}>

                    <Text style={styles.titulo}>Novo Carreto</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Local de origem"
                        value={origem}
                        onChangeText={setOrigem}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Local de destino"
                        value={destino}
                        onChangeText={setDestino}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Descrição da carga"
                        value={descricao}
                        onChangeText={setDescricao}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Data desejada"
                        value={data}
                        onChangeText={setData}
                    />

                    <TextInput
                        style={[styles.input, styles.observacoes]}
                        placeholder="Observações"
                        value={observacoes}
                        onChangeText={setObservacoes}
                        multiline
                    />

                    <View style={styles.botao}>
                        <Button
                            title="Publicar Carreto"
                            color="#22C55E"
                            onPress={publicarCarreto}
                        />
                    </View>

                    <View style={styles.botao}>
                        <Button
                            title="Fechar"
                            color="#0F766E"
                            onPress={fechar}
                        />
                    </View>

                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },

    conteudo: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 25,
        paddingTop: 50,
        paddingBottom: 40
    },

    titulo: {
        fontSize: 26,
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

    observacoes: {
        height: 90,
        textAlignVertical: "top",
        paddingTop: 12
    },

    botao: {
        marginTop: 10
    }
});
