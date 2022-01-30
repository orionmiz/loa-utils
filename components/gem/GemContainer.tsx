import { observer } from "mobx-react-lite";
import useGem from "../../hooks/useGem";
import { GemLists, presets } from "../../lib/gem";
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
    <div className="container w-56">
      <div className="flex mb-1 items-center space-x-3">
        <span className="flex-none font-bold text-sky-700 text-xl">{desc} {' '}</span>
        <span className="flex-none border rounded bg-gray-400 text-white font-bold cursor-pointer px-2 select-none" onClick={() => gem.clear(name)}>&#11119;</span>
      </div>
      <GemList gems={list} name={name} />
      <form onSubmit={onSubmit} name={name}>
        <input type='text' className="border rounded px-1 w-full" placeholder={`예시) 5, 6/2, 7*${name === 'now' ? `, ${Object.keys(presets).join(', ')}` : ''}`}
          name={name}
          onChange={handleChange}
          value={inputs[name]}></input>
        <style jsx>{`
            input::placeholder {
              user-select: none;
            }
            `}</style>
      </form>
    </div>
  );
}

export default observer(GemContainer);