
/**
 * indexedDB database utility for the equine therapy center
 */
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Paciente, Personal, Caballo, Sesion } from './types';

interface EquinoterapiaDB extends DBSchema {
  pacientes: {
    key: string;
    value: Paciente;
    indexes: { 'by-cedula': string };
  };
  personal: {
    key: string;
    value: Personal;
    indexes: { 'by-cedula': string };
  };
  caballos: {
    key: string;
    value: Caballo;
    indexes: { 'by-nombre': string };
  };
  sesiones: {
    key: string;
    value: Sesion;
    indexes: {
      'by-fecha': string;
      'by-paciente': string;
      'by-caballo': string;
      'by-personal': string;
    };
  };
}

const DB_NAME = 'equinoterapia-db';
const DB_VERSION = 1;
let db: IDBPDatabase<EquinoterapiaDB>;

/**
 * Initialize the database
 */
export async function initDB() {
  db = await openDB<EquinoterapiaDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains('pacientes')) {
        const pacientesStore = db.createObjectStore('pacientes', { keyPath: 'id' });
        pacientesStore.createIndex('by-cedula', 'cedula', { unique: true });
      }

      if (!db.objectStoreNames.contains('personal')) {
        const personalStore = db.createObjectStore('personal', { keyPath: 'id' });
        personalStore.createIndex('by-cedula', 'cedula', { unique: true });
      }

      if (!db.objectStoreNames.contains('caballos')) {
        const caballosStore = db.createObjectStore('caballos', { keyPath: 'id' });
        caballosStore.createIndex('by-nombre', 'nombre', { unique: false });
      }

      if (!db.objectStoreNames.contains('sesiones')) {
        const sesionesStore = db.createObjectStore('sesiones', { keyPath: 'id' });
        sesionesStore.createIndex('by-fecha', 'fecha', { unique: false });
        sesionesStore.createIndex('by-paciente', 'pacienteId', { unique: false });
        sesionesStore.createIndex('by-caballo', 'caballoId', { unique: false });
        sesionesStore.createIndex('by-personal', 'personalId', { unique: false });
      }
    },
  });

  return db;
}

/**
 * Get the database instance
 */
export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}

/**
 * Load initial data into the database if it's empty
 */
export async function loadInitialData(
  pacientes: Paciente[],
  personal: Personal[],
  caballos: Caballo[],
  sesiones: Sesion[]
) {
  const db = await getDB();
  
  // Check if data already exists
  const pacientesCount = await db.count('pacientes');
  
  if (pacientesCount === 0) {
    // Load initial data only if the database is empty
    const tx = db.transaction(['pacientes', 'personal', 'caballos', 'sesiones'], 'readwrite');
    
    await Promise.all([
      ...pacientes.map(p => tx.objectStore('pacientes').add(p)),
      ...personal.map(p => tx.objectStore('personal').add(p)),
      ...caballos.map(c => tx.objectStore('caballos').add(c)),
      ...sesiones.map(s => tx.objectStore('sesiones').add(s))
    ]);
    
    await tx.done;
    console.log('Initial data loaded into database');
  }
}
