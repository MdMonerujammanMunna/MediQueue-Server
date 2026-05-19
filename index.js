const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
dotenv.config()
const PORT = process.env.PORT
app.use(cors()) // cors add 
app.use(express.json())
app.get('/', (req, res) => {
    res.send("I am fine you do your work")
})


const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();


        const db = client.db("MediQueue")
        const dataCollection = db.collection("Tutors")

        app.post("/AddTutors", async (req, res) => {
            const Data = req.body
            const result = await dataCollection.insertOne(Data)
            res.json(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(PORT, () => {
    console.log(`hello on ${PORT}`)
})