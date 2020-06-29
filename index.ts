import Server from './classes/server';

const server = new Server();

//Levantar server
server.start(() => {
    console.log(`Servidor corriento en puerto: ${server.port}`);
})
