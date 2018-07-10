import envConfig from "./env.config"

const appDir: string = (envConfig.NODE_ENV === "development") ? "src" : "dist"

export default {
    type: "postgres",
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    username: process.env.PG_USER || "admin",
    password: process.env.PG_PASSWORD || "12345678",
    database: process.env.PG_DB  || "youhire_db",
    synchronize: true,
    logging: false,
    entities: [
        `${appDir}/db/entities/*.js`
    ],
    migrations: [
        `${appDir}/db/migrations/*.js`
    ],
    subscribers: [
        `${appDir}/db/subscribers/*.js`
    ],
    cli: {
        entitiesDir: `${appDir}/db/entities`,
        migrationsDir: `${appDir}/db/migrations`,
        subscribersDir: `${appDir}/db/subscribers`
    }
}
