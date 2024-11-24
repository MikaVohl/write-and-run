import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterText = () => {
    const [text, setText] = useState({ write: '', run: '' });
    const [isWriteComplete, setIsWriteComplete] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    const typeWord = (word: string, prevText: string, onComplete: () => void) => {
        let index = 0;
        return setInterval(() => {
            if (index <= word.length) {
                setText(prev => ({
                    ...prev,
                    [prevText]: word.slice(0, index)
                }));
                index++;
            } else {
                onComplete();
            }
        }, 150);
    };

    useEffect(() => {
        // Initial delay before starting animation
        const initialDelay = setTimeout(() => {
            const writeInterval = typeWord('Write', 'write', () => {
                clearInterval(writeInterval);
                setIsWriteComplete(true);
            });
        }, 800); // 800ms delay before starting

        return () => clearTimeout(initialDelay);
    }, []); // Run only once on mount

    useEffect(() => {
        if (!isWriteComplete) return;

        const runInterval = typeWord('Run', 'run', () => {
            clearInterval(runInterval);
        });

        return () => clearInterval(runInterval);
    }, [isWriteComplete]);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 400);
        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 400);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-6 lg:px-8 h-[100px]">
            <div className="mx-auto max-w-2xl">
                <div className="flex items-baseline justify-center gap-4 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontFamily: 'Dancing Script' }}
                        className="text-5xl font-bold text-gray-900 lg:text-8xl"
                    >
                        {text.write}
                    </motion.span>

                    {isWriteComplete && (
                        <>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                style={{ fontFamily: 'Dancing Script' }}
                                className="text-4xl text-gray-600 lg:text-7xl"
                            >
                                and
                            </motion.span>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-mono text-5xl font-bold text-gray-900 lg:text-8xl"
                            >
                                {text.run}
                                <span
                                    className={`inline-block h-10 w-0.5 bg-indigo-600 lg:h-14 ${showCursor && text.run.length < 3 ? 'opacity-100' : 'opacity-0'
                                        }`}
                                />
                            </motion.span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TypewriterText;