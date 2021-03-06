
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId


const port = process.env.PORT ||  5000;
// middleware
    app.use(cors());
    app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vea3q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
       
        const database = client.db('My_Travel');
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('serviceOrder');

        // get api using find
        app.get('/services', async(req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.json(services)
        })
        // get api ServiceOrder
        app.get('/serviceOrder', async(req, res) => {
            const cursor = orderCollection.find({});
            const services = await cursor.toArray();
            res.json(services)
        })
        // get api for order
        app.get('/serviceOrder/:id', async(req, res) => {
          const id = req.params.id
            const myOrder = await orderCollection.find({email: id}).toArray()
            res.json(myOrder)
        })
        // get manage order
       /*  app.get('/manage/:id', async(req, res) => {
            const id = req.params.id;
            const manageOrder = await orderCollection.find({email : id}).toArray()
            res.json(manageOrder)

        }) */
        // update
        app.put('/update/:id' , async(req, res) => {
            const id = req.params.id
            const updateInfo = req.body;
            console.log("updateInfo",updateInfo.status)
            const filter = {_id: id};
            const updateService = await orderCollection.updateOne(filter, {
                $set:{
                    email:updateInfo.email,
                    status: "pending"
                }
            });
            res.send(updateService)
        })
        // update
        app.put('/statusUpdate/:id' , async(req, res) => {
            const id = req.params.id
            const updateInfo = req.body;
            const filter = {_id: id};
            
            const updateService = await orderCollection.updateOne(filter, {
                $set:{
                    status : updateInfo.status
                }
            });
            res.send(updateService)
        })
    //  delete
    app.delete('/delete/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: id};
        const result = await orderCollection.deleteOne(query);
        res.json(result)
    })
       
        // post api
        app.post('/services',async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
           
            res.json(result)
        })
        // post order
        app.post('/serviceOrder',async (req, res) => {
            const service = req.body;
            const result = await orderCollection.insertOne(service);
           
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