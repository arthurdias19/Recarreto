
import { Button, Text, Modal, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import Botaologout from "../../components/Botaologout";
import NovoCarreto from "./novo_carreto";
import Propostas from "./proposta";

export default function TelaCliente() {
    const [modalVisivel, setModalVisivel] = useState(false);
    const [modalPropostas, setModalPropostas] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.conteudo}>
                <Text style={styles.titulo}>Bem-vindo!</Text>

                <Text style={styles.subtitulo}>
                    Gerencie seus carretos e acompanhe suas propostas.
                </Text>

                <View style={styles.botoes}>
                    <Button
                        title="Novo Carreto"
                        color="#22C55E"
                        onPress={() => setModalVisivel(true)}
                    />

                    <Button
                        title="Propostas"
                        color="#0F766E"
                        onPress={() => setModalPropostas(true)}
                    />

                    <Botaologout />
                </View>
            </View>

            <NovoCarreto
                visivel={modalVisivel}
                fechar={() => setModalVisivel(false)}
            />

            <Modal
                visible={modalPropostas}
                animationType="slide"
                onRequestClose={() => setModalPropostas(false)}
            >
                <View style={styles.modal}>
                    <View style={styles.voltar}>
                        <Button
                            title="Voltar"
                            color="#0F766E"
                            onPress={() => setModalPropostas(false)}
                        />
                    </View>

                    <Propostas />
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },

    conteudo: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: "center"
    },

    titulo: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#064E3B",
        textAlign: "center",
        marginBottom: 12
    },

    subtitulo: {
        fontSize: 16,
        color: "#0F766E",
        textAlign: "center",
        marginBottom: 30
    },

    botoes: {
        gap: 15
    },

    modal: {
        flex: 1,
        backgroundColor: "#FFFFFF"
    },

    voltar: {
        paddingTop: 40,
        paddingHorizontal: 20,
        paddingBottom: 15
    }
});
