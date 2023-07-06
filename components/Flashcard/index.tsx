"use client";
// Flashcard Component, consisting of a front and a back side. Possibility to flip the card.

import { useRef, useState } from "react";

import styles from './Flashcard.module.scss'
import { Definition, Word } from "@/types/types";

type FlashcardProps = {
    definition: Definition;
    isFlipped?: boolean;
    isActive?: boolean;
    onClick?: () => void;
    flip?: () => void;
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
        <div className={`${styles.flashcard} ${props.isActive ? styles.active : ''} ${styles[props.definition.status]}`} onClick={onClickCard} tabIndex={0} ref={cardRef}>
            <div className={`${styles.card} ${props.isFlipped ? styles.flipped : ''}`}>
                <div className={`${styles.front}`}>
                    <Side words={props.definition.front} />
                </div>
                <div className={`${styles.back}`}>
                    <Side words={props.definition.back} />
                </div>
            </div>
        </div>
    );
}

const Side = ({ words }: { words: Word[] }) => {
    return (
        <div className={styles.side}>
            {words.map((word, i) => (
                <div key={i} className={styles.word}>
                    {word.word}
                    {word.hint && <span className={styles.hint}>{word.hint}</span>}
                </div>
            ))}
        </div>
    );
}