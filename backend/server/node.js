import express from 'express'
import cors from 'cors'
import { createClient } from "@libsql/client";

import dotenv from 'dotenv';
dotenv.config()


const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

const app = express()
app.use(express.json())
app.use(express.static('public'))
app.use(cors())

const port = process.env.PORT ?? 3500

await db.execute(`
    CREATE TABLE IF NOT EXISTS userData(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userName TEXT,
    userPassword TEXT
    )`)

app.get("/getData", (req, res) =>{
  // res.status(200).json({hola:"lucas"})
})

app.post("/getData", async (req, res) => {
  const user = req.body.user;
  const userName = req.body.user.userName;
  const userPassword = req.body.user.userPassword;
  // console.log(user)

  if (user.userName == '' || user.userPassword == ''){
  res.status(400).json({message:"Please enter a User Value"})
  } else{
    const checkUserExist = await db.execute({
      sql:`SELECT * FROM userData
          WHERE userName = :userName;`,
      args:{userName}
    }
    )

    console.log(checkUserExist.rows)

    if (checkUserExist.rows == ''){
    res.status(200).json({message:"Succesfull user Created"})

      await db.execute({
        sql:`INSERT INTO userData 
          (userName, userPassword)
          VALUES (:userName, :userPassword)`,
        args:{userName, userPassword}
      })
    } else{
      res.status(200).json({message:"Succesufl Log in"})
    }

  }

})

app.listen(port, ()=>{
  console.log(`Listening on port: http://localhost:${port}`)
})