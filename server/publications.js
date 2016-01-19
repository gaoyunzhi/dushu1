Meteor.publishComposite('messages', function () {
  if (! this.userId) return;
 
  return {
    find() {
      return Messages.find({ user_id: this.userId });
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