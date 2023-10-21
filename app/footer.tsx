import { Card, CardHeader, CardBody } from "@nextui-org/card";

export default function Footer() {
  return (
    <footer className="relative z-10 ">
      <Card radius="none">
        <CardHeader className="justify-between">
          <h4 className="tracking-tight font-semibold text-xl">
            <div className="flex gap-2 items-center">
              Creado por{" "}
              <span className="from-[#6FEE8D] to-[#17c964] bg-clip-text text-transparent bg-gradient-to-b text-4xl">
                G-iga
              </span>
            </div>
          </h4>
          <h5 className="tracking-tight text-default-400 text-lg">
            © {new Date().getFullYear()} Todos los derechos reservados
          </h5>
        </CardHeader>
      </Card>
    </footer>
  );
}
