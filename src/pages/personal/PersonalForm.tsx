
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPersonalIndividual, crearPersonal, actualizarPersonal } from "@/lib/data";
import { Personal } from "@/lib/types";
import { toast } from "sonner";

const PersonalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Personal, "id">>({
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    especialidad: "",
    cargo: "",
    fechaContratacion: "",
  });

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (esEdicion) {
      const cargarPersonal = async () => {
        setLoading(true);
        try {
          const miembro = await getPersonalIndividual(id as string);
          if (miembro) {
            const { id: _, ...datosPersonal } = miembro;
            setFormData(datosPersonal);
          } else {
            toast.error("No se encontró el personal");
            navigate("/personal");
          }
        } catch (error) {
          console.error("Error al cargar personal:", error);
          toast.error("Error al cargar los datos del personal");
        } finally {
          setLoading(false);
        }
      };

      cargarPersonal();
    }
  }, [id, esEdicion, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (esEdicion && id) {
        await actualizarPersonal({ id, ...formData });
        toast.success("Personal actualizado correctamente");
      } else {
        await crearPersonal(formData);
        toast.success("Personal creado correctamente");
      }
      navigate("/personal");
    } catch (error) {
      console.error("Error al guardar personal:", error);
      toast.error(esEdicion ? "Error al actualizar el personal" : "Error al crear el personal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {esEdicion ? "Editar" : "Nuevo"} Personal
        </h2>
        <p className="text-muted-foreground">
          {esEdicion
            ? "Actualiza los datos del personal."
            : "Completa el formulario para registrar un nuevo miembro del personal."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula de identidad *</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  placeholder="Ej. V-12345678"
                  required
                />
              </div>
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
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaContratacion">Fecha de contratación</Label>
                <Input
                  id="fechaContratacion"
                  name="fechaContratacion"
                  type="date"
                  value={formData.fechaContratacion}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="especialidad">Especialidad</Label>
                <Input
                  id="especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  placeholder="Especialidad"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  placeholder="Cargo"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/personal")}
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

export default PersonalForm;
