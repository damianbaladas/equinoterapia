
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Personal } from "@/lib/types";
import { getPersonalIndividual, eliminarPersonal } from "@/lib/data";
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

const PersonalDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [miembro, setMiembro] = useState<Personal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPersonal = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await getPersonalIndividual(id);
          if (data) {
            setMiembro(data);
          } else {
            toast.error("No se encontró el personal");
            navigate("/personal");
          }
        }
      } catch (error) {
        console.error("Error al cargar personal:", error);
        toast.error("Error al cargar los datos del personal");
      } finally {
        setLoading(false);
      }
    };

    cargarPersonal();
  }, [id, navigate]);

  const handleEliminar = async () => {
    try {
      if (id) {
        await eliminarPersonal(id);
        toast.success("Personal eliminado correctamente");
        navigate("/personal");
      }
    } catch (error) {
      console.error("Error al eliminar personal:", error);
      toast.error("Error al eliminar el personal");
    }
  };

  if (loading) {
    return <p>Cargando datos del personal...</p>;
  }

  if (!miembro) {
    return <p>No se encontró el personal</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/personal">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {miembro.nombre} {miembro.apellido}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/personal/${id}/editar`}>
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
                  Esta acción no se puede deshacer. Se eliminará permanentemente a {miembro.nombre} {miembro.apellido}.
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
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Cédula de identidad</p>
              <p>{miembro.cedula}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Teléfono</p>
              <p>{miembro.telefono || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Correo electrónico</p>
              <p>{miembro.email || "No especificado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información profesional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Especialidad</p>
              <p>{miembro.especialidad || "No especificada"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Cargo</p>
              <p>{miembro.cargo || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Fecha de contratación</p>
              <p>
                {miembro.fechaContratacion
                  ? new Date(miembro.fechaContratacion).toLocaleDateString()
                  : "No especificada"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalDetalle;
