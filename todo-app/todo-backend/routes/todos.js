const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
  
});

router.get('/statistics', async (_, res) => {
  const num = await redis.getAsync("added_todos")
  res.send({
    "added_todos": num ? Number(num) : 0
  })

});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  
  const checkCurrent = await redis.getAsync("added_todos")
  const current = checkCurrent ? Number(checkCurrent) : 0
  console.log(current)
  await redis.setAsync("added_todos", current+1)
  res.send(todo);
});



const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  // const { id } = req.params
  // console.log(id)
  // const todo = await Todo.findById(id)
  res.send(req.todo)
  //res.sendStatus(405); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const newText = req.body.hasOwnProperty("text") ? req.body.text : req.todo.text
  const newDone = req.body.hasOwnProperty("done") ? req.body.done : req.todo.done

  req.todo = await Todo.findByIdAndUpdate(req.todo._id, {
    text: newText,
    done: newDone
  }, { new: true })

  res.send(req.todo)
  //res.sendStatus(405); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
