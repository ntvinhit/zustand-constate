import { useCallback, useState } from 'react'
import createZustandConstate from '../zustand-constate'
import React from 'react'

interface Props {
  step: number
}
interface State extends Props {
  count: number
  increment: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

const { useStore, Provider } = createZustandConstate<State, Props>((set) => ({
  count: 0,
  step: 1,
  open: false,
  setOpen: (open) => set((state) => ({ open })),
  increment: () => set((state) => ({ count: state.count + state.step })),
}))

const Count = () => {
  // const count = useCount()
  const count = useStore((state: State) => state.count)

  return <div>{`Current count: ${count}`}</div>
}

const Increment = () => {
  const { increment, step } = useStore((state) => ({
    increment: state.increment,
    step: state.step,
  }))

  return <button onClick={increment}>{`Increment by ${step}`}</button>
}

// const openSelector = (state: State) => state.open
// const useOpen = () => useStore(openSelector)

const Modal = () => {
  useModaltoggle()
  const { open } = useStore((state: State) => ({
    open: state.open,
  }))
  // const open = useStore((state: State) => state.open)

  return (
    <>
      <div>{`modal opened: ${open}`}</div>
      <div>{`Rendered ${Math.random()}`}</div>
    </>
  )
}

const useModaltoggle = () => {
  const { setOpen } = useStore((state: State & Props) => ({
    // count: state.count,
    setOpen: state.setOpen,
  }))

  // useEffect(() => {
  //   if (count % 2) {
  //     openModal?.(false)
  //   } else {
  //     openModal?.(true)
  //   }
  // }, [count])
}

const Zustandbutton = ({ steps }) => {
  return (
    <>
      <Provider step={steps}>
        <Count />
        <Increment />
        <Modal />
      </Provider>
      <>========================</>
      <Provider step={steps}>
        <Count />
        <Increment />
        <Modal />
      </Provider>
    </>
  )
}

export { Zustandbutton }
