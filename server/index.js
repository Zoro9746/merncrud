//import the libraries - express-mongoose-cors
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

//create express server
const app = express();
app.use(cors());
app.use(express.json());

//connect to mongodb
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connnected"))
.catch(err => console.error(err))

//create model
const Person = mongoose.model("Person", {name: String, age: Number}, "person")

//real all people
app.get("/", async(req,res) => {
    const people = await Person.find();
    res.json(people);
});

// Add new people
app.post("/",async(req,res)=>{
    const newPerson = await Person.create(req.body);
    res.json(newPerson);
    
});

// Update people
app.put("/:id", async(req,res) => {
    const updated = await Person.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );
    res.json(updated);
})

// Delete person
app.delete("/:id", async (req, res) => {
    await Person.findByIdAndDelete(req.params.id);
    res.json({ message: "Person deleted" });
});


//connection
app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000")
})
