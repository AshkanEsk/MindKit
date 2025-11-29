import Form from 'react-bootstrap/Form';

interface IT{inputText:string;}

const InputReadOnly = ({ inputText }:IT) => {
  return (
    <Form.Group className="mb-3">
      <Form.Control 
        type="text" 
        placeholder={inputText} 
        readOnly 
        className="text-center"
        style={{ fontSize: '1.1em', padding: '10px', border: '1px solid #ced4da', borderRadius: '5px', backgroundColor: '#e9ecef', color: '#495057', cursor: 'not-allowed', opacity: 1 }}
      />
    </Form.Group>
  );
};

export default InputReadOnly;
