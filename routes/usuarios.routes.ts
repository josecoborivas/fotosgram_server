import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificarToken } from '../middlewares/autenticacion';


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
            const userToken = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });

            return res.json({
                ok: true,
                token: userToken,
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

    Usuario.create( user ).then( userDB => {
        const userToken = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        
        return res.json({
            ok: true,
            token: userToken,
            user: userDB
        });
       
    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });
    
    
});


//Update
usuariosRoutes.post('/update', verificarToken,  (req: any, res: Response) =>{

    const user = {
        nombre   : req.body.nombre || req.usuario.nombre,
        email    : req.body.email || req.usuario.email,
        avatar   : req.body.avatar || req.usuario.avatar
    };

    Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (error, userDB) => {
        if(error) throw error;

        if(!userDB) {
            res.json({
                ok: false,
                mensaje: 'No existe el usuario con ese ID'
            });
        } else {

            const userToken = Token.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            
            return res.json({
                ok: true,
                token: userToken,
                user: userDB
            });
        }
    });
});

usuariosRoutes.get('/', [verificarToken], (req: any, res: Response) => {
        const usuario = req.usuario;

        res.json({
            ok: true,
            usuario
        });
});

export default usuariosRoutes;