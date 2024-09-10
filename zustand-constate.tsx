import React, {
  createContext,
  useContext,
  useRef,
  type ReactNode,
  useLayoutEffect,
} from 'react'

import {
  createStore as createZustandStore,
  type StateCreator,
  type StoreApi,
} from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'

export type LocalUseStore<TState, Props> = TState & {
  $sync: (props: Props) => void
}

type CreateContextUseStore<StateSlice, TState extends unknown> = (
  selector?: (s: TState) => StateSlice | undefined,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) => StateSlice

const syncSelector = <TState, Props>(store: LocalUseStore<TState, Props>) =>
  store.$sync

export function createZustandConstate<
  TState extends unknown,
  Props extends Record<string, any>,
>(
  createState?: StateCreator<TState>,
  useValue?: (
    props: Props & {
      useStore: CreateContextUseStore<any, TState>
      useStoreApi: StoreApi<LocalUseStore<TState, Props>>
    }
  ) => any
) {
  const StoreContext = createContext<StoreApi<
    LocalUseStore<TState, Props>
  > | null>(null)

  const useStoreInContext = (selector: any) => {
    const store = useContext(StoreContext)
    if (!store) {
      throw new Error('Missing StoreProvider')
    }
    // @ts-ignore
    return useStoreWithEqualityFn(store, selector)
  }

  const Hook = (props: Props) => {
    const sync = useStoreInContext(syncSelector)
    const storeApi = useContext(StoreContext)

    useLayoutEffect(() => {
      // @ts-ignore
      sync(props)
    }, Object.values(props))

    if (useValue) {
      // @ts-ignore
      const returned = useValue({
        ...props,
        useStore: useStoreInContext,
        useStoreApi: storeApi,
      })

      useLayoutEffect(() => {
        // @ts-ignore
        if (returned && typeof returned === 'object') sync(returned)
      }, [returned])
    }

    return null
  }

  createState = createState || (() => ({}) as TState)

  const StoreProvider = (props: Props & { children: ReactNode }) => {
    const { children, ...propsWithoutChildren } = props
    const storeRef = useRef<StoreApi<LocalUseStore<TState, Props>>>()

    if (!storeRef.current) {
      storeRef.current = createZustandStore<LocalUseStore<TState, Props>>(
        (set, get, api) => ({
          // @ts-ignore
          ...createState?.(set, get, api),
          $sync: (props: Partial<Props>) =>
            set((state) => ({ ...state, ...props })),
        })
      )
    }

    return (
      // @ts-ignore
      <StoreContext.Provider value={storeRef.current}>
        {/* @ts-ignore*/}
        <Hook {...propsWithoutChildren} />
        {children}
      </StoreContext.Provider>
    )
  }

  return {
    Provider: StoreProvider,
    useStore: useStoreInContext,
  }
}

export default createZustandConstate
