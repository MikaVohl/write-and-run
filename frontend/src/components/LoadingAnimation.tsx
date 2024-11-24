import { Player as Lottie } from '@lottiefiles/react-lottie-player';
import runningAnimation from '@/assets/Animations/runningman.json';

const LoadingAnimation = () => {
  return (
    <div className="relative h-20 w-full flex items-center justify-center overflow-hidden">
      <div className="animate-bounce-horizontal">
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
