DOUBAN_HEADER = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36',
  // 'Accept':'*/*',
  // 'Accept-Encoding':'gzip, deflate',
  // 'Accept-Language':'en-US,en;q=0.8,zh-CN;q=0.6,zh-TW;q=0.4',
  // 'Cache-Control':'no-cache',
  // // 'Connection':'keep-alive',
  // 'Content-Length':'368',
  // // 'Cookie':'grwng_uid=c3fbb41d-b438-4c9f-825d-9f2ab313e530',
  // 'Host':'api.growingio.com',
  'Origin':'http://book.douban.com',
  // 'Pragma':'no-cache',
  // 'Referer':'http://www.douban.com/search',
};

var DoubanFetcher = function(book, user_id, reply_number, onFinish) {
  this.book = book;
  this.userId = user_id;
  this.onFinish = onFinish;
  this.replyNumber = reply_number;
}

DoubanFetcher.prototype.checkNeed = function() {
  if (DoubanFetch.find({book: this.book}).count() > 0) {
    return false;
  }
  DoubanFetch.insert({book: this.book});
  return true;
}
DoubanFetcher.prototype.fetch = function() {
  HTTP.call( 
    'GET', 
    'http://www.douban.com/search?cat=1001&q='+ this.book, 
    {cat: 1001, q: this.book, headers: DOUBAN_HEADER},
    function( error, response ) {
      var bookID = this.getBookID(response.content);
      this.getBookPage(bookID);
    }.bind(this)
  );
}
DoubanFetcher.prototype.getBookID = function(content) {
  var index = content.indexOf('book.douban.com%2Fsubject');
  var content_new = content.substr(index + 28);
  var end_index = content_new.indexOf('%2F');
  var book_id = content_new.substr(0, end_index);
  return book_id;
}
DoubanFetcher.prototype.getBookPage = function(bookID) {
  HTTP.call( 
    'GET', 
    'http://book.douban.com/subject/'+ bookID + '/', 
    {headers: DOUBAN_HEADER},
    function( error, response ) {
      text_ids = parse_douban(response.content, this.book); 
      this.reply(text_ids);
    }.bind(this)
  );
}
DoubanFetcher.prototype.reply = function(text_ids) {
  text_ids.sort( function() { return 0.5 - Math.random() } );
  text_ids = text_ids.slice(0, this.replyNumber);
  text_ids.forEach(text_id => {
    reply = {
      timestamp: new Date(),
      user_id: this.userId,
      text_id: text_id,
      type: 'receive'
    };
    Messages.insert(reply);
  });
  this.onFinish && this.onFinish(text_ids.length);
}

fetch_from_douban = function(user_id, book, reply_number, on_finish) {
  var fetcher = new DoubanFetcher(book, user_id, reply_number, on_finish);
  // comment out for testing purpose
  // if (!fetcher.checkNeed()) {
  //   onFinish && onFinish(0);
  //   return;
  // } 
  fetcher.fetch();
};