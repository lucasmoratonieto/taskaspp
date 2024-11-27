import express from 'express'
import cors from 'cors'
import { createClient } from "@libsql/client";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
const app = express()



app.use(cors());


app.use(express.json())
app.use(express.static('public'))

dotenv.config()

let userLogIn = false

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

const port = process.env.PORT
// const port = 3500


await db.execute(`
    CREATE TABLE IF NOT EXISTS userData(
    id TEXT PRIMARY KEY ,
    userName TEXT,
    userPassword TEXT
    )`)

await db.execute(`
    CREATE TABLE IF NOT EXISTS task(
    subjectId TEXT ,
    taskId INTEGER PRIMARY KEY AUTOINCREMENT,
    taskName TEXT,
    taskStatus TEXT,
    taskRelevance TEXT,
    taskStartDate DATE
    )`)


app.get("/getData", (req, res) => {
  res.status(200).json({ url: "./" })
})


// -----------------------------------------login.JSX------------------------------------------------

let userName = ''
let subjectId;
app.post("/submit", async (req, res) => {
  const user = req.body.user;
  userName = req.body.user.userName;
  const userPassword = req.body.user.userPassword;
  if (user.userName === '' || user.userPassword === '') {
    res.status(400).json({ message: "Please enter a User Value" })
    userLogIn = false
  } else {
    const checkUserExist = await db.execute({
      sql: `SELECT * FROM userData
          WHERE userName = :userName;`,
      args: { userName }
    })

    if (checkUserExist.rows != '') {
      const checkPassword = await db.execute({
        sql: `SELECT * FROM userData
            WHERE userPassword = :userPassword;`,
        args: { userPassword }
      })
      if (checkPassword.rows != '') {
        res.status(200).json({ message: "Succesufl Log in" })
        userLogIn = true
        let idRow = await db.execute({
          sql: `SELECT id FROM userData
                WHERE userName = :userName;`,
          args: { userName }
        })
        subjectId = idRow.rows[0].id
        return subjectId
      } else {
        res.status(400).json({ message: "Incorrect password" })
        userLogIn = false
      }
    } else {
      res.status(400).json({ message: "User Not registered" })
      userLogIn = false
    }
  }
})


app.post("/createUser", async (req, res) => {
  userName = req.body.user.userName;
  const userPassword = req.body.user.userPassword;
  subjectId = uuidv4()

  if (userName == '' || userPassword == '') {
    res.status(400).json({ message: "Please enter a User Value" })
  } else {
    const checkUserExist = await db.execute({
      sql: `SELECT * FROM userData
            WHERE userName = :userName;`,
      args: { userName }
    })

    if (checkUserExist.rows == '') {

      userLogIn = true
      await db.execute({
        sql: `INSERT INTO userData 
              (id, userName, userPassword)
              VALUES (:subjectId ,:userName, :userPassword)`,
        args: { subjectId, userName, userPassword }
      })
      res.status(200).json({ message: "User created" })

    } else {
      res.status(400).json({ message: "User already created" })
      // console.log('user alerady created')
    }

  }
  // console.log('User not created')


})



// -----------------------------------------Main.JSX------------------------------------------------


app.get("/:userName/logOff", async (req, res) => {
  res.status(200).json({ message: "Log Off" })
  userLogIn = false
})

app.get("/userName", async (req, res) => {

  if (userLogIn) {
    const getUserName = await db.execute({
      sql: `SELECT userName FROM userData WHERE userName = :userName`,
      args: { userName }
    })
    res.status(200).json(getUserName.rows)
    // console.log(getUserName)
  }
  else {
    res.status(400).json({ message: "User not logged" })

  }
})

app.get('/:userName/getTasks', async (req, res) => {
  if (userLogIn) {
    const allTasks = await db.execute({
      sql: `SELECT * FROM task WHERE subjectId = :subjectId`,
      args: { subjectId }
    })
    res.json(allTasks.rows)
    // console.log(allTasks)
  }
})


