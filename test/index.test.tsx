import * as React from 'react';
import {render, fireEvent} from '@testing-library/react';
import createZustandConstate from '../zustand-constate';
import { useCallback, useState } from "react";

interface Props {
  step: number;
}
interface State extends Props {
  count: number;
  increment: () => void;
}

test('zustand mode only', () => {
  const {useStore, Provider} = createZustandConstate<State, Props>((set) => ({
    count: 0,
    step: 1,
    increment: () => set((state) => ({count: state.count + state.step})),
  }));

  const countSelector = (state: State) => state.count;
  const useCount = () => useStore(countSelector);

  const Count = () => {
    const count = useCount();
    return <div>{count}</div>;
  };

  const Increment = () => {
    const increment = useStore((state) => state.increment);
    return <button onClick={increment}>Increment</button>;
  };

  const {getByText} = render(
    <Provider step={2}>
      <Count />
      <Increment />
    </Provider>,
  );

  expect(getByText('0')).toBeDefined();
  fireEvent.click(getByText('Increment'));
  expect(getByText('2')).toBeDefined();
  fireEvent.click(getByText('Increment'));
  expect(getByText('4')).toBeDefined();
});

test('constate mode only', () => {
  const {useStore, Provider} = createZustandConstate<State, Props>(undefined, ({step}) => {
    const [count, setCount] = useState(0);
    const increment = useCallback(() => setCount(count => count+=step), [step]);
    return {
      count,
      increment
    }
  });

  const countSelector = (state: State) => state.count;
  const useCount = () => useStore(countSelector);

  const Count = () => {
    const count = useCount();
    return <div>{count}</div>;
  };

  const Increment = () => {
    const increment = useStore((state) => state.increment);
    return <button onClick={increment}>Increment</button>;
  };

  const {getByText} = render(
    <Provider step={2}>
      <Count />
      <Increment />
    </Provider>,
  );

  expect(getByText('0')).toBeDefined();
  fireEvent.click(getByText('Increment'));
  expect(getByText('2')).toBeDefined();
  fireEvent.click(getByText('Increment'));
  expect(getByText('4')).toBeDefined();
});
