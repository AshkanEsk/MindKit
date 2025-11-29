import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ModalComponentInput {
  launchButtonText: string;
  launchButtonStyle?: string;
  modalHeadingText?: string;
  saveButtonText?: string;
  children?: React.ReactNode;
  handleSave?: () => void;
  handleLaunchButton?: () => void;
}

function ModalComponent({
  launchButtonText,
  launchButtonStyle,
  modalHeadingText,
  saveButtonText,
  children,
  handleSave,
  handleLaunchButton
}: ModalComponentInput) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button className={launchButtonStyle} variant="primary" onClick={() => {
        handleShow();
        if (handleLaunchButton) handleLaunchButton();
      }}>
        {launchButtonText}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalHeadingText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              if (handleSave) handleSave();
            }}
          >
            {saveButtonText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalComponent;
