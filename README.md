# Zustand Constate

Just another React context-based state management

Zustand Constate is a context based React state management that based on ```zustand``` with the idea of ```constate```

The ```zustand``` pros:

- We can use it both inside and outside React component
- It can be used as Global state management as well as context state management
- Very simple to implement and to understand, small boilerplate.
- We can get the state immediately, no need to wait to re-render.
- We can use selector to prevent re-render

The ```zustand``` cons:

- Not so easy to implement Context if we compare with ```constate``` (createContext -> Provider with createStore -> We have to make sure the store not change,...)
- If we want to add effects to the Context, we have to add a child component (for example, for every second, we increase the ```count``` property 1 unit)

The ```constate``` pros:

- Very easy to implement if you know how to create a React hook

The ```constate``` cons:

- Too much boilerplate if we want to split selectors (it breaks TypeScript types too if we have many split function)
- Not so well implemented

## Then, Zustand Constate comes to use all pros of ```zustand``` and ```constate```, and remove all cons of them

Because it's zustand based, with constate idea.

Simple example that use the power of ```zustand``` only

```typescript jsx
import createZustandConstate from './zustand-constate';
import * as React from 'react';
import {Button} from 'react-native';
import shallow from 'zustand/shallow';

interface Props {
  step: number;
}
type State = {
  count: number;
  increase: () => void;
  runTimes: number;
} & Props;

const {Provider, useStore} = createZustandConstate<State, Props>(
  (set) => ({
    count: 0,
    step: 1,
    runTimes: 0,
    increase: () => set((state) => ({count: state.count + state.step})),
  })
);

const TheButton = () => {
  const [count, step, increase, runnedTimes] = useStore(
    (state) => [state.count, state.step, state.increase, state.runTimes],
    shallow,
  );
  return (
    <Button
      title={`Count/Step/Runned: ${count}/${step}/${runnedTimes}`}
      onPress={increase}
    />
  );
};

const Example = () => {
  return (
    <>
      <Provider step={1}>
        <TheButton />
      </Provider>
      <Provider step={2}>
        <TheButton />
      </Provider>
    </>
  );
};
```

Hmm, if you want some effect, like increase the count for each three seconds? Let's use the power of ```constate```.

Just add a hook creation to the second parameter of ```createZustandConstate```

```typescript jsx
const {Provider, useStore} = createZustandConstate<State, Props>(
  (set) => ({
    count: 0,
    step: 1,
    runTimes: 0,
    increase: () => set((state) => ({count: state.count + state.step})),
  }),
  ({useStore}) => {
    const [runTimes, setRunTimes] = useState(0);
    const increase = useStore((state) => state.increase);

    // auto increase every 3 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        setRunTimes((r) => r + 1);
        increase();
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }, []);

    return {runTimes};
  },
);
```

The returned property ```runTime``` is automatically added to ```zustand``` store

And, all properties that passed to Provider is automatically add to ```zustand``` store too.

## Detailed documentation and API?

For ```zustand```: https://github.com/pmndrs/zustand

For ```constate```: https://github.com/diegohaz/constate



