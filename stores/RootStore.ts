import { useStaticRendering } from "mobx-react";
import GemStore from "./GemStore";

if (process.env.SSR) {
  useStaticRendering(true);
}

class RootStore {
  gem: GemStore;

  constructor() {
    this.gem = new GemStore();
  }
}

export default new RootStore();