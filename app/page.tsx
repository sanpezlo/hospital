import RequestMedicalAppointment from "@/app/request-medical-appointment";

export default function HomePage() {
  return (
    <div className="my-6 gap-6 grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col">
        <h2 className="tracking-tight font-semibold text-5xl">
          <span>Tu salud es importante</span>
          <div>
            solicita una{" "}
            <span className="from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent bg-gradient-to-b">
              cita médica
            </span>{" "}
            ahora mismo
          </div>
        </h2>
        <p className="w-full md:w-1/2 my-2 text-lg lg:text-xl font-normal text-default-500 block max-w-full">
          te brindamos la oportunidad de cuidar de ti mismo de una manera simple
          y eficaz.
        </p>
      </div>
      <div>
        <RequestMedicalAppointment />
      </div>
    </div>
  );
}
