import axios from "axios";
import { useState, ChangeEvent } from "react";
import { useNavigate } from 'react-router-dom';

interface IFormInput {
  username: string;
  email: string;
  full_name?: string;
  phone_no?: string;
  profile_image?: FileList;
  password: string;
  confirmPassword: string;
  gender: string;
}

interface EmailConfirmationProps {
  user: Partial<IFormInput>;
}

export default function EmailConfirmation({ user }: EmailConfirmationProps) {
  const [show, setShow] = useState(false);
  const [code, setCode] = useState('');
  let navigate = useNavigate();

  const handleSendCodeButton = () => {
    axios.post('http://127.0.0.1:8000/emailconfirmation/', {
      email: user.email,
    })
    .then(function (response) {
      console.log(response.data['code']);
      setCode(response.data['code']);
      setShow(true);
    })
    .catch(function (error) {
      console.log(error);
    });
  };


  const handleConfirmationCode = async (e: ChangeEvent<HTMLInputElement>) => {
    const inputCode = e.target.value;
    if (String(code) === String(inputCode)) {
      console.log('Verification successful:', code);
      try {
        const response = await axios.post('http://127.0.0.1:8000/signup/', {
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          phone_no: user.phone_no,
          password: user.password,
        });
        console.log('User signup confirmation response:', response.data);
        navigate('/', { replace: true });
      }  catch (error: any) {
        if (error.response) {
          console.error("Signup failed:", error.response.data);
          alert(JSON.stringify(error.response.data, null, 2));
        } else {
          console.error("Unexpected error:", error);
        }
      }
    }
  };

  return (
    <>
      <div className="input-group mb-3">
        <button onClick={handleSendCodeButton} className="btn btn-outline-secondary" type="button" id="button-addon1">
          Send Code
        </button>
        <input type="text" className="form-control" value={user.email} readOnly />
      </div>
      {show && 
        <div className="input-group mb-3">
          <span className="input-group-text" id="inputGroup-sizing-default">Enter Code</span>
          <input type="text" className="form-control" onChange={handleConfirmationCode} />
        </div>
      }
    </>
  );
}
