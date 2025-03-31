
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPaciente, crearPaciente, actualizarPaciente } from "@/lib/data";
import { Paciente } from "@/lib/types";
import { toast } from "sonner";

const PacienteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Paciente, "id">>({
    cedula: "",
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    telefono: "",
    email: "",
    diagnostico: "",
    objetivos: "",
    observaciones: "",
  });

  const esEdicion = Boolean(id);

  useEffect(() => {
    if (esEdicion) {
      const cargarPaciente = async () => {
        setLoading(true);
        try {
          const paciente = await getPaciente(id as string);
          if (paciente) {
            const { id: _, ...datosPaciente } = paciente;
            setFormData(datosPaciente);
          } else {
            toast.error("No se encontró el paciente");
            navigate("/pacientes");
          }
        } catch (error) {
          console.error("Error al cargar paciente:", error);
          toast.error("Error al cargar los datos del paciente");
        } finally {
          setLoading(false);
        }
      };

      cargarPaciente();
    }
  }, [id, esEdicion, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (esEdicion && id) {
        await actualizarPaciente({ id, ...formData });
        toast.success("Paciente actualizado correctamente");
      } else {
        await crearPaciente(formData);
        toast.success("Paciente creado correctamente");
      }
      navigate("/pacientes");
    } catch (error) {
      console.error("Error al guardar paciente:", error);
      toast.error(esEdicion ? "Error al actualizar el paciente" : "Error al crear el paciente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {esEdicion ? "Editar" : "Nuevo"} Paciente
        </h2>
        <p className="text-muted-foreground">
          {esEdicion
            ? "Actualiza los datos del paciente."
            : "Completa el formulario para registrar un nuevo paciente."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos del paciente</CardTitle>
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
                <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <Textarea
                  id="diagnostico"
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  placeholder="Diagnóstico del paciente"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="objetivos">Objetivos terapéuticos</Label>
                <Textarea
                  id="objetivos"
                  name="objetivos"
                  value={formData.objetivos}
                  onChange={handleChange}
                  placeholder="Objetivos a trabajar en la terapia"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Observaciones adicionales"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/pacientes")}
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

export default PacienteForm;
