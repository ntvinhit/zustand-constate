"use strict";
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
        var storeApi = (0, react_1.useContext)(StoreContext);
        (0, react_1.useLayoutEffect)(function () {
            // @ts-ignore
            sync(props);
        }, Object.values(props));
        if (useValue) {
            // @ts-ignore
            var returned_1 = useValue(__assign(__assign({}, props), { useStore: useStoreInContext, useStoreApi: storeApi }));
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
        react_1.default.createElement(StoreContext.Provider, { value: storeRef.current },
            react_1.default.createElement(Hook, __assign({}, propsWithoutChildren)),
            children));
    };
    return {
        Provider: StoreProvider,
        useStore: useStoreInContext,
    };
}
exports.default = createZustandConstate;
