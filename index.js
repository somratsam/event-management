const express = require('express')
const app = express()

const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 4000


// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.n1dwdgt.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();
    const eventsCollection = client.db("eventsDb").collection("events");
    const blogCollection = client.db("eventsDb").collection("blog");
    const serviceCollection = client.db("eventsDb").collection("service");
    const reviewCollection = client.db("eventsDb").collection("review");
    const pricingCollection = client.db("eventsDb").collection("pricing");


    app.get('/events', async (req, res) => {
        try{
          const result = await eventsCollection.find().toArray();
          res.send(result)
        }catch (error) {
          console.error('Error fetching offers:', error);
          res.status(500).send('Internal Server Error');
        }
      })


      app.post('/add-events', async (req, res) => {
        try {
            const data = req.body;
            const result = await eventsCollection.insertOne(data);
            res.send(result)
        } catch (error) {
            console.error('Error adding event:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.delete('/events/:eventId', async (req, res) => {
      try {
          const eventId = req.params.eventId;
          
          const result = await eventsCollection.deleteOne({ _id:new ObjectId(eventId) });
          if (result.deletedCount === 1) {
              res.status(200).send('Event deleted successfully');
          } else {
              res.status(404).send('Event not found');
          }
      } catch (error) {
          console.error('Error deleting event:', error);
          res.status(500).send('Internal Server Error');
      }
  });
  app.put('/events/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const updatedEventData = req.body;
        
        const result = await eventsCollection.updateOne(
            { _id: new ObjectId(eventId) },
            { $set: updatedEventData } 
        );
        
        if (result.modifiedCount === 1) {
            res.status(200).send('Event updated successfully');
        } else {
            res.status(404).send('Event not found');
        }
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send('Internal Server Error');
    }
});









    app.get('/blog', async (req, res) => {
        try{
          const result = await blogCollection.find().toArray();
          res.send(result)
        }catch (error) {
          console.error('Error fetching offers:', error);
          res.status(500).send('Internal Server Error');
        }
      })
    app.get('/service', async (req, res) => {
        try{
          const result = await serviceCollection.find().toArray();
          res.send(result)
        }catch (error) {
          console.error('Error fetching offers:', error);
          res.status(500).send('Internal Server Error');
        }
      })
    app.get('/review', async (req, res) => {
        try{
          const result = await reviewCollection.find().toArray();
          res.send(result)
        }catch (error) {
          console.error('Error fetching offers:', error);
          res.status(500).send('Internal Server Error');
        }
      })
    app.get('/pricing', async (req, res) => {
        try{
          const result = await pricingCollection.find().toArray();
          res.send(result)
        }catch (error) {
          console.error('Error fetching offers:', error);
          res.status(500).send('Internal Server Error');
        }
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



app.get('/', (req, res) => {
    res.send('event is running')
})

app.listen (port, () =>{
    console.log(`event server is running on ${port}`);
})