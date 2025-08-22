import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';

import Home from '../app/page';

describe('Page', () => {
  it('renders a heading', async () => {
    act(async () => {
      await render(<Home searchParams={{ slug: 'test' }} />);

      const heading = await screen.findByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('NRadio');
    });
  });

  
});
