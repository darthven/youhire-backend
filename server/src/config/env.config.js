export default {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    PG_DB: process.env.PG_DB || 'youhire_db',
    PG_USER: process.env.PG_USER || 'admin',
    PG_PASSWORD: process.env.PG_PASSWORD || '12345678',
    PG_HOST: process.env.PG_HOST || 'localhost',
    PG_PORT: process.env.PG_PORT || 5432
}
