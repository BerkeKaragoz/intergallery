import { Dialog, DialogProps } from "@mui/material"
import React, { useState } from "react"

type ModalHookReturns<T> = [T, () => void, () => void]

/**
 *
 * @returns [Component, openHandler, closeHandler]
 */
const useAppModal = (openCallback?: () => void, closeCallback?: () => void) => {
   const [open, setOpen] = useState(false)

   const openHandler = () => {
      setOpen(true)

      if (openCallback) openCallback()
   }

   const closeHandler = () => {
      setOpen(false)

      if (closeCallback) closeCallback()
   }

   const Component: React.FC<Omit<DialogProps, "open" | "onClose">> = (props) => (
      <Dialog open={open} onClose={closeHandler} {...props} />
   )

   return [Component, openHandler, closeHandler] as ModalHookReturns<
      typeof Component
   >
}

export default useAppModal
