import React from 'react';

interface DefinitionItem {
  definition: string;
  example?: string;
}

interface Definition {
  partOfSpeech: string;
  definitions: DefinitionItem[];
}

interface ModalContentProps {
  definitions: Definition[];
  handleCheckbox?: (definitionText: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ModalContent: React.FC<ModalContentProps> = ({ definitions, handleCheckbox }) => {
  return (
    <div>
      <form>
        {definitions.map((_definition, defIndex) => (
          <div key={defIndex}>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id={`partOfSpeech-${defIndex}`}
              />
              <label className="form-check-label fw-bold">
                Part Of Speech: {_definition.partOfSpeech}
              </label>
            </div>
            <ul style={{ listStyleType: 'none' }}>
              {_definition.definitions.map((definitionItem, itemIndex) => (
                <li key={itemIndex}>
                  <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`definition-${defIndex}-${itemIndex}`}
                    onChange={(event) => {
                      if (handleCheckbox) {
                        const fullText = `Part Of Speech: ${_definition.partOfSpeech}\nDefinition: ${definitionItem.definition}${
                          definitionItem.example ? "\nExample: " + definitionItem.example : ""
                        }`;
                        handleCheckbox(fullText, event);
                      }
                    }}
                  />

                    <label className="form-check-label">
                      <p className='fw-semibold'>
                        {definitionItem.definition}
                        {definitionItem.example && (
                          <span className='fw-normal'>
                            <br />
                            <em>Example: {definitionItem.example}</em>
                          </span>
                        )}
                      </p>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </form>
    </div>
  );
};

export default ModalContent;
