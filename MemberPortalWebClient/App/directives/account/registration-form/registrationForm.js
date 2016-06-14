(function() {
    var app = angular.module('MemberPortalDirectives');


    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' +$('meta[name="templateCacheBust"]').attr('content');

    app.directive("registrationForm", function() {
        return {
            scope: {

            },
            restrict: "EA",
            //replace: true,      
            templateUrl: urlBase + '/App/directives/account/registration-form/registrationForm.html' + cacheBust,
            controller: 'registrationFormCtrl',
            controllerAs: 'ctrl'
        };
    });


    app.filter('excludeFrom', [function() {
        return function(inputArray, filterCriteria) {
            return inputArray.filter(function(item) {
                // if the value of filterCriteria is "falsy", retain the inputArray as it is
                // then check if the currently checked item in the inputArray is different from the filterCriteria,
                // if so, keep it in the filtered results
                return !filterCriteria || !angular.equals(item, filterCriteria);
            });
        };
    }]);

    app.controller('registrationFormCtrl', ['$scope', '$rootScope',   '$filter', 'authService', '$location', 'dialogs', '$route', '$translate',
        function ($scope, $rootScope,  $filter, authService, $location, $dialogs, $route, $translate) {
  

        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.step = 1;
        $scope.currentStep = 1;
        $scope.isAuthorizedPerson = false;
        $scope.isOpenAccessMember = false; 
        $scope.currentLanguage = '';
        $scope.DateOfBirth = "";
        $scope.DateOfBirthIsValid = false;
        $scope.loadingRegStep1 = false;
        $scope.loadingRegStep2 = false;
        $scope.loadingRegStep3 = false;
        $scope.loadingRegStep4 = false;
        $scope.step2FormSubmitButtonDisabled = true;

        $scope.showNextStep = function () {
              $scope.currentStep = ++$scope.currentStep; 
        }; 
        $scope.reloadRoute = function () {
            //Step1
            $('#subscriberNo').val('');
            $('#regDOB').val('').mask('99/99/9999');
            $('#agreeCkBox').removeAttr('checked');
            $scope.DateOfBirthIsValid = false;
            $scope.DateOfBirth = "";
            $scope.stepOne.SubscriberNumber.$valid = false;
            $scope.stepOne.$invalid = true;
            $scope.isAuthorizedPerson = false; 

            //Step2
            $('#txtLastFour').val('');
            $('#step2PinCode').val('');
            $('#step2Email').val('');
            $('#txtPassword1').val('');
            $('#txtPassword2').val('');
            ///$scope.stepTwo.LastFour.$valid = false;
           // $scope.stepTwo.PinCode.$valid = false;
            //$scope.stepTwo.Email.$valid = false;
            //$scope.stepTwo.Password.$valid = false;
            //$scope.stepTwo.passwordConfirm.$valid = false; 
        };
              
        if (!isMobile.any()) {
           
              $('#regDOB').mask('99/99/9999');
            }
     

        $scope.addSlashesToDate = function (e) {
 
            if (isMobile.any()) {
             
                var dob = $('#regDOB');
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
            $scope.DateOfBirthIsValid = false;
            if ((($('#regDOB').val()).substring(6, 10)).indexOf('_') == -1) {
                { 
                    $scope.DateOfBirthIsValid = true;  
                }
            }
        }

       
            ///===== in changePasswordController also in MemberPortalApp.js; need to consolidate
        $scope.checkPasswordStrength = function (e) {
            if (!e.isShiftKey) {
                var newPass = $('#txtPassword1').val();
                var passStrength = 0;
                var _regex = /[$-/:-?{-~!"#@^_`\[\]]/g;
                var _lowerLetters = /[a-z]+/.test(newPass);
                var _upperLetters = /[A-Z]+/.test(newPass);
                var _numbers = /[0-9]+/.test(newPass);
                var _symbols = _regex.test(newPass);

                $('#passwordStrengthString').html('');

                if (_lowerLetters) { passStrength++; }
                if (_upperLetters) { passStrength++; }
                if (_numbers) { passStrength++; }
                if (_symbols) { passStrength++; }
                if (newPass.length >= 6) { passStrength++; }

                $('#passwordStrengthString').fadeIn('slow');
                switch (passStrength) {
                    case 1: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthWeak"));
                        $('#passwordStrengthBar').removeClass('passwordStrength_1').removeClass('passwordStrength_2').addClass('passwordStrength_0'); break;

                    case 2: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthWeak"));
                        $('#passwordStrengthBar').removeClass('passwordStrength_1').removeClass('passwordStrength_2').addClass('passwordStrength_0'); break;

                    case 3: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthMedium"));
                        $('#passwordStrengthBar').removeClass('passwordStrength_0').removeClass('passwordStrength_2').addClass('passwordStrength_1'); break;

                    case 4: $('#passwordStrengthString').html($filter("translate")("form_passwordStrengthStrong"));
                        $('#passwordStrengthBar').removeClass('passwordStrength_0').removeClass('passwordStrength_1').addClass('passwordStrength_2'); break;
                }

                if (passStrength >= 5) {
                    $('#passwordStrengthIcon').removeClass('colorRed').addClass('colorGreen');
                    $('#passwordStrengthString').html('');//Green checkmark showing. 
                }
                else
                    $('#passwordStrengthIcon').addClass('colorRed').removeClass('colorGreen');
            }
        }
 

            /*************************************************************
             * * * * * * * * * * * * Culture Switching * * * * * * * * * *
             *************************************************************/
        $scope.currentCulture = $.cookie("__APPLICATION_LANGUAGE");
        $scope.currentLanguage = $scope.currentCulture.substring(0, 2);

        $scope.$on('language-change', function (event, key) {
            $scope.currentCulture = key;
            $scope.currentLanguage = key;

            //Swap All Questions List
            _extractQuestionsByCulture();
        });
            /**********************************************************/
            /**********************************************************/

            var _extractQuestionsByCulture = function () {
            if ($scope.AllSecurityQuestions.length == 0) {
                return;
            }
            $scope.AllQuestionsForCulture = [];
            for (var i = 0; i < $scope.AllSecurityQuestions.length; i++) {

                for (var j = 0; j < $scope.AllSecurityQuestions[i].Question.length; j++) {
                    if ($scope.AllSecurityQuestions[i].Question[j].culture.toLowerCase() == $scope.currentCulture.toLowerCase()) {
                        var question = {
                                id: $scope.AllSecurityQuestions[i].QuestionId,
                                question: $scope.AllSecurityQuestions[i].Question[j].question
                    }
                        $scope.AllQuestionsForCulture.push(question);
                }
            }
            }


        };

        $scope.AllQuestionsForCulture = [];
        $scope.AllSecurityQuestions = [];
             

            //$scope.toggleOptInOut = function (event) {
            
            //    if ($('#agreeCkBox').is(':checked'))
            //    {
            //        $('#optOutCont').removeClass('ckBoxOptedOut').addClass('ckBoxOptedIn');
            //        isAuthorizedPerson = true;
            //    }
            //    else {
            //        $('#optOutCont').removeClass('ckBoxOptedIn').addClass('ckBoxOptedOut');
            //       isAuthorizedPerson = false;
            //    }
            //}

 
        $scope.StepOne = function () {
            $scope.loadingRegStep1 = true;
            //Hide Cancel Button
            $('#cancelRegStep1').fadeOut(100);
            $('#submitRegStep1').fadeOut(100);

       
        
            var param = {
                    SubscriberNumber: $scope.SubscriberNumber.substring(0,12),
                    DateOfBirth:      $("#regDOB").val() 
        } 

            authService.RegistrationStepOne(param).success(function(data) {
                $scope.step++;
                $scope.data = data.Value;
                $scope.errorMessage = '';

                if (data.Value !='openaccess')
                    $scope.showNextStep();
            }).error(function (data) { 
                $('#cancelRegStep1').fadeIn(3000);
                $('#submitRegStep1').fadeIn(3000);
                $scope.loadingRegStep1 = false;

                if (data.Message == "confirmed") { 
                    var dlg = $dialogs.error($filter("translate")("form_memberDetails"), '<center>'+  $filter("translate")("page_reg_alreadyRegisteredSignIn")  +'</center>');
             
                } else if (data.Message == "failed") { 
                    var dlg = $dialogs.error($filter("translate")("form_memberDetails"), '<center>'+ $filter('translate')('form_registrationFailed')+'</center>');
              
                } else {

                    if (data.Message == "openaccess" || data.Value == 'openaccess') {

                        var dlg = $dialogs.error($filter("translate")("form_memberDetails"), '<center>' + $filter('translate')('form_registrationOpenAccessNotice') + '</center>');
                        $scope.isOpenAccessMember = true;
                    }
                    else
                        var dlg = $dialogs.error($filter("translate")("form_memberDetails"), '<center>' + $filter('translate')('form_didNotReceiveYourEntry') + '</center>');
            } 

                $('#submitRegStep1').fadeIn('slow'); 
        });

        };

        $scope.StepTwo = function () {
            $scope.loadingRegStep2 = true;
            //Hide Cancel Button
            $('#cancelRegStep2').fadeOut(100);
            $('#submitRegStep2').fadeOut(100);

            var param = {
                    SubscriberNumber: $scope.SubscriberNumber,
                    DateOfBirth:  $("#regDOB").val(), 
                    PcpPinCode: $scope.PinCode,
                    Email: $scope.Email,
                    EmailMemberConformation: $scope.Email,
                    Password: $scope.Password,
                    ConfirmPassword: $scope.Password,
                    UserName: $scope.SubscriberNumber,
                    AcceptedTerms: $scope.isAuthorizedPerson,
                    ResourceName: "WebMemberPortal"
        };

            //TODO: This is hacky, fix the form to only include the right value in the right property
            if ($scope.data == 'phone') {
                param.PhoneNumber = $scope.LastFour;
            } else {
                param.SocialSecurityNumber = $scope.LastFour;
        }

            authService.RegistrationStepTwo(param).success(function (data) {
                // alert('yay');
                $scope.data = data;
                $scope.step++;
                $scope.showNextStep();
                
            }).error(function (data) {
                $('#submitRegStep2').fadeIn(3000);
                $('#cancelRegStep2').fadeIn(3000);
                $scope.loadingRegStep2 = false;
                var dlg = $dialogs.error($filter("translate")("form_registrationIncorrecInfoTitle"), '<center>' + $filter('translate')('form_theInformationYouSubmittedIsIncorrect') + '</center>');
              
        });

        };

        $scope.StepThree = function() {
            $scope.loadingRegStep3 = true;
            //Hide Cancel Button
            $('#cancelRegStep3').fadeOut(100);
            $('#submitRegStep3').fadeOut(100);

            var param = {
                    SubscriberNumber: $scope.SubscriberNumber,
                    Code: $scope.EmailCode,
                    name: "WebMemberPortal"
        }


            authService.RegistrationStepThree(param).success(function(data) {
                //alert('yay');
                if (data.Status == "Success") {
                    $scope.step++;
                    $scope.AllSecurityQuestions = data.Value; //Questions
                    _extractQuestionsByCulture();
                    $scope.showNextStep();
                }
                else {
                    var dlg = $dialogs.error($filter("translate")("form_emailCode"), '<center>' + $filter("translate")("form_help_modal_incorrectCode") + '</center>');
            }
            }).error(function () {
                $('#submitRegStep3').fadeIn(3000);
                $('#cancelRegStep3').fadeIn(3000);
                $scope.loadingPRStep3 = false;
            
                var dlg = $dialogs.error($filter("translate")("form_emailCode"), '<center>' + $filter("translate")("form_help_modal_incorrectCode") + '</center>');
             $('#submitRegStep3').fadeIn('slow');
        });

        };

        $scope.StepFour = function () {
            $scope.loadingRegStep4 = true;
            //Hide Cancel Button
            $('#cancelRegStep4').fadeOut(100);
            $('#submitRegStep4').fadeOut(100);

            var code = $scope.AllSecurityQuestions[0].Code;

            //var param = {
            //    RegistrationResponseQuestions: [
            //        {
            //            SubscriberNumber: $scope.SubscriberNumber,
            //            QuestionId: $scope.questionOne,
            //            Answer: $scope.AnswerOne,
            //            Code: code
            //        },
            //        {
            //            SubscriberNumber: $scope.SubscriberNumber,
            //            QuestionId: $scope.questionTwo,
            //            Answer: $scope.AnswerTwo,
            //            Code: code
            //        },
            //        {
            //            SubscriberNumber: $scope.SubscriberNumber,
            //            QuestionId: $scope.questionThree,
            //            Answer: $scope.AnswerThree,
            //            Code: code
            //        }
            //    ]
            //};


            var param = [
                {
                        SubscriberNumber: $scope.SubscriberNumber,
                        QuestionId: $scope.questionOne.id,
                        Answer: $scope.AnswerOne,
                    Code: code,
                        UsersName: $scope.SubscriberNumber
            },
                {
                        SubscriberNumber: $scope.SubscriberNumber,
                        QuestionId: $scope.questionTwo.id,
                        Answer: $scope.AnswerTwo,
                    Code: code,
                        UsersName: $scope.SubscriberNumber
            },
                {
                        SubscriberNumber: $scope.SubscriberNumber,
                        QuestionId: $scope.questionThree.id,
                        Answer: $scope.AnswerThree,
                    Code: code,
                        UsersName: $scope.SubscriberNumber
            }
        ];

            authService.RegistrationStepFour(param).success(function (data) {
                
                if (data.Status == "Success") {
                    $scope.successMessage = $filter('translate')('page_reg_registeredSuccessfully');

                    var dlg = $dialogs.notify($filter("translate")("form_registration"), '<center>' + $filter('translate')('page_reg_registeredSuccessfully')  + '</center>');
                    $location.path('/App/Account/Login');
                }
                else { 
                    var dlg = $dialogs.error($filter("translate")("form_registration"), '<center>' + data.Description + '</center>');

            }
                /*
                 * data == "success" , everything is good.
                 * data == "confirmed", means that there is already a confirmed account for that subno
                 * data == "attempts", bad attempt, at somepoint you will have to start over
                 * 400 == bad request, a value didn't match, or some other validation error occured.
                 */


            }).error(function () {
                $('#submitRegStep4').fadeIn(3000);
                $('#cancelRegStep4').fadeIn(3000);
                $scope.loadingPRStep3 = false;

                var dlg = $dialogs.error($filter("translate")("form_emailCode"), '<center>' + $filter('translate')('form_didNotReceiveYourEntry') + '</center>');
        
        });

        };


            
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


    }]);

})();