import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Prisma } from "@prisma/client";
import { PremiumCardBadge } from "./premium-badge";

type UserWithSubscription = Prisma.UserGetPayload<{
  include: { subscription: true };
}>;

interface ProfessionalsProps {
  professionals: UserWithSubscription[];
}

export function Professionals({ professionals }: ProfessionalsProps) {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl text-center mb-12 font-bold">
          Clinícas disponiveis
        </h2>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((clinic) => (
            <Card
              className="overflow-hidden hover:shadow-lg duration-300 p-0 gap-0"
              key={clinic.id}
            >
              <div className="">
                <div className="relative h-48 w-full">
                  <Image
                    src={clinic.image ?? "/foto1.png"}
                    alt="Foto do profissional"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />

                  {clinic?.subscription?.status === "ATIVO" &&
                    clinic?.subscription?.plano === "PRO" && (
                      <PremiumCardBadge />
                    )}
                </div>
              </div>
              <CardContent className="p-4 space-y-4 min-h-[160px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="">
                    <h3 className="text-lg font-semibold">{clinic.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {clinic.address ?? "Endereço nao informado."}
                    </p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <Link
                  href={`/clinica/${clinic.id}`}
                  target="_blank"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center py-2 rounded-md text-sm md:text-base font-medium"
                >
                  Agendar consulta
                  <ArrowRight className="ml-2" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </section>
  );
}
