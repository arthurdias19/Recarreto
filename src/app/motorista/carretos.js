
import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Button,
    Modal,
    TextInput,
    Alert,
    StyleSheet
} from "react-native";

import { collection, getDocs, addDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

export default function Carreto() {
    
    const [carreto, setCarreto] = useState([]);
    const [modal, setModal] = useState(false);
    const [valor, setValor] = useState("");
    const [carretoSelecionado, setCarretoSelecionado] = useState("");

    async function buscarCarretos() {
        const resultado = await getDocs(collection(db, "carretos"));

        const lista = resultado.docs.map(function(documento) {
            return {
                id: documento.id,
                ...documento.data()
            };
        });

        setCarreto(lista);
    }

    async function enviarProposta() {
        if (valor === "") {
            Alert.alert("Atenção", "Informe o valor do frete.");
            return;
        }

        if (!auth.currentUser) {
            Alert.alert("Erro", "Faça login novamente.");
            return;
        }

        try {
            await addDoc(collection(db, "propostas"), {
                carretoId: carretoSelecionado,
                motoristaId: auth.currentUser.uid,
                valor: valor,
                status: "pendente"
            });

            setValor("");
            setModal(false);

            Alert.alert("Sucesso", "Proposta enviada!");
        } catch (erro) {
            console.log("Erro ao enviar proposta:", erro);
            Alert.alert("Erro", "Não foi possível enviar a proposta.");
        }
    }

    useEffect(function() {
    async function carregar() {
        await buscarCarretos();
    }

    carregar();
}, []);
    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.lista}
                contentContainerStyle={styles.listaConteudo}
                showsVerticalScrollIndicator={true}
            >
                <Text style={styles.titulo}>Carretos Disponíveis</Text>

                {carreto.map(function(item) {
                    return (
                        <View key={item.id} style={styles.card}>
                            <Text style={styles.texto}>
                                Origem: {item.origem}
                            </Text>

                            <Text style={styles.texto}>
                                Destino: {item.destino}
                            </Text>

                            <Text style={styles.texto}>
                                Descrição: {item.descricao}
                            </Text>

                            <Text style={styles.texto}>
                                Data: {item.data}
                            </Text>

                            <Text style={styles.texto}>
                                Observações: {item.observacoes}
                            </Text>

                            <View style={styles.botao}>
                                <Button
                                    title="Enviar proposta"
                                    color="#22C55E"
                                    onPress={function() {
                                        setCarretoSelecionado(item.id);
                                        setModal(true);
                                    }}
                                />
                            </View>
                        </View>
                    );
                })}
            </ScrollView>

            <Modal
                visible={modal}
                animationType="slide"
                onRequestClose={function() {
                    setModal(false);
                }}
            >
                <View style={styles.modal}>
                    <Text style={styles.titulo}>Nova proposta</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Valor do frete"
                        value={valor}
                        onChangeText={setValor}
                        keyboardType="numeric"
                    />

                    <View style={styles.botao}>
                        <Button
                            title="Enviar"
                            color="#22C55E"
                            onPress={enviarProposta}
                        />
                    </View>

                    <View style={styles.botao}>
                        <Button
                            title="Fechar"
                            color="#0F766E"
                            onPress={function() {
                                setModal(false);
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 15
    },

    lista: {
        flex: 1
    },

    listaConteudo: {
        paddingBottom: 30
    },

    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 25
    },

    card: {
        borderWidth: 1,
        borderColor: "#0F766E",
        borderRadius: 8,
        padding: 15,
        marginBottom: 20
    },

    texto: {
        fontSize: 15,
        color: "#0B1320",
        marginBottom: 10
    },

    botao: {
        marginTop: 10
    },

    modal: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        padding: 25
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#0F766E",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15
    }
});
