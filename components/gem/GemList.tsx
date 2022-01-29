import { observer } from "mobx-react-lite";
import useGem from "../../hooks/useGem";
import { Gem } from "../../lib/gem";
import { GemLists } from "../../lib/gem";
import GemBadge from "./GemBadge";

function GemList({ gems, name }: {
  gems: Gem
  name?: keyof GemLists
}) {

  const gem = useGem();

  // Lists => map, check extra in each badges
  // Previews => reduce, only render gems not in lists 
  return (
    <>
      {}
      {name ? Object.keys(gem.preview[name]).map((key, idx) => (
        <GemBadge level={parseInt(key)} amount={gems[parseInt(key)]} key={idx} name={name} />
      )) : Object.keys(gems).map((key, idx) => (
        <GemBadge level={parseInt(key)} amount={gems[parseInt(key)]} key={idx}/>
      ))}
    </>);
}

export default observer(GemList);