
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Paciente } from "@/lib/types";
import { getPacientes, eliminarPaciente } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
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

const PacientesPage = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
        toast.error("Error al cargar los pacientes");
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  const handleEliminar = async (id: string) => {
    try {
      await eliminarPaciente(id);
      setPacientes(pacientes.filter((p) => p.id !== id));
      toast.success("Paciente eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
      toast.error("Error al eliminar el paciente");
    }
  };

  const columns: ColumnDef<Paciente>[] = [
    {
      accessorKey: "cedula",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cédula
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("cedula")}</div>,
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("nombre")}</div>,
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
      cell: ({ row }) => <div>{row.getValue("apellido")}</div>,
    },
    {
      accessorKey: "diagnostico",
      header: "Diagnóstico",
      cell: ({ row }) => <div>{row.getValue("diagnostico") || "No especificado"}</div>,
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const paciente = row.original;

        return (
          <div className="flex gap-2">
            <Button asChild size="icon" variant="ghost">
              <Link to={`/pacientes/${paciente.id}`}>
                <span className="sr-only">Ver detalles</span>
                <span>Ver</span>
              </Link>
            </Button>
            <Button asChild size="icon" variant="ghost">
              <Link to={`/pacientes/${paciente.id}/editar`}>
                <span className="sr-only">Editar</span>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost">
                  <span className="sr-only">Eliminar</span>
                  <Trash2 className="h-4 w-4" />
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
                  <AlertDialogAction onClick={() => handleEliminar(paciente.id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pacientes</h2>
          <p className="text-muted-foreground">
            Gestiona los pacientes del centro de equinoterapia.
          </p>
        </div>
        <Button asChild>
          <Link to="/pacientes/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Paciente
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Cargando pacientes...</p>
      ) : pacientes.length === 0 ? (
        <EmptyState
          title="No hay pacientes"
          description="No se han registrado pacientes todavía."
          createUrl="/pacientes/nuevo"
          createLabel="Crear paciente"
        />
      ) : (
        <DataTable columns={columns} data={pacientes} searchKey="nombre" />
      )}
    </div>
  );
};

export default PacientesPage;
