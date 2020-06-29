import {Request, Response, NextFunction } from 'express';
import Token from '../classes/token';

export const verificarToken = (req: any, res: Response, next: NextFunction) => {
    const userToken = req.get('x-token') || '';

    Token.tokenCompare( userToken ).then( (decode: any) => {
        console.log('Decode: ', decode);
        req.usuario = decode.usuario;
        next();
    }).catch(error => {
        res.json({
            ok: false,
            mensaje: 'Token invalido'
        });
    });
}