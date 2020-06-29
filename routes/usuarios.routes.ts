import { Router, Request, Response } from "express";
import { Usuario } from '../models/usuario.model';


const usuariosRoutes = Router();

usuariosRoutes.post('/create', (req: Request, res: Response) => {
    
    const user = {
        nombre   : req.body.nombre,
        email    : req.body.email,
        password : req.body.password,
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