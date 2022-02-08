import { CardInputData, UserCardData } from "stores/CardStore";

type Rarity = 'uncommon' | 'rare' | 'epic' | 'legendary';

// TODO: 카드 희귀도에 따른 th 색상

export const CardColor: Record<Rarity, string> = {
  uncommon: 'bg-lime-600',
  rare: 'bg-sky-600',
  epic: 'bg-violet-700',
  legendary: 'bg-amber-500',
}

/*interface CardData {
  name: string, 
  rarity: Rarity
}*/

type CardData = Record<string, {
  rarity: Rarity
  dropOnly?: boolean,
  paths?: string[]
}>;

interface CardSet {
  maxCards: number,
  awakenings: number[],
  cards: CardData
}

export const cardSets: Record<string, CardSet> = {
  '남겨진 바람의 절벽': {
    maxCards: 6,
    awakenings: [12, 30],
    cards: {
      '아만': {
        rarity: 'legendary'
      },
      '세리아': {
        rarity: 'rare',
        paths: ['[떠상] 루테란 동부 - 버트']
      },
      '집행관 솔라스': {
        rarity: 'uncommon'
      },
      '국왕 실리안': {
        rarity: 'legendary'
      },
      '카마인': {
        rarity: 'legendary',
        paths: ['[업적] 끝 없는 혼돈의 시작']
      },
      '데런 아만': {
        rarity: 'legendary'
      },
    }
  },
  '세상을 구하는 빛': {
    maxCards: 6,
    awakenings: [12, 18, 30],
    cards: {
      '샨디': {
        rarity: 'legendary'
      },
      '아제나&이난나': {
        rarity: 'legendary'
      },
      '니나브': {
        rarity: 'legendary'
      },
      '카단': {
        rarity: 'legendary',
        dropOnly: true // 전선팩에 없음
      },
      '바훈투르': {
        rarity: 'legendary',
        paths: ['[업적] 쇼는 계속되어야 한다!']
      },
      '실리안': {
        rarity: 'legendary'
      },
      '웨이': {
        rarity: 'legendary',
        paths: ['[떠상] 애니츠 - 맥', '[업적] 보스헌터 : 고급']
      }
    }
  }
}


// Card util class
export default class Card {
  static valueOf(card: CardInputData) {
    return (card.awakening * (card.awakening + 1)) / 2 + card.amount;
  }

  static nextReqOf(card: CardInputData) {
    const next = card.awakening + 1;
    return next - card.amount;
  }

  static copy(cards: UserCardData) {
    return Object.keys(cards).reduce((prev: UserCardData, cur) => {
      prev[cur] = { ...cards[cur] };
      return prev;
    }, {})
  }

  static awakeningOf(cards: UserCardData) {
    return Object.values(cards).reduce((prev, cur) => (prev + cur.awakening), 0);
  }

  static reqsOf(cards: UserCardData, goal: number, set: string, minSelect: boolean): Record<string, number>[] {

    const maxCards = cardSets[set].maxCards;
    const reqs = Object.keys(cards).reduce((prev: Record<string, number>, cur) => {
      prev[cur] = 0;
      return prev;
    }, {});
    goal -= Card.awakeningOf(cards);
    const temp = Card.copy(cards);

    if (Object.keys(temp).length > maxCards) {
      const lowest = Object.keys(temp).reduce((prev, cur) => {
        return Card.valueOf(temp[cur]) < Card.valueOf(temp[prev]) ? cur : prev;
      });
      delete temp[lowest];
      delete reqs[lowest];
    }

    // except drop only
    if (minSelect) {
      const copy = Card.copy(cards);
      Object.keys(copy).forEach(key => {
        if (cardSets[set].cards[key].dropOnly) {
          delete copy[key];
        }
      });

      return this.reqsOf(copy, goal, set, false);
    }

    // adjust awakening from exceeding amount
    Object.keys(temp).forEach(key => {
      const info = temp[key];

      // TODO: sqrt might bring better performance
      while (info.amount > info.awakening && info.awakening < 5) {
        info.amount -= info.awakening + 1;
        info.awakening++;
        goal--;

        if (info.awakening === 5) {
          info.amount = 0;
        }
      }
    });

    while (goal > 0) {
      const minKey = Object.keys(temp).reduce((prev, cur) => {

        const prevReq = Card.nextReqOf(temp[prev]);
        const nextReq = Card.nextReqOf(temp[cur]);

        if (nextReq < prevReq)
          return cur;

        return prev;
      });

      reqs[minKey] += Card.nextReqOf(temp[minKey]);
      temp[minKey].awakening++;
      temp[minKey].amount = 0;
      goal--;
    }

    // filter zero values
    
    /* const filtered = Object.keys(reqs).reduce((prev: Record<string, number>, cur) => {
      if (reqs[cur] > 0)
        prev[cur] = reqs[cur];
      return prev;
    }, {}) */
    
    return [reqs, Object.keys(temp).reduce((prev: Record<string, number>, cur) => {
      prev[cur] = temp[cur].awakening;
      return prev;
    }, {})];

    //return reqs;
  }
}