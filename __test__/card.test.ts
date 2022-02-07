import Card from "lib/card";

describe('Calculate cards', () => {
  // my case
  it('of 1/1 2/1 2/1 1/1 0/1 0/2 3/2 (minCard)', () => {
    expect(Card.reqsOf({
      '샨디': {
        awakening: 1,
        amount: 1
      },
      '아제나&이난나': {
        awakening: 2,
        amount: 1
      },
      '니나브': {
        awakening: 2,
        amount: 1
      },
      '카단': {
        awakening: 1,
        amount: 1
      },
      '바훈투르': {
        awakening: 0,
        amount: 1,
      },
      '실리안': {
        awakening: 0,
        amount: 2,
      },
      '웨이': {
        awakening: 3,
        amount: 2,
      }
    }, 18, '세상을 구하는 빛', false)).toEqual([{ // expect 4 2 2 4 0 1 2
      '샨디': 4,
      '아제나&이난나': 2,
      '니나브': 2,
      '카단': 4,
      //'바훈투르': 0,
      '실리안': 1,
      '웨이': 2
    }, {
      '샨디': 3,
      '아제나&이난나': 3,
      '니나브': 3,
      '카단': 3,
      '실리안': 2,
      '웨이': 4
    }]);
    
  });
});