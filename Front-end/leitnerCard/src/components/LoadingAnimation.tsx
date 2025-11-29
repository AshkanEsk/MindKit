import { HashLoader  } from 'react-spinners';

export default function LoadingAnimationHash(){
  return(
  <div className='d-flex justify-content-center align-items-center py-5 my-5'>
    <HashLoader
        color="#2907f9"
        loading
        speedMultiplier={0.75}
    />
  </div>
  );
}
