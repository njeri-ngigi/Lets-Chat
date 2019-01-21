const axios = require('axios');
const qs = require('qs');
const slackMessages = require('../app/slack/slack');

module.exports = async (optionSelected, triggerId) => {
  let response;

  switch (optionSelected) {
  case 'signup':
    response = {
      token: 'xoxp-521383078068-521446236131-525201035781-566d9194d5b3b5584fa9d692654e9ec4',
      trigger_id: triggerId,
      dialog: JSON.stringify({
        callback_id: 'signup_dialog',
        title: 'Let\'s Chat Registration',
        submit_label: 'Signup',
        notify_on_cancel: true,
        state: 'Register',
        elements: [
          {
            type: 'text',
            label: 'Username',
            name: 'username',
          },
          {
            type: 'text',
            label: 'Password',
            name: 'password',
          },
        ],
      }),
    };

    return axios.post('https://slack.com/api/dialog.open', qs.stringify(response))
      .then(resp => resp.data)
      .catch(err => console.log(err));

  case 'login':
    response = {
      response_type: 'in_channel',
      text: `Hmmm :thinking_face: Seems like you selected ${optionSelected}. Let me get that resource for you.`,
    };
    // Pass interactive component
    break;

  case 'sendMessage':
    response = {
      response_type: 'in_channel',
      text: `Hmmm :thinking_face: Seems like you selected ${optionSelected}. Let me get that resource for you.`,
    };
    // Pass interactive component
    break;

  default:
    console.log('In default');
    response = {
      response_type: 'in_channel',
      text: `:wow: Ooops! I don't think we have ${optionSelected}.`,
    };
    // Pass interactive component
  }
  return response;
};
