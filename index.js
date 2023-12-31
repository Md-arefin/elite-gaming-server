const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Elite Gamers server is running")
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.bqstehg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version



const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toyCollection = client.db('EliteGamerDB').collection("EliteGear");

        app.get('/eliteGear', async (req, res) => {
            const cursor = toyCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/eliteGear/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.findOne(query);
            res.send(result);
        })

        app.get('/eliteGames', async (req, res) => {
            console.log(req.query);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        })


        app.get('/eliteGears', async (req, res) => {
            console.log(req.query);
            let query = {}
            if (req.query?.Select) {
                query = { Select: req.query.Select }
            }
          
            const result = await toyCollection.find(query).toArray();
            res.send(result);
        })


        app.post('/eliteGear', async (req, res) => {
            const newToy = req.body;
            console.log(newToy);
            const result = await toyCollection.insertOne(newToy);
            res.send(result);
        })

        app.put('/eliteGear/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedToys = req.body;
            const modifiedToy = {
                $set: {
                    Price: updatedToys.Price,
                    Quantity: updatedToys.Quantity,
                    description: updatedToys.description
                }
            }
            console.log(updatedToys, modifiedToy);

            const result = await toyCollection.updateOne(filter, modifiedToy, options);
            res.send(result);
        })

        app.delete('/eliteGear/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Gamers server is running on PORT:${port}`)
})