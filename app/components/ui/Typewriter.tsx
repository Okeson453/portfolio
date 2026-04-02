import { useState, useEffect, type FC } from 'react';

interface TypewriterProps {
    words: string[];
    delay?: number;
}

export const Typewriter: FC<TypewriterProps> = ({ words, delay = 100 }) => {
    const [text, setText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (!isDeleting && text === words[wordIndex]) {
            timer = setTimeout(() => setIsDeleting(true), delay * 20);
        } else if (isDeleting && text === '') {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
        } else {
            timer = setTimeout(() => {
                setText((prev) => {
                    const fullWord = words[wordIndex];
                    if (isDeleting) {
                        return fullWord.substring(0, prev.length - 1);
                    } else {
                        return fullWord.substring(0, prev.length + 1);
                    }
                });
            }, delay);
        }

        return () => clearTimeout(timer);
    }, [text, wordIndex, isDeleting, words, delay]);

    return <span>{text}</span>;
};

Typewriter.displayName = 'Typewriter';
