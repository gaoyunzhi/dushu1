Meteor.publishComposite('messages', function () {

  return {
    find() {
      var messages = [];
      Messages.find().forEach(message => {
        if (message.user_id ==  this.userId) {
          return messages.push(message);
        }
        var text = Text.find({ _id: message.text_id });
        if (text.user_id == ADMIN._id) {
          return;
        }
        var content = message.text || text.text;
        if ((content.length > TEXT_MIN_LENGTH) && 
          (!is_bad_content(content))) {
          return messages.push(message); 
        }
        return;
      })
    },
    children: [
      {
        find(message) {
          return Text.find({ _id: message.text_id });
        },
        children: [
          {
            find(text) {
              return Meteor.users.find(
                {_id: text.user_id}, 
                {fields: {profile: 1}});
            }
          }
        ],  
      }
    ]
  };
});

Meteor.publishComposite('allMessages', function () {
  if (this.userId !== ADMIN._id) return;
 
  return {
    find() {
      return Messages.find();
    },
    children: [
      {
        find(message) {
          return Text.find({ _id: message.text_id });
        },
        children: [
          {
            find(text) {
              return Meteor.users.find(
                {_id: text.user_id}, 
                {fields: {profile: 1}});
            }
          }
        ],  
      }
    ]
  };
});

// I know publish composite should publish all children automatically
// but apparently it's not doing so.
Meteor.publish('text', function () {
  if (! this.userId) return;
  var messages = Messages.find({ user_id: this.userId });
  var text_ids = messages.map(message => message.text_id);
  return Text.find( { _id : { $in :  text_ids} } );
});