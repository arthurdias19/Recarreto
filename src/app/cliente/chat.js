
import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
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

export default function Chat() {
    const { carretoId } = useLocalSearchParams();
    const router = useRouter();

    const [mensagem, setMensagem] = useState("");
    const [mensagens, setMensagens] = useState([]);

    function Voltar() {
        router.replace("/cliente/home");
    }

    useEffect(function() {
        const consulta = query(
            collection(db, "mensagens"),
            where("carretoId", "==", carretoId),
            orderBy("criadoEm")
        );

        const cancelar = onSnapshot(consulta, function(resultado) {
            const lista = resultado.docs.map(function(documento) {
                return {
                    id: documento.id,
                    ...documento.data()
                };
            });

            setMensagens(lista);
        });

        return cancelar;
    }, [carretoId]);

    async function enviarMensagem() {
        if (mensagem.trim() === "") {
            return;
        }

        await addDoc(collection(db, "mensagens"), {
            carretoId: carretoId,
            remetenteId: auth.currentUser.uid,
            mensagem: mensagem,
            criadoEm: new Date()
        });

        setMensagem("");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Chat</Text>

            <ScrollView style={styles.lista}>
                {mensagens.map(function(item) {
                    return (
                        <View
                            key={item.id}
                            style={[
                                styles.mensagemCard,
                                item.remetenteId === auth.currentUser?.uid
                                    ? styles.minhaMensagem
                                    : styles.outraMensagem
                            ]}
                        >
                            <Text style={styles.remetente}>
                                {item.remetenteId === auth.currentUser?.uid
                                    ? "EU:"
                                    : "Motorista"}
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
        fontSize: 25,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 20
    },

    lista: {
        flex: 1
    },

    mensagemCard: {
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
    paddingBottom: 35,
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
