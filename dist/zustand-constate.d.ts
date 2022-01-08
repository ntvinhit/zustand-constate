import { ReactNode } from 'react';
import { EqualityChecker, State, StateCreator, StateSelector } from 'zustand/vanilla';
export declare type LocalUseStore<TState, Props> = TState & {
    $sync: (props: Props) => void;
};
declare type CreateContextUseStore<StateSlice, TState extends State> = (selector?: StateSelector<TState, StateSlice> | undefined, equalityFn?: EqualityChecker<StateSlice>) => StateSlice;
declare type CreateContextUSeStoreApi<TState, Props> = () => {
    getState: import("zustand").GetState<LocalUseStore<TState, Props>>;
    setState: import("zustand").SetState<LocalUseStore<TState, Props>>;
    subscribe: import("zustand").Subscribe<LocalUseStore<TState, Props>>;
    destroy: import("zustand").Destroy;
};
export declare function createZustandConstate<TState extends State, Props extends Record<string, any>>(createState?: StateCreator<TState>, useValue?: (props: Props & {
    useStore: CreateContextUseStore<any, TState>;
    useStoreApi: CreateContextUSeStoreApi<TState, Props>;
}) => any): {
    Provider: (props: Props & {
        children: ReactNode;
    }) => JSX.Element;
    useStore: import("zustand/context").UseContextStore<LocalUseStore<TState, Props>>;
    useStoreApi: () => {
        getState: import("zustand").GetState<LocalUseStore<TState, Props>>;
        setState: import("zustand").SetState<LocalUseStore<TState, Props>>;
        subscribe: import("zustand").Subscribe<LocalUseStore<TState, Props>>;
        destroy: import("zustand").Destroy;
    };
};
export default createZustandConstate;
