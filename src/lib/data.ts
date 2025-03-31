
import { Paciente, Personal, Caballo, Sesion, SesionDetallada } from "./types";

// Datos de ejemplo para pacientes
let pacientes: Paciente[] = [
  {
    id: "p1",
    cedula: "V-12345678",
    nombre: "María",
    apellido: "González",
    fechaNacimiento: "2010-05-15",
    telefono: "0414-1234567",
    email: "maria@ejemplo.com",
    diagnostico: "Trastorno del espectro autista",
    objetivos: "Mejorar coordinación y comunicación",
    observaciones: "Responde bien a actividades estructuradas"
  },
  {
    id: "p2",
    cedula: "V-23456789",
    nombre: "Carlos",
    apellido: "Rodríguez",
    fechaNacimiento: "2008-10-20",
    telefono: "0424-9876543",
    diagnostico: "Parálisis cerebral leve",
    objetivos: "Fortalecer músculos y equilibrio"
  },
  {
    id: "p3",
    cedula: "V-34567890",
    nombre: "Ana",
    apellido: "Martínez",
    fechaNacimiento: "2015-03-08",
    telefono: "0412-4567890",
    email: "ana.martinez@ejemplo.com",
    diagnostico: "Síndrome de Down",
    objetivos: "Desarrollar habilidades sociales"
  }
];

// Datos de ejemplo para personal
let personal: Personal[] = [
  {
    id: "e1",
    cedula: "V-87654321",
    nombre: "Javier",
    apellido: "Méndez",
    telefono: "0416-7654321",
    email: "javier.mendez@ejemplo.com",
    especialidad: "Fisioterapeuta",
    cargo: "Terapeuta principal",
    fechaContratacion: "2020-01-15"
  },
  {
    id: "e2",
    cedula: "V-76543210",
    nombre: "Luisa",
    apellido: "Fernández",
    telefono: "0414-8765432",
    email: "luisa@ejemplo.com",
    especialidad: "Psicóloga",
    cargo: "Terapeuta de apoyo",
    fechaContratacion: "2021-03-01"
  },
  {
    id: "e3",
    cedula: "V-65432109",
    nombre: "Roberto",
    apellido: "Díaz",
    telefono: "0424-5432109",
    email: "roberto@ejemplo.com",
    especialidad: "Entrenador ecuestre",
    cargo: "Cuidador de caballos",
    fechaContratacion: "2019-06-10"
  }
];

// Datos de ejemplo para caballos
let caballos: Caballo[] = [
  {
    id: "c1",
    nombre: "Luna",
    edad: 8,
    raza: "Cuarto de Milla",
    color: "Alazán",
    altura: "1.5 m",
    peso: "450 kg",
    temperamento: "Dócil y tranquila",
    entrenamiento: "Completo para equinoterapia",
    historialMedico: "Vacunas al día"
  },
  {
    id: "c2",
    nombre: "Estrella",
    edad: 10,
    raza: "Appaloosa",
    color: "Moteado blanco y negro",
    altura: "1.48 m",
    peso: "420 kg",
    temperamento: "Paciente y amigable",
    entrenamiento: "Especializado en niños con autismo",
    historialMedico: "Revisión dental reciente"
  },
  {
    id: "c3",
    nombre: "Trueno",
    edad: 7,
    raza: "Criollo",
    color: "Negro",
    altura: "1.52 m",
    peso: "460 kg",
    temperamento: "Enérgico pero obediente",
    entrenamiento: "Básico para equinoterapia",
    historialMedico: "Tratamiento para articulaciones"
  }
];

// Datos de ejemplo para sesiones
let sesiones: Sesion[] = [
  {
    id: "s1",
    fecha: "2023-04-10",
    hora: "09:00",
    pacienteId: "p1",
    caballoId: "c1",
    personalId: "e1",
    duracion: "45 minutos",
    actividades: "Ejercicios de equilibrio y coordinación",
    observaciones: "Progreso notable en postura",
    estado: "completada"
  },
  {
    id: "s2",
    fecha: "2023-04-11",
    hora: "10:00",
    pacienteId: "p2",
    caballoId: "c2",
    personalId: "e2",
    duracion: "30 minutos",
    actividades: "Relajación y contacto con el caballo",
    observaciones: "Ansiedad inicial, luego buena adaptación",
    estado: "completada"
  },
  {
    id: "s3",
    fecha: "2023-04-12",
    hora: "11:00",
    pacienteId: "p3",
    caballoId: "c3",
    personalId: "e3",
    duracion: "40 minutos",
    actividades: "Estimulación sensorial y ejercicios básicos",
    estado: "programada"
  }
];

// Funciones para gestionar pacientes
export const getPacientes = (): Promise<Paciente[]> => {
  return Promise.resolve(pacientes);
};

export const getPaciente = (id: string): Promise<Paciente | undefined> => {
  const paciente = pacientes.find(p => p.id === id);
  return Promise.resolve(paciente);
};

export const crearPaciente = (paciente: Omit<Paciente, "id">): Promise<Paciente> => {
  const id = `p${Date.now()}`;
  const nuevoPaciente = { ...paciente, id };
  pacientes = [...pacientes, nuevoPaciente];
  return Promise.resolve(nuevoPaciente);
};

