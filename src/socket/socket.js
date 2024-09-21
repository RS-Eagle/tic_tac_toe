import { app } from '../app.js'
import http from 'http'
import { Server } from 'socket.io'


const server = http.createServer(app)

const io =  new Server(server,
    {
        cors: {
            origin: ["https://famous-yeot-a0f918.netlify.app"],
            methods: ["GET", "POST"], 
        },
})

const userConnected = {}

export const getUserStatus = (id)=>{
    return userConnected[id]
}


io.on("connection",(socket)=>{
    console.log("New Connection",socket.id,socket.handshake.query.userid)
    const {userid} = socket.handshake.query
    if(userid != undefined){
        userConnected[userid] = socket.id
    }
    

    socket.on("disconnect",()=>{
        console.log("Disconnected",userid)
        delete userConnected[userid]
    })
})




export{app,server,io}



