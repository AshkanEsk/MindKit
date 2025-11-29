import ProgressBar from 'react-bootstrap/ProgressBar';

interface ProgressBarInput{
    now1:number;
    now2:number;
    correctsLable : number;
    wrongsLable : number;
}
function ProgressBarFunction({correctsLable, wrongsLable, now1, now2}:ProgressBarInput) {
  return (
    <div>
      <ProgressBar className="m-3 border-5 bg-warning shadow" >
        <ProgressBar striped variant="info" now={now1} key={1} label={`${correctsLable}%`} />
        <ProgressBar striped  variant="danger" now={now2} key={2} label={`${wrongsLable}%`} />
      </ProgressBar>
    </div>
  );
}

export default ProgressBarFunction;