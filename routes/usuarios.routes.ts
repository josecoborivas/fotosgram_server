import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';


const usuariosRoutes = Router();


//Login 
usuariosRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, (error, userDb) => {
        if(error) throw error;
        
        if(!userDb){
        return res.json({
            ok: false,
            mensaje: 'Usuario/Contraseña incorrectos'
        });
        }

        
        if(userDb.passwordCompare(body.password)) {
            const userToken = Token.getJwtToken({
                _id: userDb._id,
                nombre: userDb.nombre,
                email: userDb.email,
                avatar: userDb.avatar
            });

            return res.json({
                ok: true,
                token: userToken,
                user: userDb
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
        const userToken = Token.getJwtToken({
            _id: userDb._id,
            nombre: userDb.nombre,
            email: userDb.email,
            avatar: userDb.avatar
        });
        
        return res.json({
            ok: true,
            token: userToken,
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