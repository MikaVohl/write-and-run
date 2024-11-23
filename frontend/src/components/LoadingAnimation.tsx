import { Player } from '@lottiefiles/react-lottie-player';

const LoadingAnimation = () => {
  return (
    <>
    <div className='container'>
      <h1>Using Lottie with React JS ⚛️</h1>

      <Player
        src="/assets/Animations/runningman.json"
        className="player"
        loop
        autoplay
      />
    </div>
    </>
  );
};

export default LoadingAnimation;



