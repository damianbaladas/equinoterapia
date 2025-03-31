import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SesionDetallada } from "@/lib/types";
import { getSesion, eliminarSesion } from "@/lib/data";
import { ArrowLeft, Calendar, Edit, Cat, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SesionDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sesion, setSesion] = useState<SesionDetallada | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSesion = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await getSesion(id);
          if (data) {
            setSesion(data);
          } else {
            toast.error("No se encontró la sesión");
            navigate("/sesiones");
          }
        }
      } catch (error) {
        console.error("Error al cargar sesión:", error);
        toast.error("Error al cargar los datos de la sesión");
      } finally {
        setLoading(false);
      }
    };

    cargarSesion();
  }, [id, navigate]);

  const handleEliminar = async () => {
    try {
      if (id) {
        await eliminarSesion(id);
        toast.success("Sesión eliminada correctamente");
        navigate("/sesiones");
      }
    } catch (error) {
      console.error("Error al eliminar sesión:", error);
      toast.error("Error al eliminar la sesión");
    }
  };

  const getEstadoBadge = (estado?: string) => {
    switch (estado) {
      case "programada":
        return <Badge variant="outline">Programada</Badge>;
      case "completada":
        return <Badge variant="default">Completada</Badge>;
      case "cancelada":
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">No definido</Badge>;
    }
  };

  if (loading) {
    return <p>Cargando datos de la sesión...</p>;
  }

  if (!sesion) {
    return <p>No se encontró la sesión</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/sesiones">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Sesión del {new Date(sesion.fecha).toLocaleDateString()}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-muted-foreground">{sesion.hora} - {getEstadoBadge(sesion.estado)}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/sesiones/${id}/editar`}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente la sesión del {new Date(sesion.fecha).toLocaleDateString()}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEliminar}>
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paciente</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {sesion.paciente
                ? `${sesion.paciente.nombre} ${sesion.paciente.apellido}`
                : "No asignado"}
            </div>
            {sesion.pacienteId && (
              <Button
                asChild
                variant="link"
                className="px-0 text-xs text-muted-foreground"
              >
                <Link to={`/pacientes/${sesion.pacienteId}`}>Ver detalles</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Caballo</CardTitle>
            <Cat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {sesion.caballo ? sesion.caballo.nombre : "No asignado"}
            </div>
            {sesion.caballoId && (
              <Button
                asChild
                variant="link"
                className="px-0 text-xs text-muted-foreground"
              >
                <Link to={`/caballos/${sesion.caballoId}`}>Ver detalles</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terapeuta</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {sesion.personal
                ? `${sesion.personal.nombre} ${sesion.personal.apellido}`
                : "No asignado"}
            </div>
            {sesion.personalId && (
              <Button
                asChild
                variant="link"
                className="px-0 text-xs text-muted-foreground"
              >
                <Link to={`/personal/${sesion.personalId}`}>Ver detalles</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Duración</p>
              <p>{sesion.duracion || "No especificada"}</p>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium">Actividades</p>
              <p>{sesion.actividades || "No especificadas"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Observaciones</p>
              <p>{sesion.observaciones || "No hay observaciones"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SesionDetalle;
