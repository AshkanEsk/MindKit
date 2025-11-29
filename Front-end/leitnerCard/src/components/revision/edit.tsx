import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Accordions from './accordion';

const Edit: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid ID provided.</div>;
  }

  return (
    <Container fluid className="revision-container" style={{background: 'linear-gradient(30deg,#40BFA8 0%,#FEECAD 40%)'}}>
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs={12} md={10} lg={8} xl={6} className="revision-col">
          <h2 className="revision-title">Revisions Dashboard</h2>
            <Accordions
              title="Category Details"
              description={`Details for Category ID: ${id}`}
              id={parseInt(id, 10)}
            />
        </Col>
      </Row>
    </Container>
  );
}

export default Edit;
