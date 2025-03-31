
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Personal } from "@/lib/types";
import { getPersonal, eliminarPersonal } from "@/lib/data";
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

const PersonalPage = () => {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const data = await getPersonal();
        setPersonal(data);
      } catch (error) {
        console.error("Error al cargar personal:", error);
        toast.error("Error al cargar el personal");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonal();
  }, []);

  const handleEliminar = async (id: string) => {
    try {
      await eliminarPersonal(id);
      setPersonal(personal.filter((p) => p.id !== id));
      toast.success("Personal eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar personal:", error);
      toast.error("Error al eliminar el personal");
    }
  };

  const columns: ColumnDef<Personal>[] = [
    {
      accessorKey: "cedula",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cédula
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("cedula")}</div>,
    },
    {
      accessorKey: "nombre",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("nombre")}</div>,
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
      cell: ({ row }) => <div>{row.getValue("apellido")}</div>,
    },
    {
      accessorKey: "especialidad",
      header: "Especialidad",
      cell: ({ row }) => <div>{row.getValue("especialidad") || "No especificada"}</div>,
    },
    {
      accessorKey: "cargo",
      header: "Cargo",
      cell: ({ row }) => <div>{row.getValue("cargo") || "No especificado"}</div>,
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const miembro = row.original;

        return (
          <div className="flex gap-2">
            <Button asChild size="icon" variant="ghost">
              <Link to={`/personal/${miembro.id}`}>
                <span className="sr-only">Ver detalles</span>
                <span>Ver</span>
              </Link>
            </Button>
            <Button asChild size="icon" variant="ghost">
              <Link to={`/personal/${miembro.id}/editar`}>
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
                    Esta acción no se puede deshacer. Se eliminará permanentemente a {miembro.nombre} {miembro.apellido}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleEliminar(miembro.id)}>
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
          <h2 className="text-3xl font-bold tracking-tight">Personal</h2>
          <p className="text-muted-foreground">
            Administra el equipo de trabajo del centro de equinoterapia.
          </p>
        </div>
        <Button asChild>
          <Link to="/personal/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Personal
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Cargando personal...</p>
      ) : personal.length === 0 ? (
        <EmptyState
          title="No hay personal registrado"
          description="No se ha registrado personal todavía."
          createUrl="/personal/nuevo"
          createLabel="Añadir personal"
        />
      ) : (
        <DataTable columns={columns} data={personal} searchKey="nombre" />
      )}
    </div>
  );
};

export default PersonalPage;
