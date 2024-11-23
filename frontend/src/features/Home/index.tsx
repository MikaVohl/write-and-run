import UploadComponent from "./components/Upload";

const Home = () => {

    return (
        <div>

            <div className="w-full h-full flex flex-col">
                <div className="flex flex-row space-x-4">
                    <div className="w-2/3">
                        <UploadComponent />
                    </div>

                    <div className="w-1/3 bg-purple-900 m-4 h-32rem">
                        test
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    Table
                </div>
            </div>
        </div>
    );
};

export default Home;