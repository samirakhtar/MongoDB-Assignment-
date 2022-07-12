const express = require("express");
const {MongoClient} = require('mongodb');

const connectionString = process. env.MONGODB_CONNECTION_STRING || "mongodb://localhost:27017";

async function init() {
    const client = new MongoClient(connectionString,{
        useUnifiedTopology: true,
    });
    await client.connect();

    const app = express();

    app.get('/get', async(req, res) => {
        const db = await client.db("shop");
        const collection = db.collection('tvs');

        const tvs = await collection.find({
            $text:{$search: req.query.search}
        },
        {_id: 0 }
        )
        .sort({score:{$meta: "textScore"}})
        .limit(10)
        .toArray();
        
        res.json({status: "ok", tvs}).end();
        }) 
  
        const PORT = process.env.PORT || 3000;
        app.use(express.static('./static'));
        app.listen(PORT);
        console.log(`running on http://localhost:${PORT}`);

}
init();