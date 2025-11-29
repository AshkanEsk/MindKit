import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as motion from "motion/react-client";

interface RegModalinterface{
    launchBtnTxt: string;
    children: React.ReactNode;
}

function RegModal({launchBtnTxt, children}:RegModalinterface) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
        <motion.button
            whileHover={{
                scale: 1.1,
                backgroundColor: "#02fde8ff",
                color:'#4e08f1cc'
            }}
            whileTap={{ scale: 0.95 }}
            transition={{duration: 0.1}}
            className="btn btn-primary w-50 my-2"
            style={{
                backgroundColor: "#2e20ebff",
                color: "#ffffff",
                border: "none",
            }}
            onClick={handleShow}
          >
            {launchBtnTxt}
        </motion.button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {children}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RegModal;