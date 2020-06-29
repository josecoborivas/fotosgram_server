import Server from './classes/server';
import usuariosRoutes from './routes/usuarios.routes';

const server = new Server();

//Rutas de mi App
server.app.use('/user/', usuariosRoutes);

//Levantar server
server.start(() => {
    console.log(`Servidor corriento en puerto: ${server.port}`);
})
