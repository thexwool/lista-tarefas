import { collection, getDocs, addDoc, query, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const Api = {
    createItem: async (name, cost, dateLimit) => {
        try {
            const querySnapshot = await getDocs(collection(db, "tarefas"));
            const existingTasks = querySnapshot.docs;

            const order = existingTasks.length + 1;

            const newTask = {
                nome: name,
                custo: cost,
                data_limite: dateLimit,
                ordem_apresentacao: order
            };

            const docRef = await addDoc(collection(db, "tarefas"), newTask);
            return { id: docRef.id, ...newTask };
        } catch (error) {
            console.error("Erro ao adicionar a nova tarefa ao Firestore: ", error);
            throw error;
        }
    },
    editItem: async (id, name, cost, dateLimit) => {
        try {
            const taskRef = doc(db, "tarefas", id);
            await updateDoc(taskRef, {
                nome: name,
                custo: cost,
                data_limite: dateLimit
            });
            return true;
        } catch (error) {
            console.error("Erro ao atualizar a tarefa: ", error);
            throw error;
        }
    },
    deleteItem: async (id) => {
        try {
            await deleteDoc(doc(db, "tarefas", id));
            return true;
        } catch (error) {
            console.error("Erro ao deletar a tarefa: ", error);
            throw error;
        }
    },
    readAll: async () => {
        try {
            const tarefasQuery = query(collection(db, "tarefas"), orderBy("ordem_apresentacao"));
            const querySnapshot = await getDocs(tarefasQuery);
            const data = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() });
            });
            return data;
        } catch (error) {
            console.error("Erro ao buscar todas as tarefas do Firestore: ", error);
            throw error;
        }
    },
    updateOrder: async (id, newOrder) => {
        try {
            const taskRef = doc(db, "tarefas", id);
            await updateDoc(taskRef, {
                ordem_apresentacao: newOrder
            });
            return true;
        } catch (error) {
            console.error("Erro ao atualizar a ordem de apresentação: ", error);
            throw error;
        }
    },
};

export default () => Api;
