import Server from "./clases/server";

require('.clases/config/config');

import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import fileUpload from 'express-fileupload';
//rutas de mi app
import postRoutes from './routes/post';
import userRoutes from "./routes/usuario";
//import userRoutes from "./routes/usuario";





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
mongoose.connect(process.env.URLDB, 
   { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true},
    (err, res) => {
   if (err) throw err;

   console.log(' Base de datos Online');

});

   server.app.listen(process.env.PORT, () => {
   console.log('escuchando puerto:', process.env.PORT);
});