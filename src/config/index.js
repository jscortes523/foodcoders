require('dotenv').config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    envName: process.env.NODE_ENV,
    port: process.env.PORT || 9090,
    cors:process.env.CORS,
    dbUser:process.env.DB_USER,
    dbPaswword:process.env.DB_PASSWORD,
    dbHost:process.env.DB_HOST,
    dbName:process.env.NODE_ENV !== 'production' ? process.env.DB_NAME_DEV : process.env.DB_NAME_PRD,
}

module.exports = {config}