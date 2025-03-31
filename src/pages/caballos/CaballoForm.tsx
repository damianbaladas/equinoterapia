
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCaballo, crearCaballo, actualizarCaballo } from "@/lib/data";
import { Caballo } from "@/lib/types";
import { toast } from "sonner";

const CaballoForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Caballo, "id">>({
    nombre: "",
    edad: undefined,
    raza: "",
    color: "",
    altura: "",
    peso: "",
    temperamento: "",
    entrenamiento: "",
    historialMedico: "",
  });

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (esEdicion) {
      const cargarCaballo = async () => {
        setLoading(true);
        try {
          const caballo = await getCaballo(id as string);
          if (caballo) {
            const { id: _, ...datosCaballo } = caballo;
            setFormData(datosCaballo);
          } else {
            toast.error("No se encontró el caballo");
            navigate("/caballos");
          }
        } catch (error) {
          console.error("Error al cargar caballo:", error);
          toast.error("Error al cargar los datos del caballo");
        } finally {
          setLoading(false);
        }
      };

      cargarCaballo();
    }
  }, [id, esEdicion, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (esEdicion && id) {
        await actualizarCaballo({ id, ...formData });
        toast.success("Caballo actualizado correctamente");
      } else {
        await crearCaballo(formData);
        toast.success("Caballo creado correctamente");
      }
      navigate("/caballos");
    } catch (error) {
      console.error("Error al guardar caballo:", error);
      toast.error(
        esEdicion ? "Error al actualizar el caballo" : "Error al crear el caballo"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {esEdicion ? "Editar" : "Nuevo"} Caballo
        </h2>
        <p className="text-muted-foreground">
          {esEdicion
            ? "Actualiza los datos del caballo."
            : "Completa el formulario para registrar un nuevo caballo."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del caballo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad">Edad</Label>
                <Input
                  id="edad"
                  name="edad"
                  type="number"
                  value={formData.edad !== undefined ? formData.edad : ""}
                  onChange={handleChange}
                  placeholder="Edad en años"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="raza">Raza</Label>
                <Input
                  id="raza"
                  name="raza"
                  value={formData.raza}
                  onChange={handleChange}
                  placeholder="Raza"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Color"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="altura">Altura</Label>
                <Input
                  id="altura"
                  name="altura"
                  value={formData.altura}
                  onChange={handleChange}
                  placeholder="Altura (ej: 1.5 m)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso</Label>
                <Input
                  id="peso"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  placeholder="Peso (ej: 450 kg)"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="temperamento">Temperamento</Label>
                <Textarea
                  id="temperamento"
                  name="temperamento"
                  value={formData.temperamento}
                  onChange={handleChange}
                  placeholder="Temperamento del caballo"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="entrenamiento">Entrenamiento</Label>
                <Textarea
                  id="entrenamiento"
                  name="entrenamiento"
                  value={formData.entrenamiento}
                  onChange={handleChange}
                  placeholder="Nivel y tipo de entrenamiento"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="historialMedico">Historial médico</Label>
                <Textarea
                  id="historialMedico"
                  name="historialMedico"
                  value={formData.historialMedico}
                  onChange={handleChange}
                  placeholder="Historial médico y vacunas"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/caballos")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : esEdicion ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaballoForm;
