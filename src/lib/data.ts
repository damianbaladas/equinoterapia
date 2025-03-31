
import { Paciente, Personal, Caballo, Sesion, SesionDetallada } from "./types";
import { getDB, initDB, loadInitialData } from "./db";
import { toast } from "sonner";

// Initial data for seeding the database
const initialPacientes: Paciente[] = [
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

const initialPersonal: Personal[] = [
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

const initialCaballos: Caballo[] = [
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

const initialSesiones: Sesion[] = [
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

// Initialize the database
export const initializeDatabase = async () => {
  try {
    await initDB();
    await loadInitialData(
      initialPacientes, 
      initialPersonal, 
      initialCaballos, 
      initialSesiones
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    toast.error("Error al inicializar la base de datos");
  }
};

// Funciones para gestionar pacientes
export const getPacientes = async (): Promise<Paciente[]> => {
  try {
    const db = await getDB();
    return await db.getAll('pacientes');
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    toast.error("Error al cargar los pacientes");
    return [];
  }
};

export const getPaciente = async (id: string): Promise<Paciente | undefined> => {
  try {
    const db = await getDB();
    return await db.get('pacientes', id);
  } catch (error) {
    console.error("Error al obtener paciente:", error);
    toast.error("Error al cargar los datos del paciente");
    return undefined;
  }
};

export const crearPaciente = async (paciente: Omit<Paciente, "id">): Promise<Paciente> => {
  try {
    const db = await getDB();
    const id = `p${Date.now()}`;
    const nuevoPaciente = { ...paciente, id };
    await db.add('pacientes', nuevoPaciente);
    return nuevoPaciente;
  } catch (error) {
    console.error("Error al crear paciente:", error);
    toast.error("Error al crear el paciente");
    throw error;
  }
};

export const actualizarPaciente = async (paciente: Paciente): Promise<Paciente> => {
  try {
    const db = await getDB();
    await db.put('pacientes', paciente);
    return paciente;
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    toast.error("Error al actualizar el paciente");
    throw error;
  }
};

export const eliminarPaciente = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete('pacientes', id);
  } catch (error) {
    console.error("Error al eliminar paciente:", error);
    toast.error("Error al eliminar el paciente");
    throw error;
  }
};

// Funciones para gestionar personal
export const getPersonal = async (): Promise<Personal[]> => {
  try {
    const db = await getDB();
    return await db.getAll('personal');
  } catch (error) {
    console.error("Error al obtener personal:", error);
    toast.error("Error al cargar el personal");
    return [];
  }
};

export const getPersonalIndividual = async (id: string): Promise<Personal | undefined> => {
  try {
    const db = await getDB();
    return await db.get('personal', id);
  } catch (error) {
    console.error("Error al obtener miembro del personal:", error);
    toast.error("Error al cargar los datos del personal");
    return undefined;
  }
};

export const crearPersonal = async (miembro: Omit<Personal, "id">): Promise<Personal> => {
  try {
    const db = await getDB();
    const id = `e${Date.now()}`;
    const nuevoMiembro = { ...miembro, id };
    await db.add('personal', nuevoMiembro);
    return nuevoMiembro;
  } catch (error) {
    console.error("Error al crear personal:", error);
    toast.error("Error al crear el miembro del personal");
    throw error;
  }
};

export const actualizarPersonal = async (miembro: Personal): Promise<Personal> => {
  try {
    const db = await getDB();
    await db.put('personal', miembro);
    return miembro;
  } catch (error) {
    console.error("Error al actualizar personal:", error);
    toast.error("Error al actualizar el miembro del personal");
    throw error;
  }
};

export const eliminarPersonal = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete('personal', id);
  } catch (error) {
    console.error("Error al eliminar personal:", error);
    toast.error("Error al eliminar el miembro del personal");
    throw error;
  }
};

// Funciones para gestionar caballos
export const getCaballos = async (): Promise<Caballo[]> => {
  try {
    const db = await getDB();
    return await db.getAll('caballos');
  } catch (error) {
    console.error("Error al obtener caballos:", error);
    toast.error("Error al cargar los caballos");
    return [];
  }
};

export const getCaballo = async (id: string): Promise<Caballo | undefined> => {
  try {
    const db = await getDB();
    return await db.get('caballos', id);
  } catch (error) {
    console.error("Error al obtener caballo:", error);
    toast.error("Error al cargar los datos del caballo");
    return undefined;
  }
};

export const crearCaballo = async (caballo: Omit<Caballo, "id">): Promise<Caballo> => {
  try {
    const db = await getDB();
    const id = `c${Date.now()}`;
    const nuevoCaballo = { ...caballo, id };
    await db.add('caballos', nuevoCaballo);
    return nuevoCaballo;
  } catch (error) {
    console.error("Error al crear caballo:", error);
    toast.error("Error al crear el caballo");
    throw error;
  }
};

export const actualizarCaballo = async (caballo: Caballo): Promise<Caballo> => {
  try {
    const db = await getDB();
    await db.put('caballos', caballo);
    return caballo;
  } catch (error) {
    console.error("Error al actualizar caballo:", error);
    toast.error("Error al actualizar el caballo");
    throw error;
  }
};

export const eliminarCaballo = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete('caballos', id);
  } catch (error) {
    console.error("Error al eliminar caballo:", error);
    toast.error("Error al eliminar el caballo");
    throw error;
  }
};

