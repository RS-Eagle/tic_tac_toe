import { nanoid } from "nanoid";

const games = {

}




class Game{
    constructor(userid,username,gameId){
        this.userid = userid
        this.username = username
        this.oppoid = undefined
        this.winner = false
        this.roomOwner = userid
        this.turn = true
        this.gameStart =false
        this.oppoUsername = undefined
        this.box = ["","","","","","","","",""]
        this.combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2,4, 6]]
        this.gameId = gameId
        this.firstWeapon = "X"
        this.secondWeapon = "O"
        this.timeoutID = null;
        this.winningCombo = null
        this.winnerid = null
    }

    deleteSelf(games, delay) {
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
        this.timeoutID = setTimeout(() => {
            delete games[this.gameId];
        }, delay);
    }
    keepAlive(games, delay) {
        this.deleteSelf(games, delay);
    }

    initGame(oppoid,oppoUsername){
        this.oppoid =oppoid
        this.oppoUsername = oppoUsername
        this.turn = Math.random() >= 0.5 ? "X":"O"
        this.gameStart =true
        this.firstWeapon = Math.random() >= 0.5 ? "X":"O"
        this.secondWeapon = this.firstWeapon == "X"?"O":"X"
        this.deleteSelf(games,300000)
        return games[this.gameId]
    }

    inputs(inputid,input,pos){

        if(this.turn == this.firstWeapon && inputid == this.userid){
            if(this.box[pos] == ""){
                this.box[pos] = input
                this.turn = this.turn == "X"?"O":"X"
                this.checkWinner()
                return true
            }else{
                return "Click On Empty Box"
            }
        }
        if(this.turn == this.secondWeapon && inputid == this.oppoid){
            if(this.box[pos] == ""){
                this.turn = this.turn == "X"?"O":"X"
                this.box[pos] = input
                this.checkWinner()
                return true
            }else{
                return "Click On Empty Box"
            }
        }
        this.keepAlive(games, 300000)
        
        return "Not Your Turn"
    }
    
    checkWinner(){
        for(let combination of this.combinations){
            let [a,b,c]  = combination
            if(this.box[a] && this.box[a] == this.box[b]&& this.box[a] == this.box[c]){
                if(this.box[a]== this.firstWeapon){
                    this.winner = true
                    this.winningCombo = [a,b,c]
                    this.winnerid =  this.username + "Is Winner"
                }else{
                    this.winner = true
                    this.winningCombo = [a,b,c]
                    this.winnerid =  this.oppoUsername + "Is Winner"
                }
            }
        }
        if(!this.box.includes("")){
            this.winner = true
            this.winnerid =  "Draw"
            this.winnerid =  "Draw"
        }
    }
    
}

const randomRoomId = ()=>{
    let id = Math.floor(1000 + Math.random() * 9000)
    
    if(Object.keys(games).includes(id.toString())){
            randomRoomId()
    }
    
    return id
}

const createGame = async(userid,username)=>{

    for(let i in games){
        if(games[i].userid == userid ||games[i].oppoid == userid){
            return "try After Some Time"
        }
    }
    let gameId = randomRoomId()
    const newgame = new Game(userid,username,gameId)
    games[gameId] = newgame
    return {gameId, userid}
}





export {games,createGame}


