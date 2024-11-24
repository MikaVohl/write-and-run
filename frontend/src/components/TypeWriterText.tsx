import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterText = () => {
    const [text, setText] = useState({ write: '', run: '' });
    const [isWriteComplete, setIsWriteComplete] = useState(false);
    const [showCursor, setShowCursor] = useState(true);

    useEffect(() => {
        const writeWord = 'Write';
        let writeIndex = 0;

        const writeInterval = setInterval(() => {
            if (writeIndex <= writeWord.length) {
                setText(prev => ({
                    ...prev,
                    write: writeWord.slice(0, writeIndex)
                }));
                writeIndex++;
            } else {
                clearInterval(writeInterval);
                setIsWriteComplete(true);
            }
        }, 200);

        return () => clearInterval(writeInterval);
    }, []);

    useEffect(() => {
        if (!isWriteComplete) return;

        const runWord = 'Run';
        let runIndex = 0;

        const runInterval = setInterval(() => {
            if (runIndex <= runWord.length) {
                setText(prev => ({
                    ...prev,
                    run: runWord.slice(0, runIndex)
                }));
                runIndex++;
            } else {
                clearInterval(runInterval);
            }
        }, 200);

        return () => clearInterval(runInterval);
    }, [isWriteComplete]);

    // Cursor blink effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);

        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center gap-6">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        duration: 0.5
                    }}
                    className="relative h-16 w-16 lg:h-20 lg:w-20"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-full w-full text-indigo-600"
                    >
                        <path d="M17 6.1c-.3-.2-.6-.1-.8.1l-2.9 2.9-3.5-3.5c-.2-.2-.5-.2-.7 0L6.8 7.9c-.2.2-.2.5 0 .7l3.5 3.5-2.9 2.9c-.2.2-.2.5-.1.8.2.3.5.4.8.3l8.5-4c.3-.1.5-.4.5-.7s-.2-.6-.5-.7l-8.5-4z" />
                    </svg>
                </motion.div>

                <div className="flex flex-col items-center">
                    <div className="flex items-baseline gap-4">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 lg:text-6xl"
                        >
                            {text.write}
                            <span className={`inline-block w-0.5 h-8 lg:h-12 bg-indigo-600 ml-1 ${showCursor && !isWriteComplete ? 'opacity-100' : 'opacity-0'}`} />
                        </motion.span>

                        {isWriteComplete && (
                            <>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-3xl text-gray-600 lg:text-5xl"
                                >
                                    and
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-mono text-4xl font-bold text-gray-900 lg:text-6xl"
                                >
                                    {text.run}
                                    <span className={`inline-block w-0.5 h-8 lg:h-12 bg-indigo-600 ml-1 ${showCursor && text.run.length < 3 ? 'opacity-100' : 'opacity-0'}`} />
                                </motion.span>
                            </>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-4 h-1 w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default TypewriterText;