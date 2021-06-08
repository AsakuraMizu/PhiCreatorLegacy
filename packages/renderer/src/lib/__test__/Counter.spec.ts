import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom';

import Counter from '../Counter.svelte';

it('comp:Counter', async () => {
  const { getByText } = render(Counter);
  const button = getByText('Clicks: 0');

  for (let i = 0; i < 5; ++i) await fireEvent.click(button);
  expect(button).toHaveTextContent('Clicks: 5');
});
