angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log) {
  $reactive(this).attach($scope);
  Meteor.subscribe('allMessages');
  Meteor.subscribe('text');
  Meteor.subscribe('admin_id');
  var admin_id = 0;
  $scope.$meteorSubscribe('admin_id').then(function() {
    admin_id = AdminID.findOne().admin_id;
  });
  $scope.$meteorSubscribe('allMessages').then(function() {
      var messages = $scope.$meteorCollection(Messages);
      $scope.messages = messages.filter(message => {
        if (message.user_id ==  this.userId) {
          return true;
        }
        var text = Text.findOne({ _id: message.text_id });
        if (text.user_id == admin_id) {
          return false;
        }
        var content = message.text || text.text;
        if (!content) {
          return false;
        }
        if ((content.length > TEXT_MIN_LENGTH) &&
          (!is_bad_content(content))) {
          return true;
        }
        return false;
      })

    
      $scope.getText = function(message) {
        return Text.findOne(message.text_id);
      };

      $scope.getAuthor = function(text) {
        if (!text) {
          return;
        }
        var user = Meteor.users.findOne(text.user_id);
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

  $scope.autoExpand = function(e) {
      var element = typeof e === 'object' ? e.target : document.getElementById(e);
      var scrollHeight = element.scrollHeight;
      if (element.textLength == 0) {
        element.style.height = '40px';
      } else {
        element.style.height = scrollHeight + "px"; 
      }   
  };
  
  function expand() {
    $scope.autoExpand('TextArea');
  }

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
}