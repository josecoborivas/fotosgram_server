import { Schema, model, Document } from 'mongoose';

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required : [ true, 'El nombre es obligatorio']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El email es obligatorio']
    },
    password: {
        type: String,
        required: [ true, 'La password es obligatoria']
    }
});

interface IUsuario extends Document {
    nombre: string;
    avatar?: string;
    email: string;
    password: string;
}

export const Usuario = model<IUsuario>('Usuario', usuarioSchema);