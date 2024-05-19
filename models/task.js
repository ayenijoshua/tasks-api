const mongoose = require('mongoose');
const Joi = require('joi')

const taskSchema =  mongoose.Schema(
    {
        name:{
            type:String,
            minlength: 5,
            maxlength: 50,
            required:true
        },
        description:{
            type:String,
            minlength: 5,
            maxlength: 500,
            required:true
        }
    },
)

const Task = mongoose.model('Task',taskSchema);

function validate(task) {
    const schema = Joi.object().keys({
      name: Joi.string().min(5).max(50).required(),
      description: Joi.string().min(5).max(50)
    });
  
    return schema.validate(task);
}

module.exports.Task = Task
module.exports.taskSchema = taskSchema
module.exports.validate = validate