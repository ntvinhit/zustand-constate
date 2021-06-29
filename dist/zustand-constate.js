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
exports.__esModule = true;
exports.createZustandConstate = void 0;
var zustand_1 = require("zustand");
var context_1 = require("zustand/context");
var React = require("react");
var react_1 = require("react");
var syncSelector = function (store) {
    return store.$sync;
};
function createZustandConstate(createState, useValue) {
    var _a = context_1["default"](), ZustandProvider = _a.Provider, useStore = _a.useStore, useStoreApi = _a.useStoreApi;
    var Hook = function (props) {
        var sync = useStore(syncSelector);
        react_1.useLayoutEffect(function () {
            sync(props);
        }, Object.values(props));
        if (useValue) {
            var returned_1 = useValue(__assign(__assign({}, props), { useStore: useStore, useStoreApi: useStoreApi }));
            react_1.useLayoutEffect(function () {
                if (returned_1 && typeof returned_1 === 'object')
                    sync(returned_1);
            }, [returned_1]);
        }
        return null;
    };
    createState = createState || (function () { return ({}); });
    var createStore = function () {
        return zustand_1["default"](function (set, get, api) { return (__assign(__assign({}, createState(set, get, api)), { $sync: function (props) { return set(function (state) { return (__assign(__assign({}, state), props)); }); } })); });
    };
    var Provider = function (props) {
        var children = props.children, propsWithoutChildren = __rest(props, ["children"]);
        return (
        // @ts-ignore
        <ZustandProvider createStore={createStore}>
        {/* @ts-ignore*/}
        <Hook {...propsWithoutChildren}/>
        {children}
      </ZustandProvider>);
    };
    return {
        Provider: Provider,
        useStore: useStore,
        useStoreApi: useStoreApi
    };
}
exports.createZustandConstate = createZustandConstate;
exports["default"] = createZustandConstate;
