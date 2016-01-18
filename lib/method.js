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
    admin = Meteor.users.findOne({username: Meteor.settings.admin.email});
    text_row = {
      text: '收到您对xxx的评论，谢谢。正在为您找寻相关评论。如对本软件有任何建议/投诉，请微信联系。', 
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