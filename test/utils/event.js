import test from 'ava';
import Event from '../../src/utils/event';

test('utils/event test', t => {
  const id    = 99;
  const event = new Event(id);

  // test event.id;
  t.true(event.id === id);

  // test event.on
  event.on('evt_1', value => t.true(value === 1));
  event.emit('evt_1', 1);

  // test event.off
  event.off('evt_1');
  event.emit('evt_1', 2);

  // test event.one
  event.one('evt_2', value => t.true(value === 10));
  event.emit('evt_2', 10);
  event.emit('evt_2', 20);
});