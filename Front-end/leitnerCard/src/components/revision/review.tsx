import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ProgressBarFunction from './progressbar';
import ReviewCard from './reviewcard';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Col } from 'react-bootstrap';
import LoadingAnimationHash from '../LoadingAnimation';
import PieChartWithCustomizedLabel from './PieChart';
import { motion } from 'framer-motion';
import AlternativeReviewCard from './AlternativeReviewCard';

interface ReviewCardInput {
  category: string;
  title: string;
  definition: string;
}

interface AlternativeReviewCardProps {
  progress: string;
  text: string;
  option1: string;
  option2: string;
  option3: string;
  answer: string;
}

export default function Review() {
    const [index, setIndex] = useState(0);
    const [cards, setCards] = useState<ReviewCardInput[]>([]);
    const [corrects, setCorrects] = useState(0);
    const [wrongs, setWrongs] = useState(0);
    const [show, setShow] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [changeToALTR, setChangeToALTR] = useState(false);
    const [ALTR, setALTR] = useState<AlternativeReviewCardProps[]>([]);

    const navigate = useNavigate();
    const { id } = useParams();

    const moveNextCard = () => {
        if (index < cards.length - 1) {
        setIndex(index + 1);
        } else {
        setIsFinished(true);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
        navigate('/', { replace: true });
        return;
        }

        const fetchCards = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/cards/review/${id}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            });
            setCards(response.data);
        } catch (error) {
            console.error("Error fetching cards:", error);
        }
        };

        fetchCards();
    }, [id, navigate]);

    useEffect(() => {
        if (!cards.length || changeToALTR) return;


        const titles = cards.map(card => card.title);
        const prompt = `Generate ${titles.length} fill-in-the-blank sentences using the following words: ${titles.join(', ')}.
                        Each sentence should omit one of the listed words and present it as a blank.
                        For every sentence, return a JSON object with the following structure:
                        {
                            "sentence": "The bookstore invites shoppers to _____ the newest best-seller.",
                            "options": ["title", "description", "profile"],
                            "answer": "title"
                        }
                        Ensure the sentences are vivid, contextually meaningful, and suitable for vocabulary review, and non-native English learners.
                        And Ensure answer is among options, with a random position.
                        Return the entire response as a JSON array of such objects.
                        Return only the JSON array, no code fences, no explanations.`;

         fetch('https://router.huggingface.co/v1/chat/completions', {
            method: 'POST',
            headers: {
            Authorization: `Bearer ${import.meta.env.HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            model: "openai/gpt-oss-120b:groq",
            messages: [{ role: 'user', content: prompt }],
            }),
        })
        .then(async res => {
            const text = await res.text();
            try {
            console.log(`----->${text}`);
            const data = JSON.parse(text);
            const raw = data.choices[0].message.content;
            const parsed = JSON.parse(raw);

            if (
                Array.isArray(parsed) &&
                parsed.every(item =>
                typeof item.sentence === 'string' &&
                Array.isArray(item.options) &&
                item.options.length === 3 &&
                typeof item.answer === 'string'
                )
            ) {
                const formatted = parsed.map((item: any, i: number) => ({
                    progress: `${i + 1}/${parsed.length}`,
                    text: item.sentence,
                    option1: item.options[0],
                    option2: item.options[1],
                    option3: item.options[2],
                    answer: item.answer,
                }));
                setALTR(formatted);
            } else {
                console.error("Invalid format from AI:", parsed);
            }
            } catch (err) {
            console.error("Failed to parse AI response:", text);
            }
        })
        .catch(err => {
            console.error("AI fetch error:", err);
        });
    }, [cards, changeToALTR]);

    const handleCheckButton = () => setShow(false);
    const handleTurnBackButton = () => setShow(true);
    const handleCorrectButton = () => {
        setShow(true);
        setCorrects(corrects + 1);
        moveNextCard();
    };
    const handleWrongButton = () => {
        setShow(true);
        setWrongs(wrongs + 1);
        moveNextCard();
    };

    const showALTR = () => {
        setIndex(0);
        setCorrects(0);
        setWrongs(0);
        setChangeToALTR(prev => !prev);
    };

    const handleLinksClick = (selected: string) => {
        if (selected === ALTR[index].answer) {
            setCorrects(corrects + 1);
        } else {
            setWrongs(wrongs + 1);
        }

        if (index < ALTR.length - 1) {
            setIndex(index + 1);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
        <Container>
            <Row>
            <h3 className='d-flex justify-content-center my-2'>Review Finished!</h3>
            <p className='d-flex justify-content-center'>Correct Answers: {corrects}</p>
            <p className='d-flex justify-content-center'>Wrong Answers: {wrongs}</p>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
                <PieChartWithCustomizedLabel
                data={[
                    { name: 'Correct', value: corrects },
                    { name: 'Wrong', value: wrongs }
                ]}
                />
            </motion.div>
            </Row>
        </Container>
        );
    }

    if (cards.length === 0) {
        return (
        <Container>
            <Row>
            <LoadingAnimationHash />
            </Row>
        </Container>
        );
    }

    return (
        <Container className='vh-100' style={{ minWidth: '100%', minHeight: '100%', background: 'linear-gradient(30deg,#40BFA8 0%,#FEECAD 40%)' }}>
        <Row>
            <h3 className='d-flex justify-content-center my-3 pt-5'>Review {cards[0].category} Cards</h3>
            <ProgressBarFunction
            now1={(corrects * 100) / cards.length}
            now2={(wrongs * 100) / cards.length}
            correctsLable={(corrects * 100) / cards.length}
            wrongsLable={(wrongs * 100) / cards.length}
            />
            <Col className='p-5' style={{ width: '50%' }}>
            <Button 
                onClick={showALTR}
                className='my-2 '
            >
                {!changeToALTR ? 'Review Via Sentences' : 'Review Via Card'}
            </Button>

            {changeToALTR && ALTR.length > 0 && index < ALTR.length ? (
                <AlternativeReviewCard
                    text={ALTR[index].text}
                    progress={ALTR[index].progress}
                    option1={ALTR[index].option1}
                    option2={ALTR[index].option2}
                    option3={ALTR[index].option3}
                    handleClick={handleLinksClick}
                />
            ) : !changeToALTR ? (
                <ReviewCard
                    key={index}
                    category={cards[index]?.category}
                    title={cards[index]?.title}
                    definition={cards[index]?.definition}
                    handleClick={handleCheckButton}
                    handleClick2={handleCorrectButton}
                    handleClick3={handleWrongButton}
                    handleClick4={handleTurnBackButton}
                    show={show}
                />
            ) : (
                <p>No alternative review content available.</p>
            )}
            </Col>
        </Row>
        </Container>
    );
}