var DoubanParser = function(content) {
  this.content = content;
}

DoubanParser.prototype.getComments = function() {
  start_index = this.content.indexOf('<li class="comment-item">');
  while (start_index !== -1) {
    this.content = this.content.substr(start_index);
    end_index = this.content.indexOf('<\\li>')
    comment =
  }
}

parse_douban = function(content) {
  var parser = new DoubanParser(content);
  // comment out for testing purpose
  // if (!fetcher.checkNeed()) {
  //   return;
  // } 
  parser.getComments();
};