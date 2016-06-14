(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("changeEmailForm", function () {
        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/account/change-email-form/changeEmailForm.html' + cacheBust,
            controller: 'changeEmailFormCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.controller('changeEmailFormCtrl', ['$scope', 'authService', '$filter', '$translate', 'authStatusService',
        function ($scope, authService,$filter, $translate, authStatusService) {
        $scope.loading = false;
        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.successMessage = "";
        authStatusService.status = authStatusService.getStatus();
        $scope.currentEmail = authStatusService.status.claims.email;


        $scope.checkEmailMatch = function (e) {
 
            $('#emailMatchString').fadeIn('slow');
            var newEmail1 = $('#newEmail').val();
            var newEmail2 = $('#matchEmail').val();
        
            if ((newEmail1 == newEmail2) && (newEmail1.trim() != '')) {
         
                $('#emailMatchString').html($filter('translate')('form_emailsMatch'));
                $('#emailMatchIcon').removeClass('colorRed').addClass('colorGreen');
          
            }
            else { 
                $('#emailMatchString').html($filter('translate')('form_emailsDoNotMatch'));
                $('#emailMatchIcon').addClass('colorRed').removeClass('colorGreen');
            } 
        }

        $scope.SubmitEmailChange = function() {
            $scope.loading = true;
            $scope.errorMessage = "";
            $scope.infoMessage = "";
            $scope.successMessage = "";


            var ParameterModel = {
                UserName: authStatusService.status.userName,
                Password: changeEmailForm.password.value,
                NewEmail: changeEmailForm.newEmail.value,
                ConfirmEmail: changeEmailForm.newEmailConfirmation.value,
                name : 'WebMemberPortal'
            }


 

            authService.ChangeEmail(ParameterModel).success(function(result) {
                $scope.loading = false;

                //Clear the form
                changeEmailForm.newEmail.value = '';
                changeEmailForm.newEmailConfirmation.value = '';
                changeEmailForm.password.value = '';

                //Display Success Message
                $scope.successMessage = $filter('translate')('form_successMessageEmailUpdate');// "Success! Your email has been changed.";

                //Refresh Token to reflect new email
                authService.refreshToken().then(function(status) {
                    authStatusService.status = status;
                });
                

                //Should we inform the user that an email has been sent.

            }).error(function(msg) {
                $scope.loading = false;
                $scope.errorMessage = $('translate','form_thereWasAProblemWithEmailChange'); 
                //Show error message

            });
        };


    }]);
})();


