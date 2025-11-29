import axios from 'axios';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function RecoveryPassword({ onValueChange }) {
  const [userName, setUserName] = useState<string>('');
  const [code, setCode] = useState<string>();
  const [temp, setTemp] = useState<string>();
  const [canChangePassword, setCanChangePassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFindUsername = () => {
    if (!userName.trim()) {
      setError('Please enter a valid username');
      return;
    }

    setError('');
    setSuccess('Sending code...');

    axios.post('http://127.0.0.1:8000/finduser/', { username: userName })
      .then((response) => {
        setSuccess('Recovery code sent to your email');
        setCode(response.data.code);
      })
      .catch((error) => {
        const message = error.response?.data?.message ||
          'Failed to send recovery code. Please try again later.';
        setError(message);
        setSuccess('');
      });
  };

  const handleCheckCode = () => {
    if (code === temp) {
      setCanChangePassword(true);
      setSuccess('Code verified! Set new password');
      setError('');
    } else {
      setError('Invalid verification code');
    }
  };

  const handleNewPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.currentTarget.value;
    onValueChange({ pass: newPassword, user: userName });
  };

  return (
    <div className="p-3">
      <Form.Label className="mb-2 fw-bold">Password Recovery</Form.Label>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Enter your username"
          onChange={(e) => setUserName(e.target.value)}
        />
        <Button 
          variant="outline-primary" 
          onClick={handleFindUsername}
        >
          Send Code
        </Button>
      </InputGroup>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {code && (
        <div className="mt-4">
          <Form.Label className="mb-2 fw-bold">Verification Code</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Enter 5-digit code from email"
              onChange={(e) => setTemp(e.target.value)}
            />
            <Button 
              variant="outline-primary" 
              onClick={handleCheckCode}
            >
              Verify Code
            </Button>
          </InputGroup>
        </div>
      )}

      {canChangePassword && (
        <div className="mt-4">
          <Form.Label className="mb-2 fw-bold">New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            aria-describedby="passwordHelpBlock"
            onChange={handleNewPassword}
          />
          <Form.Text 
            id="passwordHelpBlock"
            className="text-muted"
          >
            Password requirements: 8-20 characters, letters and numbers only
          </Form.Text>
        </div>
      )}
    </div>
  );
}

export default RecoveryPassword;
