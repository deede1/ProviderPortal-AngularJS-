(function () {
    var app = angular.module('MemberPortalDirectives');

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

    app.directive("changeSecurityQuestionsForm", function () {
        return {
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/account/change-security-questions-form/changeSecurityQuestionsForm.html' + cacheBust,
            controller: 'changeSecurityQuestionsFormCtrl',
            controllerAs: 'ctrl'
        };
    });
    app.filter('excludeSelected', function() {
        return function(input, selected, except) {
            //if (!selected.isArray())
            //    return null;

            var result = input;

            for (var i = 0; i < selected.length; i++) {
                for (var j = 0; j < input.length; j++) {
                    if (selected[i].QuestionId == input[j].id) {
                        if (input[j].id != except) {
                            input.splice(j, 1);
                        }
                        break;
                    }
                }
            }

            return result;
        }
    });

    app.controller('changeSecurityQuestionsFormCtrl', ['$scope', 'authService', 'authStatusService', function ($scope, authService, authStatusService) {
        $scope.loading = false;
        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.successMessage = "";
        authStatusService.status = authStatusService.getStatus();
        
        //Member's Current Questions
        $scope.usersQuestions = [];
        //$scope.questions = [];
        //$scope.questions = [{ "SubscriberNumber": 0, "UsersName": null, "QuestionId": 1, "Question": [{ "culture": "en-US", "question": "What was your childhood nickname?" }, { "culture": "es-MX", "question": "¿Cuál fue su apodo de la infancia ?" }], "Code": "sttkmnvl", "Answer": null }, { "SubscriberNumber": 0, "UsersName": null, "QuestionId": 2, "Question": [{ "culture": "en-US", "question": "What is the name of your favorite childhood friend?" }, { "culture": "es-MX", "question": "¿Cuál es el nombre de tu amigo favorito de la infancia ?" }], "Code": "sttkmnvl", "Answer": null }, { "SubscriberNumber": 0, "UsersName": null, "QuestionId": 3, "Question": [{ "culture": "en-US", "question": "In what city or town did your mother and father meet?" }, { "culture": "es-MX", "question": "¿En qué ciudad o pueblo hicieron su madre y su padre se reúnen ?" }], "Code": "sttkmnvl", "Answer": null }, { "SubscriberNumber": 0, "UsersName": null, "QuestionId": 31, "Question": [{ "culture": "en-US", "question": "What street did you grow up on?" }, { "culture": "es-MX", "question": "¿En qué calle creciste en ?" }], "Code": "sttkmnvl", "Answer": null }, { "SubscriberNumber": 0, "UsersName": null, "QuestionId": 24, "Question": [{ "culture": "en-US", "question": "Where do you want to retire?" }, { "culture": "es-MX", "question": "¿A dónde quiere jubilarse?" }], "Code": "sttkmnvl", "Answer": null }, { "SubscriberNumber": 0, "UsersName": null, "QuestionId": 31, "Question": [{ "culture": "en-US", "question": "What street did you grow up on?" }, { "culture": "es-MX", "question": "¿En qué calle creciste en ?" }], "Code": "sttkmnvl", "Answer": null }, { "SubscriberNumber": 0, "UsersName": null, "QuestionId": 17, "Question": [{ "culture": "en-US", "question": "In what city or town did you meet your spouse/partner?" }, { "culture": "es-MX", "question": "¿En qué ciudad o pueblo se conocieron su cónyuge / pareja?" }], "Code": "sttkmnvl", "Answer": null }];
        




        /*************************************************************
         * * * * * * * * * * * * Culture Switching * * * * * * * * * *
         *************************************************************/
        $scope.currentCulture = $.cookie("__APPLICATION_LANGUAGE");
        $scope.$on('language-change', function (event, key) {
            $scope.currentCulture = key;

            //Swap All Questions List
            _extractQuestionsByCulture();
        });
        /**********************************************************/
        /**********************************************************/


        $scope.getCultureSpecificQuestionById = function(id) {
            var result = $.grep($scope.AllQuestionsForCulture, function(e, i) {
                return e.id == id;
            });
            if (result && result.length > 0) {
                return result[0].question;
            }
            return null;
        };


/**************************************************************
         * * * * * * * * * * * * Question Manager * * * * * * * * * * *
         **************************************************************/

        $scope.canDelete = true;

        $scope.toggleDelete = function(question) {
            if (question) {
                var idx = $scope.usersQuestions.indexOf(question);
                $scope.usersQuestions[idx].remove = !$scope.usersQuestions[idx].remove;
            }

            if ($scope.usersQuestions.length - _getDeletedItemCount($scope.usersQuestions) <= 3) {
                $scope.canDelete = false;
            } else {
                $scope.canDelete = true;
            }
            
        };
        $scope.saveChanges = function() {
            $scope.successMessage = '';
            $scope.errorMessage = '';
            var status = authStatusService.status;


            //Create Parameter Object
            var param = {
                UserName: authStatusService.status.claims.username,
                Password: $scope.password,
                name: "WebMemberPortal",
                questions: []
            };

            var questions = $scope.questions;
            //Read through each question
            for (var i = 0; i < questions.length; i++) {
                var question = questions[i];

                var item = {
                    SubscriberNumber: status.claims.subno,
                    UsersName: status.claims.username,
                    QuestionId: question.QuestionId,
                    Code: question.Code,
                    Answer: question.Answer == '' ? null : question.Answer
                };

                //Check for remove == false, ignore
                if (!question.remove) {
                    param.questions.push(item);
                }
            }

            authService.submitQuestions(param).success(function(response) {
                $scope.successMessage = "Changes Saved.";
                $scope.getUserQuestions();
                //Reset or Reload the data
            }).error(function(msg) {
                $scope.errorMessage = "There was a problem saving your questions.";
            });


        };
        var _getDeletedItemCount = function (questions) {
            var count = 0;
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].remove) {
                    count++;
                }
            }
            return count;
        };
        $scope.toggleDelete();
        /**********************************************************/
        /**********************************************************/





        /*************************************************************
         * * * * * * * * * * * New Question Stuff * * * * * * * * * * 
         *************************************************************/
        //All Questions
        $scope.AllSecurityQuestions = [];
        $scope.AllQuestionsForCulture = [];
        $scope.AvailableQuestions = [];

        

        $scope.openNewQuestionForm = function() {
            $scope.showNewQuestionForm = true;
            if ($scope.AllSecurityQuestions.length == 0) {
                $scope.getAllSecurityQuestions();
            }
        };

        $scope.addQuestion = function () {
            var idx = _getQuestionIndexByQuestionId($scope.newQuestion, $scope.AllSecurityQuestions);

            

            var newQuestion = {
                SubscriberNumber: $scope.usersQuestions[0].SubscriberNumber,
                UsersName: $scope.usersQuestions[0].UsersName,
                QuestionId: $scope.newQuestion,
                Code: $scope.usersQuestions[0].Code,
                Question : $scope.AllSecurityQuestions[idx].Question,
                Answer: $scope.newAnswer
            };

            $scope.usersQuestions.push(newQuestion);
            $scope.showNewQuestionForm = false;
            $scope.newAnswer = '';
            $scope.toggleDelete();

        };

        $scope.getAllSecurityQuestions = function () {
            authService.getAllQuestions().success(function(result) {
                $scope.AllSecurityQuestions = result;
                _extractQuestionsByCulture();
                _extractAvailableQuestions();
                //Populate Available Questions Here
            }).error(function(msg) {
                
            });
        };

        var _extractQuestionsByCulture = function() {
            //Extracts the Culture relevant questions from full set of SecurityQuestions which has multiple versions of each question by languange

            //Ensure that AllSecurityQuestions is populated
            if ($scope.AllSecurityQuestions.length == 0) {
                return;
            }
            //Reset AllQuestionsForCulture value
            $scope.AllQuestionsForCulture = [];

            //Loop through AllSecurityQuestions
            for (var i = 0; i < $scope.AllSecurityQuestions.length; i++) {
                //Loop through each SecurityQuestions' Questions (multiple values for each supported language)
                for (var j = 0; j < $scope.AllSecurityQuestions[i].Question.length; j++) {
                    //If the language matches the current setting, push into AllQuestionsForCulture
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

        var _getQuestionIndexByQuestionId = function(id, arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].QuestionId == id) {
                    return i;
                }
            }
            return -1;
        };


        var _getCurrentlySelectedQuestions = function() {
            

        };

        var _extractAvailableQuestions = function() {
            $scope.AvailableQuestions = $scope.AllQuestionsForCulture;

            //Loop through AvailableQuestions (taking any pending changes into consideration) and remove any matches from AllQuestionsForCulture, then set to AvailableQuestions
            for (var i = 0; i < $scope.AvailableQuestions.length; i++) {
                var idx = _getQuestionIndexByQuestionId($scope.AvailableQuestions[i].id, $scope.usersQuestions);
                if (idx >= 0) {
                    delete $scope.AvailableQuestions[i];
                }

            }


            //Might need an event to toggle the availability of a question when one is tentatively selected (on-change for a dropdown?).

            //Change all dropdowns to use $scope.AvailableQuestions for their ng-repeat source
        };

        /**********************************************************/
        /**********************************************************/


        $scope.getUserQuestions = function () {
            $scope.errorMessage = '';

            var parameterModel = {
                name: 'WebMemberPortal',
                UserName : authStatusService.status.claims.username
                //Password : 'Password#00',
                //grant_type: 'password'
            };

            //var parameterModel = {
            //    name: 'WebMemberPortal',
            //    UserName: authStatusService.status.claims.username
            //};

            authService.getUserQuestions(parameterModel).success(function (result) {
                $scope.usersQuestions = result.Value;
                $scope.toggleDelete();
            }).error(function(msg) {
                $scope.errorMessage = "Unable to retrieve security questions";
            });
        };
        $scope.getUserQuestions();

        $scope.openNewQuestionForm();
    }]);
})();


