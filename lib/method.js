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
    Messages.insert(message);

    books = TextParser.findBooks(text);
    generate_admin_relpy(books, this.userId);
    generate_related_relpy(books, this.userId);
  }
});