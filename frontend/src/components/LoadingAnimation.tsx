import { Player as Lottie } from '@lottiefiles/react-lottie-player';
import runningAnimation from '@/assets/Animations/runningman.json';

const LoadingAnimation = () => {
  return (
    <div className="relative h-20 w-full overflow-hidden">
      <div className="absolute top-0 left-0 animate-bounce-horizontal">
        <div className="h-20 w-20">
          <Lottie
            loop={true}
            src={runningAnimation}
            autoplay={true}
          />
        </div>
      </div>
    </div>
  );
}; 
export default LoadingAnimation;