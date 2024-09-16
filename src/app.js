import express, { json } from 'express'
import { router } from "./router/Game.router.js"
import cors from 'cors'
const app = express()


app.use(cors())
app.use(json({limit:'20kb'}))
app.use("/api/v1",router)
app.get("/u",(req,res)=>{
    res.send("hello")
})



export {app}