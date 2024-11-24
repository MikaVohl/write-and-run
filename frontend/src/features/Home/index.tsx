import UploadComponent from "./components/Upload";

const Home = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center">
          <div className="relative flex flex-row items-center pt-16 gap-5">
            <h1 className="flex text-5xl font-bold  text-black">
              Write and Run
            </h1>
            <img src="/Logo/W&RLogo.png" className="w-28" />
          </div>
          <p className="text-lg text-center text-gray-500 pt-4">
            Upload your handwritten code and run it in your browser with ease
          </p>
        </div>
        <div className="w-2/3 pt-4">
          <UploadComponent />
        </div>
      </div>
    </div>
  );
};

export default Home;
