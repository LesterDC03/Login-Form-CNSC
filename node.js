const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
app.use(bodyParser.json());

//connect to MongoDB
mongoose.connect("mongodb://localhost:27017/DatabaseName")

//User schema
const userSchema = new mongoosee.Schema({
    email:{type: String, required: true, unique:true},
    password: {type:String, required:true}
});

const User = mongoose.model("User", userSchema);

//Login route
app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne ({email});

    if (!user) {
        res.status(401).json({ message: "Invalid email or password"});
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
        //Generate a JWT token and send it back to the client
        res.json({ message: "Login successful"});
    } else {
        res.status(401).json({message: "Invalid email or password"})
    }

//Registration route
app.post("/register", async (req, res) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if (existingUser) {
        res.status(400).json({ message: "Email already exists"});
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({ email, password:hashedPassword});

    await user.save();
    
    res.json({ message: "Registration successful"});
});

// Start the server
app.listen(3000,()=> {
    console.log("Server listening on port");
});
})