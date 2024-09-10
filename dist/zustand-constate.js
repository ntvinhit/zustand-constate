"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createZustandConstate = createZustandConstate;
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
var react_1 = require("react");
var zustand_1 = require("zustand");
var traditional_1 = require("zustand/traditional");
var syncSelector = function (store) {
    return store.$sync;
};
function createZustandConstate(createState, useValue) {
    var StoreContext = (0, react_1.createContext)(null);
    var useStoreInContext = function (selector) {
        var store = (0, react_1.useContext)(StoreContext);
        if (!store) {
            throw new Error('Missing StoreProvider');
        }
        // @ts-ignore
        return (0, traditional_1.useStoreWithEqualityFn)(store, selector);
    };
    var Hook = function (props) {
        var sync = useStoreInContext(syncSelector);
        (0, react_1.useLayoutEffect)(function () {
            // @ts-ignore
            sync(props);
        }, Object.values(props));
        if (useValue) {
            // @ts-ignore
            var returned_1 = useValue(__assign(__assign({}, props), { useStoreInContext: useStoreInContext, useStoreApi: useStoreApi }));
            (0, react_1.useLayoutEffect)(function () {
                // @ts-ignore
                if (returned_1 && typeof returned_1 === 'object')
                    sync(returned_1);
            }, [returned_1]);
        }
        return null;
    };
    createState = createState || (function () { return ({}); });
    var StoreProvider = function (props) {
        var children = props.children, propsWithoutChildren = __rest(props, ["children"]);
        var storeRef = (0, react_1.useRef)();
        if (!storeRef.current) {
            storeRef.current = (0, zustand_1.createStore)(function (set, get, api) { return (__assign(__assign({}, createState === null || createState === void 0 ? void 0 : createState(set, get, api)), { $sync: function (props) {
                    return set(function (state) { return (__assign(__assign({}, state), props)); });
                } })); });
        }
        return (
        // @ts-ignore
        React.createElement(StoreContext.Provider, { value: storeRef.current },
            React.createElement(Hook, __assign({}, propsWithoutChildren)),
            children));
    };
    return {
        Provider: StoreProvider,
        useStore: useStoreInContext,
    };
}
exports.default = createZustandConstate;
