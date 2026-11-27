
import { Button, Text, Modal, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import Botaologout from "../../components/Botaologout";
import Carreto from "./carretos";
import PropostasMotorista from "./propostas_mot";

export default function TelaMot() {
    const [modalCarretos, setModalCarretos] = useState(false);
    const [modalPropostas, setModalPropostas] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.titulo}>
                    Bem-vindo, Motorista!
                </Text>

                <Text style={styles.subtitulo}>
                    Encontre carretos e acompanhe suas solicitações.
                </Text>

                <View style={styles.botoes}>
                    <Button
                        title="Carretos"
                        color="#22C55E"
                        onPress={function() {
                            setModalCarretos(true);
                        }}
                    />

                    <Button
                        title="Solicitações"
                        color="#0F766E"
                        onPress={function() {
                            setModalPropostas(true);
                        }}
                    />

                    <Botaologout />
                </View>
            </View>

            <Modal
                visible={modalCarretos}
                animationType="slide"
                onRequestClose={function() {
                    setModalCarretos(false);
                }}
            >
                <View style={styles.modal}>
                    <View style={styles.voltar}>
                        <Button
                            title="Voltar"
                            color="#0F766E"
                            onPress={function() {
                                setModalCarretos(false);
                            }}
                        />
                    </View>

                    <Carreto />
                </View>
            </Modal>

            <Modal
                visible={modalPropostas}
                animationType="slide"
                onRequestClose={function() {
                    setModalPropostas(false);
                }}
            >
                <View style={styles.modal}>
                    <View style={styles.voltar}>
                        <Button
                            title="Voltar"
                            color="#0F766E"
                            onPress={function() {
                                setModalPropostas(false);
                            }}
                        />
                    </View>

                    <PropostasMotorista />
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

    content: {
        flex: 1,
        paddingHorizontal: 25,
        justifyContent: "center"
    },

    titulo: {
        fontSize: 26,
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
