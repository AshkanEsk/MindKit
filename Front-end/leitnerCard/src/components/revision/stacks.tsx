import Stack from 'react-bootstrap/Stack';

interface VEinput{
    numDivs : number,
}

function VerticalExample({ numDivs }:VEinput) {
  
  const divs = Array.from({ length: numDivs }, (v, i) => (
    <div key={i} className="p-2">{`Item ${i + 1}`}</div>
  ));

  return (
    <Stack gap={3}>
      {divs}
    </Stack>
  );
}

export default VerticalExample;
