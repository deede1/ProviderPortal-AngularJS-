(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

 

    app.directive("submitNewPasswordForm",  ['$filter',  function ($filter) {
        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/account/submit-new-password-form/submitNewPasswordForm.html' + cacheBust,
            controller: 'submitNewPasswordFormCtrl',
            controllerAs: 'ctrl'
        };
    }]);
    app.controller('submitNewPasswordFormCtrl', ['$scope', 'authService', 'authStatusService','$filter','passwordStrength',
        function ($scope, authService, authStatusService, $filter, passwordStrength) {
        $scope.loading = false;
        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.successMessage = "";
        $scope.formSubmitButtonDisabled = true;
        $scope.newPasswordConfirmation = "";
        $scope.newPasswordConfirmation = ""; 

 
        $scope.closeChangePass = function () {
      
            $('#bakModal').fadeOut('fast');
            $('#submitNewPasswordForm').fadeOut('fast');
            $scope.showResetForm = false;
            $('#submitNewPasswordForm').fadeIn('fast');
        };

            //Submit New Password
        $scope.SubmitNewPassword = function() {
            $scope.loading = true;
            $scope.errorMessage = "";
            $scope.infoMessage = "";
            $scope.successMessage = "";

            var parameterModel = {
                UserName: $scope.username,
                NewPassword: $scope.newPassword,
                ConfirmPassword: $scope.newPasswordConfirmation,
                OldPassword: $scope.password,
                name:"WebMemberPortal"
            };

            authService.SubmitNewPassword(parameterModel).success(function (result) {
                $scope.loading = false;
                $scope.successMessage = $filter('translate')('page_resetPass_successfully');// "Success! Your password has been changed.";
                $scope.showResetForm = false;

                //Clear the form
                $scope.password = '';
                $('#bakModal').fadeOut('slow');

                //Display Success Message
                //Should we inform the user that an email has been sent.

            }).error(function(msg) {
                $scope.loading = false;
                $scope.errorMessage = $filter('translate')('page_resetPass_problemResettingPassword');// 'There was problem with your request. We were not able to change your password';
                //Show error message

            });
        }; 
            
 
        //========= PASSWORD STRENGTH
        $scope.checkPasswordStrength = function (e) {
            passwordStrength.checkPasswordStrength(e); 
        } 

        $scope.checkIfPasswordsMatch = function () {
 
            if ($scope.newPassword == $scope.newPasswordConfirmation && $scope.newPasswordConfirmation.length > 0) {
                $scope.formSubmitButtonDisabled = false;
            } else {
                $scope.formSubmitButtonDisabled = true;
            }
            }


        }]);
})();


