import styles from './Controls.module.scss';

type ControlsProps = {
    onChange: (string: "unlearned" | "learning" | "learned") => void;
    onSkip: () => void;
    onShuffle: () => void;
    onReset: () => void;
    onToggle: () => void;
    onIsolated: () => void;
};

export const Controls = (props: ControlsProps) => {
    // Three control buttons, red, yellow and green, to indicate the success of the current flashcard.

    return (
        <div className={styles.controls}>
            <div className={styles.main}>
                <button onClick={() => props.onChange("unlearned")} className={styles.danger}>❌</button>
                <button onClick={() => props.onChange("learning")} className={styles.warning}>⚠️</button>
                <button onClick={() => props.onChange("learned")} className={styles.success}>✅</button>
            </div>
            <div className={styles.secondary}>
                <button onClick={props.onSkip} className={styles.skip}>⏭</button>
                <button onClick={props.onShuffle} className={styles.shuffle}>🔀</button>
                <button onClick={props.onReset} className={styles.reset}>🔄</button>
                <button onClick={props.onToggle} className={styles.toggle}>👀</button>
                <button onClick={props.onIsolated} className={styles.isolated}>🔍</button>
            </div>
        </div>
    )
}