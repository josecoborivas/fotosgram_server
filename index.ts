import Server from './classes/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import usuariosRoutes from './routes/usuarios.routes';
import postRouter from './routes/post.routes';

const server = new Server();


//MIDDLEWARES


//Body Parser
server.app.use( bodyParser.urlencoded({ extended: true}));
server.app.use( bodyParser.json());

//FileUpload
server.app.use( fileUpload({ useTempFiles: true}));


//Rutas de mi App
server.app.use('/user/', usuariosRoutes);

server.app.use('/post/', postRouter);

//Conectar Base de Datos Mongo
mongoose.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, err => {
    if(err) throw err;

    console.log('BASE DE DATOS ONLINE!');
});

//Levantar server
server.start(() => {
    console.log(`Servidor corriento en puerto: ${server.port}`);
})
