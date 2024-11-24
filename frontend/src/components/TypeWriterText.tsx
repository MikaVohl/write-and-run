const TypewriterText = () => {
    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 h-[100px]">
            <div className="mx-auto max-w-2xl">
                <div className="flex items-baseline justify-center gap-4 text-center">
                    <span 
                    className="text-5xl font-bold text-gray-900 lg:text-8xl"
                    style={{ fontFamily: 'Dancing Script' }}
                    >Write</span>

                    <span
                    className="text-4xl text-gray-600 lg:text-7xl"
                    style={{ fontFamily: 'Dancing Script' }}
                    >and</span>
                    <span 
                    className="font-mono text-5xl font-bold text-gray-900 lg:text-8xl"
                    >Run</span>
                </div>
            </div>
        </div>
    );
};

export default TypewriterText;