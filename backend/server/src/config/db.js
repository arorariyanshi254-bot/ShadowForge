import mongoose from "mongoose";
import dns from "dns";

try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
    // Ignore DNS error
}

let isConnecting = false;

const connectDB = async () => {
    if (isConnecting) return;
    isConnecting = true;

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 4000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (primaryError) {
        console.warn(`MongoDB Primary URI Error: ${primaryError.message}`);
        
        try {
            console.log("Attempting fallback connection to local MongoDB (mongodb://127.0.0.1:27017/shadowforge)...");
            const conn = await mongoose.connect("mongodb://127.0.0.1:27017/shadowforge", {
                serverSelectionTimeoutMS: 3000,
            });
            console.log(`MongoDB Connected (Local Fallback): ${conn.connection.host}`);
        } catch (fallbackError) {
            console.error("MongoDB Atlas & Local connection unavailable.");
            console.error("-> Note: Please ensure your current IP address is whitelisted in MongoDB Atlas (Network Access -> Add IP Address -> Allow Access from Anywhere 0.0.0.0/0)");
        }
    } finally {
        isConnecting = false;
    }
};

export default connectDB;
