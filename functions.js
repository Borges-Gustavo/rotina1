import { getDatabase, ref, push, set, get, remove } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5-974mJ4f9eX_tGTmdf5Ufa2Lq2fXjNI",
  authDomain: "project-5456599948464232672.firebaseapp.com",
  databaseURL: "https://project-5456599948464232672-default-rtdb.firebaseio.com",
  projectId: "project-5456599948464232672",
  storageBucket: "project-5456599948464232672.firebasestorage.app",
  messagingSenderId: "114109783215",
  appId: "1:114109783215:web:2e76a403e660233d03885a",
  measurementId: "G-LQJPRDFECY"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
let usuarioAtual;

async function obterUsuario() {
    if (!usuarioAtual) {
        const credencial = await signInAnonymously(auth);
        usuarioAtual = credencial.user;
    }

    return usuarioAtual;
}

function referenciaLancamentos(uid) {
    return ref(db, `usuarios/${uid}/lancamentos`);
}

// Função para Guardar (Create)
export async function adicionarLancamento(descricao, categoria, tipo, valor, data) {
    try {
        const usuario = await obterUsuario();
        const lancamentoRef = push(referenciaLancamentos(usuario.uid));
        await set(lancamentoRef, {
            descricao: descricao,
            categoria: categoria,
            tipo: tipo,
            valor: Number(valor),
            data: data,
            criadoEm: Date.now()
        });
        console.log("Lançamento escrito com ID: ", lancamentoRef.key);
        alert("Lançamento guardado com sucesso!");
    } catch (e) {
        console.error("Erro ao adicionar documento: ", e);
    }
}

// Função para Ler (Read)
export async function buscarLancamentos() {
    const usuario = await obterUsuario();
    const snapshot = await get(referenciaLancamentos(usuario.uid));
    const lancamentos = [];

    if (snapshot.exists()) {
        Object.entries(snapshot.val()).forEach(([id, lancamento]) => {
            lancamentos.push({ id, ...lancamento });
        });
    }

    return lancamentos;
}

// Função para Apagar (Delete)
export async function deletarLancamento(id) {
    try {
        const usuario = await obterUsuario();
        await remove(ref(db, `usuarios/${usuario.uid}/lancamentos/${id}`));
        console.log("Lançamento apagado com sucesso!");
    } catch (e) {
        console.error("Erro ao apagar documento: ", e);
    }
}