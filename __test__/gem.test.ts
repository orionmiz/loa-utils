import { calcBossRushReq, calcReq, calcWarReq, combine, merge, parseGemString } from '../lib/gem'

describe('Combine', () => {
  describe('empty gem', () => {
    it ('zero', () => {
      expect(combine({
        1: 0,
        2: 0
      })).toEqual({
      });
    });
  });
  /*
  describe('invalid gems', () => {
    it('out of range: level', () => {
      expect(() => combine({
        0: 3
      })).toThrowError();
    });
    it('negative: amount', () => {
      expect(() => combine({
        1: -1
      })).toThrowError();
    });
  });*/
  describe('gems of Level / Amount', () => {
    it('1 / 14', () => {
      expect(combine({
        1: 14
      })).toEqual({
        1: 2,
        2: 1,
        3: 1
      });
    });
    it('7 / 27', () => {
      expect(combine({
        7: 27
      })).toEqual({
        10: 1
      });
    });
  })
});

describe('Parse', () => {
  describe('single gem strings', () => {
    it('7', () => {
      expect(parseGemString('7')).toEqual({
        7: 1
      });
    });
    it('7/2', () => {
      expect(parseGemString('7/2')).toEqual({
        7: 2
      });
    });
    it('7*', () => {
      expect(parseGemString('7*')).toEqual({
        7: 11
      });
    });
    it('Preset: 회랑', () => {
      expect(parseGemString('회랑')).toEqual({
        4: 2,
        3: 1
      });
    });
  });

  describe('multiple gems strings', () => {
    it('회랑/2, 3/5, 4, 4*', () => {
      expect(parseGemString('회랑/2, 3/5, 4, 4*')).toEqual({
        4: 16,
        3: 7
      });
    });
  });
});

describe('Calculate Requirements', () => {
  it('of 5 with 4/2, 3', () => {
    expect(calcReq({
      4: 2,
      3: 1
    }, {
      5: 1
    })).toEqual({
      3: 2
    });
  });
  it('of 7/8, 9/3', () => {
    expect(calcReq({
      // empty
    }, {
      7: 8,
      9: 3
    })).toEqual({
      7: 8,
      9: 3
    });
  });
  it('of 6/11, 8/11 with 7/34', () => {
    expect(calcReq({
      7: 34
    }, {
      6: 11,
      8: 11
    })).toEqual({
      6: 11,
    });
  });
  it('of 3/4, 4, 5 with 3/10', () => {
    expect(calcReq({
      3: 10
    }, {
      3: 4,
      4: 1,
      5: 1
    })).toEqual({
      4: 2
    });
  });
  it('of 2/4, 3/4, 4, 5 with 1/34, 3/8', () => {
    expect(calcReq({
      1: 34,
      3: 8
    }, {
      2: 4,
      3: 4,
      4: 1,
      5: 1
    })).toEqual({
      1: 2,
      2: 1,
      3: 2,
      4: 1
    });
  });
})

describe('Calculate Boss Rush Reqs', () => {
  it('of 5', () => {
    expect(calcBossRushReq({
      5: 1
    })).toBe(2);
  });
})

describe('Calculate War Reqs', () => {
  it('of 5', () => {
    expect(calcWarReq({
      5: 1
    })).toBe(1);
  });
})

describe('Merge', () => {
  it('1,2 with 1,3', () => {
    expect(merge({
      1: 1,
      2: 1
    }, {
      1: 1,
      3: 1
    })).toEqual({
      1: {
        amount: 1,
        extra: 1
      },
      2: {
        amount: 1,
        extra: 0
      },
      3: {
        amount: 0,
        extra: 1
      }
    });
  })
});