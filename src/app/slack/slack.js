module.exports = class SlackMessages {
  static createMessage(channel, text) {
    return {
      response_type: 'in_channel',
      channel,
      text,
    };
  }
};
