import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';



const app = express();
const PORT = 3000;
const mongoUrl='mongodb+srv://admin:123@cluster0.yghtoep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUrl, {})
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection successfully");
});

app.use(bodyParser.json());

app.use(

    (req,res,next)=>{
  
  
  
      const token = req.header("Authorization")?.replace("Bearer ","")
      console.log(token)
  
      if(token != null){
        jwt.verify(token,process.env.SECRET , (error,decoded)=>{
  
          if(!error){
            req.user = decoded   
            console.log(decoded)     
          }
  
        })
      }
  
      next()
  
    }
  
  )



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});