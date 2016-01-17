Meteor.methods({
  newMessage (text) {
    if (!this.userId) throw new Meteor.Error('not-logged-in');
    text_row = 
      {text: text, timestamp: new Date(), user_id: this.userId};
    text_id = Text.insert(text_row);
    message.timestamp = new Date();
    message.user_id = this.userId;
    message.text_id = text_id;
    message.type = 'send';
    return Messages.insert(message);
  }
});