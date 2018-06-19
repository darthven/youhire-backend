export default {
    type: "postgres",
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT || 5432,
    username: process.env.PG_USER || "test",
    password: process.env.PG_PASSWORD || "12345678",
    database: process.env.PG_DB  || "youhire_db_test",
    synchronize: true,
    logging: false,
    entities: [
        "src/db/entities/*.ts"
    ],
    migrations: [
        "src/db/migrations/*.ts"
    ],
    subscribers: [
        "src/db/subscribers/*.ts"
    ],
    cli: {
        entitiesDir: "src/db/entities",
        migrationsDir: "src/db/migrations",
        subscribersDir: "src/db/subscribers"
    }
}
