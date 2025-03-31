
// Tipos de datos para la aplicación

export interface Paciente {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  fechaNacimiento?: string;
  telefono?: string;
  email?: string;
  diagnostico?: string;
  objetivos?: string;
  observaciones?: string;
}

export interface Personal {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
  especialidad?: string;
  cargo?: string;
  fechaContratacion?: string;
}

export interface Caballo {
  id: string;
  nombre: string;
  edad?: number;
  raza?: string;
  color?: string;
  altura?: string;
  peso?: string;
  temperamento?: string;
  entrenamiento?: string;
  historialMedico?: string;
}

export interface Sesion {
  id: string;
  fecha: string;
  hora: string;
  pacienteId: string;
  caballoId: string;
  personalId: string;
  duracion?: string;
  actividades?: string;
  observaciones?: string;
  estado?: "programada" | "completada" | "cancelada";
}

// Información relacionada
export interface SesionDetallada extends Sesion {
  paciente?: {
    nombre: string;
    apellido: string;
  };
  caballo?: {
    nombre: string;
  };
  personal?: {
    nombre: string;
    apellido: string;
  };
}
