(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("changePasswordForm", function () {
        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/account/change-password-form/changePasswordForm.html' + cacheBust,
            controller: 'changePasswordFormCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.controller('changePasswordFormCtrl', ['$scope','$filter','$translate', 'authService', 'authStatusService','passwordStrength',
        function ($scope, $filter, $translate, authService, authStatusService, passwordStrength) {
        $scope.loading = false;
        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.successMessage = "";  
        authStatusService.status = authStatusService.getStatus();

        //========= PASSWORD STRENGTH
        $scope.checkPasswordStrength = function ($scope, e) {
            passwordStrength.checkPasswordStrength($scope, e);
        }


        $scope.SubmitPasswordChange = function() {
                $scope.loading = true;
                $scope.errorMessage = "";
                $scope.infoMessage = "";
                $scope.successMessage = "";

            var ParameterModel = {
                UserName: authStatusService.status.userName,
                OldPassword: $('#currentPass').val(), // $scope.changePasswordForm.currentpass.value,
                ConfirmPassword: $('#matchPassword').val(), //  $scope.changePasswordForm.newPassword.value,
                NewPassword: $('#txtPassword1').val(), //$scope.changePasswordForm.newPasswordConfirmation.value,
                name: 'WebMemberPortal'
            };

            authService.ChangePassword(ParameterModel).success(function(result) {
                $scope.loading = false;
                $scope.successMessage = $filter('translate')('form_successfullyChangedPassword');//"Your password has been changed successfully.";
                //Clear the form
                $('#currentPass').val('');// $scope.changePasswordForm.currentpass.value = '';
                $('#matchPassword').val('');//$scope.changePasswordForm.newPassword.value = '';
                $('#newPassword').val('');//$scope.changePasswordForm.newPasswordConfirmation.value = '';
                //Display Success Message
                //Should we inform the user that an email has been sent.

            }).error(function(msg) {
                $scope.loading = false;
                $scope.errorMessage = $filter('translate')('form_problemChangingPassword');  
                //Show error message

            });
        };




    }]);
})();


