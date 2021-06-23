import createZustandConstate from './zustand-constate';
import * as React from 'react';
import {Button} from 'react-native';
import {useEffect, useState} from 'react';
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

export default Example;
