
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Horse as HorseIcon } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center gap-2 font-semibold">
          <HorseIcon className="h-6 w-6 text-primary" />
          <span>Centro de Equinoterapia</span>
        </div>
        <nav className="ml-auto flex gap-4 items-center">
          <Button asChild variant="ghost">
            <Link to="/">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/pacientes">Pacientes</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/personal">Personal</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/caballos">Caballos</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/sesiones">Sesiones</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
