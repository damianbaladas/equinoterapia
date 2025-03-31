
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";
import { Paciente, Personal, Caballo, Sesion, SesionDetallada } from './types';
import { toast } from "sonner";

// Function to convert snake_case keys to camelCase
function snakeToCamel(arr: any[]): any[] {
  return arr.map(obj => {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        newObj[camelCaseKey] = obj[key];
      }
    }
    return newObj;
  });
}

// Function to initialize the database with sample data
export async function initializeDatabase() {
  try {
    // Check if the 'pacientes' table is empty
    const { data: pacientes, error: pacientesError, count } = await supabase
      .from('pacientes')
      .select('*', { count: 'exact', head: true });

    if (pacientesError) {
      console.error("Error checking 'pacientes' table:", pacientesError);
      throw pacientesError;
    }

    if (count === 0) {
      // Insert sample data into the 'pacientes' table
      const samplePacientes = [
        { nombre: 'Juan Perez', fecha_nacimiento: '1990-05-15', diagnostico: 'Parálisis Cerebral', observaciones: 'Necesita apoyo en la marcha.' },
        { nombre: 'Maria Rodriguez', fecha_nacimiento: '1985-10-20', diagnostico: 'Autismo', observaciones: 'Buena respuesta a estímulos visuales.' },
      ];

      const { error: insertError } = await supabase
        .from('pacientes')
        .insert(samplePacientes);

      if (insertError) {
        console.error("Error inserting sample data into 'pacientes':", insertError);
        throw insertError;
      } else {
        console.log("Sample data inserted into 'pacientes' successfully.");
      }
    } else {
      console.log("'pacientes' table is not empty. Skipping sample data insertion.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Add the missing getEstadisticas function
export async function getEstadisticas() {
  try {
    // Get counts from Supabase
    const [
      { count: pacientes, error: pacientesError },
      { count: personal, error: personalError },
      { count: caballos, error: caballosError },
      { data: sesiones, error: sesionesError }
    ] = await Promise.all([
      supabase.from('pacientes').select('*', { count: 'exact', head: true }),
      supabase.from('personal').select('*', { count: 'exact', head: true }),
      supabase.from('caballos').select('*', { count: 'exact', head: true }),
      supabase.from('sesiones').select('fecha, estado')
    ]);

    if (pacientesError || personalError || caballosError || sesionesError) {
      console.error("Error al obtener estadísticas:", 
        pacientesError || personalError || caballosError || sesionesError);
      throw new Error('Error al obtener estadísticas');
    }

    // Process session data to get statistics
    const fechaHoy = new Date();
    const sesionesHoy = snakeToCamel(sesiones || []).filter(s => {
      const fechaSesion = new Date(s.fecha);
      return fechaSesion.toDateString() === fechaHoy.toDateString();
    });

    const sesionesProgramadas = snakeToCamel(sesiones || []).filter(s => 
      s.estado === 'programada'
    );

    const sesionesCompletadas = snakeToCamel(sesiones || []).filter(s => 
      s.estado === 'completada'
    );

    return {
      totalPacientes: pacientes || 0,
      totalPersonal: personal || 0,
      totalCaballos: caballos || 0,
      totalSesiones: (sesiones?.length || 0),
      sesionesHoy: sesionesHoy.length,
      sesionesProgramadas: sesionesProgramadas.length,
      sesionesCompletadas: sesionesCompletadas.length
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    // Return default values in case of error
    return {
      totalPacientes: 0,
      totalPersonal: 0,
      totalCaballos: 0,
      totalSesiones: 0,
      sesionesHoy: 0,
      sesionesProgramadas: 0,
      sesionesCompletadas: 0
    };
  }
}

// Generic function to fetch data from a table
async function fetchData<T>(table: string): Promise<T[]> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*');

    if (error) {
      console.error(`Error fetching ${table}:`, error);
      return [];
    }

    return snakeToCamel(data) as T[];
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }
}

// Generic function to fetch data from a table by ID
async function fetchDataById<T>(table: string, id: string): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching ${table} with ID ${id}:`, error);
      return null;
    }

    return snakeToCamel([data])[0] as T;
  } catch (error) {
    console.error(`Error fetching ${table} with ID ${id}:`, error);
    return null;
  }
}

// Generic function to create a new record in a table
async function createData<T>(table: string, newData: Omit<T, 'id'>): Promise<T | null> {
  try {
    const id = uuidv4();
    const { data, error } = await supabase
      .from(table)
      .insert([{ id, ...newData }])
      .select('*')
      .single();

    if (error) {
      console.error(`Error creating record in ${table}:`, error);
      return null;
    }

    return snakeToCamel([data])[0] as T;
  } catch (error) {
    console.error(`Error creating record in ${table}:`, error);
    return null;
  }
}

// Generic function to update a record in a table
async function updateData<T>(table: string, id: string, updatedData: Partial<T>): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updatedData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(`Error updating record in ${table} with ID ${id}:`, error);
      return null;
    }

    return snakeToCamel([data])[0] as T;
  } catch (error) {
    console.error(`Error updating record in ${table} with ID ${id}:`, error);
    return null;
  }
}

// Generic function to delete a record from a table
async function deleteData(table: string, id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting record from ${table} with ID ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error deleting record from ${table} with ID ${id}:`, error);
    return false;
  }
}

