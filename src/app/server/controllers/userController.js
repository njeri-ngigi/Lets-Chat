const { User } = require('../models');

module.exports = {
  create(name, password) {
    return User.findOrCreate({
      where: { name },
      defaults: {
        name,
        password,
      },
    })
      .then(() => true)
      .catch((error) => {
        console.log(error);
        return false;
      });
  },

  list(req, res) {
    return User.all()
      .then(users => res.status(200).send(users))
      .catch(error => res.status(400).send(error));
  },

  loginViaSlack(name, password) {
    return User.findOne({ where: { name } })
      .then((user) => {
        if (!user) {
          return { message: "User doesn't exist" };
        }
        if (user.password === password) {
          return { message: 'Logged in successfully' };
        }
        return { message: 'Incorrect password' };
      })
      .catch(message => ({ message }));
  },

  login(req, res) {
    return User.findOne({ where: { name: req.body.name } })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: "User doesn't exist" });
        }
        if (user.password === req.body.password) {
          return res.status(200).send({ message: 'Logged in successfully' });
        }
        return res.status(403).send({ message: 'Incorrect password' });
      })
      .catch(error => res.status(400).send({ message: error }));
  },
};
