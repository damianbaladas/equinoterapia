
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSesion,
  crearSesion,
  actualizarSesion,
  getPacientes,
  getCaballos,
  getPersonal,
} from "@/lib/data";
import { Sesion, Paciente, Caballo, Personal } from "@/lib/types";
import { toast } from "sonner";

const SesionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [caballos, setCaballos] = useState<Caballo[]>([]);
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [formData, setFormData] = useState<Omit<Sesion, "id">>({
    fecha: new Date().toISOString().split("T")[0],
    hora: "09:00",
    pacienteId: "",
    caballoId: "",
    personalId: "",
    duracion: "45 minutos",
    actividades: "",
    observaciones: "",
    estado: "programada",
  });

  const esEdicion = Boolean(id);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        // Cargar listas de pacientes, caballos y personal
        const [pacientesData, caballosData, personalData] = await Promise.all([
          getPacientes(),
          getCaballos(),
          getPersonal(),
        ]);
        setPacientes(pacientesData);
        setCaballos(caballosData);
        setPersonal(personalData);

        // Si es edición, cargar datos de la sesión
        if (esEdicion && id) {
          const sesion = await getSesion(id);
          if (sesion) {
            const { id: _, paciente: __, caballo: ___, personal: ____, ...datosSesion } = sesion;
            setFormData(datosSesion);
          } else {
            toast.error("No se encontró la sesión");
            navigate("/sesiones");
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar la información necesaria");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, esEdicion, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.pacienteId || !formData.caballoId || !formData.personalId) {
        toast.error("Por favor, complete todos los campos obligatorios");
        setLoading(false);
        return;
      }

      if (esEdicion && id) {
        await actualizarSesion({ id, ...formData });
        toast.success("Sesión actualizada correctamente");
      } else {
        await crearSesion(formData);
        toast.success("Sesión creada correctamente");
      }
      navigate("/sesiones");
    } catch (error) {
      console.error("Error al guardar sesión:", error);
      toast.error(
        esEdicion ? "Error al actualizar la sesión" : "Error al crear la sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {esEdicion ? "Editar" : "Nueva"} Sesión
        </h2>
        <p className="text-muted-foreground">
          {esEdicion
            ? "Actualiza los datos de la sesión."
            : "Completa el formulario para programar una nueva sesión."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Hora *</Label>
                <Input
                  id="hora"
                  name="hora"
                  type="time"
                  value={formData.hora}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pacienteId">Paciente *</Label>
                <Select
                  value={formData.pacienteId}
                  onValueChange={(value) => handleSelectChange("pacienteId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientes.map((paciente) => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {paciente.nombre} {paciente.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caballoId">Caballo *</Label>
                <Select
                  value={formData.caballoId}
                  onValueChange={(value) => handleSelectChange("caballoId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar caballo" />
                  </SelectTrigger>
                  <SelectContent>
                    {caballos.map((caballo) => (
                      <SelectItem key={caballo.id} value={caballo.id}>
                        {caballo.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personalId">Terapeuta *</Label>
                <Select
                  value={formData.personalId}
                  onValueChange={(value) => handleSelectChange("personalId", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar terapeuta" />
                  </SelectTrigger>
                  <SelectContent>
                    {personal.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.nombre} {persona.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duracion">Duración</Label>
                <Input
                  id="duracion"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  placeholder="Ej: 45 minutos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleSelectChange("estado", value as "programada" | "completada" | "cancelada")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programada">Programada</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="actividades">Actividades</Label>
                <Textarea
                  id="actividades"
                  name="actividades"
                  value={formData.actividades}
                  onChange={handleChange}
                  placeholder="Actividades planificadas"
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
                onClick={() => navigate("/sesiones")}
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

export default SesionForm;
