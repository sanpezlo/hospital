import React, { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function ChangePassword({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [data, setData] = useState({
    password: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    newPassword: "",
  });

  const [isVisible, setIsVisible] = useState({
    password: false,
    newPassword: false,
  });

  const handleSubmit = async (onClose: () => void) => {
    const response = await fetch("/api/user/self", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await response.json();

    if (response.ok) {
      onClose();
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
        setErrors((prev) => ({ ...prev, password: body.error.message }));
      }
    } else {
      console.log({ response, body });
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1>Camibiar contraseña</h1>
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label="Contraseña actual"
                placeholder="Ingrese su contraseña actual"
                variant="bordered"
                type={isVisible.password ? "text" : "password"}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, password: e.target.value }))
                }
                isInvalid={Boolean(errors.password)}
                errorMessage={errors.password}
                value={data.password}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() =>
                      setIsVisible((prev) => ({
                        ...prev,
                        password: !prev.password,
                      }))
                    }
                  >
                    {isVisible ? (
                      <EyeSlashIcon className="text-default-400 pointer-events-none w-6" />
                    ) : (
                      <EyeIcon className="text-default-400 pointer-events-none w-6" />
                    )}
                  </button>
                }
              />
              <Input
                label="Nueva contraseña"
                placeholder="Ingrese su nueva contraseña"
                type={isVisible.newPassword ? "text" : "password"}
                variant="bordered"
                onChange={(e) =>
                  setData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                isInvalid={Boolean(errors.newPassword)}
                errorMessage={errors.newPassword}
                value={data.newPassword}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() =>
                      setIsVisible((prev) => ({
                        ...prev,
                        newPassword: !prev.newPassword,
                      }))
                    }
                  >
                    {isVisible ? (
                      <EyeSlashIcon className="text-default-400 pointer-events-none w-6" />
                    ) : (
                      <EyeIcon className="text-default-400 pointer-events-none w-6" />
                    )}
                  </button>
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  handleSubmit(onClose);
                }}
              >
                Cambiar contraseña
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
