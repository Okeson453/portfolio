'use client'

import { useState, useEffect } from 'react'

interface TypewriterProps {
    words: string[]
    delay?: number
    speed?: number
    deleteSpeed?: number
}

export function Typewriter({
    words,
    delay = 2000,
    speed = 50,
    deleteSpeed = 30
}: TypewriterProps) {
    const [displayText, setDisplayText] = useState('')
    const [wordIndex, setWordIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        let timer: NodeJS.Timeout
        const currentWord = words[wordIndex]
        const isComplete = displayText === currentWord

        if (isComplete && !isDeleting) {
            timer = setTimeout(() => setIsDeleting(true), delay)
        } else if (displayText === '' && isDeleting) {
            setIsDeleting(false)
            setWordIndex((prev) => (prev + 1) % words.length)
        } else {
            timer = setTimeout(() => {
                setDisplayText((prev) =>
                    isDeleting
                        ? currentWord.slice(0, prev.length - 1)
                        : currentWord.slice(0, prev.length + 1)
                )
            }, isDeleting ? deleteSpeed : speed)
        }

        return () => clearTimeout(timer)
    }, [displayText, isDeleting, wordIndex, words, speed, deleteSpeed, delay, mounted])

    if (!mounted) {
        return <>{words[0]}</>
    }

    return <>{displayText}</>
}
