"use client";
// Flashcard Component, consisting of a front and a back side. Possibility to flip the card.

import { useRef } from "react";

import styles from './Flashcard.module.scss'
import { ExerciseType } from "@flashcards/core/types/LessonType";

type FlashcardProps = {
    exercise: ExerciseType;
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
        <div className={`${styles.flashcard} ${props.isActive ? styles.active : ''} ${styles[props.exercise.status || "unlearned"]}`} onClick={onClickCard} tabIndex={0} ref={cardRef}>
            <div className={`${styles.card} ${props.isFlipped ? styles.flipped : ''}`}>
                <div className={`${styles.front}`}>
                    <Side text={props.exercise.front} hint={props.exercise.front_hint} showHint={props.showHint} />
                </div>
                <div className={`${styles.back}`}>
                    <Side text={props.exercise.back} hint={props.exercise.back_hint} showHint={props.showHint} />
                </div>
            </div>
        </div>
    );
}


const Side = ({ text, hint, showHint }: { text: string, hint?: string, showHint?: boolean }) => {
    return (
        <div className={styles.side}>
            <div className={styles.word}>
                {text}
                {showHint && hint && <span className={styles.hint}>{hint}</span>}
            </div>
        </div>
    );
}