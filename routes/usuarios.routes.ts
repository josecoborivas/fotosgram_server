import { Router, Request, Response } from "express";


const usuariosRoutes = Router();

usuariosRoutes.get('/prueba', (req: Request, res: Response) => {
    res.json({
        ok: true,
        mensaje: 'Todo funciona Ok!'
    });
});

export default usuariosRoutes;