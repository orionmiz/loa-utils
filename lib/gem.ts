export type Gem = Record<number, number>;

export type GemLists = {
  now: Gem,
  target: Gem
}

export type UnifiedGem = Record<number, { 
  amount: number,
  extra: number
}>

export type UnifiedGemLists = Record<keyof GemLists, UnifiedGem>;

export const GemColor: Record<number, string> = {
  1: 'bg-lime-500',
  2: 'bg-lime-500',
  3: 'bg-sky-500',
  4: 'bg-sky-500',
  5: 'bg-violet-600',
  6: 'bg-violet-600',
  7: 'bg-amber-500',
  8: 'bg-amber-500',
  9: 'bg-amber-500',
  10: 'bg-red-500'
}

// level 1
// level 2 = 3
// level 3 = 3^2
// level 4 = 3^3
// ... 
// level n = 3^(n-1)

export const presets: Record<string, Gem> = {
  '회랑': {
    4: 2,
    3: 1
  },
  '회랑-헬': {
    4: 2,
    3: 2,
    2: 2
  },
  '점령': {
    3: 10
  }
}

const minGemLev = 1;
const maxGemLev = 10;

export function combine(gem: Gem): Gem {
  let val = calcGemValue(gem);

  const result: Gem = {};

  for (let level = maxGemLev; level; level--) {
    const cost = 3 ** (level - 1);
    const quotient = (val / cost) | 0;
    if (quotient) {
      val %= cost;
      result[level] = quotient;
    }
  }

  return result;
}

export function parseGemString(str: string, preview: boolean = false) {

  const gems: Gem = str.split(/,\s*/).reduce((prev: Gem, cur) => {

    let isPreset = false;

    const [level, amount = cur.includes('*') ? 11 : 1] = cur.split('/').map(str => parseInt(str));

    if (amount < 0 || !amount) {
      if (!preview)
        throw Error(`유효하지 않은 개수입니다 '${cur}'`);
      return prev;
    }

    /*for (const preset in presets) {
      if (cur.startsWith(preset)) {
        presets[preset].forEach(([presetLevel, presetAmount]) => {
          prev[presetLevel] = (prev[presetLevel] ?? 0) + presetAmount * amount;
        });
        isPreset = true;
        break;
      }
    }*/

    for (const preset in presets) {
      if (cur.split('/')[0] === preset) {
        Object.keys(presets[preset]).forEach((key) => {
          const presetLevel = parseInt(key);
          prev[presetLevel] = (prev[presetLevel] ?? 0) + presets[preset][presetLevel] * amount;
        });
        isPreset = true;
        break;
      }
    }

    // raw level
    if (!isPreset) {
      if (level >= minGemLev && level <= maxGemLev)
        prev[level] = (prev[level] ?? 0) + amount;
      else {
        if (!preview) {
          throw Error(`유효하지 않은 보석입니다 '${cur}'`);
        }
        return prev;
      }
    }

    return prev;
  }, {});

  return gems;
}

export function calcReqOld(from: Gem, to: Gem): Gem {
  let diff = calcGemValue(to) - calcGemValue(from);

  // already done
  if (diff <= 0)
    return {};

  let level = getMaxLevel(to);

  const reqs: Gem = {};

  while (diff > 0) {
    const gemVal = 3 ** (level - 1);

    if (diff - gemVal < 0) {
      level--;
    } else {
      const quotient = (diff / gemVal) | 0;
      //const quotient = Math.min((diff / gemVal) | 0, to[level]);
      
      diff -= gemVal * quotient;
      reqs[level] = (reqs[level] ?? 0) + quotient;

      level--;
      //level = findPrevLevel(to, level);
    }
    
    // level--보다 다음 목표레벨로?
    //level = findPrevLevel(to, level);
    //console.log(`level: ${level}`)
  }

  return reqs;
}

/*export function calcReq(from: Gem, to: Gem): Gem {

  const _from = Object.assign({}, from);
  let _to = Object.assign({}, to);

  //let reqs: Gem = {};

  const rest: Gem = {};

  // desc
  Object.keys(from).sort().reverse().forEach(key => { 
    const level = parseInt(key);
    let amount = from[level];
    let idx = level;

    if (_to[level]) {
      const dec = Math.min(_to[level], amount);
      _to[level] -= dec;
      amount -= dec;
      if (!_to[level])
        delete _to[level]
    }

    while (true) {
      const nextLevel = findNextLevel(_to, idx);
      if (nextLevel > 10)
        break;
      idx = nextLevel;

      const levelDiff = idx - level;
      // reqs에는 to - from이 담겨야함
      const quotient = (amount / (3 ** levelDiff)) | 0;

      if (quotient) {
        const dec = Math.min(_to[idx], quotient);

        // consider quotient > _to[idx]
        _to[idx] -= dec;
        amount -= dec * (3 ** levelDiff);
        if (!_to[idx]) {
          delete _to[idx];
        }      
      } else {
        break;
      }
    }
    // use classic way here. and dispose 'rest'
    if (amount) {

      if (_to[idx]) {
        const req = calcReqOld({ [level]: amount }, { [idx]: _to[idx] });
        // calcreqold -> 분배

        console.log('req:');
        console.log(req);
  
        delete _to[idx];

        if (!Object.keys(req).length) {
          // go rest
          rest[level] = amount;
        } else {
          
          _to = { ..._to, ...req };
        }
      }
    }
  });

  return _to;
}*/

