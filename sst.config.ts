import { SSTConfig } from "sst";
import { Flashcards } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "flashcards",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Flashcards);
  },
} satisfies SSTConfig;
