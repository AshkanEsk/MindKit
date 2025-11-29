import { useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import SignIn from "./signinform";
import SignUpForm from "./signupform";


export default function RegistrationPage() {
  const [showSignIn, setShowSignIn] = useState(true);
  return (
    <Container 
      className="border rounded shadow align-items-center my-5"
      style={{maxWidth:'1000px', maxHeight:"1000px"}} 
      >
      <Row>
        <Col
          md={5}
          className="d-flex flex-column justify-content-center align-items-center p-5"
          style={{
            background: '#fdf695ff',
          }}
        >
          {showSignIn ? (
            <SignIn Rotate={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm Rotate={() => setShowSignIn(true)} />
          )}
        </Col>
        <Col
          md={7}
          className="p-0 d-none d-md-block"
          style={{

          }}
        >
          <Image
            src="https://picsum.photos/seed/picsum/700/850"
            className="shadow"
            fluid
            style={{ height: '100%', objectFit: 'cover' }}
          />
        </Col>
      </Row>
     
    </Container>
  );
}