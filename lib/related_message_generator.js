MAX_REPLY = 5

var ReplyGenerator2 = function(books, user_id) {
  this.books = books;
  this.userId = user_id;
  this.admin = Meteor.users.findOne({username: Meteor.settings.admin.email});
}

ReplyGenerator2.prototype.generate = function() {
  var replies = this.books.map(book => this.getRelated(book));
  replies = new Set([].concat.apply([], replies));
  Array.from(replies).slice(0, MAX_REPLY).forEach(reply => {
    Messages.insert(reply);
  });
}

ReplyGenerator2.prototype.getRelated = function(book) {
  var replies = [];
  console.log("yunzhi", book);
  Text.find({
    text: {$regex: ".*" + book + ".*"},
    user_id: {$nin: [this.userId, this.admin._id]}
  }).forEach(text => {
    console.log(text._id);
    replies.push({
      timestamp: new Date(),
      user_id: this.userId,
      text_id: text._id,
      type: 'receive'
    });
  });
  return replies;
}

generate_related_relpy = function(books, user_id) {
    var reply_generator = new ReplyGenerator2(books, user_id);
    reply_generator.generate();
}


