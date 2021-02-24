var express = require('express');
var router = express.Router();

var resource = require('../resources/examples-resource');

var { EventEmitter } = require('events');
var events = new EventEmitter();

router.get('/events', async (req, res, next) => {
  res.set('Content-Type', 'text/event-stream');
  res.flushHeaders();

  function disconnect(argument) {
    console.log('client disconnect');
    events.off('access', sender);
    try {
      res.end();
    } catch (e) {}
  }

  function sender({ type, ...args }) {
    console.log('access event happened', type, args);
    // requires correspondingly named event listeners on frontend
    // res.write(`event: ${type}`);
    // res.write(`data: ${JSON.stringify(args)}\n\n`);
    try {
      res.write(`data: ${JSON.stringify({ type, ...args })}\n\n`);
    } catch (e) {
      console.error(e);
      disconnect();
    }
  }

  events.on('access', sender);
  res.on('close', disconnect);
});

async function serveWithEvents(type, res, op, ...args) {
  var result = await op(...args);
  events.emit("access", { type, args, result });
  res.json(result);
}

/* C: Add example. */
router.post('/', async (req, res, next) => {
  // var args = [req.body];
  // var result = await resource.add(...args);
  // res.json(result);
  // events.emit("access", { type: 'post', args, result });

  await serveWithEvents('post', res, resource.add, req.body);
});

/* R: GET example. */
router.get('/:id', async (req, res, next) => {
  await serveWithEvents('get:id', res, resource.get, req.param.id);
});

/* U: update example. */
router.put('/:id', async (req, res, next) => {
  await serveWithEvents('put:id', res, resource.update, req.param.id, req.body);
});

/* D: delete example. */
router.delete('/:id', async (req, res, next) => {
  await serveWithEvents('delete:id', res, resource.delete, req.param.id);
});

/* GET examples listing. */
router.get('/', async (req, res, next) => {
  await serveWithEvents('get', res, resource.get, req.query.id);
});

module.exports = router;
