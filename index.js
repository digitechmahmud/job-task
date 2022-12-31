const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


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
            const cursor = movieCollection.find(query).sort(sort);
            const result = await cursor.limit(10).toArray();
            res.send(result);
        })

        app.get('/api/v1/top-rated-movies', async (req, res) => {
            const query = {};
            const cursor = ratingCollection.find({ averageRating: { $gt: 6.0 } });
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/api/v1/new-movie', async (req, res) => {
            res.send(`
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
                    <div class="card mb-3 mx-auto" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">Special title treatment</h5>
                        <form method="POST" action="/">
                            <div class="mb-3">
                                <label class="form-label">tconst</label>
                                <input type="text" name="tconst" class="form-control" id="tconst" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">titleType</label>
                                <input type="text" name="titleType" class="form-control" id="titleType">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">primaryTitle</label>
                                <input type="text" name="primaryTitle" class="form-control" id="primaryTitle">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">runtimeMinutes</label>
                                <input type="number" name="runtimeMinutes" class="form-control" id="runtimeMinutes">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">genres</label>
                                <input type="text" name="genres" class="form-control" id="genres">
                            </div>
                           <input type="submit" value="Submit"/>
                        </form>
                    </div>
                    </div>

           `);
        });
        app.post('/',async (req, res) => {
            const addMovies = req.body;
            const result = await movieCollection.insertOne(addMovies);
            res.send(result);
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