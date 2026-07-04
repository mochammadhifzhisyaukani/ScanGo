const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const PROJECT_REF = process.env.PROJECT_REF;

async function migrate() {
    const client = new Client({
        user: `postgres.${PROJECT_REF}`,
        password: process.env.DATABASE_PASSWORD,
        host: "aws-0-ap-southeast-1.pooler.supabase.com",
        port: 6543,
        database: "postgres",
        ssl: { rejectUnauthorized: true },
        connectionTimeoutMillis: 10000,
    });

    try {
        await client.connect();
        console.log("Connected to database via pooler");

        const sqlPath = path.join(__dirname, "migrations", "001_create_attendances.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");

        await client.query(sql);
        console.log("Migration 001_create_attendances.sql berhasil dijalankan!");
    } catch (error) {
        console.error("Migration error:", error.message);
        console.log("Mencoba koneksi langsung ke database...");
        try {
            const directClient = new Client({
                user: `postgres.${PROJECT_REF}`,
                password: process.env.DATABASE_PASSWORD,
                host: `db.${PROJECT_REF}.supabase.co`,
                port: 5432,
                database: "postgres",
                ssl: { rejectUnauthorized: true },
                connectionTimeoutMillis: 10000,
            });
            await directClient.connect();
            console.log("Connected to database directly");

            const sqlPath = path.join(__dirname, "migrations", "001_create_attendances.sql");
            const sql = fs.readFileSync(sqlPath, "utf8");

            await directClient.query(sql);
            console.log("Migration 001_create_attendances.sql berhasil dijalankan!");
            await directClient.end();
        } catch (directError) {
            console.error("Direct connection error:", directError.message);
        }
    } finally {
        await client.end();
    }
}

migrate();
