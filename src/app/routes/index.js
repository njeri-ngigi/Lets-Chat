const axios = require('axios');
const qs = require('qs');
const responseGenerator = require('../../utils/responseGenerator');
const slackMessages = require('../slack/slack');
const usersController = require('../server/controllers').users;

const messageContrroller = require('../server/controllers').messages;

const base = '/api/v1';
const errorMessage = 'Something went terribly wrong :pensive:. We\'re looking into it ASAP';

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.render('index');
  });

  app.post(`${base}/register`, usersController.create);
  app.post(`${base}/login`, usersController.login);
  app.post(`${base}/chat`, messageContrroller.create);
  app.get(`${base}/chat`, messageContrroller.history);
  app.post(`${base}/slack/command/chat`, async (req, res) => {
    const { channel_id } = req.body;
    try {
      const response = {
        response_type: 'in_channel',
        channel: channel_id,
        text: 'Hello :smiley:',
        attachments: [{
          text: 'What would you like to do?',
          fallback: 'What would you like to do?',
          color: '#2c963f',
          attachment_type: 'default',
          callback_id: 'entry_choices',
          actions: [
            {
              name: 'entry_choices',
              text: 'Signup',
              type: 'button',
              value: 'signup',
              style: 'primary',
            },
            {
              name: 'entry_choices',
              text: 'Login',
              type: 'button',
              value: 'login',
              style: 'primary',
            },
            {
              name: 'entry_choices',
              text: 'Send message to a buddy?',
              type: 'button',
              value: 'sendMessage',
              style: 'primary',
            }],
        }],
      };
      return res.json(response);
    } catch (err) {
      return res.json(slackMessages.createMessage(channel_id, errorMessage));
    }
  });
  app.post(`${base}/slack/actions`, async (req, res) => {
    const payload = JSON.parse(req.body.payload);
    console.log(payload, req.body);
    try {
      const { callback_id } = payload;

      let response;
      switch (callback_id) {
      case ('entry_choices'): {
        const { trigger_id, actions: [{ value }] } = payload;
        response = await responseGenerator(value, trigger_id);
        break;
      }
      case ('signup_dialog'): {
        const { submission: { username, password } } = payload;
        const message = await usersController.create(username, password);
        if (message) {
          console.log('I waited, therefore I am satisfied!');
          res.status(200);
          const responseMessage = {
            token: 'xoxp-521383078068-521446236131-525201035781-566d9194d5b3b5584fa9d692654e9ec4',
            channel: 'DFESC0RKM',
            text: 'Successfully signed up try logging in now. Or better yet send a message to your buddy :smiley:',
            as_user: false,
          };
          return axios.post('https://slack.com/api/chat.postMessage',
            qs.stringify(responseMessage))
            .then((resp) => {
              console.log(resp.data);
              return resp.data;
            })
            .catch(err => console.log(err));
        }


        break;
      }
      default:
        console.log('I got here 2.');

        response = slackMessages.createMessage('Dum dum dum dum dum!. In default bruh!');
      }


      return res.json(response);
    } catch (error) {
      return res.json(slackMessages.createMessage(errorMessage));
    }
  });
};
