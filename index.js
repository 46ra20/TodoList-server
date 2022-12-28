//require file
const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

//port
const port = process.env.PORT || 5000;

app.get('/',(req, res)=>{
    res.send("Hello world");
})

//uir 
const uri = "mongodb+srv://<username>:<password>@cluster0.p4fjw31.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function runMongoDB(){
    try{
        const toDoList = await client.db('TodoList').collection('todo');
        
        //add-item in list
        app.post("/add-item", async(req, res)=>{
            const data = req.body;
            console.log(data)
            res.send(data);
        })
    }
    catch(err){
        console.log(err)
    }
    finally{

    }
}

app.listen(port, ()=>{console.log("Server port ="+port)})
