import style from 'ansi-styles';

import getUnitStyle from './getUnitStyle';

test('downsamples RGB to 256 color ANSI', () => {
  const color = '#8fbcbb';
  const unitStyle = getUnitStyle({ color });
  expect(unitStyle('foo')).toBe(
    `${style.color.ansi256.hex(color)}foo${style.color.close}`,
  );
});
