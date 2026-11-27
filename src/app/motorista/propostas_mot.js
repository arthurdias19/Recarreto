
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
    query,
    where
} from "firebase/firestore";
import { db, auth } from "../../services/firebase";

export default function PropostasMotorista() {
    const [propostas, setPropostas] = useState([]);
    const router = useRouter();

    async function buscarPropostas() {
        try {
            if (!auth.currentUser) {
                Alert.alert("Erro", "Usuário não está logado.");
                return;
            }

            const consulta = query(
                collection(db, "propostas"),
                where("motoristaId", "==", auth.currentUser.uid)
            );

            const resultado = await getDocs(consulta);
            const carretosResultado = await getDocs(collection(db, "carretos"));

            const carretos = carretosResultado.docs.map(function(documento) {
                return {
                    id: documento.id,
                    ...documento.data()
                };
            });

            const lista = resultado.docs.map(function(documento) {
                const proposta = documento.data();

                const carreto = carretos.find(function(item) {
                    return item.id === proposta.carretoId;
                });

                return {
                    id: documento.id,
                    ...proposta,
                    carretoDescricao: carreto ? carreto.descricao : "Carreto não encontrado"
                };
            });

            setPropostas(lista);

        } catch (erro) {
            console.log("Erro ao buscar propostas:", erro);
            Alert.alert("Erro", "Não foi possível buscar as propostas.");
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
            <Text style={styles.titulo}>Minhas Propostas</Text>

            <ScrollView>
                {propostas.map(function(item) {
                    return (
                        <View key={item.id} style={styles.proposta}>
                            <Text style={styles.descricao}>
                                Carreto: {item.carretoDescricao}
                            </Text>

                            <Text style={styles.texto}>
                                Valor: R$ {item.valor}
                            </Text>

                            <Text style={styles.texto}>
                                Status: {item.status}
                            </Text>

                            {item.status === "aceita" && (
                                <View style={styles.botao}>
                                    <Button
                                        title="Abrir chat"
                                        color="#22C55E"
                                        onPress={function() {
                                            router.push({
                                                pathname: "/motorista/chat_mot",
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
        fontSize: 25,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 25
    },

    proposta: {
        borderWidth: 1,
        borderColor: "#0F766E",
        borderRadius: 8,
        padding: 15,
        marginBottom: 15
    },

    descricao: {
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
