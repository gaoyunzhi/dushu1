angular
  .module('Root')
  .controller('ChatCtrl', ChatCtrl);
 
function ChatCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log, $state) {
  $reactive(this).attach($scope);
  Meteor.subscribe('allMessages');
  Meteor.subscribe('text');
  Meteor.subscribe('admin_id');
  var admin_id = 0;
  $scope.$meteorSubscribe('admin_id').then(function() {
    admin_id = AdminID.findOne().admin_id;
  });
  $scope.$meteorSubscribe('allMessages').then(function() {
      $scope.raw_messages = $scope.$meteorCollection(Messages);
    
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

  $scope.getMessageClass = function(message) {
    if (message.type === 'send' && 
      (!Meteor.user() || message.user_id === Meteor.user()._id)) {
      return 'message-mine';
    }
    if (Meteor.user() && message.user_id === Meteor.user()._id) {
      return 'message-other message-to-me';
    }
    return 'message-other';
  }

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

  $scope.$watchCollection('raw_messages', (newVal, oldVal) => {
    var val = newVal || oldVal;
    if (!val) {
      return;
    }
    var messages =  val.slice();
    messages.sort((m1, m2) => m1.timestamp - m2.timestamp);
    $scope.messages = messages.filter(message => {
      if (Meteor.user() && message.user_id ==  Meteor.user()._id) {
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
  });

  $scope.$watchCollection('messages', (newVal, oldVal) => {
    if (oldVal && newVal && oldVal.length && newVal.length) {
      if (oldVal[oldVal.length-1].timestamp == 
        newVal[newVal.length-1].timestamp) {
        return;
      }
    }
    $ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom();
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

  $scope.gotoLogin = function() {
    $state.go('login');
  }


  $scope.gotoRegister = function() {
    $state.go('register');
  }
}