import express, { json } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(express.static("public"));

// Schema
const feedbackSchema = new mongoose.Schema({
    name:String,
    rating:Number,
    comment:String

});

//Modal
const Feedback = mongoose.model("Feedback",feedbackSchema)

//POST route 
app.post("/feedback",async(req,res)=>{
    try{
        const feedback = new Feedback({
        name:req.body.name,
        rating:req.body.rating,
        comment:req.body.comment
    });
    await feedback.save();
    res.json({
        message:"Feedback saved successfully"
    });
}catch(error){
    res.status(500).json({
        message:"Error saving feedback"
    })
}

})

//GET route
app.get("/feedback",async(req,res)=>{
    try{
        const feedback = await Feedback.find();
        res.json(feedback);
    }catch(error){
        res.status(500).json({
            message:"Error getting feedback"
        })
    }
})

//DELETE ALL FEEDBACK
// app.get("/delete-feedback",async(req,res)=>{
//     try{
//         await Feedback.deleteMany({});
//         res.json({
//             message:"All feedback deleted successfully"
//         })
//     }catch(error){
//         console.log(error);
//         res.status(500).json({
//             message:"Error deleting feedback"
//         })
//     }
// })
//MongoDB connection 

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected successfully")
})
.catch((error)=>{
console.log("Mongo connection error:",error)
})

//Start server
app.listen(PORT,()=>{
    console.log(`Server running on port:${PORT}`,)
})
