import axios from "axios";
import { useState } from "react";
import { Button, Card, Form, InputGroup, Stack } from "react-bootstrap";
import ModalContent from "../Profile/ModalContent";
import ModalComponent from "../Profile/Modal";

interface Category {
  id: number;
  title: string;
}

interface DefinitionItem {
  definition: string;
  example?: string;
}

interface Definition {
  partOfSpeech: string;
  definitions: DefinitionItem[];
}

interface SelectInput {
  categories: Category[];
  user: string;
}

const Select: React.FC<SelectInput> = ({ user, categories }) => {
  const [newCategory, setNewCategory] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [cardDefinition, setCardDefinition] = useState('');
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [definitions, setDefinitions] = useState<Definition[]>([]);
  const [wordsSet, setWordsSet] = useState<string[]>([]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCategory(event.target.value === "new-category");
    setSelectValue(event.target.value);
  };

  const handleSearchButton = (useAI: boolean) => {
    setDefinitions([]);
    if (cardTitle.trim() === '') {
      alert('Please enter a word to search.');
      return;
    }

    if (useAI) {
      const SITE_URL = 'https://yourdomain.com';
      const SITE_TITLE = 'FlashAI';

      axios.get('http://127.0.0.1:8000/cards/newcategory/', {
        params: { category: selectValue },
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      })
      .then(response => {
          const words = response.data.words || [];
          setWordsSet(words);

          const prompt = `Define ${cardTitle} in the style of the Cambridge Dictionary.
                          Include its part of speech and related forms.
                          Provide pronunciation using IPA.
                          Keep the definition and examples short and vivid.
                          Give three clear example sentences.
                          ${words.length > 0 ? `And if possible, use the following words in your examples: ${words.join(', ')}` : ''}`;

          return fetch('https://router.huggingface.co/v1', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${import.meta.env.HUGGING_FACE_API_KEY}`,
              'HTTP-Referer': SITE_URL,
              'X-Title': SITE_TITLE,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-120b:groq",
              messages: [{ role: 'user', content: prompt }],
            }),
          });
      })
      .then(async res => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          const reply = data?.choices?.[0]?.message?.content.replace(/\*/g, "");
          if (reply) {
            setCardDefinition(reply);
            setDefinitions([]);
          } else {
            setCardDefinition('No response from AI. Please try again.');
          }
        } catch (err) {
          console.error('AI response (non-JSON):', text);
          setCardDefinition(`Error: ${text}`);
        }
      })
      .catch(err => {
        console.error('AI fetch error:', err);
        setCardDefinition(`Error fetching AI definition: ${err}`);
      });
    }
    else {
      axios
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${cardTitle}`)
        .then(res => {
          if (!res.data?.length) {
            setDefinitions([]);
            setCardDefinition('No definitions found.');
            return;
          }
          const defs: Definition[] = res.data[0].meanings.map((m: any) => ({
            partOfSpeech: m.partOfSpeech,
            definitions: m.definitions.map((d: any) => ({
              definition: d.definition,
              example: d.example,
            })),
          }));
          setDefinitions(defs);
          setCardDefinition('');
        })
        .catch(err => {
          console.error('Dictionary fetch error:', err);
          setDefinitions([]);
          setCardDefinition('Error fetching definition.');
        });
    }
    console.log(`----->${definitions}`)
  };

  const handleCheckboxChange = (definitionText: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setCardDefinition(prev => prev ? prev + "\n\n" + definitionText : definitionText);
    } else {
      setCardDefinition(prev =>
        prev
          .split("\n\n")
          .filter(text => text.trim() !== definitionText.trim())
          .join("\n\n")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/cards/newcategory/",
        {
          card_title: cardTitle,
          definition: cardDefinition || 'Definition not provided.',
          category_title: newCategory ? newCategoryTitle : selectValue,
          owner: user,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem("authToken")}`,
          },
        }
      );
      console.log('Category and card successfully created.');
    } catch (error) {
      console.error('Error creating category and card:', error);
    }
  };

  return (
    <Card
      className="select-container p-3"
      style={{
        width: '100%',
        background: 'linear-gradient(45deg, rgb(237, 251, 35) 0%, rgb(238, 255, 0) 40%)',
      }}
    >
      <Form.Select
        aria-label="Category Select"
        onChange={handleSelectChange}
        className="text-bg-success my-2"
      >
        <option value="">Open this select menu</option>
        <option value="new-category">New Category</option>
        {categories.map((category) => (
          <option value={category.title} key={category.id}>
            {category.title}
          </option>
        ))}
      </Form.Select>

      {newCategory && (
        <InputGroup size="sm" className="mb-3">
          <InputGroup.Text>Category Name</InputGroup.Text>
          <Form.Control
            aria-label="Category Name"
            onChange={(e) => setNewCategoryTitle(e.target.value)}
          />
        </InputGroup>
      )}

      <hr />

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            placeholder="Hi"
            className="text-bg-info"
            as="textarea"
            rows={3}
            onChange={(e) => setCardTitle(e.target.value)}
          />
        </Form.Group>

        <Stack direction="horizontal" gap={3}>
          <ModalComponent
            launchButtonText="Search"
            handleLaunchButton={() => handleSearchButton(false)}
            modalHeadingText={cardTitle}
            saveButtonText="Save Selected"
          >
            <ModalContent
              definitions={definitions}
              handleCheckbox={handleCheckboxChange}
            />
          </ModalComponent>

          <ModalComponent
            launchButtonText="Ask AI"
            handleLaunchButton={() => handleSearchButton(true)}
            modalHeadingText={cardTitle}
            saveButtonText="Save Selected"
          >
            <ModalContent
              definitions={definitions}
              handleCheckbox={handleCheckboxChange}
            />
          </ModalComponent>
        </Stack>

        <hr />

        <Form.Group className="mb-3" controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            className="text-bg-info"
            as="textarea"
            rows={4}
            value={cardDefinition}
            onChange={(e) => setCardDefinition(e.target.value)}
          />
        </Form.Group>

        <Button variant="outline-dark" type="submit">Submit</Button>
      </Form>
    </Card>
  );
};

export default Select;