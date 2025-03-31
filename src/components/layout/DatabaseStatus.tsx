
import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DBStats {
  pacientes: number;
  personal: number;
  caballos: number;
  sesiones: number;
}

const DatabaseStatus = () => {
  const [dbStats, setDbStats] = useState<DBStats | null>(null);
  const [dbStatus, setDbStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkDb = async () => {
      try {
        const db = await getDB();
        
        // Get record counts for each store
        const pacientes = await db.count('pacientes');
        const personal = await db.count('personal');
        const caballos = await db.count('caballos');
        const sesiones = await db.count('sesiones');
        
        setDbStats({ pacientes, personal, caballos, sesiones });
        setDbStatus('connected');
      } catch (error) {
        console.error("Error connecting to database:", error);
        setDbStatus('error');
      }
    };

    checkDb();
  }, []);

  let statusColor = "";
  let statusText = "";
  
  switch (dbStatus) {
    case 'loading':
      statusColor = "bg-yellow-500";
      statusText = "Conectando...";
      break;
    case 'connected':
      statusColor = "bg-green-500";
      statusText = "Conectado";
      break;
    case 'error':
      statusColor = "bg-red-500";
      statusText = "Error";
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              <span>DB</span>
              <div className={`h-2 w-2 rounded-full ${statusColor}`} />
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Estado de la base de datos: {statusText}</p>
            {dbStats && (
              <div className="text-xs">
                <p>Pacientes: {dbStats.pacientes}</p>
                <p>Personal: {dbStats.personal}</p>
                <p>Caballos: {dbStats.caballos}</p>
                <p>Sesiones: {dbStats.sesiones}</p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DatabaseStatus;
