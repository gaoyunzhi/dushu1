MAX_REPLY = 3

var ReplyGenerator = function(books, user_id) {
  this.books = books;
  this.userId = user_id;
  this.admin = Meteor.users.findOne({username: Meteor.settings.admin.email});
}

ReplyGenerator.prototype.generate = function() {
  var replies = this.books.map(book => this.getRelated(book));
  replies = new Set([].concat.apply([], replies));
  replies = Array.from(replies);
  replies.sort( function() { return 0.5 - Math.random() } );
  replies.slice(0, MAX_REPLY).forEach(reply => {
    Messages.insert(reply);
  });
  reply_number = replies.slice(0, MAX_REPLY).length
  fetch_from_douban(this.userId, books[0], MAX_REPLY - reply_number);
  this.books.slice(1).forEach(book => {
    fetch_from_douban(this.userId, books[0], 0);
  });
}

ReplyGenerator.prototype.getRelated = function(book) {
  var replies = [];
  Text.find({
    text: {$regex: ".*" + book + ".*"},
    user_id: {$nin: [this.userId, this.admin._id]}
  }).forEach(text => {
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
    var reply_generator = new ReplyGenerator(books, user_id);
    reply_generator.generate();
}


