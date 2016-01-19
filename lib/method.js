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
  },

  welcome () {
    if (!this.userId) throw new Meteor.Error('not-logged-in');
    reply_text = '你好呀~ 最近读了什么书，能告诉我吗？我可以倾听你，为你找到相关的' + 
      '书评。也可以为你找到爱书的同好，建立友谊。';
    admin_reply(this.userId, reply_text);
  }
});