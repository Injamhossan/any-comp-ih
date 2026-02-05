import "reflect-metadata";
import "dotenv/config";
import { getDataSource } from "./src/lib/data-source";

async function check() {
    console.log("Starting check...");
    try {
        const ds = await getDataSource();
        console.log("Registered Entities:");
        ds.entityMetadatas.forEach(m => {
            console.log(`- ${m.name} (Table: ${m.tableName})`);
        });
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}

check();
