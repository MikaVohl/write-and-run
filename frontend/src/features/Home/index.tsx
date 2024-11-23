import { Card } from "@/components/ui/card";
import UploadComponent from "./components/Upload";

const Home = () => {
  return (
    <div>
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-row justify-center">
          <div className="w-1/2">
            <UploadComponent />
          </div>
        </div>
        <div className="flex flex-row px-8 space-y-10 justify-center">
          <Card className="w-full h-64"></Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
