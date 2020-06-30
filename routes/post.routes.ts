import { Router, Response } from 'express'
import { verificarToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';

const postRouter = Router();



//Obtener Post por pagina
postRouter.get('/', [verificarToken], async (req: any, res: Response)=> {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip * 10;

    const posts = await Post.find()
                                    .sort({'_id': -1})
                                    .limit(10)
                                    .skip(skip)
                                    .populate('usuario', '-password')
                                    .exec();

    res.json({
        ok: true,
        pagina,
        posts
    });
});



//Crear Post
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