export function calcReq(from: Gem, to: Gem) {
  const [req] = calcReqWithRest(from, to);
  return req;
}

export function calcReqWithRest(from: Gem, to: Gem): [Gem, Gem] {
  let _to = Object.assign({}, to);
  const rest: Gem = {};
  Object.keys(from).sort().reverse().forEach(key => {
    const level = parseInt(key);
    let amount = from[level];
    let idx = to[level] ? level : findNextLevel(_to, level);

    do {
      const levelDiff = idx - level;
      const quotient = (amount / (3 ** levelDiff)) | 0;

      // break 1: amount is not enough
      if (!quotient)
        break;

      if (quotient >= _to[idx]) {
        // amount is more bigger
        amount -= _to[idx] * (3 ** levelDiff);
        delete _to[idx];
      } else {
        amount %= 3 ** levelDiff;
        _to[idx] -= quotient;
        // break 1: explicit end point of amount
        break;
      }

      // break 2: no more target
      idx = findNextLevel(_to, idx);
    } while (idx <= 10);

    if (amount) {
      // case 1: calc old req
      if (_to[idx]) {
        const req = calcReqOld({ [level]: amount }, { [idx]: _to[idx] });
        delete _to[idx];
        _to = { ..._to, ...req };
      } else {
        // case 2: rest
        rest[level] = amount;
      }
    }

   
  });

  return [_to, rest];
}

function calcSpecialReq(goal: Gem, req: string) {
  const each = calcGemValue(presets[req])
  const val = calcGemValue(goal);

  return Math.ceil(val / each);
}

export function calcBossRushReq(goal: Gem) {
  return calcSpecialReq(goal, '회랑');
}

export function calcBossRushHellReq(goal: Gem) {
  return calcSpecialReq(goal, '회랑-헬');
}

export function calcWarReq(goal: Gem) {
  return calcSpecialReq(goal, '점령');
}

function getValue(level: number, count: number = 1) {
  return (3 ** (level - 1)) * count;
}

function calcGemValue(gem: Gem): number {
  return Object.keys(gem).reduce((prev, cur) => {
    const level = parseInt(cur);
    return prev + getValue(level, gem[level]);
  }, 0);
}

export function addGem(origin: Gem, target: Gem) {
  Object.keys(target).forEach(key => {
    const level = parseInt(key);
    origin[level] = (origin[level] ?? 0) + target[level];
  })
}

export function merge(src: Gem, extra: Gem): UnifiedGem {
  const unified: UnifiedGem = {};

  Object.keys(src).forEach(key => {
    const level = parseInt(key);
    unified[level] = {
      amount: src[level],
      extra: 0
    }
  });

  Object.keys(extra).forEach(key => {
    const level = parseInt(key);
    if (!unified[level]) {
      unified[level] = {
        amount: 0,
        extra: extra[level]
      }
    } else {
      unified[level].extra = extra[level];
    }
  })

  return unified;
}

export function getMaxLevel(gem: Gem) {
  return Object.keys(gem).reduce((prev, cur) => {
    const val = parseInt(cur);
    if (val > prev)
      return val;
    return prev;
  }, 0);
}

export function getMinLevel(gem: Gem) {
  return Object.keys(gem).reduce((prev, cur) => {
    const val = parseInt(cur);
    if (val < prev)
      return val;
    return prev;
  }, 11);
}

function findPrevLevel(gem: Gem, level: number) {
  return Object.keys(gem).reduce((prev, cur) => {

    const lev = parseInt(cur);

    if (lev < level && lev > prev) {
      return lev;
    }

    return prev;
  }, 0);
}

// same or above
function findNextLevel(gem: Gem, level: number) {
  return Object.keys(gem).reduce((prev, cur) => {

    const lev = parseInt(cur);

    if (lev > level && lev < prev) {
      return lev;
    }

    return prev;
  }, 11);
}