export const actualizarPaciente = (paciente: Paciente): Promise<Paciente> => {
  pacientes = pacientes.map(p => p.id === paciente.id ? paciente : p);
  return Promise.resolve(paciente);
};

export const eliminarPaciente = (id: string): Promise<void> => {
  pacientes = pacientes.filter(p => p.id !== id);
  return Promise.resolve();
};

// Funciones para gestionar personal
export const getPersonal = (): Promise<Personal[]> => {
  return Promise.resolve(personal);
};

export const getPersonalIndividual = (id: string): Promise<Personal | undefined> => {
  const miembro = personal.find(p => p.id === id);
  return Promise.resolve(miembro);
};

export const crearPersonal = (miembro: Omit<Personal, "id">): Promise<Personal> => {
  const id = `e${Date.now()}`;
  const nuevoMiembro = { ...miembro, id };
  personal = [...personal, nuevoMiembro];
  return Promise.resolve(nuevoMiembro);
};

export const actualizarPersonal = (miembro: Personal): Promise<Personal> => {
  personal = personal.map(p => p.id === miembro.id ? miembro : p);
  return Promise.resolve(miembro);
};

export const eliminarPersonal = (id: string): Promise<void> => {
  personal = personal.filter(p => p.id !== id);
  return Promise.resolve();
};

// Funciones para gestionar caballos
export const getCaballos = (): Promise<Caballo[]> => {
  return Promise.resolve(caballos);
};

export const getCaballo = (id: string): Promise<Caballo | undefined> => {
  const caballo = caballos.find(c => c.id === id);
  return Promise.resolve(caballo);
};

export const crearCaballo = (caballo: Omit<Caballo, "id">): Promise<Caballo> => {
  const id = `c${Date.now()}`;
  const nuevoCaballo = { ...caballo, id };
  caballos = [...caballos, nuevoCaballo];
  return Promise.resolve(nuevoCaballo);
};

export const actualizarCaballo = (caballo: Caballo): Promise<Caballo> => {
  caballos = caballos.map(c => c.id === caballo.id ? caballo : c);
  return Promise.resolve(caballo);
};

export const eliminarCaballo = (id: string): Promise<void> => {
  caballos = caballos.filter(c => c.id !== id);
  return Promise.resolve();
};

// Funciones para gestionar sesiones
export const getSesiones = (): Promise<SesionDetallada[]> => {
  return Promise.resolve(
    sesiones.map(sesion => {
      const paciente = pacientes.find(p => p.id === sesion.pacienteId);
      const caballo = caballos.find(c => c.id === sesion.caballoId);
      const miembroPersonal = personal.find(p => p.id === sesion.personalId);
      
      return {
        ...sesion,
        paciente: paciente ? { nombre: paciente.nombre, apellido: paciente.apellido } : undefined,
        caballo: caballo ? { nombre: caballo.nombre } : undefined,
        personal: miembroPersonal ? { nombre: miembroPersonal.nombre, apellido: miembroPersonal.apellido } : undefined
      };
    })
  );
};

export const getSesion = (id: string): Promise<SesionDetallada | undefined> => {
  const sesion = sesiones.find(s => s.id === id);
  if (!sesion) return Promise.resolve(undefined);

  const paciente = pacientes.find(p => p.id === sesion.pacienteId);
  const caballo = caballos.find(c => c.id === sesion.caballoId);
  const miembroPersonal = personal.find(p => p.id === sesion.personalId);

  return Promise.resolve({
    ...sesion,
    paciente: paciente ? { nombre: paciente.nombre, apellido: paciente.apellido } : undefined,
    caballo: caballo ? { nombre: caballo.nombre } : undefined,
    personal: miembroPersonal ? { nombre: miembroPersonal.nombre, apellido: miembroPersonal.apellido } : undefined
  });
};

export const crearSesion = (sesion: Omit<Sesion, "id">): Promise<Sesion> => {
  const id = `s${Date.now()}`;
  const nuevaSesion = { ...sesion, id };
  sesiones = [...sesiones, nuevaSesion];
  return Promise.resolve(nuevaSesion);
};

export const actualizarSesion = (sesion: Sesion): Promise<Sesion> => {
  sesiones = sesiones.map(s => s.id === sesion.id ? sesion : s);
  return Promise.resolve(sesion);
};

export const eliminarSesion = (id: string): Promise<void> => {
  sesiones = sesiones.filter(s => s.id !== id);
  return Promise.resolve();
};

// Estadísticas para el dashboard
export const getEstadisticas = (): Promise<{
  totalPacientes: number;
  totalPersonal: number;
  totalCaballos: number;
  sesionesCompletadas: number;
  sesionesProgramadas: number;
}> => {
  return Promise.resolve({
    totalPacientes: pacientes.length,
    totalPersonal: personal.length,
    totalCaballos: caballos.length,
    sesionesCompletadas: sesiones.filter(s => s.estado === "completada").length,
    sesionesProgramadas: sesiones.filter(s => s.estado === "programada").length
  });
};
