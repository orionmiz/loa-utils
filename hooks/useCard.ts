import useStores from "./useStores";

export default function useCard() {
  const { card } = useStores();
  
  return card;
}