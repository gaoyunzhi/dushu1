var DoubanParser = function(content, book) {
  this.content = content;
  this.book = book;
  this.textIds = [];
}

DoubanParser.prototype.getComments = function() {
  var start_index = this.content.indexOf('<li class="comment-item">');
  while (start_index !== -1) {
    this.content = this.content.substr(start_index);
    // console.log("start_index", start_index);
    var end_index = this.content.indexOf('</li>');
    // console.log("end_index", end_index);
    comment = this.content.substr(0, end_index);
    var text_id = this.parseComment(comment);
    if (text_id) {
      this.textIds.push()
    }
    this.content = this.content.substr(end_index);
    start_index = this.content.indexOf('<li class="comment-item">');
  }
  return this.textIds;
}

DoubanParser.prototype.parseComment = function(comment) {
  // console.log(comment);
  var start_pattern = '<p class="comment-content">';
  var start_index = comment.indexOf(start_pattern);
  var end_index = comment.indexOf('</p>');
  content = comment.substr(
    start_index + start_pattern.length,
    end_index - start_index - start_pattern.length);
  var comment_info_start = comment.indexOf('<span class="comment-info">');
  comment = comment.substr(comment_info_start);
  // console.log(comment);
  var author = comment.match('<a href="(.*)">(.*)<\/a>');
  author = author[2];
  // I will use the current date as date, if there is need, I can always find the
  // original post date.
  console.log(ADMIN, "ADMIN");
  text_row = {
    text: content + ' (' + author + '评《' + this.book + '》)',
    timestamp: new Date(), 
    user_id: ADMIN._id
  };
  text_id = Text.insert(text_row);
  if (content.length > TEXT_MIN_LENGTH) return text_id;
}

parse_douban = function(content, book) {
  var parser = new DoubanParser(content, book);
  return parser.getComments();
};