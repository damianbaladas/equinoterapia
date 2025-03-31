
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Caballo } from "@/lib/types";
import { getCaballos, eliminarCaballo } from "@/lib/data";
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

const CaballosPage = () => {
  const [caballos, setCaballos] = useState<Caballo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaballos = async () => {
      try {
        const data = await getCaballos();
        setCaballos(data);
      } catch (error) {
        console.error("Error al cargar caballos:", error);
        toast.error("Error al cargar los caballos");
      } finally {
        setLoading(false);
      }
    };

    fetchCaballos();
  }, []);

  const handleEliminar = async (id: string) => {
    try {
      await eliminarCaballo(id);
      setCaballos(caballos.filter((c) => c.id !== id));
      toast.success("Caballo eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar caballo:", error);
      toast.error("Error al eliminar el caballo");
    }
  };

  const columns: ColumnDef<Caballo>[] = [
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
      accessorKey: "edad",
      header: "Edad",
      cell: ({ row }) => <div>{row.getValue("edad") || "No especificada"} años</div>,
    },
    {
      accessorKey: "raza",
      header: "Raza",
      cell: ({ row }) => <div>{row.getValue("raza") || "No especificada"}</div>,
    },
    {
      accessorKey: "temperamento",
      header: "Temperamento",
      cell: ({ row }) => <div>{row.getValue("temperamento") || "No especificado"}</div>,
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const caballo = row.original;

        return (
          <div className="flex gap-2">
            <Button asChild size="icon" variant="ghost">
              <Link to={`/caballos/${caballo.id}`}>
                <span className="sr-only">Ver detalles</span>
                <span>Ver</span>
              </Link>
            </Button>
            <Button asChild size="icon" variant="ghost">
              <Link to={`/caballos/${caballo.id}/editar`}>
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
                    Esta acción no se puede deshacer. Se eliminará permanentemente al caballo {caballo.nombre}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleEliminar(caballo.id)}>
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
          <h2 className="text-3xl font-bold tracking-tight">Caballos</h2>
          <p className="text-muted-foreground">
            Gestiona los caballos del centro de equinoterapia.
          </p>
        </div>
        <Button asChild>
          <Link to="/caballos/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Caballo
          </Link>
        </Button>
      </div>

      {loading ? (
        <p>Cargando caballos...</p>
      ) : caballos.length === 0 ? (
        <EmptyState
          title="No hay caballos"
          description="No se han registrado caballos todavía."
          createUrl="/caballos/nuevo"
          createLabel="Añadir caballo"
        />
      ) : (
        <DataTable columns={columns} data={caballos} searchKey="nombre" />
      )}
    </div>
  );
};

export default CaballosPage;
