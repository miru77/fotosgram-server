import Server from "./clases/server";
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import fileUpload from 'express-fileupload';
//rutas de mi app
import postRoutes from './routes/post';
import userRoutes from "./routes/usuario";


const server = new Server();

// Body PArser
server.app.use( bodyParser.urlencoded({extended: true}));
server.app.use(bodyParser.json());

//FileUpload
server.app.use(fileUpload({useTempFiles: true}));

//confugurar Cords
server.app.use(cors({origin: true, credentials: true}));

//rutas de mi app
server.app.use('/user',userRoutes);
server.app.use('/posts',postRoutes);


// Conectar DB
mongoose.connect('mongodb://localhost:27017/fotosgram',
 { useNewUrlParser: true, useCreateIndex: true },(err)=> {
     
    if (err) throw err;

    console.log('Base de datos ONLINE');
 })
//levantar express

server.start();