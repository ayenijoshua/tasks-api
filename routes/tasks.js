const express = require('express');
const router = express.Router();
const {Task,validate} = require('../models/task')
const asyncMiddleware = require('../middlewares/asyncMiddleware');
const mongoose = require('mongoose');
const validateObjectId = require('../middlewares/validateObjectId')
const auth = require('../middlewares/authMiddleware')

/**
 * get all tasks
 */
router.get('/', async (req, res) => {
    const tasks = await Genre.find().sort('name')
    res.send(tasks);
});

/**
 * create task
 */
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        const task = new Genre({name:req.body.name});
        const result = await task.save();
        res.send(result);
    } catch (error) {
        console.error('Error',error)
        return res.status(500).send("An internal error occured")
    }
  
});

/**
 * update task
 */
router.put('/:id', async (req, res) => {
    try {
        const {error} = validate(req.body)

        const task = await Task.findByIdAndUpdate(req.params.id,{name:req.body.name},{
            new:true
        })

        if (!task) return res.status(404).send('The task with the given ID was not found.');

        if (error) return res.status(400).send(error.details[0].message);
        
        res.send(task);

    } catch (error) {
        res.status(500).send("An internal error occured")
        console.error('Error',error)
    }
});

/**
 * delete task
 */
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndRemove(req.params.id)
  
        if (!task) return res.status(404).send('The task with the given ID was not found.');

        res.send(genre);
    } catch (error) {
        res.status(500).send("An internal error occured")
        console.error('Error',error)
    }
    
});

/**
 * get task
 */
router.get('/:id', validateObjectId, async (req, res) => {
    try {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            return res.status(404).send('The task with the given ID was not found.');
        }

        const task = await Task.findById(req.params.id)
  
        if (!task) return res.status(404).send('The task with the given ID was not found.');

        res.send(task);
    } catch (error) {
        res.status(500).send("An internal error occured")
        console.error('Error',error)
    }
    
});

module.exports = router;