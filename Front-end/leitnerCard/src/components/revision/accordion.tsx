import axios from 'axios';
import { useEffect, useState } from 'react';
import Accordion from "react-bootstrap/Accordion";
import { useNavigate } from 'react-router-dom';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

interface AccordionInput {
  id: number;
  title: string;
  description: string;
}

function Accordions({ id, title, description }: AccordionInput) {
  console.log("Category ID in Accordions:", id);
  const [cards, setCards] = useState<{ id: number; title: string; definition: string }[]>([]);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [editedCard, setEditedCard] = useState<{ id: number; title: string; definition: string } | null>(null);
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/cards/edit/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setCards(response.data);
        console.log("Cards:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching Cards:", error.response || error.message);
        if (error.response?.status === 401) {
          navigate('/profile', { replace: true });
        } else {
          navigate('/error', { replace: true });
        }
      });
  }, [id, navigate]);

  const handleInputChange = (field: string, value: string) => {
    if (editedCard) {
      setEditedCard({ ...editedCard, [field]: value });
    }
  };
  const handleEdit = (card: { id: number; title: string; definition: string }) => {
    setEditedCard(card);
    setHasValueChanged(true);
  };
  const handleSave = async () => {
    if (!editedCard) return;
  
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate('/', { replace: true });
      return;
    }
  
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/cards/edit/card/${editedCard.id}/`,
        editedCard,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("Card updated successfully:", response.data);
      setHasValueChanged(false);
    } catch (error) {
      console.error("Error updating card:", error.response || error.message);
    }
  };

  if (cards.length === 0) {
    return <div>No cards found in this category.</div>;
  }

  return (
    <Accordion defaultActiveKey="0" className="custom-accordion shadow">
      {cards.map((card) => (
        <Accordion.Item key={card.id} eventKey={`${card.id}`} className="accordion-item">
          <Accordion.Header className="accordion-header">{card.title}</Accordion.Header>
          <Accordion.Body className="accordion-body">
            <Form>
              <Form.Group controlId={`title-${card.id}`} className="form-group">
                <Form.Label className="form-label">Title</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editedCard ? editedCard.title : card.title}
                  rows={2}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  readOnly={!hasValueChanged}
                  className="form-control-readonly"
                />
              </Form.Group>
              <Form.Group controlId={`definition-${card.id}`} className="form-group">
                <Form.Label className="form-label">Definition</Form.Label>
                <Form.Control
                  as="textarea"
                  value={editedCard ? editedCard.definition : card.definition}
                  rows={4}
                  onChange={(e) => handleInputChange('definition', e.target.value)}
                  readOnly={!hasValueChanged}
                  className="form-control-readonly"
                />
              </Form.Group>
            </Form>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (hasValueChanged) {
                  handleSave();
                } else {
                  handleEdit(card);
                }
              }}
            >
              {hasValueChanged ? 'Save' : 'Edit'}
            </Button>

          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default Accordions;