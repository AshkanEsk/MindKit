import React from 'react';
import Card from 'react-bootstrap/Card';

interface CardInput {
  cardtitle: string;
  cards_no: string;
  editLink: string;
  reviewLink: string;
}

const ProfileCard: React.FC<CardInput> = ({ editLink, reviewLink, cardtitle, cards_no }) => {
  return (
    <Card
      className='my-2'
      style={{
        width: '100%',
        boxShadow: '10px 10px 5px lightblue',
        background: 'linear-gradient(45deg, rgb(175, 251, 35) 0%, rgb(26, 158, 33) 40%)',
      }}
    >
      <Card.Body>
        <Card.Title>{cardtitle}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{cards_no}</Card.Subtitle>
        <Card.Link style={{ color: 'black' }} href={editLink}>
          Edit
        </Card.Link>
        <Card.Link style={{ color: 'black' }} href={reviewLink}>
          Review
        </Card.Link>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
