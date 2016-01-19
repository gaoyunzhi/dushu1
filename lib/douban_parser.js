var DoubanParser = function(content, book) {
  this.content = content;
  this.book = book;
  this.textIds = [];
}

DoubanParser.prototype.getComments = function() {
  var start_index = this.content.indexOf('<li class="comment-item">');
  while (start_index !== -1) {
    this.content = this.content.substr(start_index);
    var end_index = this.content.indexOf('</li>');
    var comment = this.content.substr(0, end_index);
    var text_id = this.parseComment(comment);
    if (text_id) {
      this.textIds.push(text_id)
    }
    this.content = this.content.substr(end_index);
    start_index = this.content.indexOf('<li class="comment-item">');
  }
  return this.textIds;
}

DoubanParser.prototype.parseComment = function(comment) {
  var start_pattern = '<p class="comment-content">';
  var start_index = comment.indexOf(start_pattern);
  var end_index = comment.indexOf('</p>');
  content = comment.substr(
    start_index + start_pattern.length,
    end_index - start_index - start_pattern.length);
  var comment_info_start = comment.indexOf('<span class="comment-info">');
  comment = comment.substr(comment_info_start);
  var author = comment.match('<a href="(.*)">(.*)<\/a>');
  author = author && author[2];
  // I will use the current date as date, if there is need, I can always find the
  // original post date.
  var text = content
  if (author) {
    text = text + ' (' + author + '评《' + this.book + '》)';
  }
  var text_row = {
    text: text,
    timestamp: new Date(), 
    user_id: CRAWLER._id
  };
  var old_text = Text.findOne({text: text});
  if (old_text) {
    return;
  }
  var text_id = Text.insert(text_row);
  if ((content.length > TEXT_MIN_LENGTH) && (!is_bad_content(content))) {
    return text_id;
  }
}

parse_douban = function(content, book) {
  var parser = new DoubanParser(content, book);
  return parser.getComments();
};