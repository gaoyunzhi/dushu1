angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log) {
  $reactive(this).attach($scope);

  $scope.$meteorSubscribe('messages').then(function() {
      // This swill get you the articles from the local collection
      $scope.messages = $scope.$meteorCollection(Messages);
      // then you need to get the related Categories for the articles
      $scope.getText = function(message) {
        return $scope.$meteorObject(Text, message.text_id);
      };

      $scope.getAuthor = function(text) {
        user = $scope.$meteorObject(Meteor.users, text.user_id);
        return {name: user.profile.name, wechat_id: user.profile.wechat_id};
      };
  });
 
  let isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  this.sendMessage = sendMessage
  this.inputUp = inputUp;
  this.inputDown = inputDown;
  this.closeKeyboard = closeKeyboard;

  function sendMessage() {
    if (_.isEmpty(this.message)) return;
 
    Meteor.call('newMessage', this.message);
 
    delete this.message;
  }

  $scope.$watchCollection('messages', (oldVal, newVal) => {
    let animate = newVal && (!oldVal || oldVal.length !== newVal.length);
    $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
  });

  function inputUp () {
    if (isIOS) {
      this.keyboardHeight = 216;
    }
 
    $timeout(function() {
      $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(true);
    }, 300);
  }
 
  function inputDown () {
    if (isIOS) {
      this.keyboardHeight = 0;
    }
 
    $ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }
 
  function closeKeyboard () {
    // cordova.plugins.Keyboard.close();
  }
 
  function handleError (err) {
    $log.error('profile save error ', err);
    $ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}