import { useCallback, useEffect, useRef, useState } from 'react'
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

const { useStore, Provider } = createZustandConstate<State, Props>(
  undefined,
  ({ step }) => {
    const [count, setCount] = useState(0)
    const [open, setOpen] = useState(false)
    const increment = useCallback(
      () => setCount((count) => (count += step)),
      [step]
    )

    return {
      count,
      increment,
      open,
      setOpen,
    }
  }
)

// const countSelector = (state: State) => state.count
// const useCount = () => useStore(countSelector)

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
  const { open, count } = useStore((state: State) => ({
    open: state.open,
    count: state.count,
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

const ZustandConstatebutton = ({ steps }) => {
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

export { ZustandConstatebutton }
