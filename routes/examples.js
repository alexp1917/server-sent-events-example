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

  // for (var i = 0; i < 10; i++) {
  //   try {
  //     await new Promise(r => setTimeout(r, 250));
  //     res.write(`data: ${JSON.stringify({ hello: 'world' })}\n\n`);
  //   } catch (e) {
  //     break;
  //   }
  // }
});

/* C: Add example. */
router.post('/', async (req, res, next) => {
  var args = [req.body];
  var result = await resource.add(...args);
  res.json(result);
  events.emit("access", { type: 'post', args, result });
});

/* R: GET example. */
router.get('/:id', async (req, res, next) => {
  var args = [req.param.id];
  var result = await resource.get(...args);
  res.json(result);
  events.emit("access", { type: 'get:id', args, result });
});

/* U: update example. */
router.put('/:id', async (req, res, next) => {
  var args = [req.param.id, req.body];
  var result = await resource.update(...args);
  res.json(result);
  events.emit("access", { type: 'put:id', args, result });
});

/* D: delete example. */
router.delete('/:id', async (req, res, next) => {
  var args = [req.param.id];
  var result = await resource.delete(...args);
  res.json(result);
  events.emit("access", { type: 'delete:id', args, result });
});

/* GET examples listing. */
router.get('/', async (req, res, next) => {
  var args = [req.query.id];
  var result = await resource.get(...args);
  res.json(result);
  events.emit("access", { type: 'get', args, result });
});

module.exports = router;
