
import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Button,
    Alert,
    StyleSheet
} from "react-native";
import { useRouter } from "expo-router";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    query,
    where
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";

export default function Propostas() {
    const [propostas, setPropostas] = useState([]);
    const router = useRouter();

    async function buscarPropostas() {
        try {
            const usuario = auth.currentUser;

            if (!usuario) {
                return;
            }

            const carretosConsulta = query(
                collection(db, "carretos"),
                where("clienteId", "==", usuario.uid)
            );

            const carretosResultado = await getDocs(carretosConsulta);

            const carretos = carretosResultado.docs.map(function(documento) {
                return {
                    id: documento.id,
                    ...documento.data()
                };
            });

            const idsCarretos = carretos.map(function(item) {
                return item.id;
            });

            const resultado = await getDocs(collection(db, "propostas"));

            const propostasFiltradas = resultado.docs.filter(function(documento) {
                return idsCarretos.includes(documento.data().carretoId);
            });

            const lista = await Promise.all(
                propostasFiltradas.map(async function(documento) {
                    const proposta = documento.data();

                    const carreto = carretos.find(function(item) {
                        return item.id === proposta.carretoId;
                    });

                    const motoristaDocumento = await getDoc(
                        doc(db, "users", proposta.motoristaId)
                    );

                    return {
                        id: documento.id,
                        ...proposta,
                        carretoDescricao: carreto
                            ? carreto.descricao
                            : "Carreto não encontrado",
                        motoristaNome: motoristaDocumento.exists()
                            ? motoristaDocumento.data().nome
                            : "Motorista não encontrado"
                    };
                })
            );

            setPropostas(lista);

        } catch (erro) {
            console.log("Erro ao buscar propostas:", erro);
            Alert.alert("Erro", "Não foi possível buscar as propostas.");
        }
    }

    async function responderProposta(item, status) {
        try {
            if (status === "aceita") {
                if (!item.motoristaId) {
                    Alert.alert("Erro", "Esta proposta não possui motorista vinculado.");
                    return;
                }

                await updateDoc(doc(db, "carretos", item.carretoId), {
                    status: "contratado",
                    motoristaId: item.motoristaId
                });
            }

            await updateDoc(doc(db, "propostas", item.id), {
                status: status
            });

            Alert.alert("Sucesso", "Resposta enviada!");

            buscarPropostas();

        } catch (erro) {
            console.log("Erro ao responder proposta:", erro);
            Alert.alert("Erro", "Não foi possível responder à proposta.");
        }
    }

    useEffect(function() {
        async function carregar() {
            await buscarPropostas();
        }

        carregar();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Propostas Recebidas</Text>

            <ScrollView contentContainerStyle={styles.lista}>
                {propostas.map(function(item) {
                    return (
                        <View key={item.id} style={styles.card}>
                            <Text style={styles.nome}>
                                Motorista: {item.motoristaNome}
                            </Text>

                            <Text style={styles.texto}>
                                Carreto: {item.carretoDescricao}
                            </Text>

                            <Text style={styles.texto}>
                                Valor: R$ {item.valor}
                            </Text>

                            <Text style={styles.texto}>
                                Status: {item.status}
                            </Text>

                            {item.status === "pendente" && (
                                <>
                                    <View style={styles.botao}>
                                        <Button
                                            title="Aceitar"
                                            color="#22C55E"
                                            onPress={function() {
                                                responderProposta(item, "aceita");
                                            }}
                                        />
                                    </View>

                                    <View style={styles.botao}>
                                        <Button
                                            title="Recusar"
                                            color="#0F766E"
                                            onPress={function() {
                                                responderProposta(item, "recusada");
                                            }}
                                        />
                                    </View>
                                </>
                            )}

                            {item.status === "aceita" && (
                                <View style={styles.botao}>
                                    <Button
                                        title="Abrir chat"
                                        color="#22C55E"
                                        onPress={function() {
                                            router.push({
                                                pathname: "/cliente/chat",
                                                params: {
                                                    carretoId: item.carretoId
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        padding: 20
    },

    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 25
    },

    lista: {
        paddingBottom: 30
    },

    card: {
        borderWidth: 1,
        borderColor: "#0F766E",
        borderRadius: 8,
        padding: 15,
        marginBottom: 20
    },

    nome: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#064E3B",
        marginBottom: 10
    },

    texto: {
        fontSize: 15,
        color: "#0B1320",
        marginBottom: 8
    },

    botao: {
        marginTop: 10
    }
});
