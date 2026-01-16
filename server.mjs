import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/database.mjs';
const app=express();
import taskRoutes from './routes/tasks.routes.mjs';
import {    login,
    signup,
    logout,
    token} from './controllers/auth.controller.mjs';
const PORT = 3000;
connectDB();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Node app initialised");
})
app.use('/tasks',taskRoutes);

app.post('/signup',signup
  )

  app.post('/login',login
);

app.post("/token", token);

app.post("/logout", logout );

app.listen(PORT,()=>{
      console.log(`Server running on port ${PORT}`);
});

