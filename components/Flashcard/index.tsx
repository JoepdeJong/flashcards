// Flashcard Component, consisting of a front and a back side. Possibility to flip the card.

type FlashcardProps = {
    front: string;
    back: string;
    onClick: () => void;
};

export default function Flashcard(props: FlashcardProps) {

