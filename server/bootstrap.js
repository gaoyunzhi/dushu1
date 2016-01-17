Meteor.startup(function () {
  if (Meteor.users.find().count() != 0) return;

  Accounts.createUser({
    username: Meteor.settings.admin.email,
    password: Meteor.settings.admin.password,
    profile: {
      wechat_id: 'fenxiangdushu',
      name: '阿云'
    }
  });
});