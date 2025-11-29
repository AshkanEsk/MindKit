import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

interface ReviewCardInput {
    category: string;
    title: string;
    definition: string;
    handleClick: () => void; // Check button
    handleClick2: () => void; // Correct button
    handleClick3: () => void; // Wrong button
    handleClick4: () => void; // Turn back button
    show: boolean; // Controls button visibility
}

function ReviewCard({ category, title, definition, handleClick, handleClick2, handleClick3, handleClick4, show }: ReviewCardInput) {
    return (
        <Card>
            <Card.Header>{category}</Card.Header>
            <Card.Body>
                <Card.Title>
                    {show? title : ''}
                </Card.Title>
                <Card.Text>
                    <pre>
                        {show ? '' : definition}
                    </pre>
                </Card.Text>
                {show ? (
                    // Show Check button when show is true
                    <Button variant="primary" onClick={handleClick}>Check</Button>
                ) : (
                    // Show Correct, Wrong, and Turn Back buttons when show is false
                    <>
                        <Button variant="success" onClick={handleClick2}>Correct</Button>
                        <Button variant="secondary" onClick={handleClick4}>Turn Back</Button>
                        <Button variant="danger" onClick={handleClick3}>Wrong</Button>
                    </>
                )}
            </Card.Body>
        </Card>
    );
}

export default ReviewCard;