// Funciones para gestionar sesiones
export const getSesiones = async (): Promise<SesionDetallada[]> => {
  try {
    const db = await getDB();
    const sesiones = await db.getAll('sesiones');
    const pacientes = await db.getAll('pacientes');
    const caballos = await db.getAll('caballos');
    const personal = await db.getAll('personal');
    
    return sesiones.map(sesion => {
      const paciente = pacientes.find(p => p.id === sesion.pacienteId);
      const caballo = caballos.find(c => c.id === sesion.caballoId);
      const miembroPersonal = personal.find(p => p.id === sesion.personalId);
      
      return {
        ...sesion,
        paciente: paciente ? { nombre: paciente.nombre, apellido: paciente.apellido } : undefined,
        caballo: caballo ? { nombre: caballo.nombre } : undefined,
        personal: miembroPersonal ? { nombre: miembroPersonal.nombre, apellido: miembroPersonal.apellido } : undefined
      };
    });
  } catch (error) {
    console.error("Error al obtener sesiones:", error);
    toast.error("Error al cargar las sesiones");
    return [];
  }
};

export const getSesion = async (id: string): Promise<SesionDetallada | undefined> => {
  try {
    const db = await getDB();
    const sesion = await db.get('sesiones', id);
    if (!sesion) return undefined;

    const paciente = await db.get('pacientes', sesion.pacienteId);
    const caballo = await db.get('caballos', sesion.caballoId);
    const miembroPersonal = await db.get('personal', sesion.personalId);

    return {
      ...sesion,
      paciente: paciente ? { nombre: paciente.nombre, apellido: paciente.apellido } : undefined,
      caballo: caballo ? { nombre: caballo.nombre } : undefined,
      personal: miembroPersonal ? { nombre: miembroPersonal.nombre, apellido: miembroPersonal.apellido } : undefined
    };
  } catch (error) {
    console.error("Error al obtener sesión:", error);
    toast.error("Error al cargar los datos de la sesión");
    return undefined;
  }
};

export const crearSesion = async (sesion: Omit<Sesion, "id">): Promise<Sesion> => {
  try {
    const db = await getDB();
    const id = `s${Date.now()}`;
    const nuevaSesion = { ...sesion, id };
    await db.add('sesiones', nuevaSesion);
    return nuevaSesion;
  } catch (error) {
    console.error("Error al crear sesión:", error);
    toast.error("Error al crear la sesión");
    throw error;
  }
};

export const actualizarSesion = async (sesion: Sesion): Promise<Sesion> => {
  try {
    const db = await getDB();
    await db.put('sesiones', sesion);
    return sesion;
  } catch (error) {
    console.error("Error al actualizar sesión:", error);
    toast.error("Error al actualizar la sesión");
    throw error;
  }
};

export const eliminarSesion = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete('sesiones', id);
  } catch (error) {
    console.error("Error al eliminar sesión:", error);
    toast.error("Error al eliminar la sesión");
    throw error;
  }
};

// Estadísticas para el dashboard
export const getEstadisticas = async (): Promise<{
  totalPacientes: number;
  totalPersonal: number;
  totalCaballos: number;
  sesionesCompletadas: number;
  sesionesProgramadas: number;
}> => {
  try {
    const db = await getDB();
    const pacientes = await db.getAll('pacientes');
    const personal = await db.getAll('personal');
    const caballos = await db.getAll('caballos');
    const sesiones = await db.getAll('sesiones');
    
    return {
      totalPacientes: pacientes.length,
      totalPersonal: personal.length,
      totalCaballos: caballos.length,
      sesionesCompletadas: sesiones.filter(s => s.estado === "completada").length,
      sesionesProgramadas: sesiones.filter(s => s.estado === "programada").length
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    toast.error("Error al cargar las estadísticas");
    return {
      totalPacientes: 0,
      totalPersonal: 0,
      totalCaballos: 0,
      sesionesCompletadas: 0,
      sesionesProgramadas: 0
    };
  }
};
