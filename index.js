
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId


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
            // console.log('get')
            res.json(services)
        })
        // get api for order
        app.get('/orders/:id', async(req, res) => {
          const id = req.params.id
            // console.log('get', id)
            const myOrder = await serviceCollection.find({email: id}).toArray()
            console.log(myOrder)
            res.json(myOrder)
        })
        // get manage order
        app.get('/manage/:id', async(req, res) => {
            const id = req.params.id;
            const manageOrder = await serviceCollection.find({status:"pending"}).toArray()
            res.json(manageOrder)

        })
        // update
        app.put('/update/:id' , async(req, res) => {
            const id = req.params.id
            // console.log(req.params.id)
            const updateInfo = req.body;
            console.log(updateInfo)
            const filter = {_id: ObjectId(id)};
            const updateService = await serviceCollection.updateOne(filter, {
                $set:{
                    email:updateInfo.email,
                    status: "pending"
                }
            });
            // console.log(updateService)
            res.send(updateService)
        })
     
       
        // post api
        app.post('/services',async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            // console.log('hit the post')
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
