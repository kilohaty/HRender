import test from 'ava';
import misc from '../../src/utils/misc';

test('utils/misc getId test', t => {
  [1, 12, 32, 60, 128].forEach(num => {
    const id = misc.getId(num);
    t.regex(id, new RegExp(`[a-zA-Z0-9]{${num}}`));
  });
});