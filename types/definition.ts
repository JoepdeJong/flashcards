export type Definition = {
    front: Word[],
    back: Word[],
    status: 'unlearned' | 'learning' | 'learned',
}

export type Word = {
    word: string
    hint?: string
}