import Joi from 'joi';

export const participantSchema = Joi.object({
    name: Joi.string().min(1).required(),
});

export const messageSchema = Joi.object({
    to: Joi.string().min(1).required(),
    from: Joi.string().min(1).required(),
    text: Joi.string().min(1).required(),
    type: Joi.string().valid('message', 'private_message').required(),
});

export const statusSchema = Joi.object({
    user: Joi.string().min(1).required(),
});
