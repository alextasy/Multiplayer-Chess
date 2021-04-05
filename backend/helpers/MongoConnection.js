const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.MONGO_URI_KEY, { useNewUrlParser: true, useUnifiedTopology: true });

async function getCollection(collectionName) {
    await client.connect();
    return client.db('chess').collection(collectionName);
}

module.exports = getCollection;
