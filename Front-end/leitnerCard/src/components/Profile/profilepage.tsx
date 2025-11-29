import { Col, Row, Container } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import InputReadOnly from './readonlyinput';
import ProfileCard from './card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from '../revision/select';
import LoadingAnimationHash from '../LoadingAnimation';
import { motion } from 'framer-motion';

interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  phone_no: string;
  gender: string;
}

interface ProfileData {
  user: User;
  categories: { id: number; title: string }[];
}

const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/profile/",
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const categories = response.data.categories.map((cat: [number, string]) => ({
          id: cat[0],
          title: cat[1],
        }));
        setProfileData({ ...response.data, categories });
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error.response || error.message);
        if (error.response?.status === 401) {
          navigate('/', { replace: true });
        } else {
          navigate('/error', { replace: true });
        }
      });
  }, [navigate]);

  if (!profileData) {
    return <LoadingAnimationHash />;
  }

  return (
    <Container fluid className="p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
            duration: 0.4,
            scale: { type: "spring", visualDuration: 0.4, bounce: 0.2 },
        }}
      >
        <Row className="justify-content-center align-items-center text-bg-info p-4 rounded border shadow">
          <Col xs={12} md={4} className="text-center mb-4">
            <Image
              src={`https://avatar.iran.liara.run/public/${profileData.user.gender == 'M'? 'boy':'girl'}`}
              roundedCircle
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                border: '3px solid #007bff',
              }}
            />
          </Col>
          <Col xs={12} md={8}>
            <Row>
              <Col xs={12} md={6} className="mb-3">
                <InputReadOnly inputText={profileData.user.username} />
              </Col>
              <Col xs={12} md={6} className="mb-3">
                <InputReadOnly inputText={profileData.user.fullname} />
              </Col>
              <Col xs={12} md={6} className="mb-3">
                <InputReadOnly inputText={profileData.user.email} />
              </Col>
              <Col xs={12} md={6} className="mb-3">
                <InputReadOnly inputText={profileData.user.phone_no} />
              </Col>
            </Row>
          </Col>
        </Row>
      </motion.div>
      <motion.div
        animate={{
          x: [100, 0],
          transition: { times: [1, 0] }
        }}
      >
        <Row
          className="justify-content-center align-items-center rounded border shadow m-1 p-2"
          style={{ background: 'linear-gradient(30deg, #40BFA8 0%, #FEECAD 40%)' }}
        >
          <Col xs={12} md={8}>
            <Select categories={profileData.categories} user={profileData.user.username} />
          </Col>

          <Col className="my-2" style={{ minHeight: '200px' }}>
            {profileData.categories.slice(0, 3).map(({ id, title }) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 1.025 }}
                style={{ marginBottom: '20px' }}
              >
                <ProfileCard
                  cardtitle={title}
                  cards_no="10"
                  editLink={`/cards/edit/${id}/`}
                  reviewLink={`/review/${id}/`}
                />
              </motion.div>
            ))}
          </Col>

          {/* If more than 3 categories exist, render the rest in another column */}
          {profileData.categories.length > 3 && (
            <Col xs={12} md={5}>
              {profileData.categories.slice(3).map(({ id, title }) => (
                <ProfileCard
                  key={id}
                  cardtitle={title}
                  cards_no="10"
                  editLink={`/cards/edit/${id}/`}
                  reviewLink={`/review/${id}/`}
                />
              ))}
            </Col>
          )}
        </Row>
      </motion.div>
    </Container>
  );
};

export default ProfilePage;
