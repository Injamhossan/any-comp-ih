import "reflect-metadata";
import { DataSource } from "typeorm";
import { Specialist } from "@/entities/Specialist";
import { Media } from "@/entities/Media";
import { ServiceOffering } from "@/entities/ServiceOffering";
import { ServiceOfferingMasterList } from "@/entities/ServiceOfferingMasterList";
import { PlatformFee } from "@/entities/PlatformFee";
import { User } from "@/entities/User";
import { Order } from "@/entities/Order";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [
        Specialist, Media, ServiceOffering, ServiceOfferingMasterList,
        PlatformFee, User, Order
    ],
    subscribers: [],
    migrations: [],
});

const globalForTypeORM = global as unknown as { dataSource: DataSource };

export const getDataSource = async () => {
    if (globalForTypeORM.dataSource && globalForTypeORM.dataSource.isInitialized) {
        return globalForTypeORM.dataSource;
    }

    if (!AppDataSource.isInitialized) {
        try {
            await AppDataSource.initialize();
            console.log("✅ Database initialized successfully");
            if (Array.isArray(AppDataSource.options.entities)) {
                console.log("Entities registered:", AppDataSource.options.entities.map((e: any) => (typeof e === 'function' ? e.name : e)));
            }
        } catch (error) {
            console.error("❌ Database initialization failed:", error);
            throw error;
        }
    }
    
    if (process.env.NODE_ENV !== "production") {
        globalForTypeORM.dataSource = AppDataSource;
    }
    
    return AppDataSource;
};
