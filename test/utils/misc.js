import test from 'ava';
import misc from '../../src/utils/misc';

test('utils/misc getId test', t => {
  [1, 12, 32, 60, 128].forEach(num => {
    const id = misc.getId(num);
    t.regex(id, new RegExp(`[a-zA-Z0-9]{${num}}`));
  });
});

test('utils/misc degreesToRadians test', t => {
  const radians_1 = misc.degreesToRadians(360);
  t.is(radians_1, Math.PI * 2);

  const radians_2 = misc.degreesToRadians(180);
  t.is(radians_2, Math.PI);

  const radians_3 = misc.degreesToRadians(90);
  t.is(radians_3, Math.PI / 2);

  const radians_4 = misc.degreesToRadians(45);
  t.is(radians_4, Math.PI / 4);

  const radians_5 = misc.degreesToRadians(0);
  t.is(radians_5, 0);

  const radians_6 = misc.degreesToRadians(-45);
  t.is(radians_6, -Math.PI / 4);
});

test('utils/misc radiansToDegrees test', t => {
  const radians_1 = misc.radiansToDegrees(Math.PI * 2);
  t.is(radians_1, 360);

  const radians_2 = misc.radiansToDegrees(Math.PI);
  t.is(radians_2, 180);

  const radians_3 = misc.radiansToDegrees(Math.PI / 2);
  t.is(radians_3, 90);

  const radians_4 = misc.radiansToDegrees(Math.PI / 4);
  t.is(radians_4, 45);

  const radians_5 = misc.radiansToDegrees(0);
  t.is(radians_5, 0);

  const radians_6 = misc.radiansToDegrees(-Math.PI / 4);
  t.is(radians_6, -45);
});

test('utils/misc rotatePoint test', t => {
  const res_45 = misc.rotatePoint(
    {x: 0, y: 0},
    45,
    {x: 1, y: 0},
  );
  t.true(res_45.x - 1 / Math.sqrt(2) < 1e6);
  t.true(res_45.y - 1 / Math.sqrt(2) < 1e6);

  const res_90 = misc.rotatePoint(
    {x: 0, y: 0},
    90,
    {x: 1, y: 0},
  );
  t.true(res_90.x < 1e6);
  t.true(res_90.y - 1 < 1e6);

  const res_180 = misc.rotatePoint(
    {x: 0, y: 0},
    180,
    {x: 1, y: 0},
  );
  t.true(res_180.x + 1 < 1e6);
  t.true(res_180.y < 1e6);
});