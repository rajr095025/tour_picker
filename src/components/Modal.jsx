import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(function Modal(
  { children, isOpen, openHandler },
  ref
) {
  const dialog = useRef();

  // useImperativeHandle(ref, () => {
  //   return {
  //     open: () => {
  //       dialog.current.showModal();
  //     },
  //     close: () => {
  //       dialog.current.close();
  //     },
  //   };
  // });

  useEffect(() => {
    if (isOpen) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [isOpen]);

  return createPortal(
    <dialog className="modal" ref={dialog}>
      {isOpen ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
});

export default Modal;
