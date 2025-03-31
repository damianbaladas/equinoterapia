
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Caballo } from "@/lib/types";
import { getCaballo, eliminarCaballo } from "@/lib/data";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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

const CaballoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caballo, setCaballo] = useState<Caballo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCaballo = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await getCaballo(id);
          if (data) {
            setCaballo(data);
          } else {
            toast.error("No se encontró el caballo");
            navigate("/caballos");
          }
        }
      } catch (error) {
        console.error("Error al cargar caballo:", error);
        toast.error("Error al cargar los datos del caballo");
      } finally {
        setLoading(false);
      }
    };

    cargarCaballo();
  }, [id, navigate]);

  const handleEliminar = async () => {
    try {
      if (id) {
        await eliminarCaballo(id);
        toast.success("Caballo eliminado correctamente");
        navigate("/caballos");
      }
    } catch (error) {
      console.error("Error al eliminar caballo:", error);
      toast.error("Error al eliminar el caballo");
    }
  };

  if (loading) {
    return <p>Cargando datos del caballo...</p>;
  }

  if (!caballo) {
    return <p>No se encontró el caballo</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/caballos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">{caballo.nombre}</h2>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/caballos/${id}/editar`}>
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
                  Esta acción no se puede deshacer. Se eliminará permanentemente al caballo {caballo.nombre}.
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

      <Card>
        <CardHeader>
          <CardTitle>Características físicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Edad</p>
              <p>{caballo.edad ? `${caballo.edad} años` : "No especificada"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Raza</p>
              <p>{caballo.raza || "No especificada"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Color</p>
              <p>{caballo.color || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Altura</p>
              <p>{caballo.altura || "No especificada"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Peso</p>
              <p>{caballo.peso || "No especificado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características y entrenamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Temperamento</p>
              <p>{caballo.temperamento || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Entrenamiento</p>
              <p>{caballo.entrenamiento || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Historial médico</p>
              <p>{caballo.historialMedico || "No especificado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaballoDetalle;
