const express = require("express");
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
const port = 5000;

// middlerware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.deaij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("geniusCar");
        const servicesCollection = database.collection("Services");

        // GET API
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // GET SINGLE DATA API 
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.json(result)
        })

        // DELETE  API
        app.delete("/services/:id", async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            console.log(result)
            res.json(result)
        })
        // POST  API
        app.post("/services", async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            
            res.json(result);
        })
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir)



app.get("/", (req, res) => {
    res.send("server is running...")
})

app.listen(port, () => {
    console.log("server port number is ", port)
})

// userName: firstmongodb
// password: p8gAC5rC5O44f3r0

// userName: mdalamin
// passwrod: VZ3OMZFhBGty5f5Y