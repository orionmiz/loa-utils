import { observer } from "mobx-react-lite";
import Head from "next/head";
import React, { useMemo } from "react";
import GemContainer from "../components/gem/GemContainer";
import GemList from "../components/gem/GemList";
import Layout from "../components/layout";
import useGem from "../hooks/useGem";
import { calcBossRushReq, calcWarReq, presets } from "../lib/gem";
import { GemLists } from "../lib/gem";
import { isEmpty } from "../lib/util";

function GemPage() {

  const gem = useGem();

  const { lists, result, needs, rests } = gem;

  // parse string and cache preview data
  const cache = useMemo(() => {

  }, []);

  return (
    <Layout>
      <Head>
        <title>LoaUtils - 보석 계산</title>
      </Head>
      <div className="p-4">
        <div className="font-bold">가이드) </div>
        보유 중인 보석과 목표 보석을 <span className="border rounded font-bold text-green-500 border-green-500 px-1 pt-1">
          레벨/개수
        </span>와 같은 형태로 입력합니다.
        <div>
          Enter를 누르면 입력을 확정하여 리스트에 반영합니다.<br />
          레벨만 입력할 경우 개수는 1로 취급합니다.<br />
          레벨 뒤에 *를 붙일 경우 개수는 11로 취급합니다. (최대 장착 보석)<br />
          쉼표로 구분하여 여러 개의 보석을 한번에 입력 가능합니다.<br />
        </div>
        <br />
        <div>
          보석 레벨 대신 다음과 같은 단어들도 사용 가능합니다.
          {Object.keys(presets).map(key => (
            <div key={key}>
              <span className="font-bold">{key}:</span>{' '}
              { Object.keys(presets[key]).map(level => (
                `${level}레벨 보석 ${presets[key][parseInt(level)]}개`
              )).join(', ') }로 취급
            </div>))}
        </div>
      </div>
      <div className="flex flex-wrap">
        {
          [
            ['now', '보유 중인 보석'],
            ['target', '목표 보석']
          ].map(([name, desc]) => (
            <div className="flex-none p-4" key={name}>
              <GemContainer name={name as keyof GemLists} desc={desc} />
            </div>))
        }
        <div className="flex-none p-4">
          <div className="font-bold text-sky-700 mb-1">결과</div>
          <div className="mb-1 border rounded px-1 flex flex-wrap">
            {(!isEmpty(lists.now) && isEmpty(lists.target)) &&
              <div className="flex-none p-4">
                <div className="bg-slate-600 pt-1 mb-2 rounded font-bold text-white text-center">합성 결과</div>
                <GemList gems={result} />
                <br />
              </div>}
            {!isEmpty(needs) &&
              <div className="flex-none p-4">
                <div className="bg-slate-600 pt-1 mb-2 rounded font-bold text-white text-center">필요 보석</div>
                <GemList gems={needs} />
                <div className="text-rose-400 font-bold">≈ 태양의 회랑 {calcBossRushReq(needs)}수</div>
                <div className="text-rose-400 font-bold">≈ 점령전 {calcWarReq(needs)}회</div>
                <br />
              </div>}
            {(!isEmpty(lists.target) && !isEmpty(rests)) &&
              <div className="flex-none p-4">
                <div className="bg-slate-200 pt-1 mb-2 rounded font-bold text-center">남는 보석</div>
                <GemList gems={rests} />
              </div>}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default observer(GemPage);