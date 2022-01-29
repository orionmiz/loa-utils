import useStores from "./useStores";

export default function useGem() {
  const { gem } = useStores();
  
  return gem;
}