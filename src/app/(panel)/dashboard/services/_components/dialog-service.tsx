"use client";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DialogService() {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Adicionar Serviço</DialogTitle>
        <DialogDescription>
          Preencha os campos abaixo para adicionar um novo serviço.
        </DialogDescription>
      </DialogHeader>
      <div className="">
        <h1>Conteudo do Modal</h1>
      </div>
    </>
  );
}
