const { Op } = require('sequelize');
const { Message } = require('../models');
const { User } = require('../models');

async function findOne(name) {
  const user = await User.findOne({ where: { name } });
  return user.dataValues;
}

module.exports = {
  async create(req, res) {
    const sender = await findOne(req.body.sender);
    const recepient = await findOne(req.body.recepient);
    return Message.create(
      {
        content: req.body.content, senderId: sender.id, recepientId: recepient.id,
      },
    )
      .then(message => res.status(201).send(message))
      .catch(error => console.log(error));
  },

  async history(req, res) {
    const sender = await findOne(req.body.sender);
    const recepient = await findOne(req.body.recepient);

    return Message.findAll({
      where: {
        [Op.or]: [
          { senderId: sender.id, recepientId: recepient.id },
          { senderId: recepient.id, recepientId: sender.id }],
      },
    }).then(messages => res.status(200).send(messages))
      .catch(error => console.log(error));
  },
};
