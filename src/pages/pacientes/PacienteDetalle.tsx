
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paciente } from "@/lib/types";
import { getPaciente, eliminarPaciente } from "@/lib/data";
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

const PacienteDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPaciente = async () => {
      setLoading(true);
      try {
        if (id) {
          const data = await getPaciente(id);
          if (data) {
            setPaciente(data);
          } else {
            toast.error("No se encontró el paciente");
            navigate("/pacientes");
          }
        }
      } catch (error) {
        console.error("Error al cargar paciente:", error);
        toast.error("Error al cargar los datos del paciente");
      } finally {
        setLoading(false);
      }
    };

    cargarPaciente();
  }, [id, navigate]);

  const handleEliminar = async () => {
    try {
      if (id) {
        await eliminarPaciente(id);
        toast.success("Paciente eliminado correctamente");
        navigate("/pacientes");
      }
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      toast.error("Error al eliminar el paciente");
    }
  };

  if (loading) {
    return <p>Cargando datos del paciente...</p>;
  }

  if (!paciente) {
    return <p>No se encontró el paciente</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/pacientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {paciente.nombre} {paciente.apellido}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/pacientes/${id}/editar`}>
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
                  Esta acción no se puede deshacer. Se eliminará permanentemente al paciente {paciente.nombre} {paciente.apellido}.
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
              <p>{paciente.cedula}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Fecha de nacimiento</p>
              <p>{paciente.fechaNacimiento || "No especificada"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Teléfono</p>
              <p>{paciente.telefono || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Correo electrónico</p>
              <p>{paciente.email || "No especificado"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información médica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Diagnóstico</p>
              <p>{paciente.diagnostico || "No especificado"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Objetivos terapéuticos</p>
              <p>{paciente.objetivos || "No especificados"}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Observaciones</p>
              <p>{paciente.observaciones || "No hay observaciones"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PacienteDetalle;
