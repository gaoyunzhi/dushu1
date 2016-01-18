TextParser = function() {}

TextParser.findBooks = function(text) {
    var books = [];
    var last = -1;
    for (var i=0; i<text.length; i++) {
        if (text[i] == '《') {
            last = i + 1;
        }
        if (text[i] == '》') {
            books.push(text.substr(last, i - last));
        }
    }
    return books;
}


