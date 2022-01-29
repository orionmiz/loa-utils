import { observer } from "mobx-react-lite";
import useGem from "../../hooks/useGem";
import { GemLists } from "../../lib/gem";
import GemList from "./GemList";

function GemContainer({ name, desc }: {
  name: keyof GemLists,
  desc: string,
}) {

  const gem = useGem();

  const { lists, inputs } = gem;

  const list = lists[name];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      gem.addFromInput(name);
      gem.changeInputs(name, '');
    } catch (e) {
      alert(e);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    //console.log(`change: ${name} ${e.target.value}`)
    //console.log(`store: ${inputs[name]}`)
    gem.changeInputs(name, e.target.value);
  }

  return (
    <>
      <div className="mb-1">
        <span className="font-bold text-sky-700">{desc} {' '}</span>
        <span className="border rounded bg-gray-300 font-bold px-1 pt-1" onClick={() => gem.clear(name)}>초기화</span>
      </div>
      <GemList gems={list} name={name} />
      <form onSubmit={onSubmit} name={name}>
        <input type='text' className="border rounded px-1" placeholder="예시) 5, 6/2, 7*"
          name={name}
          onChange={handleChange}
          value={inputs[name]}></input>
        <style jsx>{`
            input::placeholder {
              user-select: none;
            }
            `}</style>
      </form>
    </>
  );
}

export default observer(GemContainer);