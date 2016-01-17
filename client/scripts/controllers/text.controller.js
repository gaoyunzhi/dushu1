angular
  .module('Root')
  .controller('TextCtrl', TextCtrl);
 
function TextCtrl ($scope, $reactive, $stateParams, $ionicScrollDelegate, $timeout, $ionicPopup, $log) {
  $reactive(this).attach($scope);
  console.log($scope, "yunzhi_3");
  this.helpers({
    text() {
      console.log("yunzhi 4");
      return Text.find({ _id: $scope.id });
    }
  });
}