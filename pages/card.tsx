import { CardDataCell, CardDataCells, CardTable } from "components/card/CardTable";
import useCard from "hooks/useCard";
import { CardColor, cardSets } from "lib/card";
import { observer } from "mobx-react-lite";
import Head from "next/head";
import React, { ChangeEventHandler } from "react";
import { CardInputData } from "stores/CardStore";
import Layout from "../components/layout";

function CardPage() {

  const card = useCard();

  const { set, sets, goal, awakenings, data, minSelect } = card;

  return (
    <Layout>
      <Head>
        <title>LoaUtils - 카드 각성</title>
      </Head>
      <div className="m-4">
        <div className="font-bold text-xl mb-1 text-sky-700">가이드</div>
        <p>
          1. 맞추고자 하는 카드 세트와 목표 각성의 합계를 설정하세요. <br />
          2. 현재 보유중인 카드들의 각성 수치와 추가 개수를 입력하세요. <br />
          <span className="font-bold">※ 세트의 모든 카드가 등록되어 있다고 가정합니다.<br /></span>
        </p>
        <div className="space-x-2 py-2">
          <select value={set} onChange={e => {
            e.preventDefault();
            card.changeSet(e.target.value);
          }} className="border border-black rounded">
            <option value=''>세트 선택</option>
            {sets.map(name => (<option value={name} key={name}>{name}</option>))}
          </select>
          <select value={goal} disabled={set === ''} onChange={e => {
            e.preventDefault();
            card.changeGoal(parseInt(e.target.value));
          }} className="border border-black rounded">
            <option value={0}>목표 각성</option>
            {set !== '' && awakenings?.map(goal => (<option value={goal} key={goal}>{goal}</option>))}
          </select>
        </div>
        {set !== '' &&
          <>
            <div className="my-2">
              <CardTable cardList={Object.keys(data)} propList={{ '각성 수치': 'awakening', '+ 카드 수': 'amount' }} mode='input' />
            </div>
            <div>
              {goal > 0 && (
                <>
                  <div className="my-4">
                    <span className="font-bold text-sky-700 text-xl">
                      ➥ 결과
                    </span>
                    <div className="flex space-x-2 mb-2">
                      <div>
                        <input type='radio' name='group' id='minCard' value='minCard' checked={!minSelect} onChange={() => card.toggleMinSelect()} />
                        <label htmlFor='minCard'> 최소 카드</label>
                      </div>
                      <div>
                        <input type='radio' name='group' id='minSelect' value='minSelect' checked={minSelect} onChange={() => card.toggleMinSelect()} />
                        <label htmlFor='minSelect'> 최소 선택팩</label>
                      </div>
                    </div>
                    <div className="font-bold">
                      <span className="text-sky-500">각성 합계: </span>
                      {card.totalAwakening} {' → '} {goal}
                    </div>
                    <div className="font-bold text-sky-500 mb-1">목표 각성까지 필요한 카드:</div>
                    <CardTable cardList={Object.keys(card.reqs)} propList={{
                      '각성 결과': card.result,
                      '필요 개수': card.reqs,
                    }} mode='output' />
                  </div>
                  {/*<div className="my-4">
                    <div className="font-bold text-sky-700 text-xl mb-2">
                      ➥ 획득처
                    </div>
                    <CardTable cardList={Object.keys(card.reqs)} propList={{
                      '획득처': card.paths,
                    }} mode='output' />
                  </div>*/}
                </>)}
            </div>
          </>
        }
      </div>
    </Layout>
  )
}

export default observer(CardPage);