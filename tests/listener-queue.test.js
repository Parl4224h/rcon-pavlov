const net = require('net');
const assert = require('assert');
const { EventEmitter } = require('events');

(async () => {
  // Lower the global default max listeners to catch leaks quickly
  EventEmitter.defaultMaxListeners = 5;

  // Start a mock RCON server
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  let authed = false;
  server.on('connection', (socket) => {
    socket.on('data', () => {
      if (!authed) {
        // First message is password hash, immediately authenticate
        authed = true;
        socket.write('Authenticated 1');
        return;
      }
      // Simulate a small processing delay so the client keeps the listener attached awhile
      setTimeout(() => {
        // Always respond with the same command name so all listeners are for the same event
        const payload = JSON.stringify({ Command: 'TestCommand', ok: true });
        socket.write(payload);
      }, 5);
    });
  });

  // Import built artifact
  const { RCON } = require('../dist/rcon.js');

  const rcon = new RCON('127.0.0.1', port, 'secret');
  // Connect and wait for authentication
  await rcon.connect();
  await new Promise((resolve, _) => {
    const s = rcon.socket || rcon._socket || rcon["socket"]; // runtime access (TS private)
    if (!s) return setTimeout(() => resolve(), 25); // best effort if not yet available
    s.once('Authenticated', resolve);
    // Safety timeout
    setTimeout(resolve, 100);
  });

  // Tap into warnings
  const warnings = [];
  process.on('warning', (w) => warnings.push(w));

  // Access the internal socket to measure listener counts (TS private is runtime-accessible)
  const socket = rcon.socket || rcon._socket || rcon["socket"]; 
  assert(socket, 'Client socket not available');

  // Fire 20 concurrent requests for the same event name
  const inFlight = 20;
  let maxListenerCount = 0;
  const sampler = setInterval(() => {
    const c = socket.listenerCount('TestCommand');
    if (c > maxListenerCount) maxListenerCount = c;
  }, 1);

  const sends = Array.from({ length: inFlight }, () =>
    rcon.send('DoSomething', 'TestCommand', () => {})
  );

  await Promise.all(sends);
  clearInterval(sampler);

  // Final listener count for the event should be 0 (all removed)
  const finalCount = socket.listenerCount('TestCommand');

  try {
    assert(maxListenerCount <= 1, `More than one listener attached concurrently (max ${maxListenerCount})`);
    assert.strictEqual(finalCount, 0, `Listeners not removed after completion (remaining ${finalCount})`);
    assert.strictEqual(warnings.length, 0, `Node emitted warnings: ${warnings.map(w => w.name).join(', ')}`);
    // Clean up
    await rcon.close();
    server.close();
    // eslint-disable-next-line no-console
    console.log('OK: listener cleanup verified with 20 concurrent sends of the same command.');
    process.exit(0);
  } catch (e) {
    await rcon.close();
    server.close();
    // eslint-disable-next-line no-console
    console.error('Test failed:', e && e.stack || e);
    process.exit(1);
  }
})();
