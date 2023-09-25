"use client";

import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

export default function Center() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [data, setData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("/api/center", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      setData({
        name: "",
        address: "",
        city: "",
        phone: "",
        email: "",
      });
    } else if (response.status === 400) {
      if (body.error.error) {
        Object.keys(body.error.error).forEach((key) => {
          if (key === "_errors") return;
          setErrors((prev) => ({
            ...prev,
            [key]: body.error.error[key]._errors[0],
          }));
        });
      } else {
        onOpen();
        setErrors((prev) => ({ ...prev, name: body.error.message }));
      }
    } else {
      console.log({ response, body });
    }
  };

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          isRequired
          label="Nombre"
          placeholder="Ingrese el nombre"
          type="text"
          value={data.name}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, name: "" }));
            setData({ ...data, name: e.target.value });
          }}
          isInvalid={Boolean(errors.name)}
          errorMessage={errors.name}
        />
        <Input
          isRequired
          label="Dirección"
          placeholder="Ingrese la dirección"
          type="text"
          value={data.address}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, address: "" }));
            setData({ ...data, address: e.target.value });
          }}
          isInvalid={Boolean(errors.address)}
          errorMessage={errors.address}
        />
        <Input
          isRequired
          label="Ciudad"
          placeholder="Ingrese la ciudad"
          type="text"
          value={data.city}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, city: "" }));
            setData({ ...data, city: e.target.value });
          }}
          isInvalid={Boolean(errors.city)}
          errorMessage={errors.city}
        />
        <Input
          isRequired
          type="text"
          label="Teléfono"
          placeholder="Ingrese el teléfono"
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">+57</span>
            </div>
          }
          value={data.phone}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, phone: "" }));
            setData({ ...data, phone: e.target.value });
          }}
          isInvalid={Boolean(errors.phone)}
          errorMessage={errors.phone}
        />
        <Input
          isRequired
          label="Correo electrónico"
          placeholder="Ingrese el correo electrónico"
          type="email"
          labelPlacement="inside"
          value={data.email}
          onChange={(e) => {
            setErrors((prev) => ({ ...prev, email: "" }));
            setData({ ...data, email: e.target.value });
          }}
          isInvalid={Boolean(errors.email)}
          errorMessage={errors.email}
        />

        <div className="flex gap-2 justify-end">
          <Button
            fullWidth
            color="primary"
            type="submit"
            isDisabled={
              !data.name ||
              !data.address ||
              !data.city ||
              !data.phone ||
              !data.email ||
              Boolean(errors.name) ||
              Boolean(errors.address) ||
              Boolean(errors.city) ||
              Boolean(errors.phone) ||
              Boolean(errors.email)
            }
          >
            Crear Centro
          </Button>
        </div>
      </form>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        scrollBehavior="outside"
        placement="bottom"
        backdrop="transparent"
        classNames={{
          base: "bg-primary text-foreground",
          closeButton: "text-white hover:bg-[#66aaf9]",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Centro creado exitosamente
              </ModalHeader>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
