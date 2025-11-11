/*
 * Script to reset the database: drop and recreate it.
 * Run with: npx tsx scripts/reset_db.ts
 */

import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

dotenv.config();

if (
    !process.env.DATABASE_NAME ||
    !process.env.DATABASE_USER ||
    !process.env.DATABASE_PASSWORD
) {
    throw new Error(
        "Please set DATABASE_NAME, DATABASE_USER, and DATABASE_PASSWORD in .env file"
    );
}

async function resetDatabase() {
    // Connect without specifying database
    const sequelize = new Sequelize({
        dialect: "mariadb",
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST || "127.0.0.1",
        port: parseInt(process.env.DATABASE_PORT || "3306"),
        logging: console.log,
    });

    try {
        await sequelize.authenticate();
        console.log("Connected to MariaDB successfully.");

        // Drop the database if it exists
        await sequelize.query(`DROP DATABASE IF EXISTS \`${process.env.DATABASE_NAME}\`;`);
        console.log(`Database '${process.env.DATABASE_NAME}' dropped.`);

        // Create the database
        await sequelize.query(`CREATE DATABASE \`${process.env.DATABASE_NAME}\`;`);
        console.log(`Database '${process.env.DATABASE_NAME}' created.`);

    } catch (error) {
        console.error("Error resetting database:", error);
    } finally {
        await sequelize.close();
    }
}

resetDatabase();