const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const PORT = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

// database!!
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGOURL)
.then(()=>{
    console.log("Connecting to DB")
})
.catch((err)=>{
    console.log(err);
});

// Middle ware !!
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

// app.get("/",(req,res)=>{
//     res.send("Hello")
// })
// app.get("/users",(req,res)=>{
//     res.send("Users")
// })
app.listen(PORT,()=>console.log("Start server"));