import { FileUpload } from '../interfaces/file-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';


export default class FileSystem {

    constructor(){ }

    guardarImagenTemporal(file: FileUpload, userId: string){

        return new Promise( (resolve, reject) => {
            //Crear carpetas
            const path = this.crearCarpetaUsuario(userId);
    
            //Crear nombre de archivo
            const nombreArchivo = this.generarNombreUnico(file.name);
            console.log(file.name);
            console.log(nombreArchivo);
    
            //Mover el archivo del Temp a nuestra carpeta
            file.mv(`${path}/${nombreArchivo}`, (error: any) => {
                if(error){
                    //no se pudo mover
                    reject(error);
                } else {
                    //archivo movido exitosamente!
                    resolve();
                }
            });
        });
    }

    private generarNombreUnico(nombreOriginal: string){
        const nombreArray = nombreOriginal.split(',');
        const extension = nombreArray[nombreArray.length -1];

        const idUnico = uniqid();

         return `${idUnico}.${extension}`;
    }

    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve( __dirname, '../uploads/', userId );
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync(pathUser);

        if(!existe){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    private obtenerImagenesTemp(userId: string){
        const pathUserTemp = path.resolve( __dirname, '../uploads/', userId, 'temp' );
        return fs.readdirSync(pathUserTemp) || [];
    }

    imagenesDeTempHaciaPost(userId: string){
        const pathUserTemp = path.resolve( __dirname, '../uploads/', userId, 'temp' );
        const pathUserPosts = path.resolve( __dirname, '../uploads/', userId, 'posts' );

        if(!fs.existsSync(pathUserTemp)){
            return [];
        }

        if(!fs.existsSync(pathUserPosts)){
            fs.mkdirSync(pathUserPosts);
        }

        const imagenesTemp = this.obtenerImagenesTemp(userId);

        imagenesTemp.forEach(imagen => {
            fs.renameSync(`${pathUserTemp}/${imagen}`, `${pathUserPosts}/${imagen}`);
        });

        return imagenesTemp;
    }

    getImagenUrl(userId: string, img: string) {
        const pathImagen = path.resolve( __dirname, '../uploads/', userId, 'posts', img);

        const existe = fs.existsSync(pathImagen);

        if(!existe) {
            return path.resolve(__dirname, '../assets/400x250.jpg');
        }

        return pathImagen;
    }
}