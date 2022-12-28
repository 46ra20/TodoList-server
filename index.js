//require file
const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectID, ObjectId } = require('mongodb');

//port
const port = process.env.PORT || 5000;

//middle-ware
app.use(cors())
app.use(express.json())
require('dotenv').config()

app.get('/',(req, res)=>{
    res.send("Hello world");
})

//uir 
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.p4fjw31.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function runMongoDB(){
    try{
        const toDoList = await client.db('TodoList').collection('todo');
        //get all task
        app.get("/get-task",async(req,res)=>{
            const email = req.query.email;
            const query = {$and:[{'email':email},{'isComplete':false}]}
            const getTask = await toDoList.find(query).toArray();
            res.send(getTask);
        })
        

        app.get("/get-complete-task/",async(req,res)=>{
            const email = req.query.email;
            const query = {$and:[{'email':email},{'isComplete':true}]}
            const getTask = await toDoList.find(query).toArray();
            res.send(getTask);
        })

        //add-item in list
        app.post("/add-task", async(req, res)=>{
            const data = req.body;
            const addTask = await toDoList.insertOne(data)
            res.send(addTask);
        })

        app.put("/complete-task/", async(req, res)=>{
            const id = req.query.id;
            const query = {"_id":ObjectId(id)}
            const completeTask = await toDoList.updateOne(query,{$set:{"isComplete":true}},{upsert:true})
            res.send(completeTask)
        })

        app.put("/make-incomplete/", async(req, res)=>{
            const id = req.query.id;
            const query = {"_id":ObjectId(id)}
            const completeTask = await toDoList.updateOne(query,{$set:{"isComplete":false}},{upsert:true})
            res.send(completeTask)
        })

        //delete task
        app.delete("/delete-task/",async(req, res)=>{
            const id = req.query.id;
            const query = {"_id":ObjectId(id)}
            const deleteTask = await toDoList.deleteOne(query)
            res.send(deleteTask)
        })
    }
    catch(err){
        console.log(err)
    }
    finally{

    }
}

runMongoDB().catch(err=>console.log(err.code))

app.listen(port, ()=>{console.log("Server port ="+port)})
