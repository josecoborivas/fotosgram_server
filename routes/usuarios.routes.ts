import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';


const usuariosRoutes = Router();


//Login 
usuariosRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, (error, userDB) => {
        if(error) throw error;

        if(!userDB){
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña incorrectos'
            });
        }

        if(userDB.passwordCompare(body.password)) {
            return res.json({
                ok: true,
                token: 'FDSABFDHTERTDSBFGJTUTYSGFDS',
                user: userDB
            });
        } else {
            return res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña incorrectos ****'
            });
        }

    });
});




//Crear un usuario
usuariosRoutes.post('/create', (req: Request, res: Response) => {
    
    const user = {
        nombre   : req.body.nombre,
        email    : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10),
        avatar   : req.body.avatar
    };

    Usuario.create( user ).then( userDb => {
        res.json({
            ok: true,
            user: userDb
        });
    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });
    
    
});

export default usuariosRoutes;