// Meteor.publish('users', function () {
//   return Meteor.users.find({}, { 
//     fields: { 'profile.wechat_id': 1, 'profile.name': 1 } 
//   });
// });

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