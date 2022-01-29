import { observer } from "mobx-react-lite";
import { useState } from "react";
import useGem from "../../hooks/useGem";
import { GemColor } from "../../lib/gem";
import { GemLists } from "../../lib/gem";
import Badge from "../badge";
import { Counter } from "../counter";

function GemBadge({ level, amount, name }: {
  level: number,
  amount: number,
  name?: keyof GemLists
}) {

  const gem = useGem();

  const [showCounter, setShowCounter] = useState(false);

  const preview = name ? gem.preview[name][level].extra : 0;

  // amount = 0 & preview > 0 -> new with opacity
  // amount > 0 & preview > 0 -> amount+preview

  const arr = [];

  if (amount)
    arr.push(amount);

  if (preview)
    arr.push(preview);

  return (
    <>
      <div className="mb-1" onMouseOver={() => setShowCounter(true)} onMouseLeave={() => setShowCounter(false)}>
        <Badge label={`${level}레벨 보석 / ${arr.join('+')}개`} color={GemColor[level]} />
        {(name && showCounter && amount) &&
          <Counter
            inc={() => gem.increase(name, level)}
            dec={() => gem.decrease(name, level)}
            del={() => gem.delete(name, level)} />}
      </div>
      <style jsx>{`
        div {
          opacity: ${(!amount && preview) ? 0.5 : 1}
        }
      `}</style>
    </>
  )
}

export default observer(GemBadge);