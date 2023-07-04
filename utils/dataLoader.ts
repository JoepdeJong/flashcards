import { Definition } from '@/types/definition';
import csv from 'csv-parser';
import fs from 'fs';

export const loadDefinitionsFromCSV = async (csvPath: string): Promise<Definition[]> => {
    const definitions: Definition[] = [];

    

    const promise = new Promise((resolve, reject) => {
        // Process rows as numbers do not use headers option
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data', (row) => {
            row = Object.assign({}, row);
            const front_word = { word: row['Translation'] };
            const back_word_1 = { word: row['Active Past'], hint: row['Transliteration Past'] };
            const back_word_2 = { word: row['Active Present'], hint: row['Transliteration Present'] };
            const back = [back_word_1, back_word_2];
    
            const definition = {
              front: [front_word],
              back: back,
              status: 'unlearned',
            };
    
            definitions.push(definition as Definition);
          })
          .on('end', () => {
            resolve(definitions); // Resolve the promise when the reading is done
          })
          .on('error', (error) => {
            reject(error); // Reject the promise if an error occurs
          });
      });
    
      try {
        const result = await promise; // Wait for the promise to resolve
        // You can return the definitions here or use them as needed
      } catch (error) {
        console.error('Error reading CSV:', error);
        // Handle the error as needed
      }

    return definitions;
}

