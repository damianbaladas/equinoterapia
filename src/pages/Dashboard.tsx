
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEstadisticas, getSesiones } from "@/lib/data";
import { Calendar, Horse, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SesionDetallada } from "@/lib/types";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPacientes: 0,
    totalPersonal: 0,
    totalCaballos: 0,
    sesionesCompletadas: 0,
    sesionesProgramadas: 0
  });

  const [proximasSesiones, setProximasSesiones] = useState<SesionDetallada[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const estadisticas = await getEstadisticas();
      setStats(estadisticas);
      
      const sesiones = await getSesiones();
      // Ordenar por fecha y mostrar solo las programadas
      const sesionesOrdenadas = sesiones
        .filter(s => s.estado === "programada")
        .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        .slice(0, 5);
      
      setProximasSesiones(sesionesOrdenadas);
    };
    
    cargarDatos();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido al sistema de gestión del centro de equinoterapia.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPacientes}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/pacientes" className="hover:underline">Ver todos los pacientes</Link>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPersonal}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/personal" className="hover:underline">Ver personal</Link>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caballos</CardTitle>
            <Horse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCaballos}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/caballos" className="hover:underline">Ver caballos</Link>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sesionesProgramadas}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/sesiones" className="hover:underline">
                {stats.sesionesCompletadas} completadas, {stats.sesionesProgramadas} programadas
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Próximas Sesiones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {proximasSesiones.length > 0 ? (
              proximasSesiones.map((sesion) => (
                <div key={sesion.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">
                      {sesion.paciente?.nombre} {sesion.paciente?.apellido}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(sesion.fecha).toLocaleDateString()} - {sesion.hora}
                    </p>
                    <p className="text-sm">Caballo: {sesion.caballo?.nombre}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/sesiones/${sesion.id}`}>Ver</Link>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No hay sesiones programadas</p>
            )}
            
            <Button asChild className="w-full mt-4" variant="outline">
              <Link to="/sesiones/nueva">Programar nueva sesión</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full" variant="default">
              <Link to="/pacientes/nuevo">
                <User className="mr-2 h-4 w-4" />
                Nuevo Paciente
              </Link>
            </Button>
            
            <Button asChild className="w-full" variant="outline">
              <Link to="/personal/nuevo">
                <Users className="mr-2 h-4 w-4" />
                Nuevo Personal
              </Link>
            </Button>
            
            <Button asChild className="w-full" variant="outline">
              <Link to="/caballos/nuevo">
                <Horse className="mr-2 h-4 w-4" />
                Nuevo Caballo
              </Link>
            </Button>
            
            <Button asChild className="w-full" variant="outline">
              <Link to="/sesiones/nueva">
                <Calendar className="mr-2 h-4 w-4" />
                Nueva Sesión
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
