import { MobXProviderContext } from "mobx-react";
import React from "react";
import RootStore from "../stores/RootStore";

export default function useStores() {
  return React.useContext(MobXProviderContext) as typeof RootStore;
}