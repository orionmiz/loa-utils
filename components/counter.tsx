export function Counter({ inc, dec, del }: {
  inc: () => void,
  dec: () => void,
  del: () => void
}) {
  return (
    <>
      <CounterButton onClick={inc}>＋</CounterButton>
      <CounterButton onClick={dec}>－</CounterButton>
      <CounterButton onClick={del}>×</CounterButton>
    </>
  )
}

function CounterButton({ children, onClick }: {
  children: React.ReactNode
  onClick: () => void
}) {
  return(<span className="border rounded-full bg-gray-100 px-1 pt-1 select-none" onClick={onClick}>{ children }</span>)
}