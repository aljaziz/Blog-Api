import mongoose from "mongoose";
import config from "@/config";
import type { ConnectOptions } from "mongoose";
import { logger } from "@/lib/winston";

const clientOptions: ConnectOptions = {
    dbName: "blog-db",
    appName: "Blog API",
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    },
};

export const connectToDatabase = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error("MongoDB URI is not defined in the cofiguration.");
    }

    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info("Connected to the databse successfully.", {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        logger.error("Error connecting to the database", error);
    }
};

export const disconnetFromDatabase = async (): Promise<void> => {
    try {
        await mongoose.disconnect();
        logger.info("Disconnected from the database successfully", {
            uri: config.MONGO_URI,
            options: clientOptions,
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        logger.error("Error disconnecting from the database", error);
    }
};
