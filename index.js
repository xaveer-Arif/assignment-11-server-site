
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
// const ObjectId = require('mongodb').ObjectId


const port = 5000;
// middleware
    app.use(cors());
    app.use(express.json())


// console.log(uri)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
       
        const database = client.db('My_Travel');
        const serviceCollection = database.collection('services');

        // get api using find
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services)
        })

        /* // get single api using ObjectId and find
        app.get('/services/:id', async(req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const singleService = await serviceCollection.findOne(query) 
            // const service = await singleService.toArray()
            console.log('service id', singleService)
            res.json(singleService)
        }) */
       
        // post api
        app.post('/services',async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service).toArray();
            // console.log('hit the post', service)
            // res.json(result)
            res.json(result)
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', async(req, res) => {
    console.log('command line a jabe')
    res.send('client site a jabe,')
});
app.listen(port, () => {
    console.log('listnitg port' ,port)
})





//...........................................
/*  const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config();

const port = 5000;
// middle ware
app.use(cors())
app.use(express.json())

// connect to data base
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)

// function of post and get method 
async function run(){
    try{
        await client.connect();
        const database = client.db('My_Travel');
        const serviceCollection = database.collection('services')
        // post method
        app.post('/services', async(req, res) => {
            // const services = req.body;
            // const services = await serviceCollection.insertOne(req.body); 
            console.log('console log er ', req.body)
            res.send('service')
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    console.log('this is first command')
    res.send('Hellow world')
})

app.listen(port , () => {
    console.log('Running From ', port)
})

 */