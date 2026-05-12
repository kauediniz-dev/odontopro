"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "components/ui/button";
import { Pencil, Plus, X } from "lucide-react";
import { DialogService } from "./dialog-service";
import { Service } from "@prisma/client";
import formatCurrency from "@/utils/formatCurrency";
import { deleteService } from "../_actions/delete-service";
import { toast } from "sonner";

interface ServicesListProps {
  services: Service[];
}

export function ServicesList({ services }: ServicesListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleDeleteService(serviceId: string) {
    const response = await deleteService({ serviceId: serviceId });

    if (response.error) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <section className="mx-auto">
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl md:text-2xl font-bold">
              Serviços
            </CardTitle>
            <DialogTrigger asChild>
              <Button>
                <Plus className=" h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogService
                closeModal={() => {
                  setIsDialogOpen(false);
                }}
              />
            </DialogContent>
          </CardHeader>
          <CardContent>
            <section className="space-y-4 mt-5">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{service.name}</span>
                    <span className="text-gray-500">-</span>
                    <span className="text-gray-500">
                      {formatCurrency(service.price / 100)}
                    </span>
                  </div>
                  <div className="">
                    <Button variant="ghost" size="icon" onClick={() => {}}>
                      <Pencil className=" h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <X className=" h-4 w-4" />
                    </Button>
                  </div>
                </article>
              ))}
            </section>
          </CardContent>
        </Card>
      </section>
    </Dialog>
  );
}
