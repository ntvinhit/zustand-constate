// import { create } from "zustand";
// import createContext from "zustand/context";
// import * as React from "react";
// import { type ReactNode, useLayoutEffect } from "react";
// import type {
// 	EqualityChecker,
// 	State,
// 	StateCreator,
// 	StateSelector,
// } from "zustand/vanilla";

// export type LocalUseStore<TState, Props> = TState & {
// 	$sync: (props: Props) => void;
// };

// type CreateContextUseStore<StateSlice, TState extends State> = (
// 	selector?: StateSelector<TState, StateSlice> | undefined,
// 	equalityFn?: (StateSlice: TState)//EqualityChecker<StateSlice>,
// ) => StateSlice;

// type CreateContextUSeStoreApi<TState, Props> = () => {
// 	getState: import("zustand").GetState<LocalUseStore<TState, Props>>;
// 	setState: import("zustand").SetState<LocalUseStore<TState, Props>>;
// 	subscribe: import("zustand").Subscribe<LocalUseStore<TState, Props>>;
// 	destroy: import("zustand").Destroy;
// };

// const syncSelector = <TState, Props>(store: LocalUseStore<TState, Props>) =>
// 	store.$sync;

// export function createZustandConstate<
// 	TState extends State,
// 	Props extends Record<string, any>,
// >(
// 	createState?: StateCreator<TState>,
// 	useValue?: (
// 		props: Props & {
// 			useStore: CreateContextUseStore<any, TState>;
// 			useStoreApi: CreateContextUSeStoreApi<TState, Props>;
// 		},
// 	) => any,
// ) {
// 	const {
// 		Provider: ZustandProvider,
// 		useStore,
// 		useStoreApi,
// 	} = createContext<LocalUseStore<TState, Props>>();

// 	const Hook = (props: Props) => {
// 		const sync = useStore(syncSelector);

// 		useLayoutEffect(() => {
// 			sync(props);
// 		}, Object.values(props));

// 		if (useValue) {
// 			const returned = useValue({ ...props, useStore, useStoreApi });

// 			useLayoutEffect(() => {
// 				if (returned && typeof returned === "object") sync(returned);
// 			}, [returned]);
// 		}

// 		return null;
// 	};

// 	createState = createState || (() => ({}) as TState);

// 	const createStore = () => {
// 		return create<TState>((set, get, api) => ({
// 			...createState!(set, get, api),
// 			$sync: (props: Partial<Props>) =>
// 				set((state) => ({ ...state, ...props })),
// 		}));
// 	};

// 	const Provider = (props: Props & { children: ReactNode }) => {
// 		const { children, ...propsWithoutChildren } = props;

// 		return (
// 			// @ts-ignore
// 			<ZustandProvider createStore={createStore}>
// 				{/* @ts-ignore*/}
// 				<Hook {...propsWithoutChildren} />
// 				{children}
// 			</ZustandProvider>
// 		);
// 	};

// 	return {
// 		Provider,
// 		useStore,
// 		useStoreApi,
// 	};
// }

// export default createZustandConstate;

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
