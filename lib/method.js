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

    admin = Meteor.users.findOne({username: Meteor.settings.admin.email});
    console.log(books);
    reply_text = '收到您对' + books.map(book => '《' + book + '》').join('，') + 
    '的评论，谢谢。正在为您找寻相关评论。如对本软件有任何建议/投诉，请微信联系。';
    if (books.length == 0) {
      reply_text = '请用书名号将书评括出，方便阿云为您寻找相关评论，谢谢。如对本软件有任何建议/投诉，请微信联系。';
    }
    text_row = {
      text: reply_text,
      timestamp: new Date(), user_id: admin._id};
    text_id = Text.insert(text_row);
    reply = {
      timestamp: new Date(),
      user_id: this.userId,
      text_id: text_id,
      type: 'recieve'
    }
    Messages.insert(reply);
  }
});