admin_reply = function(user_id, text) {
  text_row = {
    text: text,
    timestamp: new Date(), 
    user_id: ADMIN._id
  };
  text_id = Text.insert(text_row);
  reply = {
    timestamp: new Date(),
    user_id: user_id,
    text_id: text_id,
    type: 'receive'
  }
  Messages.insert(reply);
};