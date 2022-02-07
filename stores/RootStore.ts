import { useStaticRendering } from "mobx-react";
import CardStore from "./CardStore";
import GemStore from "./GemStore";

if (process.env.SSR) {
  useStaticRendering(true);
}

class RootStore {
  gem: GemStore;
  card: CardStore;

  constructor() {
    this.gem = new GemStore();
    this.card = new CardStore();
  }
}

export default new RootStore();