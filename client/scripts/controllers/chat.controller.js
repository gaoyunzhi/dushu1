angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log) {
  $reactive(this).attach($scope);
 
  let isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();
  this.sendMessage = sendMessage
  this.inputUp = inputUp;
  this.inputDown = inputDown;
  this.closeKeyboard = closeKeyboard;
  this.helpers({
    messages() {
      console.log("yunzhi_4");
      messages = Messages.find({ user_id: $scope.currentUser._id });
      messages.forEach(message => {
        text = Text.find({_id: message.text_id});
        message.text = text;
      });
      console.log(messages);
      return messages;
    },
  });

  function sendMessage() {
    if (_.isEmpty(this.message)) return;
 
    Meteor.call('newMessage', this.message);
 
    delete this.message;
  }

  $scope.$watchCollection('chat.messages', (oldVal, newVal) => {
    let animate = oldVal.length !== newVal.length;
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