app.post("/:userName/changeTaskName", async (req, res) => {
  const body = req.body
  const taskId = req.body.id
  const updatedTaskName = req.body.taskName


  console.log(updatedTaskName)

  try {
    const changeTaskName = await db.execute({
      sql: `UPDATE task SET taskName = :updatedTaskName WHERE taskId = :taskId`,
      args: { updatedTaskName, taskId }
    })
    res.status(200).json({ message: 'Task Name has been updated' })
  } catch (e) {
    res.status(400).json({ message: 'Task Name has not been updated' })
    // console.log(e)
  }

})


app.post("/:userName/changeStatus", async (req, res) => {
  const id = req.body.id
  console.log(id)
  const updatedTaskStatus = req.body.taskStatus
  console.log('id', id)
  console.log('status', updatedTaskStatus)

  try {
    await db.execute({
      sql: `UPDATE task SET taskStatus = :updatedTaskStatus WHERE taskId = :id`,
      args: { updatedTaskStatus, id }
    })
    res.status(200).json({ message: 'Status has been updated' })
  } catch (e) {
    res.status(400).json({ message: 'Status has not been updated' })
    // console.log(e)
  }

})


app.post("/:userName/changeDate", async (req, res) => {
  const id = req.body.id
  const newDate = new Date(req.body.taskDate)
  console.log(id)
  console.log(typeof (newDate))
  const formattedDate = newDate.toLocaleDateString('es-ES', {
    year: 'numeric',   // Años como '2023'
    month: '2-digit',   // Mes como '02' (mes con ceros a la izquierda)
    day: '2-digit'      // Día como '01' (día con ceros a la izquierda)
  });
  console.log(formattedDate);
  // console.log(newDate.toLocaleDateString());
  const todayDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',   // Años como '2023'
    month: '2-digit',   // Mes como '02' (mes con ceros a la izquierda)
    day: '2-digit'      // Día como '01' (día con ceros a la izquierda)
  });
  console.log('Today', todayDate)
  if (formattedDate > todayDate) {
    res.status(400).json({ message: 'Start Date cannot be set in future' })

  } else {
    try {
      await db.execute({
        sql: `UPDATE task SET taskStartDate = :formattedDate WHERE taskId = :id`,
        args: { formattedDate, id }
      })
      res.status(200).json({ message: 'Date has been updated' })
    } catch (e) {
      res.status(400).json({ message: 'Date has not been updated' })
      // console.log(e)
    }
  }

})





app.post("/:userName/changeRelevance", async (req, res) => {
  const body = req.body
  const id = req.body.id
  const updatedTaskRelevance = req.body.taskRelevance

  try {
    const changeTaskRelevance = await db.execute({
      sql: `UPDATE task SET taskRelevance = :updatedTaskRelevance WHERE taskId = :id`,
      args: { updatedTaskRelevance, id }
    })
    res.status(200).json({ message: 'Relevance has been updated' })
  } catch (e) {
    res.status(400).json({ message: 'Relevance has not been updated' })
    // console.log(e)
  }

})


app.post("/:userName/newTask", async (req, res) => {
  const body = req.body
  console.log('This is the body', body)

  const newTaskName = req.body.newTask.taskName
  const newTaskStatus = req.body.newTask.taskStatus
  const newTaskRelevance = req.body.newTask.taskRelevance

  try {
    const createNewTask = await db.execute({
      sql: `INSERT INTO task (subjectId, taskName, taskStatus, taskRelevance) VALUES (:subjectId, :newTaskName, :newTaskStatus, :newTaskRelevance) `,
      args: { subjectId, newTaskName, newTaskStatus, newTaskRelevance }
    })
    res.status(200).json({ message: 'New Task has been created' })

  } catch (e) {
    res.status(400).json({ message: 'New Task has not been created' })
    console.log(e)
  }

})



app.post("/:userName/deleteTask", async (req, res) => {

  const id = req.body.id
  try {
    const deteleTask = await db.execute({
      sql: `DELETE FROM task WHERE taskId = :id`,
      args: { id }
    })
    res.status(200).json({ message: 'Task has been deleted' })
  } catch (e) {
    res.status(400).json({ message: 'Task not been deleted' })
    // console.log(e)
  }

})



// ----------------------------------------PORT------------------------------------------------



app.listen(port, () => {
  console.log(`Listening on port: ${port}`)

})




