import Joi from 'joi';

/** Schema de validação dos participantes */
export const participantSchema = Joi.object({
    name: Joi.string().min(1).required(),
});

/** Schema de validação das mensagens */
export const messageSchema = Joi.object({
    to: Joi.string().min(1).required(),
    from: Joi.string().min(1).required(),
    text: Joi.string().min(1).required(),
    type: Joi.string().valid('message', 'private_message').required(),
});

/** Schema de validação do status */
export const statusSchema = Joi.object({
    user: Joi.string().min(1).required(),
});
