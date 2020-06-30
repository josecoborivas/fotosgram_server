import { Router, Response, Request } from 'express'
import { verificarToken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../classes/file-system';

const postRouter = Router();
const fileSystem = new FileSystem();


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

    const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
    body.imgs = imagenes;


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

//Servicio para subir archivos
postRouter.post('/upload', [verificarToken], async (req: any, res: Response) => {
    if(!req.files) {
        res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

    if(!file){
        res.status(400).json({
            ok: false,
            mensaje: 'No se subio ningun archivo -- image'
        });
    }

    if(!file.mimetype.includes('image')){
        res.status(400).json({
            ok: false,
            mensaje: 'Lo que subio no es una imagen'
        });
    }

    await fileSystem.guardarImagenTemporal(file, req.usuario._id);

    res.json({
        ok: true,
        file: file.mimetype
    });
});

//Obtener una imagen
postRouter.get('/imagen/:userId/:img', (req: any, res: Response) => {
    const userId = req.params.userId;
    const img = req.params.img;

    const pathImagen = fileSystem.getImagenUrl(userId, img);

    res.sendFile(pathImagen);
});







export default postRouter;