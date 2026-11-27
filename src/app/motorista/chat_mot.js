
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    Alert,
    StyleSheet
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";

export default function ChatMotorista() {
    const { carretoId } = useLocalSearchParams();
    const router = useRouter();

    const [mensagem, setMensagem] = useState("");
    const [mensagens, setMensagens] = useState([]);

    function Voltar() {
        router.replace("/motorista/home");
    }

    useEffect(function() {
        if (!carretoId || !auth.currentUser) {
            return;
        }

        const consulta = query(
            collection(db, "mensagens"),
            where("carretoId", "==", carretoId),
            orderBy("criadoEm")
        );

        const cancelar = onSnapshot(
            consulta,
            function(resultado) {
                const lista = resultado.docs.map(function(documento) {
                    return {
                        id: documento.id,
                        ...documento.data()
                    };
                });

                setMensagens(lista);
            },
            function(erro) {
                console.log("Erro ao carregar mensagens:", erro);
                Alert.alert("Erro", "Não foi possível carregar o chat.");
            }
        );

        return cancelar;
    }, [carretoId]);

    async function enviarMensagem() {
        if (mensagem.trim() === "") {
            return;
        }

        if (!auth.currentUser || !carretoId) {
            Alert.alert("Erro", "Usuário ou carreto não encontrado.");
            return;
        }

        try {
            await addDoc(collection(db, "mensagens"), {
                carretoId: carretoId,
                remetenteId: auth.currentUser.uid,
                mensagem: mensagem.trim(),
                criadoEm: new Date()
            });

            setMensagem("");
        } catch (erro) {
            console.log("Erro ao enviar mensagem:", erro);
            Alert.alert("Erro", "Não foi possível enviar a mensagem.");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Chat com o cliente</Text>

            <ScrollView style={styles.lista}>
                {mensagens.map(function(item) {
                    return (
                        <View
                            key={item.id}
                            style={[
                                styles.mensagem,
                                item.remetenteId === auth.currentUser?.uid
                                    ? styles.minhaMensagem
                                    : styles.outraMensagem
                            ]}
                        >
                            <Text style={styles.remetente}>
                                {item.remetenteId === auth.currentUser?.uid
                                    ? "Você"
                                    : "Cliente"}
                            </Text>

                            <Text style={styles.textoMensagem}>
                                {item.mensagem}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>

            <View style={styles.areaEnvio}>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua mensagem"
                    value={mensagem}
                    onChangeText={setMensagem}
                />

                <View style={styles.botao}>
                    <Button
                        title="Enviar"
                        color="#22C55E"
                        onPress={enviarMensagem}
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
        padding: 20,
        paddingTop: 40
    },

    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 20
    },

    lista: {
        flex: 1
    },

    mensagem: {
        padding: 12,
        borderRadius: 8,
        maxWidth: "85%",
        marginBottom: 12
    },

    minhaMensagem: {
        backgroundColor: "#C6FF00",
        alignSelf: "flex-end"
    },

    outraMensagem: {
        backgroundColor: "#E6F4F1",
        alignSelf: "flex-start"
    },

    remetente: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#064E3B",
        marginBottom: 4
    },

    textoMensagem: {
        fontSize: 15,
        color: "#0B1320"
    },

areaEnvio: {
    paddingTop: 15,
    paddingBottom: 70,
    gap: 10
},
input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#0F766E",
    borderRadius: 8,
    paddingHorizontal: 12
},

    botao: {
        marginTop: 3
    }
});
