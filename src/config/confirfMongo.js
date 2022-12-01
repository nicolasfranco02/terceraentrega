export const config = {
    db: {
        host: 'localhost',
        port: 27017,
        dbName: 'clase19',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        }
    }
}
export default config 