Meteor.methods({
  newMessage (text) {
    if (!this.userId) throw new Meteor.Error('not-logged-in');
    text_row = 
      {text: text, timestamp: new Date(), user_id: this.userId};
    text_id = Text.insert(text_row);
    message = {
      timestamp: new Date(),
      user_id: this.userId,
      text_id: text_id,
      type: 'send'
    };
    return Messages.insert(message);
  }
});