import { db } from "../firebase/config.js";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";  // Make sure these are correctly imported


export const createTransaction = async (req, res) => {
    const { userId, name, amount, category, date, description, transactionType, paymentMethod } = req.body;

    try {
        const transactionDetails = {
            userId,
            name,
            amount,
            category,
            date,
            description,
            transactionType,
            paymentMethod
        };

        const docRef = await addDoc(collection(db, "Transaction"), transactionDetails);
        res.status(201).json({ message: "Transaction added", id: docRef.id });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export const getTransactions = async (req, res) => {
    const { userId } = req.params;

    try {
        const q = query(
            collection(db, "Transaction"),
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const transactions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(transactions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};