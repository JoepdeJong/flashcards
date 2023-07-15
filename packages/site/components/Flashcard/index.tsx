"use client";
// Flashcard Component, consisting of a front and a back side. Possibility to flip the card.

import { useRef, useState } from "react";

import styles from './Flashcard.module.scss'
import { Exercise, Word } from "@/types/types";

type FlashcardProps = {
    exercise: Exercise;
    isFlipped?: boolean;
    isActive?: boolean;
    onClick?: () => void;
    flip?: () => void;
    showHint?: boolean;
};

export default function Flashcard(props: FlashcardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const onClickCard = () => {
        if (props.flip) {
            props.flip();
        }

        if (props.onClick) {
            props.onClick();
        }

        if (cardRef.current) {
            cardRef.current.focus();
        }
    }

    return (
        <div className={`${styles.flashcard} ${props.isActive ? styles.active : ''} ${styles[props.exercise.status]}`} onClick={onClickCard} tabIndex={0} ref={cardRef}>
            <div className={`${styles.card} ${props.isFlipped ? styles.flipped : ''}`}>
                <div className={`${styles.front}`}>
                    <Side words={props.exercise.front} showHint={props.showHint} />
                </div>
                <div className={`${styles.back}`}>
                    <Side words={props.exercise.back}  showHint={props.showHint} />
                </div>
            </div>
        </div>
    );
}

const Side = ({ words, showHint }: { words: Word[], showHint?: boolean }) => {
    return (
        <div className={styles.side}>
            {words.map((word, i) => (
                <div key={i} className={styles.word}>
                    {word.word}
                    {showHint && word.hint && <span className={styles.hint}>{word.hint}</span>}
                </div>
            ))}
        </div>
    );
}