import express from 'express'
import cors from 'cors'
import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
dotenv.config()

let userLogIn = false



const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

const app = express()
app.use(
  cors({
    origin: "https://lucastaskapp.netlify.app", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);
app.options("*", cors());

app.use(express.json())
app.use(express.static('public'))

const port = process.env.PORT
// const port = 3500

app.use((req, res, next) => {
  console.log("Request URL:", req.url);
  console.log("Request Method:", req.method);
  console.log("Request Headers:", req.headers);
  next();
});

await db.execute(`
    CREATE TABLE IF NOT EXISTS userData(
    id TEXT PRIMARY KEY ,
    userName TEXT,
    userPassword TEXT
    )`)
    
  await db.execute(`
    CREATE TABLE IF NOT EXISTS task(
    taskName TEXT,
    taskStatus TEXT,
    taskRelevance TEXT,
    taskStartDate DATE
    )`)


app.get("/getData", (req, res) =>{
  res.status(200).json({url:"./"})
})


// -----------------------------------------login.JSX------------------------------------------------

let userName = ''
app.post("/submit", async (req, res) => {
  const user = req.body.user;
  userName = req.body.user.userName;
  const userPassword = req.body.user.userPassword;
  

  if (user.userName == '' || user.userPassword == ''){
  res.status(400).json({message:"Please enter a User Value"})
  userLogIn = false
  } else{
    const checkUserExist = await db.execute({
      sql:`SELECT * FROM userData
          WHERE userName = :userName;`,
      args:{userName}
    })

    if (checkUserExist.rows != ''){
      const checkPassword = await db.execute({
        sql:`SELECT * FROM userData
            WHERE userPassword = :userPassword;`,
        args:{userPassword}
      })
      if(checkPassword.rows != ''){
        res.status(200).json({message:"Succesufl Log in"})
        userLogIn = true
      } else {
        res.status(400).json({message:"Incorrect password"})
        userLogIn = false
      }
    }  else {
      res.status(400).json({message:"User Not registered"})
      userLogIn = false
    }
  }
})

app.post("/createUser", cors({
  origin: "https://lucastaskapp.netlify.app",
  methods: ["POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
}),  async (req, res) => {
  const user = req.body.user;
  userName = req.body.user.userName;
  const userPassword = req.body.user.userPassword;
  const id = crypto.randomUUID()
  console.log(id)
  // console.log(user)
  try{

    if (user.userName == '' || user.userPassword == ''){
    res.status(400).json({message:"Please enter a User Value"})
    } else{
      const checkUserExist = await db.execute({
        sql:`SELECT * FROM userData
            WHERE userName = :userName;`,
        args:{userName}
      })
  
      if (checkUserExist.rows == ''){
      res.status(200).json({message:"Succesfull user Created"})
      userLogIn = true
  
        await db.execute({
          sql:`INSERT INTO userData 
            (id, userName, userPassword)
            VALUES (:id ,:userName, :userPassword)`,
          args:{id, userName, userPassword}
        })
      } else{
        res.status(400).json({message:"User already created"})
      }
  
    }
  } catch(err){
    res.status(400).json({message:err})
    console.log(err)
  }

})



// -----------------------------------------Main.JSX------------------------------------------------


app.get("/logOff", async (req, res) =>{
  res.status(200).json({message:"Log Off"})
  userLogIn = false  
})

app.get("/userName", async (req, res) =>{
  if (userLogIn){

    const getUserName = await db.execute({
      sql: `SELECT userName FROM userData WHERE userName = :userName`,
      args: {userName}
    })
    res.status(200).json(getUserName.rows)
    console.log(getUserName)
  }
   else{
    res.status(400).json({message:"User not logged"})

  }
})


app.get("/getTasks", async (req, res) =>{
  if (userLogIn){
    const allTasks = await db.execute(`SELECT * FROM task`)
    res.json(allTasks.rows)
    // console.log(allTasks)
  }
})


app.post("/changeTaskName", async (req, res) => {
  const body = req.body
  const id = req.body.id
  const updatedTaskName = req.body.taskName

  console.log(id)
  console.log(updatedTaskName)

  try{
    const changeTaskName = await db.execute({
      sql: `UPDATE task SET taskName = :updatedTaskName WHERE id = :id`,
      args: {updatedTaskName, id}
    })
    res.status(200).json({message:'Task Name has been updated'})
  } catch(e){
    res.status(400).json({message:'Task Name has not been updated'})
    console.log(e)
  }
  
})


app.post("/changeStatus", async (req, res) => {
  const id = req.body.id
  const updatedTaskStatus = req.body.taskStatus
  console.log(id)
  console.log(updatedTaskStatus)

  try{
    const changeTaskStatus = await db.execute({
      sql: `UPDATE task SET taskStatus = :updatedTaskStatus WHERE id = :id`,
      args: {updatedTaskStatus, id}
    })
    res.status(200).json({message:'Status has been updated'})
  } catch(e){
    res.status(400).json({message:'Status has not been updated'})
    console.log(e)
  }
  
})


app.post("/changeDate", async (req, res) => {
  const id = req.body.id
  const updatedTaskDate = req.body.taskDate
  console.log(id)
  console.log(updatedTaskDate)

  try{
    const changeTaskDate = await db.execute({
      sql: `UPDATE task SET taskStartDate = :updatedTaskDate WHERE id = :id`,
      args: {updatedTaskDate, id}
    })
    res.status(200).json({message:'Date has been updated'})
  } catch(e){
    res.status(400).json({message:'Date has not been updated'})
    console.log(e)
  }
  
})





app.post("/changeRelevance", async (req, res) => {
  const body = req.body
  const id = req.body.id
  const updatedTaskRelevance = req.body.taskRelevance

  try{
    const changeTaskRelevance = await db.execute({
      sql: `UPDATE task SET taskRelevance = :updatedTaskRelevance WHERE id = :id`,
      args: {updatedTaskRelevance, id}
    })
    res.status(200).json({message:'Relevance has been updated'})
  } catch(e){
    res.status(400).json({message:'Relevance has not been updated'})
    console.log(e)
  }
  
})


app.post("/newTask", async (req, res) => {
  const body = req.body
  console.log('This is the body', body)

  const newTaskName = req.body.newTask.taskName
  const newTaskStatus = req.body.newTask.taskStatus
  const newTaskRelevance = req.body.newTask.taskRelevance

  try{
    const createNewTask = await db.execute({
      sql: `INSERT INTO task (taskName, taskStatus, taskRelevance) VALUES (:newTaskName, :newTaskStatus, :newTaskRelevance) `,
      args: { newTaskName, newTaskStatus, newTaskRelevance }
    })
    res.status(200).json({message:'New Task has been created'})
  } catch(e){
    res.status(400).json({message:'New Task has not been created'})
    console.log(e)
  }
  
})



app.post("/deleteTask", async (req, res) => {
  
  const id = req.body.id
  

  console.log(id)
  

  try{
    const deteleTask = await db.execute({
      sql: `DELETE FROM task WHERE id = :id`,
      args: {id}
    })
    res.status(200).json({message:'Task has been deleted'})
  } catch(e){
    res.status(400).json({message:'Task not been deleted'})
    console.log(e)
  }
  
})



// ----------------------------------------PORT------------------------------------------------



app.listen(port, ()=>{
  console.log(`Listening on port: ${port}`)

})




