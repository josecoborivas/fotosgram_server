import jwt from 'jsonwebtoken';


export default class Token {
    private static seed: string = 'este_es_mi_seed_para_la_app_fotosgram';
    private static caducidad: string = '1h';

    constructor(){ }

    static getJwtToken( payload: any): string {
        return jwt.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad});
    }

    static tokenCompare( userToken: string) {

        return new Promise( (resolve, reject) => {
            jwt.verify(userToken, this.seed, (error, decode) => {
                if(error) {
                    //no confiar
                    reject();
                } else {
                    resolve(decode);
                }
            });
        });

    }

}