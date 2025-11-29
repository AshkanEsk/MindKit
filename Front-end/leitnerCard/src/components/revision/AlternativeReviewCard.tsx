import Card from 'react-bootstrap/Card';

interface AlternativeReviewCardProps {
    progress: string;
    text: string;
    option1: string;
    option2: string;
    option3: string;
    handleClick: (selected: string) => void;
}

function AlternativeReviewCard({
    progress = 'test',
    text = 'test',
    option1 = 'test1',
    option2 = 'test2',
    option3 = 'test3',
    handleClick,
}: AlternativeReviewCardProps) {
    return (
        <Card>
        <Card.Body>
            <Card.Title>Choose Correct Option</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{progress}</Card.Subtitle>
            <Card.Text>{text}</Card.Text>
            <Card.Link onClick={() => handleClick(option1)}>{option1}</Card.Link>
            <Card.Link onClick={() => handleClick(option2)}>{option2}</Card.Link>
            <Card.Link onClick={() => handleClick(option3)}>{option3}</Card.Link>
        </Card.Body>
        </Card>
    );
}

export default AlternativeReviewCard;