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

var DoubanFetcher = function(book, user_id) {
  this.book = book;
  this.userId = user_id;
  this.admin = Meteor.users.findOne({username: Meteor.settings.admin.email});
  this.fetcher = Meteor.users.findOne({username: Meteor.settings.crawler.email});
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

fetch_from_douban = function(user_id, book, reply_number) {
  var fetcher = new DoubanFetcher(book, user_id);
  // comment out for testing purpose
  // if (!fetcher.checkNeed()) {
  //   return;
  // } 
  fetcher.fetch();
};