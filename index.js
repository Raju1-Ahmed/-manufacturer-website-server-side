const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fx3gw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const productsCollection = client.db('Auto_Parts').collection('Products');
    const orderCollection = client.db('Auto_Parts').collection('Clint_Order');

    //Get All products api
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //Get a single id
    app.get('/service/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await productsCollection.findOne(query);
      res.send(service);
    })
    // order api
    app.post('/order', async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })

  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From AutoParts!')
})

app.listen(port, () => {
  console.log(`Example AutoParts listening on port ${port}`)
})