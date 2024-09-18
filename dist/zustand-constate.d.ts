import { type ReactNode } from 'react';
import { type StateCreator, type StoreApi } from 'zustand';
export type LocalUseStore<TState, Props> = TState & {
    $sync: (props: Props) => void;
};
type CreateContextUseStore<StateSlice, TState extends unknown> = (selector?: (s: TState) => StateSlice | undefined, equalityFn?: (a: StateSlice, b: StateSlice) => boolean) => StateSlice;
export declare function createZustandConstate<TState extends unknown, Props extends Record<string, any>>(createState?: StateCreator<TState>, useValue?: (props: Props & {
    useStore: CreateContextUseStore<any, TState>;
    useStoreApi: StoreApi<LocalUseStore<TState, Props>>;
}) => any): {
    Provider: (props: Props & {
        children: ReactNode;
    }) => JSX.Element;
    useStore: (selector: any) => unknown;
};
export default createZustandConstate;
