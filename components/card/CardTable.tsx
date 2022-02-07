import useCard from "hooks/useCard";
import { CardColor, cardSets } from "lib/card";
import { observer } from "mobx-react";
import { CardInputData } from "stores/CardStore";

export const CardTable = observer(({ cardList, propList, mode }: {
  cardList: string[],
  propList: Record<string, any>,
  mode: "input" | "output"
}) => {
  const card = useCard();

  return (
    <>
      { // table for big screen
        <table className="table ~sm:hidden">
          <thead>
            <tr>
              <th className="border border-slate-400 bg-gray-400 text-white">카드 목록 {' >'}</th>
              {cardList.map(name => (
                <th key={name} className={`text-center text-white font-normal border border-slate-400 bg-slate-100 ${CardColor[cardSets[card.set].cards[name].rarity]}`}>{name}</th>))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(propList).map(prop => (
              <tr key={prop}>
                <td className="w-24 text-center font-bold border border-slate-400 bg-slate-100">{prop}</td>
                {cardList.map(name => (
                  <td key={name} className="border border-slate-400 text-center sm:w-16 md:w-24 lg:w-28 text-lg">
                    {mode === "input" ? <CardDataCell name={name} prop={propList[prop] as keyof CardInputData} /> : propList[prop][name]}
                  </td>))}
              </tr>))}
          </tbody>
        </table>
      }
      { // table for small screen
        <table className="table sm:hidden">
          <thead>
            <tr>
              <th className="border border-slate-400 bg-gray-400 text-white w-28">카드 목록 {' ∨'}</th>
              {Object.keys(propList).map(prop => (
                <th key={prop} className="text-center border border-slate-400 bg-slate-100">{prop}</th>))}
            </tr>
          </thead>
          <tbody>
            {cardList.map(name => (
              <tr key={name}>
                <td key={name} className={`text-center text-white font-normal border border-slate-400 bg-slate-100 ${CardColor[cardSets[card.set].cards[name].rarity]}`}>{name}</td>
                {Object.keys(propList).map(prop => (
                  <td key={prop} className="border border-slate-400 text-center w-24 text-lg">
                    {mode === "input" ? <CardDataCell name={name} prop={propList[prop] as keyof CardInputData} /> : (<span className="">{propList[prop][name]}</span>)}
                  </td>))}
              </tr>))}
          </tbody>
        </table>
      }
    </>)
});

export const CardDataCells = observer(({ prop }: {
  prop: keyof CardInputData
}) => {

  const card = useCard();

  const { data } = card;

  return (
    <>{Object.keys(data).map(name => (
      <CardDataCell name={name} prop={prop} key={name} />))}
    </>)
});

export const CardDataCell = observer(({ name, prop }: {
  name: string,
  prop: keyof CardInputData
}) => {

  const card = useCard();

  const { data } = card;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const val = parseInt(e.target.value);
    if (val >= 0 && (prop === 'amount' || val <= 5)) {
      card.changeData(name, prop, val);
    }
  }

  return (
    <input type='number'
      className="text-center text-lg w-full pl-2"
      value={data[name][prop]}
      onChange={onChange}></input>
  )
});