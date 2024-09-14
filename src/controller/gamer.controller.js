import { createGame, games } from "../gameData/gameData.js"
import { getUserStatus, io } from "../socket/socket.js"
import { users } from "../UsersData/UsersData.js"


const createUSerId = ()=>{
    const userid = Math.floor(1000 + Math.random() * 9000)
    
    if(users.includes(userid)){
        createUSerId()
    }
    return userid
}

const createRoom = async(req,res)=>{
    console.log("Room")
    const {username} = req.body 
    const userid = createUSerId()
    const createNewGame = await createGame(userid,username)
    res.status(200).json({message:"Room Created",gameData:createNewGame})

}

const joinRoom = async(req,res)=>{
    const {gameId,username} =req.body
    const userid = createUSerId()
    if(!games.hasOwnProperty(gameId)){
        return res.status(401).json({message:"Invalid Or Expired Room Id"})
    }
    if(games[gameId].gameStart){
        return res.status(401).json({message:"Invalid Or Expired Room Id"})
    }
    const roomData = await games[gameId].initGame(userid,username)
    const {winner,turn,box,firstWeapon,secondWeapon} = roomData
    return res.status(200).json({winner,turn,box,firstWeapon,secondWeapon,userid})


}

const inputHandler = async(req,res)=>{
    const {inputid,pos,gameId} = req.body
    if(!inputid || !pos){
        return res.status(404).json({message:"Inputs Are Required"})
    }
    if(!games.hasOwnProperty(gameId)){
        return res.status(401).json({message:"Invalid Or Expired Room"})
    }
    const userGame = games[gameId]
    const firstPlayer = userGame.userid
    const secondPlayer  = userGame.oppoid
    const socketid = getUserStatus(firstPlayer)
    const socketid2 = getUserStatus(secondPlayer)
    let Data = null

    if(!socketid || !socketid2){
        return res.status(404).json({message:"Slow Internet Connection"})
    }
    if(inputid == firstPlayer && userGame.turn == userGame.firstWeapon){

       Data= userGame.inputs(inputid,userGame.firstWeapon,pos)
    }else{

       Data= userGame.inputs(inputid,userGame.secondWeapon,pos)
    }

    const {winner,turn,box,firstWeapon,secondWeapon} = games[gameId]

    if(Data === true){
    io.to(socketid).emit("gameData",{winner,turn,box,firstWeapon,secondWeapon});
    io.to(socketid2).emit("gameData",{winner,turn,box,firstWeapon,secondWeapon});
    }

    res.status(200).json(Data)
}

export{createRoom,joinRoom,inputHandler}