// Specific functions for each entity
export async function getPacientes(): Promise<Paciente[]> {
  return fetchData<Paciente>('pacientes');
}

export async function getPaciente(id: string): Promise<Paciente | null> {
  return fetchDataById<Paciente>('pacientes', id);
}

export async function crearPaciente(paciente: Omit<Paciente, 'id'>): Promise<Paciente | null> {
  return createData<Paciente>('pacientes', paciente);
}

export async function actualizarPaciente(id: string, paciente: Partial<Paciente>): Promise<Paciente | null> {
  return updateData<Paciente>('pacientes', id, paciente);
}

export async function eliminarPaciente(id: string): Promise<boolean> {
  return deleteData('pacientes', id);
}

export async function getPersonal(): Promise<Personal[]> {
  return fetchData<Personal>('personal');
}

export async function getPersonalById(id: string): Promise<Personal | null> {
  return fetchDataById<Personal>('personal', id);
}

export async function getPersonalIndividual(id: string): Promise<Personal | null> {
  return fetchDataById<Personal>('personal', id);
}

export async function crearPersonal(personal: Omit<Personal, 'id'>): Promise<Personal | null> {
  return createData<Personal>('personal', personal);
}

export async function actualizarPersonal(id: string, personal: Partial<Personal>): Promise<Personal | null> {
  return updateData<Personal>('personal', id, personal);
}

export async function eliminarPersonal(id: string): Promise<boolean> {
  return deleteData('personal', id);
}

export async function getCaballos(): Promise<Caballo[]> {
  return fetchData<Caballo>('caballos');
}

export async function getCaballo(id: string): Promise<Caballo | null> {
  return fetchDataById<Caballo>('caballos', id);
}

export async function crearCaballo(caballo: Omit<Caballo, 'id'>): Promise<Caballo | null> {
  return createData<Caballo>('caballos', caballo);
}

export async function actualizarCaballo(id: string, caballo: Partial<Caballo>): Promise<Caballo | null> {
  return updateData<Caballo>('caballos', id, caballo);
}

export async function eliminarCaballo(id: string): Promise<boolean> {
  return deleteData('caballos', id);
}

export async function getSesiones(): Promise<SesionDetallada[]> {
  try {
    const { data, error } = await supabase
      .from('sesiones')
      .select(`
        *,
        paciente:paciente_id(nombre, apellido),
        caballo:caballo_id(nombre),
        personal:personal_id(nombre, apellido)
      `)
      .order('fecha', { ascending: false });
    
    if (error) {
      console.error('Error al obtener sesiones:', error);
      throw new Error('Error al obtener sesiones');
    }
    
    return snakeToCamel(data || []);
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    return [];
  }
}

export async function getSesion(id: string): Promise<SesionDetallada | null> {
  try {
    const { data, error } = await supabase
      .from('sesiones')
      .select(`
        *,
        paciente:paciente_id(nombre, apellido),
        caballo:caballo_id(nombre),
        personal:personal_id(nombre, apellido)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error al obtener sesión:', error);
      throw new Error('Error al obtener sesión');
    }
    
    return data ? snakeToCamel([data])[0] : null;
  } catch (error) {
    console.error('Error al obtener sesión:', error);
    return null;
  }
}

export async function crearSesion(sesion: Omit<Sesion, 'id'>): Promise<Sesion | null> {
  return createData<Sesion>('sesiones', sesion);
}

export async function actualizarSesion(id: string, sesion: Partial<Sesion>): Promise<Sesion | null> {
  return updateData<Sesion>('sesiones', id, sesion);
}

export async function eliminarSesion(id: string): Promise<boolean> {
  return deleteData('sesiones', id);
}

// Compatibility functions with older naming convention
export const createPaciente = crearPaciente;
export const updatePaciente = actualizarPaciente;
export const deletePaciente = eliminarPaciente;

export const createPersonal = crearPersonal;
export const updatePersonal = actualizarPersonal;
export const deletePersonal = eliminarPersonal;

export const createCaballo = crearCaballo;
export const updateCaballo = actualizarCaballo;
export const deleteCaballo = eliminarCaballo;

export const createSesion = crearSesion;
export const updateSesion = actualizarSesion;
export const deleteSesion = eliminarSesion;
