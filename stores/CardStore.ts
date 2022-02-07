import Card, { cardSets } from "lib/card";
import { makeAutoObservable } from "mobx";

export type CardInputData = {
  awakening: number,
  amount: number
}

export type UserCardData = Record<string, CardInputData>;

export default class CardStore {

  set: string = '';
  data: UserCardData = {};
  goal: number = 0;
  minSelect: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  changeSet(name: string) {
    this.set = name;

    if (name === '') {
      this.data = {};
      return;
    }

    const cards = cardSets[name].cards;

    this.data = Object.keys(cards).reduce((prev: UserCardData, cur) => {
      prev[cur] = {
        awakening: 0,
        amount: 0
      }
      return prev;
    }, {});

    this.goal = 0;
  }

  get sets() {
    return Object.keys(cardSets);
  }

  get awakenings() {
    return cardSets[this.set]?.awakenings;
  }

  get totalAwakening() {
    return Card.awakeningOf(this.data);
  }

  get reqsWithResult() {
    return Card.reqsOf(this.data, this.goal, this.set, this.minSelect);
  }

  get reqs() {
    const [reqs] = this.reqsWithResult;
    return reqs;
  }

  get result() {
    const [, result] = this.reqsWithResult;
    return result;
  }

  get paths() {
    const cards = cardSets[this.set].cards;
    return Object.keys(cards).reduce((prev: Record<string, string[]>, cur) => {
      const card = cards[cur];
      if (card.paths) {
        prev[cur] = card.paths;
      }
      return prev;
    }, {});
  }

  changeGoal(goal: number) {
    this.goal = goal;
  }

  changeData(name: string, prop: keyof CardInputData, data: number) {
    this.data[name][prop] = data;
  }

  toggleMinSelect() {
    this.minSelect = !this.minSelect;
  }

}