export function Counter({ inc, dec, del }: {
  inc: () => void,
  dec: () => void,
  del: () => void
}) {
  return (
    <div className="flex space-x-1 m-1">
      <CounterButton onClick={inc}>＋</CounterButton>
      <CounterButton onClick={dec}>－</CounterButton>
      <CounterButton onClick={del}>×</CounterButton>
    </div>
  )
}

function CounterButton({ children, onClick }: {
  children: React.ReactNode
  onClick: () => void
}) {
  return(<span className="border-2 rounded-full bg-gray-100 px-1 select-none cursor-pointer w-7 text-center font-bold leading-3 text-center" onClick={onClick}>{ children }</span>)
}