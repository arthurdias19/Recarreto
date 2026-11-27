import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase";
export async function login(email, senha) {
    try {
        const resultado = await signInWithEmailAndPassword(auth, email, senha);

        const documento = await getDoc(
            doc(db, "users", resultado.user.uid)
        );

        if (!documento.exists()) {
            throw new Error("Dados do usuário não encontrados.");
        }

        return documento.data().tipo;

    } catch (erro) {
        console.log("Erro no login:", erro);
        throw erro;
    }
}

export async function cadastro(nome,email, senha,tipo) {
    try {
       const resultado= await createUserWithEmailAndPassword(auth, email, senha);
        await setDoc(doc(db,"users",resultado.user.uid),{
            email:email,
            nome:nome,
            tipo:tipo})
        
        console.log("Cadastro feito!");}
     catch (erro) {
        console.log("Erro no cadastro:");
        throw erro;
    }
}

export async function logout() {
    await signOut(auth);
}