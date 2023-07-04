'use client';

import { useEffect, useState } from 'react';
import Flashcard from '../Flashcard';
import { Controls } from '../Controls';

import styles from './Main.module.scss'
import { Definition } from '@/types/definition';

export default function Main({ data }: { data: Definition[] }) {
    const [active, setActive] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
  
    const [definitions, setDefinitions] = useState(data!);
  
    const flip = () => {
      setIsFlipped(!isFlipped);
    }
  
    const next = () => {
      const max = definitions.length - 1;
  
      if (active < max) {
        setActive(active + 1);
      } else {
        setActive(0);
      }
    }
  
    const prev = () => {
      const max = definitions.length - 1;
  
      if (active > 0) {
        setActive(active - 1);
      } else {
        setActive(max);
      }
    }
  
    const updateStatus = (status: "unlearned" | "learning" | "learned") => {
      const newDefinitions = [...definitions];
      newDefinitions[active].status = status;
  
      setDefinitions(newDefinitions);
    }
  
  
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        // If cmd or ctrl key is pressed, don't do anything
        if (event.metaKey || event.ctrlKey) {
          return;
        }
        event.preventDefault();

        if (event.key === ' ') {
          flip();
        }
        else if (event.key === 'ArrowRight' || event.key === 'Tab') {
          next();
        }
        else if (event.key === 'ArrowLeft') {
          prev();
        }
        else if (event.key === '1', event.key === 'Backspace') {
          changeCard('unlearned');
        }
        else if (event.key === '2') {
          changeCard('learning');
        }
        else if (event.key === '3' || event.key === 'Enter') {
          changeCard('learned');
        } else if (event.key === 's') {
          shuffle();
        }
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
      if (hasLearnedAll()) {
        reset();
      }
      
      if (definitions[active].status === 'unlearned') {
        updateStatus('learning');
      }

      if (definitions[active].status === 'learned') {
        next();
      }
    }, [active]);
  
    const hasLearnedAll = () => {
      return definitions.every((definition) => definition.status === 'learned');
    }
  
    const changeCard = (string: "unlearned" | "learning" | "learned") => {
      updateStatus(string);
      next();
    }
  
    const shuffle = () => {
      const newDefinitions = [...definitions];
      newDefinitions.sort(() => Math.random() - 0.5);
  
      setDefinitions(newDefinitions);
    }
  
    const reset = () => {
      const newDefinitions = [...definitions];
      newDefinitions.forEach((definition) => {
        definition.status = 'unlearned';
      });
  
      setDefinitions(newDefinitions);
    }
  
    return (
      <div className={styles.container}>
        <div className={styles.flashcards}>
          {/* .filter((definition) => definition.status !== 'learned') */}
          {definitions.map((definition, i) => (
            <Flashcard key={i} definition={definition} 
              onClick={() => setActive(i)}
              flip={flip}
              isActive={i === active} 
              isFlipped={active === i && isFlipped} />
          ))}
        </div>
        {/* Update status and go to next */}
        <Controls onChange={changeCard}
        onSkip={next} 
        onShuffle={shuffle}
        onReset={reset}
        />
      </div>
    )
  }