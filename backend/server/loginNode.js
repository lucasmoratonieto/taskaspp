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
app.use(express.json())
const port = process.env.PORT ?? 3000

app.use(express.static('public'))
app.use(cors())

app.get("/getData", (req, res) =>{
  res.status(200).json({hola:"lucas"})
})

app.post("/getData", (req, res) => {
  console.log(req.body)
  res.json({ message: "Hello", receivedData: req.body }); // Envía una respuesta JSON
})

app.listen(port, ()=>{
  console.log(`Listening on port: http://localhost:${port}`)
})