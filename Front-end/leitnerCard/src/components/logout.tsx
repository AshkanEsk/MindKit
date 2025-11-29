import { useContext } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { UserContext } from './userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogOut: React.FC = () => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) {
    throw new Error('LogOut must be used within a UserProvider');
  }


  const handleLogout = () => {
    axios.get('/logout')
    .then(function (response) {
      localStorage.removeItem('authToken');
      console.log(response);
      navigate('/');
    })
    .catch(function (error) {
      console.log(error);
      navigate('/profile');
    })
    .finally(function () {
      // always executed
    })
    
    
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Log out
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={handleLogout}>
          Log out
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default LogOut;