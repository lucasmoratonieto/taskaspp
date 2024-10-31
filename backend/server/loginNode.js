import express from 'express'
import cors from 'cors'
// import { createClient } from "@libsql/client";
// import dotenv from 'dotenv';

// dotenv.config()

// const db = createClient({
//   url: process.env.DB_URL,
//   authToken: process.env.DB_TOKEN
// })

const app = express()
const port = process.env.PORT ?? 3000

app.use(express.static('public'))
app.use(cors())

app.get("/getData", (req, res) =>{
  res.send("Hello")
})

app.listen(port, ()=>{
  console.log(`Listening on port: http://localhost:${port}`)
})