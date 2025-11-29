import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface NewCardInput{
  header?:string;
  title?:string;
  text?:string;
  buttonText?:string;
  handleClick?: ()=> void;
}

function NewCard( {header, title, text, buttonText, handleClick}:NewCardInput) {
  
  return (
    <Card className="text-center text-bg-warning m-3">
      <Card.Header>{header}</Card.Header>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>
          {text}
        </Card.Text>
        <Button variant="primary" onClick={handleClick}>{buttonText}</Button>
      </Card.Body>
    </Card>
  );
}

export default NewCard;