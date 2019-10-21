import {Router, Response, Request} from 'express';
import { verificatoken } from '../middlewares/autenticacion';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/file-upload';
import FileSystem from '../clases/file-system';


const fileSystem = new FileSystem();
const postRoutes = Router();

//obtener post paginado
postRoutes.get('/', async(req: any, res: Response)=>{

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina -1;
    skip = skip *10;

    const posts =  await Post.find()
                             .sort({_id:-1})
                             .skip(skip)
                             .limit(10)
                             .populate('usuario', '-password')
                            .exec();
    res.json({
        ok:true,
        pagina,
        posts
        
    });
});


//crear post
postRoutes.post('/', [verificatoken],(req: any, res: Response)=>{
        
        const body = req.body;
        body.usuario = req.usuario._id;

        const imagenes = fileSystem.imagenesDeTempHaciaPost(req.usuario._id);
        body.imgs = imagenes;

        Post.create( body).then( async postDB => {

           await postDB.populate('usuario', '-password').execPopulate()

            res.json({
                ok:true,
                post: postDB
            });
    
        }).catch( err=> {
            res.json(err);
        });

});

//servicio para subir achivos

postRoutes.post('/upload', [verificatoken],async (req: any, res: Response)=>{

        if(!req.files){
            return res.status(400).json({
                    ok: false,
                    mensaje: 'No se recibio ningun archivo'
            });
        }
        const file: FileUpload = req.files.image;
        
        if(!file){
            return res.status(400).json({
                    ok: false,
                    mensaje: 'No subio ningun archivo -image'
            });
        }
        if(!file.mimetype.includes('image')){
            return res.status(400).json({
                    ok: false,
                    mensaje: 'Lo que sibio no es imagen'
            });
        }
        
   await fileSystem.guardarImangenTemporal(file, req.usuario._id);

        res.json({
            ok: true,
            file: file.mimetype
        });

});

postRoutes.get('/imagen/:userid/:img',(req:any, res: Response) => {

    const userId = req.params.userid;
    const img = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img);

    res.sendFile(pathFoto);

});



export default postRoutes;