import { Router, Response } from 'express'
import { verificarToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';

const postRouter = Router();

postRouter.post('/', [verificarToken], (req: any, res: Response)=> {

    const body = req.body;
    body.usuario = req.usuario._id;

    Post.create(body).then( async postDB => {

        await postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        });
    }).catch(error => {
        res.json(error);
    });

});









export default postRouter;