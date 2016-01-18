var ReplyGenerator = function(books, user_id) {
    this.books = books;
    this.userId = user_id;
}

ReplyGenerator.prototype.generate = function() {
    var reply_text = '收到您对' + 
      this.books.map(book => '《' + book + '》').join('，') + 
      '的评论，谢谢。正在为您找寻相关评论。如对本软件有任何建议/投诉，请微信联系。';
    if (this.books.length == 0) {
      reply_text = '请用书名号将书评括出，方便阿云为您寻找相关评论，谢谢。如对本软件有任何建议/投诉，请微信联系。';
    }
    text_row = {
      text: reply_text,
      timestamp: new Date(), 
      user_id: ADMIN._id
    };
    text_id = Text.insert(text_row);
    reply = {
      timestamp: new Date(),
      user_id: this.userId,
      text_id: text_id,
      type: 'receive'
    }
    Messages.insert(reply);
}

generate_admin_relpy = function(books, user_id) {
    var reply_generator = new ReplyGenerator(books, user_id);
    reply_generator.generate();
}


