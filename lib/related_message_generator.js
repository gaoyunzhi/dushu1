MAX_REPLY = 5

var ReplyGenerator = function(books, user_id) {
  this.books = books;
  this.userId = user_id;
  this.admin = Meteor.users.findOne({username: Meteor.settings.admin.email});
}

ReplyGenerator.prototype.generate = function() {
  var replies = this.books.map(book => this.generateOne(book));
  replies = new Set([].concat.apply([], replies));
  console.log(replies);
  return Array.from(replies).slice(MAX_REPLY);
}

ReplyGenerator.prototype.getRelated = function(book) {
  var replies = [];
  Text.find({
    text: {$regex: ".*" + book + ".*"},
    user_id: {$ne: this.userId} 
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

generate_admin_relpy = function(books, user_id) {
    var reply_generator = new ReplyGenerator(books, user_id);
    reply_generator.generate();
}


