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
    app.controller('changeSecurityQuestionsFormCtrl', ['$scope', 'authService', '$filter', '$translate', 'authStatusService',
        function ($scope, authService, $filter, $translate, authStatusService) {
        $scope.loading = false;
        $scope.errorMessage = "";
        $scope.infoMessage = "";
        $scope.successMessage = "";
        authStatusService.status = authStatusService.getStatus();
        
        //Member's Current Questions
        $scope.questions = [];
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





        /**************************************************************
         * * * * * * * * * * * * Question Manager * * * * * * * * * * *
         **************************************************************/

        $scope.canDelete = true;

        $scope.toggleDelete = function(question) {
            if (question) {
                var idx = $scope.questions.indexOf(question);
                $scope.questions[idx].remove = !$scope.questions[idx].remove; 
            }

            if ($scope.questions.length - _getDeletedItemCount($scope.questions) <= 3) {
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
                $scope.errorMessage = $filter('translate')('form_thereWasAProblemSavingYourQuestions'); 
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

        

        $scope.openNewQuestionForm = function() {
            $scope.showNewQuestionForm = true;
            if ($scope.AllSecurityQuestions.length == 0) {
                $scope.getAllSecurityQuestions();
            }
        };

        $scope.addQuestion = function () {
            var idx = _getQuestionIndexByQuestionId($scope.newQuestion);

            

            var newQuestion = {
                SubscriberNumber: $scope.questions[0].SubscriberNumber,
                UsersName: $scope.questions[0].UsersName,
                QuestionId: $scope.newQuestion,
                Code: $scope.questions[0].Code,
                Question : $scope.AllSecurityQuestions[idx].Question,
                Answer: $scope.newAnswer
            };

            $scope.questions.push(newQuestion);
            $scope.showNewQuestionForm = false;
            $scope.newAnswer = '';
            $scope.toggleDelete();

        };

        $scope.getAllSecurityQuestions = function () {
            authService.getAllQuestions().success(function(result) {
                $scope.AllSecurityQuestions = result;
                _extractQuestionsByCulture();
            }).error(function(msg) {
                
            });
        };

        var _extractQuestionsByCulture = function() {
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
        var _getQuestionIndexByQuestionId = function(id) {
            for (var i = 0; i < $scope.AllSecurityQuestions.length; i++) {
                if ($scope.AllSecurityQuestions[i].QuestionId == id) {
                    return i;
                }
            }
        }

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
                $scope.questions = result.Value;
                $scope.toggleDelete();
            }).error(function(msg) {
                $scope.errorMessage = "Unable to retrieve security questions";
            });
        };
        $scope.getUserQuestions();


        //authService.test().success(function() {
        //    var yay = 'yay';
        //}).error(function () {
        //    var yay = 'boo';
        //});
    }]);
})();


