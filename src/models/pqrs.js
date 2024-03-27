import { model, Schema } from 'mongoose'
import mongoose from 'mongoose';


const PqrsSchema = Schema({
  anioModelo: String,
  anonimo: {
    type: Boolean,
    default: false
  },
  apellidos: String,
  archivos: String, // Suponiendo que los archivos son nombres de archivo almacenados como strings
  asunto: String,
  autorizacion: {
    type: Boolean,
    default: false
  },
  barrio: String,
  celular: String,
  ciudad: String,
  ciudadveh: String,
  correo: String,
  departamento: String,
  descripcion: String,
  direccion: String,
  linea: String,
  marca: String,
  nombres: String,
  placa: String,
  sede: String,
  telefono: String,
  tipoId: String,
  tipoSolicitud: String,
  valcorreo: String,
  vehAdquirido: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  numeroSolicitud: {
    type: Number,
    unique: true
  },
  status: {
    type: String,
    default: 'Pendiente'
  }

})

export const Pqrs = mongoose.models.Pqrs || model('Pqrs', PqrsSchema)