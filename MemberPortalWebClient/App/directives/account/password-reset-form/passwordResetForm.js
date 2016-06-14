(function () {
    var app = angular.module('MemberPortalDirectives');

    app.directive("passwordResetForm", ['$filter', function ($filter) {
        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
        //console.log("urlBase=" + urlBase);

        var link = function (scope, element, attrs) {

        };

        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/account/password-reset-form/passwordResetForm.html' + cacheBust,
            controller: 'passwordResetFormController',
            controllerAs: 'ctrl',
            link: link
        };
    }]);

    app.controller('passwordResetFormController', [
        '$scope', '$rootScope', '$routeParams', '$translate', '$filter', '$location', '$cookies', 'authService', 'dialogs', '$route', 'passwordStrength',
        function($scope, $rootScope, $routeParams, $translate, $filter, $location, $cookies, authService, $dialogs, $route,  passwordStrength) {
       // $scope.steps = [$filter('translate')('form_memberDetails'), 'E-Mail Verification', 'Security Question', 'New Password'];
        $scope.step = 1;
        $scope.password = '';
        $scope.passwordConfirm = '';
        $scope.loadingPRStep1 = false;
        $scope.loadingPRStep2 = false;
        $scope.loadingPRStep3 = false;
        $scope.loadingPRStep4 = false; 
        $scope.currentLanguage = $rootScope.currentLanguage;
         

        //Debug Variables
        //$scope.email = 'kepke-b@iehp.org';
        //$scope.MemberId = '199611085459';
        //$scope.PcpPinCode = '000000013905';
        //$scope.MemberDob = '12/28/1979'; 

        $scope.reloadRoute = function () {
            $route.reload();
        };
             

        //$scope.changeLanguage = function (key) {
        //    if ($scope.currentLanguage !== key) {
        //        $translate.use(key);
        //        $scope.currentLanguage = key;
        //        var date = new Date();
        //        var m = 10 * 60 * 24 * 30 * 6;
        //        date.setTime(date.getTime() + (m * 60 * 1000));
        //        $.cookie("__APPLICATION_LANGUAGE", key, {
        //            expires: date, path: '/'
        //        });

        //        $('html').attr("lang", key);
        //        $rootScope.currentLanguage = key;
        //        $rootScope.$broadcast('language-change', key);
        //        $('.selectedLanguage').removeClass('selectedLanguage');
        //    }
        //}
        ////========== LANGUAGE
        //var requestedLanguage = $routeParams.lang;
        //    //default language, use existing cookies, or proceed w init cookie as normal
        //    //Check if desired language is passed
        //if (requestedLanguage != undefined)
        //    if (requestedLanguage.toLowerCase() == 'es') {
        //        $scope.changeLanguage('es-mx');
        //    }
        //    else
        //        $scope.changeLanguage('en-us');



        //Questions
        $scope.questions = [];
        $scope.questions = [{
            "SubscriberNumber": 0, "UsersName": null, "QuestionId": 1, "Question": [{ "culture": "en-US", "question": "What was your childhood nickname?" },
                { "culture": "es-MX", "question": "¿Cuál fue su apodo de la infancia ?" }], "Code": "sttkmnvl", "Answer": null
        }, {
            "SubscriberNumber": 0, "UsersName": null, "QuestionId": 2, "Question": [{ "culture": "en-US", "question": "What is the name of your favorite childhood friend?" },
                { "culture": "es-MX", "question": "¿Cuál es el nombre de tu amigo favorito de la infancia ?" }], "Code": "sttkmnvl", "Answer": null
        }, {
            "SubscriberNumber": 0, "UsersName": null, "QuestionId": 3, "Question": [{ "culture": "en-US", "question": "In what city or town did your mother and father meet?" },
                { "culture": "es-MX", "question": "¿En qué ciudad o pueblo hicieron su madre y su padre se reúnen ?" }], "Code": "sttkmnvl", "Answer": null
        }, {
            "SubscriberNumber": 0, "UsersName": null, "QuestionId": 31, "Question": [{ "culture": "en-US", "question": "What street did you grow up on?" },
                { "culture": "es-MX", "question": "¿En qué calle creciste en ?" }], "Code": "sttkmnvl", "Answer": null
        }, {
            "SubscriberNumber": 0, "UsersName": null, "QuestionId": 24, "Question": [{ "culture": "en-US", "question": "Where do you want to retire?" },
                { "culture": "es-MX", "question": "¿A dónde quiere jubilarse?" }], "Code": "sttkmnvl", "Answer": null
        }, {
            "SubscriberNumber": 0, "UsersName": null, "QuestionId": 31, "Question": [{ "culture": "en-US", "question": "What street did you grow up on?" },
                { "culture": "es-MX", "question": "¿En qué calle creciste en ?" }], "Code": "sttkmnvl", "Answer": null
        }, {
            "SubscriberNumber": 0, "UsersName": null, "QuestionId": 17, "Question": [{ "culture": "en-US", "question": "In what city or town did you meet your spouse/partner?" },
                { "culture": "es-MX", "question": "¿En qué ciudad o pueblo se conocieron su cónyuge / pareja?" }], "Code": "sttkmnvl", "Answer": null
        }];
        $scope.currentQuestionIndex = 0;
        $scope.nextQuestion = function() {
            $scope.currentQuestionIndex++;
            if ($scope.currentQuestionIndex >= $scope.questions.length) {
                $scope.currentQuestionIndex = 0;
            }
        };

        //Culture
        $scope.currentCulture = $.cookie("__APPLICATION_LANGUAGE");
        $scope.$on('language-change', function(event, key) {
            $scope.currentCulture = key;
            $scope.currentLanguage = key; 
        });
 

        if (!isMobile.any()) {
            $('#memberDOB').mask('99/99/9999'); 
        }
        $scope.addSlashesToDate = function (e) {
            if (isMobile.any()) {
                var dob = $('#memberDOB');
                var dateValue = dob.val();
                var dateLength = dateValue.length;

                if (e.keyCode == 8) //delete
                {
                    dateValue = dateValue.substring(0, dateValue.length);
                    dob.val(dateValue);
                }
                else {
                    switch (dateLength) {
                        case 2: dob.val(dateValue + '/'); break;
                        case 5: dob.val(dateValue + '/'); break;
                    }
                }
            }
        }
  

        //========= PASSWORD STRENGTH
        $scope.checkPasswordStrength = function (e) {
            passwordStrength.checkPasswordStrength(e);
        } 

        //Step 1
        $scope.checkMemberDetails = function ($event) {  
            $scope.loadingPRStep1 = true;
            //Hide Cancel Button
            $('#cancelPRStep1').fadeOut(100);
            $('#submitPRStep1').fadeOut(100);
            var param = {
                Email: $scope.email,
                SubscriberNumber: $scope.MemberId, 
                DateOfBirth: $scope.MemberDob
                }; 
            authService.InitiatePasswordReset(param).success(function (data) {
                $scope.loadingPRStep1 = false;
                $scope.step++;
            }).error(function (data) {
                   //Error 
                    $('#submitPRStep1').fadeIn(3000);
                    $('#cancelPRStep1').fadeIn(3000); 
                    $scope.loadingPRStep1 = false;
                    if (data.Message == 'Request failed:') {  
                        //Credentials failed
                        var dlg = $dialogs.error($filter("translate")("form_memberDetails"), '<center>' + $filter('translate')('page_resetPass_incorrectSubmittedInformation') + '</center>');
                    }
                    else 
                        var dlg = $dialogs.error($filter("translate")("form_memberDetails"), '<center>' + $filter('translate')('page_resetPass_incorrectSubmittedInformation') + '</center>');
                     }); 
        };

        //Step 2
        $scope.VerifyEmailCode = function (isValid) {
            $scope.loadingPRStep2 = true;
            //Hide Cancel Button
            $('#cancelPRStep2').fadeOut(100);
            $('#submitPRStep2').fadeOut(100);

            var param = {
                SubscriberNumber: $scope.MemberId,
                Code: $scope.emailCode
            }; 
            authService.VerifyEmailCode(param).success(function (data) {
                $scope.loadingPRStep2 = false;
                if (data.Status == 'Success') {
                    $scope.questions = data.Value;
                    $scope.currentQuestion = data.Value[0]; 
                    $scope.step++;
                }
                else
                {
                    //Code failed
                    $('#submitPRStep2').fadeIn('slow');
                    $('#cancelPRStep2').fadeIn('slow');
                    var dlg = $dialogs.error($filter("translate")("form_emailVerification"), '<center>'+ $filter('translate')('page_resetPass_incorrectCode')+'</center>');
                  
                } 
            }).error(function (data) {
                    $scope.loadingPRStep2 = false;
                    //Encountered an Error  
                    var dlg = $dialogs.error($filter("translate")("form_emailVerification"), '<center>' + $filter('translate')('page_resetPass_incorrectCode') + '</center>');
                    $('#submitPRStep2').fadeIn('slow');
                    $('#cancelPRStep2').fadeIn('slow');
            });
        };

        //Step 3
        $scope.SubmitSecurityQuestionAnswer = function (isValid) {
            $scope.loadingPRStep3 = true;
            //Hide Cancel Button
            $('#cancelPRStep3').fadeOut(100);
            $('#submitPRStep3').fadeOut(100);

            if (isValid) {
            var param = {
                SubscriberNumber: $scope.MemberId,
                UsersName: $scope.MemberId,
                Code: $scope.questions[$scope.currentQuestionIndex].Code,
                QuestionId: $scope.questions[$scope.currentQuestionIndex].QuestionId,
                Answer: $scope.securityAnswer
            };

            authService.SubmitSecurityQuestionAnswer(param).success(function (data) {
                $scope.loadingPRStep3 = false;
                //data == new code
                data.Value = data.Value.replace('"', '');  //.replace only replace the first character it finds, maybe there is a better recursive replace method to use here...
                data.Value = data.Value.replace('"', '');
                $scope.Code = data.Value;
                $scope.step++;
                  //  }
                     
            }).error(function (data) {
                    $scope.loadingPRStep3 = false;
                    $('#submitPRStep3').fadeIn('slow');
                    $('#cancelPRStep3').fadeIn('slow');

                    if (data.Message == 'Members question & answer failed') { 
                        var dlg = $dialogs.error($filter("translate")("form_securityQuestion"), '<center>' + $filter('translate')('page_resetPass_wrongAnswer') + '</center>');
                    }
                    else     
                        var dlg = $dialogs.error($filter("translate")("form_securityQuestion"), '<center>'+ $filter('translate')('form_didNotReceiveYourEntry') +'</center>');
 
            });
            }
            else {
                $('#submitPRStep3').fadeIn('slow');
            }
        };
        //Step 4
        $scope.SubmitNewPassword = function (isValid) {
            $scope.loadingPRStep4 = true;
            //Hide Cancel Button
            $('#cancelPRStep4').fadeOut(100);
            $('#submitPRStep4').fadeOut(100);

            if ($scope.password != $scope.passwordConfirm)
            {
                alert('Passwords do not match.');
                return;
            }

            var paramModel = {
                UserName: $scope.MemberId,
                OldPassword: $scope.Code,
                NewPassword: $scope.password,
                ConfirmPassword: $scope.passwordConfirm,
                name: "WebMemberPortal" 
            };
            //console.log(paramModel);
            authService.SubmitNewPassword(paramModel).success(function () {
                $scope.loadingPRStep4 = false;
                $('#submitPRStep4').fadeIn('slow');
                $('#cancelPRStep4').fadeIn('slow');
                var dlg = $dialogs.notify($filter("translate")("form_newPassword"), '<center>' + $filter('translate')('page_resetPass_successfully') + '</center>');
                $scope.lastStep();
            }).error(function () {
                $scope.loadingPRStep4 = false;
                $('#submitPRStep4').fadeIn('slow');
                $('#cancelPRStep4').fadeIn('slow');
                //Encountered an Error  
                var dlg = $dialogs.error($filter("translate")("form_securityQuestion"), '<center>' + $filter('translate')('form_didNotReceiveYourEntry') + '</center>');
            });
        };
             
        ////Help Modal
        //$scope.showHelpModal = function (type) {
        //    var dlg = {};
        //    switch (type) {
        //        case 'IEHPMemID': dlg = $dialogs.notify($filter('translate')('form_help_modal_title_whereToFindYourMemberID'),   '<center class="overflowAuto"><img src="Content/Images/IEHPMemCard_memIDv2.png"></center>'); break;
        //        case 'PCPPinCode': dlg = $dialogs.notify($filter('translate')('form_help_modal_title_whereToFindYourPCPPinCode'), '<center class="overflowAuto"><img src="Content/Images/IEHPMemCard_pcpCode.png"></center>'); break;
        //      } 
        //}; 
             
        $scope.compareTo = function () {
            return {
                require: "ngModel",
                scope: {
                    otherModelValue: "=compareTo"
                },
                link: function (scope, element, attributes, ngModel) {

                    ngModel.$validators.compareTo = function (modelValue) {
                        return modelValue == scope.otherModelValue;
                    };

                    scope.$watch("otherModelValue", function () {
                        ngModel.$validate();
                    });
                }
            };
        };
             


        $scope.nextStep = function () {
            $scope.step++;
        };

        $scope.lastStep = function () {
            $location.path('App/Account/Login').replace();
        };


        $scope.opened = false;
        $scope.maxDate = new Date();
        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.isOpened = true;
        };
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            showWeeks: false
        };

    }]);


})();


