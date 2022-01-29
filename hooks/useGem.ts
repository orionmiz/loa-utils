import { GemLists } from "../stores/GemStore";
import useStores from "./useStores";

export default function useGem() {
  const { gem } = useStores();
  
  return gem;
}