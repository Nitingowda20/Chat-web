import { WebSocketServer } from "ws";
import express from "express";
import path from "path"
import { fileURLToPath } from "url";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4545;

const server = app.listen(port, () => {
  console.log(`Server is running.. on port ${port}`);
});
 
app.use(express.static(path.join(__dirname , "public")))

// const wss = new WebSocketServer({ server });
const io = new Server(server);

let socketConnected = new Set()

io.on("connection",onConnected)

function onConnected(socket){
    console.log(socket.id);
    socketConnected.add(socket.id)

    io.emit('clients-total' , socketConnected.size)

    socket.on("disconnect" , ()=>{
        console.log("Socket disconnected : ", socket.id);
        socketConnected.delete(socket.id)
        io.emit("clients-total", socketConnected.size);
    })

    socket.on('message' , (data)=>{
        console.log(data);
        socket.broadcast.emit('chat-message' , data)
    })

    socket.on("feedback" , (data)=>{
        socket.broadcast.emit("feedback", data);
    });
}

