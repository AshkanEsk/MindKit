import { Form, Stack } from "react-bootstrap";
import * as motion from "motion/react-client";
import RegModal from "./RegistrationModal";
import ResetPassword from "./ResetPassword";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface SignInProps {
  Rotate: () => void;
}

export default function SignIn({ Rotate }: SignInProps) {
  const [userName, setUserName] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleSignIn = async () => {
    setShowError(false)
    
    try {
      console.log(`----->${userName}, ${pass}`)
      const response = await axios.post('http://127.0.0.1:8000/signin/', {
        username: userName,
        password: pass,
      });
      localStorage.setItem('authToken', response.data.token);
      navigate('/profile');
    } catch (err: any) {
      setShowError(true);
      // choose one of the following
      const msg = err.response?.data?.non_field_errors?.[0]  // first message
              ?? err.response?.data?.detail
              ?? 'Unexpected error';
      setError(msg);          // <= now it is a string
    }
  };

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 2,
          scale: { type: "spring", visualDuration: 1, bounce: 0.5 },
        }}
      >
        <Form
          className="w-100 my-3 align-items-center"
          style={{ minWidth: '350px' }}
          onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}
        >
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setUserName(e.currentTarget.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your Password"
              onChange={(e) => setPass(e.currentTarget.value)}
            />
          </Form.Group>
          {showError && <div className="text-danger">{error}</div>}
        </Form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}
      >
        <motion.button
          whileHover={{
            scale: 1.1,
            backgroundColor: "#eb2031ff",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className="btn btn-primary w-100 my-2"
          style={{
            backgroundColor: "#2e20ebff",
            color: "#ffffff",
            border: "none",
          }}
          onClick={handleSignIn}
        >
          Sign In
        </motion.button>

        <Stack direction="horizontal" gap={3}>
          <RegModal launchBtnTxt="Forget Password">
            <ResetPassword />
          </RegModal>

          <motion.button
            whileHover={{
              rotate: 360,
              scale: 1.1,
              background: '#18f803bb',
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 1 }}
            className="btn w-50"
            style={{
              backgroundColor: "#2e20ebff",
              color: "#ffffff",
              border: "none",
            }}
            onClick={Rotate}
          >
            Sign UP
          </motion.button>
        </Stack>
      </motion.div>
    </section>
  );
}