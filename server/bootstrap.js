Meteor.startup(function () {
  if (Meteor.users.find(
    {username: Meteor.settings.admin.email}
  ).count() != 0) return;

  Accounts.createUser({
    username: Meteor.settings.admin.email,
    password: Meteor.settings.admin.password,
    profile: {
      wechat_id: 'fenxiangdushu',
      name: '阿云'
    }
  });
});