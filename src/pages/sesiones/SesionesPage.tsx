
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SesionDetallada } from "@/lib/types";
import { getSesiones, eliminarSesion } from "@/lib/data";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Calendar, Edit, Plus, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const SesionesPage = () => {
  const [sesiones, setSesiones] = useState<SesionDetallada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSesiones = async () => {
      try {
        const data = await getSesiones();
        setSesiones(data);
      } catch (error) {
        console.error("Error al cargar sesiones:", error);
        toast.error("Error al cargar las sesiones");
      } finally {
        setLoading(false);
      }
    };

    fetchSesiones();
  }, []);

  const handleEliminar = async (id: string) => {
    try {
      await eliminarSesion(id);
      setSesiones(sesiones.filter((s) => s.id !== id));
      toast.success("Sesión eliminada correctamente");
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

  const columns: ColumnDef<SesionDetallada>[] = [
    {
      accessorKey: "fecha",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div>
          {new Date(row.getValue("fecha")).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "hora",
      header: "Hora",
      cell: ({ row }) => <div>{row.getValue("hora")}</div>,
    },
    {
      accessorKey: "paciente",
      header: "Paciente",
      cell: ({ row }) => {
        const paciente = row.original.paciente;
        return <div>{paciente ? `${paciente.nombre} ${paciente.apellido}` : "Sin asignar"}</div>;
      },
    },
    {
      accessorKey: "caballo",
      header: "Caballo",
      cell: ({ row }) => {
        const caballo = row.original.caballo;
        return <div>{caballo ? caballo.nombre : "Sin asignar"}</div>;
      },
    },
    {
      accessorKey: "personal",
      header: "Terapeuta",
      cell: ({ row }) => {
        const personal = row.original.personal;
        return <div>{personal ? `${personal.nombre} ${personal.apellido}` : "Sin asignar"}</div>;
      },
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => getEstadoBadge(row.getValue("estado")),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const sesion = row.original;

        return (
          <div className="flex gap-2">
            <Button asChild size="icon" variant="ghost">
              <Link to={`/sesiones/${sesion.id}`}>
                <span className="sr-only">Ver detalles</span>
                <span>Ver</span>
              </Link>
            </Button>
            <Button asChild size="icon" variant="ghost">
              <Link to={`/sesiones/${sesion.id}/editar`}>
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
                    Esta acción no se puede deshacer. Se eliminará permanentemente la sesión del {new Date(sesion.fecha).toLocaleDateString()}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleEliminar(sesion.id)}>
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
          <h2 className="text-3xl font-bold tracking-tight">Sesiones</h2>
          <p className="text-muted-foreground">
            Gestiona las sesiones de terapia del centro.
          </p>
        </div>
        <Button asChild>
          <Link to="/sesiones/nueva">
            <Calendar className="mr-2 h-4 w-4" /> Nueva Sesión
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Cargando sesiones...</p>
      ) : sesiones.length === 0 ? (
        <EmptyState
          title="No hay sesiones"
          description="No se han registrado sesiones todavía."
          createUrl="/sesiones/nueva"
          createLabel="Programar sesión"
        />
      ) : (
        <DataTable columns={columns} data={sesiones} searchKey="paciente" />
      )}
    </div>
  );
};

export default SesionesPage;
