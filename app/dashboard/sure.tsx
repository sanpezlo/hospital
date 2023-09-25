import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

export default function Sure({
  isOpen,
  onOpen,
  onOpenChange,
  onPress,
  entity,
  list,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  onPress: () => void;
  entity: string;
  list: {
    [key: string]: string;
  };
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h1>
                ¿Está seguro de crear un{" "}
                <span className="font-bold text-primary">{entity}</span>?
              </h1>
            </ModalHeader>
            <ModalBody>
              <p className="flex flex-col gap-3">
                La cuenta de {entity.toLocaleLowerCase()} se creará con los
                siguientes datos:
                <ul className="list-disc list-inside">
                  {Object.keys(list).map((key, index) => (
                    <li key={`${key}-${index}`}>
                      <span>{key}: </span>
                      {list[key]}
                    </li>
                  ))}
                </ul>
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button
                color="primary"
                onPress={(e) => {
                  onPress();
                  onClose();
                }}
              >
                Crear
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
