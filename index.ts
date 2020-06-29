import Server from './classes/server';
import usuariosRoutes from './routes/usuarios.routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server();


//MIDLEWARES


//Body Parser
server.app.use( bodyParser.urlencoded({ extended: true}));
server.app.use( bodyParser.json());


//Rutas de mi App
server.app.use('/user/', usuariosRoutes);

//Conectar Base de Datos Mongo
mongoose.connect('mongodb://localhost:27017/fotosgram', { useNewUrlParser: true, useCreateIndex: true }, err => {
    if(err) throw err;

    console.log('BASE DE DATOS ONLINE!');
});

//Levantar server
server.start(() => {
    console.log(`Servidor corriento en puerto: ${server.port}`);
})
