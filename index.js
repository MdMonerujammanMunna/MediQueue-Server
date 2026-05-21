const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { useId } = require("react");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
const { verify } = require("node:crypto");
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

const JWKS = createRemoteJWKSet(
    new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

const Varify = async (req, res, next) => {
    const AuthValu = req?.headers.authorization;
    if (!AuthValu) {
        return res.status(401).json({ message: "Unauthorization" })
    }
    const Token = AuthValu.split(" ")[1]
    if (!Token) {
        return res.status(401).json({ message: "Unauthorization" })
    }
    try {
        const { payload } = await jwtVerify(Token, JWKS)
        next()
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" })
    }

}

async function run() {
    try {
        // await client.connect();


        const db = client.db("MediQueue")
        const dataCollection = db.collection("Tutors")
        const bookingCollection = db.collection("Booking")

        // Add data
        app.post("/AddTutors", async (req, res) => {
            const Data = req.body
            const result = await dataCollection.insertOne(Data)
            res.json(result)
        })
        // All data done
        app.get("/Tutors", async (req, res) => {
            const result = await dataCollection.find().toArray()
            res.json(result)
        })
        // Details page done
        app.get("/AllTutorPage/:id", async (req, res) => {
            const { id } = req.params
            const result = await dataCollection.findOne({ _id: new ObjectId(id) })
            res.json(result)
        })
        // All data done
        app.get("/TutorsLimit", async (req, res) => {
            const result = await dataCollection.find().limit(6).toArray()
            res.json(result)
        })
        // Booking data
        app.post("/Booking", async (req, res) => {
            const Data = req.body
            const result = await bookingCollection.insertOne(Data)
            res.json(result)
        })
        // Booking data done
        app.get("/Bookingall", async (req, res) => {
            const Data = req.body
            const result = await bookingCollection.find().toArray()
            res.json(result)
        })

        // My maked done
        app.get("/myMaked", async (req, res) => {
            const userId = req.headers.uservalidid || req.headers['uservalidid'];
            const result = await dataCollection.find({ SessionUserID: userId }).toArray()
            res.json(result)
        })
        // Update done
        app.patch("/Tutors/:id", async (req, res) => {
            const { id } = req.params
            const updateData = req.body
            const result = await dataCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
            res.json(result)
            console.log(result)
        })
        // Delect 
        app.delete("/Tutors/:id", async (req, res) => {
            const { id } = req.params
            const result = await dataCollection.deleteOne({ _id: new ObjectId(id) })
            res.json(result)
            console.log(result)
        })
        // Slot down
        app.patch("/AllTutorPage/:id", async (req, res) => {

            const { id } = req.params;
            const { Slot } = req.body;
            console.log(Slot)

            const filter = { _id: new ObjectId(id) };

            const updatedDoc = {
                $set: {
                    Slot: Slot
                }
            };

            const result = await dataCollection.updateOne(filter, updatedDoc);

            res.send(result);

        })
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(PORT, () => {
    console.log(`hello on ${PORT}`)
})