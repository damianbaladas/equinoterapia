
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./pages/Dashboard";
import PacientesPage from "./pages/pacientes/PacientesPage";
import PacienteForm from "./pages/pacientes/PacienteForm";
import PacienteDetalle from "./pages/pacientes/PacienteDetalle";
import PersonalPage from "./pages/personal/PersonalPage";
import PersonalForm from "./pages/personal/PersonalForm";
import PersonalDetalle from "./pages/personal/PersonalDetalle";
import CaballosPage from "./pages/caballos/CaballosPage";
import CaballoForm from "./pages/caballos/CaballoForm";
import CaballoDetalle from "./pages/caballos/CaballoDetalle";
import SesionesPage from "./pages/sesiones/SesionesPage";
import SesionForm from "./pages/sesiones/SesionForm";
import SesionDetalle from "./pages/sesiones/SesionDetalle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <div className="container py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pacientes" element={<PacientesPage />} />
                <Route path="/pacientes/nuevo" element={<PacienteForm />} />
                <Route path="/pacientes/:id" element={<PacienteDetalle />} />
                <Route path="/pacientes/:id/editar" element={<PacienteForm />} />
                <Route path="/personal" element={<PersonalPage />} />
                <Route path="/personal/nuevo" element={<PersonalForm />} />
                <Route path="/personal/:id" element={<PersonalDetalle />} />
                <Route path="/personal/:id/editar" element={<PersonalForm />} />
                <Route path="/caballos" element={<CaballosPage />} />
                <Route path="/caballos/nuevo" element={<CaballoForm />} />
                <Route path="/caballos/:id" element={<CaballoDetalle />} />
                <Route path="/caballos/:id/editar" element={<CaballoForm />} />
                <Route path="/sesiones" element={<SesionesPage />} />
                <Route path="/sesiones/nueva" element={<SesionForm />} />
                <Route path="/sesiones/:id" element={<SesionDetalle />} />
                <Route path="/sesiones/:id/editar" element={<SesionForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
