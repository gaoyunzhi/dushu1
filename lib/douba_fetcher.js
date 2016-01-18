var DoubanFetcher = function(books, user_id) {
  this.books = books;
  this.userId = user_id;
  this.admin = Meteor.users.findOne({username: Meteor.settings.admin.email});
  this.fetcher = Meteor.users.findOne({username: Meteor.settings.crawler.email});
  if (!this.checkNeed()) {
    return;
  }
  this.fetch();
}

DoubanFetcher.prototype.checkNeed = function() {
  if (DoubanFetch.find({book: this.book}).count() > 0) {
    return false;
  }
  DoubanFetch.insert({book: this.book});
  return true;
}

DoubanFetcher.prototype.fetch = function() {
  var theUrl = 'http://www.douban.com/search?cat=1001&q=' + this.book;
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
  xmlHttp.send( null );
  console.log(xmlHttp.responseText);
}

fetch_from_douban = function(user_id, book, reply_number) {
  DoubanFetcher(book, user_id);
};