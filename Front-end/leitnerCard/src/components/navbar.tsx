import { Container, Nav, Navbar } from 'react-bootstrap';
import LogOut from './logout'; 

function NavbarFunction() {
  return (
    <Navbar bg="primary" variant="dark" className='shadow'>
      <Container>
        <Navbar.Brand href="#home">MindKit</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/profile">Profile</Nav.Link>
        </Nav>
        <Nav>
          <LogOut />
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavbarFunction;
