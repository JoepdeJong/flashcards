'use client';

import { useEffect, useState } from 'react';
import Flashcard from '../Flashcard';
import { Controls } from '../Controls';

import styles from './Main.module.scss'
import { ExerciseType } from '@flashcards/core/types/LessonType';

export default function Main({ data }: { data: ExerciseType[] }) {
    const [active, setActive] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isIsolated, setIsIsolated] = useState(false);
  
    const [exercises, setExercises] = useState(data!);
  
    const flip = () => {
      setIsFlipped(!isFlipped);
    }
  
    const next = () => {
      const max = exercises.length - 1;
  
      if (active < max) {
        setActive(active + 1);
      } else {
        setActive(0);
      }
    }
  
    const prev = () => {
      const max = exercises.length - 1;
  
      if (active > 0) {
        setActive(active - 1);
      } else {
        setActive(max);
      }
    }
  
    const updateStatus = (status: "unlearned" | "learning" | "learned", card?: number) => {
      const newExercises = [...exercises];
      newExercises[card ?? active].status = status;
  
      setExercises(newExercises);
    }
  
  
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        // If cmd or ctrl key is pressed, don't do anything
        if (event.metaKey || event.ctrlKey) return;
        event.preventDefault();

        if (event.key === ' ') 
          flip();
        else if (event.key === 'ArrowRight' || event.key === 'Tab') 
          next();
        else if (event.key === 'ArrowLeft')
          prev();
        else if (event.key === '1', event.key === 'Backspace')
          changeCard('unlearned');
        else if (event.key === '2')
          changeCard('learning');
        else if (event.key === '3' || event.key === 'Enter')
          changeCard('learned');
        else if (event.key === 's')
          shuffle();
      };
  
      // Attach the event listener to the document
      document.addEventListener('keydown', handleKeyPress);
  
      // Clean up the event listener when the component unmounts
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, [flip]);
  
    useEffect(() => {
      setIsFlipped(false);
  
      // Check if all cards are learned
      if (hasLearnedAll()) reset();
      
      if (exercises[active].status === 'unlearned') updateStatus('learning');

      if (exercises[active].status === 'learned') next();
    }, [active]);
  
    const hasLearnedAll = () => {
      return exercises.every((definition) => definition.status === 'learned');
    }
  
    const changeCard = (string: "unlearned" | "learning" | "learned") => {
      updateStatus(string);
      next();
    }
  
    const shuffle = () => {
      const newExercises = [...exercises];
      newExercises.sort(() => Math.random() - 0.5);
  
      setExercises(newExercises);
    }
  
    const reset = () => {
      const newExercises = [...exercises];
      newExercises.forEach((definition) => {
        definition.status = 'unlearned';
      });
  
      setExercises(newExercises);
    }

    const onCardClick = (card: number) => {
      // TODO: fix this code
      const newExercises = [...exercises];
      if (newExercises[card].status === 'learned') {
        newExercises[card].status = 'learning';
      }

      setExercises(newExercises);

      setActive(card);
    }

  
    return (
      <div className={styles.container}>
        <div className={styles.flashcards}>
          {/* .filter((definition) => definition.status !== 'learned') */}
          {exercises.map((exercise, i) => {
            if (isIsolated && i !== active) return null;
            return (
            <Flashcard key={i} exercise={exercise} 
              onClick={() => onCardClick(i)}
              flip={flip}
              isActive={i === active} 
              isFlipped={active === i && isFlipped} 
              showHint={showHint}
              />
          )})}
        </div>
        <div className={styles.controls}>
          <Controls onChange={changeCard}
          onSkip={next} 
          onShuffle={shuffle}
          onReset={reset}
          onToggle={() => setShowHint(!showHint)}
          onIsolated={() => setIsIsolated(!isIsolated)}
          />
        </div>
      </div>
    )
  }