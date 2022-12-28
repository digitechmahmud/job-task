const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rwqozng.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        
        const movieCollection = client.db('movieDB').collection('movies');
        const ratingCollection = client.db('movieDB').collection('ratings');

        app.get('/movies', async (req, res) => {
            const query = {};
            const cursor = movieCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/api/v1/longest-duration-movies', async (req, res) => {
            const query = {};
            const sort = { runtimeMinutes: -1 };
            const cursor = movieCollection.find(query);
            const result = await cursor.limit(10).sort(sort).toArray();
            res.send(result);
        })

        app.post('/api/v1/new-movie', async (req, res) => {
           
        })
    }
    finally {
        
    }
}
run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send("Server is running smoothly")
})

app.listen(port, () => {
    console.log(`Server listening from port ${port}`);
})