import { action, makeAutoObservable } from "mobx";
import { addGem, calcReq, calcReqWithRest, combine, Gem, GemLists, getMaxLevel, merge, parseGemString, UnifiedGem, UnifiedGemLists } from "../lib/gem";

export default class GemStore {
  lists: GemLists = {
    now: {
      5: 34
    },
    target: {
      4: 11,
      6: 11

    }
  }

  inputs: Record<keyof GemLists, string> = {
    now: '',
    target: '',
  }

  constructor() {
    makeAutoObservable(this);
  }

  get result(): Gem {
    const result = combine(this.lists.now);
    return result;
  }

  get needs(): Gem {
    const needs = calcReq(this.lists.now, this.lists.target);
    return needs;
  }

  get rests(): Gem {
    const [, rests] = calcReqWithRest(this.lists.now, this.lists.target);
    return rests;
  }

  get preview(): UnifiedGemLists {

    const preview = Object.keys(this.lists).reduce((prev: UnifiedGemLists, cur) => {
      const name = cur as keyof GemLists;
      prev[name] = merge(this.lists[name], parseGemString(this.inputs[name], true));
      return prev;
    }, {
      now: {},
      target: {}
    });

    return preview;
  }

  addFromInput(name: keyof GemLists) {

    const input = parseGemString(this.inputs[name]);
    const inputMaxLevel = getMaxLevel(input);

    /*if (name === 'now') {
      // 보유 중 최대 보석이 목표 최대 보석보다 클 경우
      const goalMaxLevel = getMaxLevel(this.lists.target);
      if (goalMaxLevel && inputMaxLevel > goalMaxLevel) {
        throw Error(`보유 중인 보석의 최대 레벨(${inputMaxLevel})이 목표 보석의 최대 레벨(${goalMaxLevel})보다 큽니다!`);
      }
    } else if (name === 'target') {
      // 목표 최대 보석이 보유 중 최대 보석보다 작을 경우
      const currentMaxLevel = getMaxLevel(this.lists.now);
      if (inputMaxLevel < currentMaxLevel) {
        throw Error(`목표 보석의 최대 레벨(${inputMaxLevel})이 보유 중인 보석의 최대 레벨(${currentMaxLevel})보다 작습니다!`);
      }
    }*/

    addGem(this.lists[name], parseGemString(this.inputs[name]));
  }

  push(name: keyof GemLists, gem: Gem) {
    addGem(this.lists[name], gem);
  }

  increase(name: keyof GemLists, level: number) {
    this.lists[name][level]++;
  }

  decrease(name: keyof GemLists, level: number) {
    this.lists[name][level]--;

    if (this.lists[name][level] <= 0)
      this.delete(name, level);
  }

  delete(name: keyof GemLists, level: number) {
    delete this.lists[name][level];
  }

  changeInputs(name: keyof GemLists, input: string) {
    this.inputs[name] = input; 
  }

  clear(name: keyof GemLists) {
    this.lists[name] = {};
    this.inputs[name] = '';
  }

}