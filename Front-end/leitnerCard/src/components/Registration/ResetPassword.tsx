import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import * as motion from "motion/react-client"

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [code, setCode] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [codeMatch, setCodeMatch] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!enteredCode) {
      setCodeMatch(false);
      return;
    }
    setCodeMatch(Number(enteredCode) === Number(code));
  }, [enteredCode, code]);

  const handleSendCode = async () => {
    setShowCodeInput(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/changepassword/',
      {
        email: email,
      });
      console.log('User signup confirmation response:', response.data);
      setCode(response.data['code']);
      setMessage(response.data['message']);
    } catch (error: any) {
      if (error.response) {
        setMessage(error.response.data.message || "Something went wrong.");
      } else {
        setMessage("Unexpected error occurred.");
      }
    }
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.put('http://127.0.0.1:8000/signup/', {
        password: pass1,
      });
      console.log('Password reset response:', response.data);
    } catch (error: any) {
      if (error.response) {
        console.error("Password reset failed:", error.response.data);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <section>
      <InputGroup className="mb-3">
        <Form.Control
          onChange={(e) => setEmail(e.currentTarget.value)}
          placeholder="Enter Email and press Button"
        />
        <Button onClick={handleSendCode}>Send Code</Button>
      </InputGroup>

      {showCodeInput && (
        <InputGroup className="mb-3">
          <InputGroup.Text>Enter Code</InputGroup.Text>
          <Form.Control
            placeholder="46528"
            value={enteredCode}
            onChange={(e) => {setEnteredCode(e.currentTarget.value)}}
          />
        </InputGroup>
      )}
      <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 1, bounce: 0.5 },
            }}
      >
        {message && 
          <Alert key='primary' variant='primary' className="d-flex justify-content-center">
            {message}
          </Alert>
        }
      </motion.div>
    
      {codeMatch && (
        <div>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={pass1}
            onChange={(e) => setPass1(e.currentTarget.value)}
          />
          <Form.Text id="passwordHelpBlock" muted>
            Your password must be 8-20 characters long, contain letters and numbers,
            and must not contain spaces, special characters, or emoji.
          </Form.Text>

          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={pass2}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setPass2(value);
              setPasswordsMatch(pass1 === value);
            }}
          />

          {!passwordsMatch && (
            <Form.Text className="text-danger">
              Passwords do not match.
            </Form.Text>
          )}
        </div>
      )}
      <Button 
        onClick={handleConfirm}
        disabled={!passwordsMatch}
      >
        Confirm
      </Button>
    </section>
  );
}