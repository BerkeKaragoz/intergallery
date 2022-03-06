import { Dialog, DialogProps } from "@mui/material";
import React, { useState } from "react";

type ModalHookReturns<T> = [T, () => void, () => void];

/**
 *
 * @returns [Component, openHandler, closeHandler]
 */
const useModal = () => {
  const [open, setOpen] = useState(false);

  const openHandler = () => {
    setOpen(true);
  };

  const closeHandler = () => {
    setOpen(false);
  };

  const Component: React.FC<Omit<DialogProps, "open" | "onClose">> = (
    props,
  ) => <Dialog open={open} onClose={closeHandler} {...props} />;

  return [Component, openHandler, closeHandler] as ModalHookReturns<
    typeof Component
  >;
};

export default useModal;
