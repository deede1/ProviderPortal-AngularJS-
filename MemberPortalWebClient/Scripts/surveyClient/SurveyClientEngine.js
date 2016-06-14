(function () {
    angular.module("surveyClient", []);
})();

/**
 * @desc survey directive that starts a new instance of a specified survey
 */
angular
    .module('surveyClient')
    .directive('newSurvey', newSurvey);

newSurvey.$inject = ['$compile'];

function newSurvey($compile) {
    var directive = {
        restrict: 'EA',
        templateUrl: 'Directives/new-survey.directive.html',
        scope: {
            surveyId: '='
        },
        link: linkFunc,
        controller: NewSurveyController,
        controllerAs: 'vm',
        bindToController: true
    };
    return directive;

    function linkFunc(scope, el, attr, ctrl) {
        scope.$watch('vm.survey', function (newVal) {
            if (newVal) {
                var el = angular.element('div.survey-questions');
                el.append('<div class="panel"><h1 class="pageTitle">' + scope.vm.survey.Name + '</h1></div>');
                var sections = scope.vm.survey.Sections;
                for (var sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
                    //Go through each question in the survey
                    var questions = sections[sectionIndex].Questions;
                    for (var questionIndex = 1; questionIndex < questions.length; questionIndex++) {
                        if (!questions[questionIndex].QuestionText.$isEmpty && questions[questionIndex].InputType === 'Blank') {
                            el.append('<div class="SectionHeader"><h4>' + questions[questionIndex].QuestionText + '</h4></div>');
                        }
                        //Go through each questions sub question
                        var subQuestions = questions[questionIndex].SubQuestions;
                        for (var subQuestionIndex = 0; subQuestionIndex < subQuestions.length; subQuestionIndex++) {
                            switch (subQuestions[subQuestionIndex].InputType) {
                                case "text":
                                    //attach an answer using an object
                                    var directive = '<sc-text-input question=' + subQuestions[subQuestionIndex].QuestionText + '></sc-text-input>';
                                    el.append($compile(directive)(scope));
                                    break;
                                case "Table - Radio":
                                    //attach an answer
                                    scope.vm.answers.push({});
                                    var directive = '<sc-table-radio answers=vm.answers[vm.answers.length-1] obj=vm.survey.Sections[' + sectionIndex + '].Questions[' + questionIndex + '].SubQuestions[' + subQuestionIndex + ']></sc-table-radio>';
                                    el.append($compile(directive)(scope));
                                    break;
                            }
                        }
                    }
                }
            }
        }, true);
    }
}

NewSurveyController.$inject = ['$scope', 'dataService'];

function NewSurveyController($scope, dataService) {
    var vm = this;
    vm.answers = [];
    activate();

    //For testing
    //$scope.$watch('vm.answers', function(newVal, oldVal) { console.log(newVal) }, true);

    function activate() {
        return getQuestions(vm.surveyId).then(function () {
            //log stuff
        });
    }

    function getQuestions(surveyId) {
        dataService.setUrlBase('UAT');
        return dataService.getQuestions(surveyId)
            .then(function (data) {
                vm.survey = data;
                //For development only!
                //console.log(vm.survey);
                return vm.survey;
            });
    }
    function getAnswers(surveyId) {
        dataService.setUrlBase('UAT');
        return dataService.getAnswers(surveyId)
            .then(function (data) {
                return vm.answers;
            });
    }
}
angular.module("surveyClient").directive("ruleEngine", [function () {
    var directive = {};
    directive.restrict = "A";
    directive.controller = "ruleEngineController";
    directive.controllerAs = "vm";
    directive.bindToController = true;
    directive.scope = {
        question: "="
    };
    return directive;
}]);

angular.module("surveyClient").controller("ruleEngineController", ["$q", "modelService", function ($q, modelService) {
    this.run = function () { };
}]);

angular
    .module('surveyClient')
    .directive('surveyHistory', surveyHistory);

function surveyHistory() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'Directives/survey-history.directive.html',
        scope: {},
        link: linkFunc,
        controller: surveyHistoryController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
}

surveyHistoryController.$inject = ['$scope', 'dataService'];

function surveyHistoryController($scope, dataService) {
    var vm = this;
    vm.transactions = {};
    vm.surveyId = 34;

    //Check if survey history is empty
    //create default empty history message but also customizable
    //build out how it shows each list entry

    activate();

    function activate() {
        return getTransactions(vm.surveyId).then(function () {
            //log stuff
        });
    }

    function getTransactions(surveyId) {
        dataService.setUrlBase('DEV');
        return dataService.getTransactions(surveyId)
            .then(function (data) {
                vm.transactions = data;
                return vm.transactions;
            });
    }

}

angular.module("surveyClient").controller("pickLanguageController", ["$uibModalInstance", "modelService", function ($uibModalInstance, modelService) {
    this.ok = function () {
        this.modelService.data.selectedLanguage = Models.Language.English;
        this.$uibModalInstance.close();
    }
}]);
angular.module('lodashAngularWrapper', [])
.run(function () {
    if (!window || !window._) {
        throw new Error("Js library 'Lo-Dash' is not available! You either misspelled " +
            "the lib name or forgot to load it. Please check http://lodash.com/");
    }
})
.factory('_', function () {
    if (window && window._) {
        return window._;
    } else {
        throw new Error("Js library 'Lo-Dash' is not available! You either misspelled " +
            "the lib name or forgot to load it. Please check  http://lodash.com/");
    }
});
var SurveyEngine;
(function (SurveyEngine) {
    var Models;
    (function (Models) {
        (function (Language) {
            Language[Language["English"] = "EN"] = "English";
            Language[Language["Spanish"] = "ES"] = "Spanish";
        })(Models.Language || (Models.Language = {}));
        var Language = Models.Language;
        (function (DisplayMode) {
            DisplayMode[DisplayMode["Block"] = 0] = "Block";
            DisplayMode[DisplayMode["Native"] = 1] = "Native";
        })(Models.DisplayMode || (Models.DisplayMode = {}));
        var DisplayMode = Models.DisplayMode;
        (function (Kind) {
            Kind[Kind["Simple"] = "simple"] = "Simple";
            Kind[Kind["Regex"] = "regex"] = "Regex";
        })(Models.Kind || (Models.Kind = {}));
        var Kind = Models.Kind;
        (function (RuleComparision) {
            RuleComparision[RuleComparision["Equals"] = "equals"] = "Equals";
            RuleComparision[RuleComparision["NotEquals"] = "notEquals"] = "NotEquals";
            RuleComparision[RuleComparision["GreaterThan"] = "greaterThan"] = "GreaterThan";
            RuleComparision[RuleComparision["LesserThan"] = "lesserThan"] = "LesserThan";
            RuleComparision[RuleComparision["GreaterThanOrEqualsTo"] = "greaterThanOrEqualsTo"] = "GreaterThanOrEqualsTo";
            RuleComparision[RuleComparision["LesserThanOrEqualsTo"] = "lesserThanOrEqualsTo"] = "LesserThanOrEqualsTo";
            RuleComparision[RuleComparision["Match"] = "match"] = "Match";
        })(Models.RuleComparision || (Models.RuleComparision = {}));
        var RuleComparision = Models.RuleComparision;
        (function (DataSourceType) {
            DataSourceType[DataSourceType["Question"] = "question"] = "Question";
            DataSourceType[DataSourceType["Config"] = "config"] = "Config";
        })(Models.DataSourceType || (Models.DataSourceType = {}));
        var DataSourceType = Models.DataSourceType;
    })(Models = SurveyEngine.Models || (SurveyEngine.Models = {}));
})(SurveyEngine || (SurveyEngine = {}));

angular.module("surveyClient")
    .factory("ruleUtility", function () {

        var ruleUtilityFactory = {};
        ruleUtilityFactory.pluck = function (path, data) {
            var parts = path.split('.');
            var index = 1; // Skip the first index
            var value = '';

            while (index < parts.length) {
                var part = parts[index];
                value = data[part];
                data = data[part];
                index++;
            }
            return value;
        }

        ruleUtilityFactory.Simple = function (params, data) {
            this.a = ruleUtilityFactory.pluck(params.path, data);
            this.b = params.match;
            this.equals = function () {
                return this.a === this.b;
            };
            this.notEquals = function () {
                return this.a !== this.b;
            };
            this.greaterThan = function () {
                return this.a > this.b;
            }
            this.lesserThan = function () {
                return this.a < this.b;
            }
            this.greaterThanOrEqualsTo = function () {
                return this.a >= this.b;
            }
            this.lesserThanOrEqualsTo = function () {
                return this.a <= this.b;
            }
        }

        ruleUtilityFactory.Regex = function (params, data) {
            this.params = params;
            this.data = data;
            this.match = function () {
                var comparisonValue = ruleUtilityFactory.pluck(this.params.path, this.data);
                var exp = new RegExp(this.params.pattern, this.params.flags || "i");
                if (!comparisonValue) {
                    return false;
                }

                var regexMatchResult = comparisonValue.match(exp);

                if (!regexMatchResult) {
                    return false;
                }

                var result = regexMatchResult.indexOf(this.params.match);

                if (result > -1) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        ruleUtilityFactory.toCamelCase = function (str) {
            return str
                .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
                .replace(/\s/g, '')
                .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
        }

        return ruleUtilityFactory;
    })
    .service("Rule", ["modelService", "ruleUtility", function (modelService, ruleUtility) {
        this.rule = null;
        this.simple = null;
        this.regex = null;
        this.inputData = null; // can either be a token, a config item, or a question

        this.setRule = function (rule) {
            this.rule = rule;
            return this;
        }

        this.setData = function () {
            var source = _(this.rule.params.path.split(".")).first();
            if (_.includes(source, "question")) {
                var expressionId = _(_(source.split("(")).last().split(")")).first();
                this.inputData = _(this.modelService.data.survey.section.questions).filter(function (x) { return x.expresionId === expressionId; });
            }
            else if (_.includes(source, "config")) {
                this.inputData = this.modelService.data.config;
            }
            return this;
        }

        this.exec = function (pass, fail) {
            pass = pass || angular.noop;
            fail = fail || angular.noop;

            if (this.rule && this.inputData) {
                var result = new ruleUtility[this.rule.ruleType](this.rule.params, this.inputData)[this.rule.params.comparision](); // eg. : new ruleUtility.Simple(params, data).equals()
                if (result === false) {
                    fail();
                    return false;
                } else {
                    pass();
                    return true;
                }
            } else {
                return false;
            }
        }
    }]);
angular.module("surveyClient").service("dataService", ["$http", "$q", "$log", function ($http, $q, $log) {
    var urlBase = "https://svc-dev.iehp.org/IEHPWebApiUAT/";
    this.setUrlBase = function (environment) {
        switch (environment.toUpperCase()) {
            case "DEV":
                urlBase = "https://devserv.iehp.org/IehpWebApiAlpha/Survey";
                break;
            case "UAT":
                urlBase = "https://devserv.iehp.org/IehpWebApiDev/Survey";
                break;
            case "PROD":
                urlBase = "";
            default:
        }
    };

    this.getTransactions = function (surveyId) {
        var filter = {
            SurveyId: surveyId
        };
        return $http.post(urlBase + "/Transactions", filter)
            .then(function (response) {
                return response.data;
            })
            .catch(function (response) {
                var errorMessage = "Error retrieving transactions. (HTTP status: " + response.status + ")";
                $log.error(errorMessage);
                return $q.reject();
            });
    };
    this.getQuestions = function (surveyId) {
        var filter = {
            SurveyId: surveyId
        };
        return $http.post(urlBase + "/GetQuestions", filter)
            .then(function (response) {
                return response.data;
            })
            .catch(function (response) {
                var errorMessage = "Error retrieving questions. (HTTP status: " + response.status + ")";
                $log.error(errorMessage);
                return $q.reject();
            });
    };
    this.getAnswers = function (surveyId) {
        var filter = {
            SurveyId: surveyId
        };
        return $http.post(urlBase + "/getAnswers", filter)
            .then(function (response) {
                return response.data;
            })
            .catch(function (response) {
                var errorMessage = "Error retrieving answers. (HTTP status: " + response.status + ")";
                $log.error(errorMessage);
                return $q.reject();
            });
    };
    this.saveAnswers = function (surveyId) {
        var filter = {
            SurveyId: surveyId
        };
        return $http.post(urlBase + "/saveAnswers", filter)
            .then(function (response) {
                return response.data;
            })
            .catch(function (response) {
                var errorMessage = "Error sending answers. (HTTP status: " + response.status + ")";
                $log.error(errorMessage);
                return $q.reject();
            });
    };
}]);

angular.module("surveyClient").factory("modelService", ["dataService", function (dataService) {

    // this is a centralised store for any number of survey directives present in the client
    var dataStore = [];

    // when a new directive is created, it requests a key which it uses to access its data content, at the same time its data store is initialised
    var getDataKey = function () {
        var newKey = this.dataStore.length;
        var dataForDirectiveInstance = {};
        dataStore.push(dataForDirectiveInstance);
        return newKey;
    };
    var getAttributes = function (question) {
        var parsedAttributes = JSON.parse(question.Attributes);
        var result = {
            visibilityConfig: parsedAttributes.visibilityConfig,
            type: parsedAttributes.type,
            rules: parsedAttributes.rules,
            specialProcess: parsedAttributes.specialProcess
        };
        return result;
    };
    var modelService = {
        dataStore: dataStore,
        getDataKey: getDataKey,
        getAttributes: getAttributes
    };
    return modelService;
}]);


/**
 * @desc Directive for creating table of radio input on a survey
 */
angular
    .module('surveyClient')
    .directive('scTableRadio', tableRadio);

function tableRadio() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'Directives/SurveyComponents/sc-table-radio.directive.html',
        scope: {
            obj: "=",
            answers: "="
        },
        link: linkFunc,
        controller: TableRadioController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {
    }
}

TextInputController.$inject = ['$scope'];

function TableRadioController($scope) {
    var vm = this;

    vm.vertRadio = true;
    vm.tableRadioList = vm.obj.AnswerSelections;
    vm.answers.QuestionId = vm.obj.QuestionId;
    vm.answers.GroupItemId = vm.obj.GroupItemId;
    vm.answers.ItemSequenceId = 0;
    vm.answers.AnswerValue = "";
    if (vm.tableRadioList[1].ItemSelection.DisplayName === "") {
        vm.vertRadio = false;
    }
}
/**
 * @desc Directive for text input on survey
 */
angular
    .module('surveyClient')
    .directive('scTextInput', textInput);

function textInput() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'Directives/SurveyComponents/sc-text-input.directive.html',
        scope: {
            question: "@"
        },
        link: linkFunc,
        controller: TextInputController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {

    }
}

TextInputController.$inject = ['$scope'];

function TextInputController($scope) {
    var vm = this;
}
angular.module("surveyClient").directive("surveyClient", ["modelService", "$compile", function (modelService, $compile) {
    return {
        templateUrl: "Directives/SurveyClient/SurveyClient.html",
        controller: "SurveyClientController",
        controllerAs: "vm",
        scope: {},
        bindToController: {
            surveyClientConfig: "="
        }
    };
}]);


angular.module("surveyClient").controller("SurveyClientController", ["$log", "modelService", function ($log, modelService) {
    this.$log = $log;

    this.pressMe = function () {
        modelService.data.config = "Directives/SurveyClient/test.html";
    }

    this.$log.info("Input surveyId = " + this.surveyClientConfig.surveyId);
    this.$log.info("Input versionId = " + this.surveyClientConfig.versionId);
}
]);
angular.module("surveyClient").run(["$templateCache", function ($templateCache) {
    $templateCache.put("Directives/new-survey.directive.html", "<div class=\"survey-questions\"></div>");
    $templateCache.put("Directives/survey-history.directive.html", "<div class=\"surveyHistory\">\r\n    <h1>Survey History goes here</h1>\r\n    <p>{{vm.transactions.list[0].surveyName}}</p>\r\n</div>");
    $templateCache.put("Modals/PickLanguage.html", "<div class=\"modal-header\">\r\n    <h3 class=\"modal-title\">Select survey language</h3>\r\n</div>\r\n<div class=\"modal-body\">\r\n    <div class=\"btn-group\">\r\n        <label class=\"btn btn-primary\" ng-model=\"vm.selectedLanguage\" uib-btn-radio=\"\'English\'\">English</label>\r\n        <label class=\"btn btn-primary\" ng-model=\"vm.selectedLanguage\" uib-btn-radio=\"\'Spanish\'\">Spanish</label>\r\n    </div>\r\n</div>\r\n<div class=\"modal-footer\">\r\n    <button class=\"btn btn-default\" ng-click=\"vm.ok\">OK</button>\r\n</div>");
    $templateCache.put("Directives/SurveyClient/SurveyClient.html", "<div>\r\n    Hello World\r\n    <br/>\r\n    Survey Id : {{vm.surveyClientConfig.surveyId}}\r\n    <br/>\r\n    Version Id : {{vm.surveyClientConfig.versionId}}\r\n    <br/>\r\n    <button ng-click=\"vm.pressMe()\">Press me</button>\r\n    <br/>\r\n\r\n    \r\n    <!--<h2>{{vm.modelService.data.survey.Survey.Name}}</h2>\r\n    <br/>\r\n    <div class=\"container\">\r\n        <div class=\"col-md-4\">\r\n            <div ng-repeat=\"section ing-repeat vmng-repeat.modelService.data.survey.Sections | orderby: \'SortOrder\'\" class=\"row\">\r\n                <a ng-href=\"#\" ng-click=\"vm.selectSection(section)\">{{section.SectionItem.Title}}</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"col-md-8\" ng-form name=\"vm.myForm\">\r\n            <div ng-repeat=\"question in vm.modelService.data.selectedSection.Questions\">\r\n                <div ng-switch=\"vm.getInputType(question)\" ng-class=\"{\'has-error\': vm.myForm.question[$index].$error.required}\">\r\n                    <div ng-switch-when=\"Text\">\r\n                        <input type=\"text\" ng-model=\"question.Answer\" regexvalidate question=\"question\"/>\r\n                    </div>\r\n                    <span ng-show=\"vm.myForm.question[$index].$error.regexvalidate\">{{vm.errorMessage(question)}}</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>-->\r\n</div>\r\n");
    $templateCache.put("Directives/SurveyClient/test.html", "<div>\r\n    BAM!\r\n</div>\r\n");
    $templateCache.put("Directives/SurveyComponents/sc-table-radio.directive.html", "<ng-form name=\"innerForm\">\r\n    <div class=\"form-group\">\r\n        <div class=\"col-md-12\">\r\n            <label class=\"control-label\">{{vm.obj.QuestionText}}</label>\r\n            <div class=\"invalid-text\">\r\n                This field is required\r\n            </div>\r\n        </div>\r\n        <div class=\"col-md-12\">\r\n            <div ng-if=\"vm.vertRadio\" class=\"radio\" ng-repeat=\"radio in vm.tableRadioList track by $index\">\r\n                <input type=\"radio\" name=\"option{{vm.obj.QuestionId}}\" ng-value=\"radio.ItemSelection.DisplayValue\" class=\"col-md-1\" style=\"position:relative\"/>\r\n                <label class=\"col-md-2\">{{radio.ItemSelection.DisplayName}}</label>\r\n                <br>\r\n            </div>\r\n            <div ng-if=\"!vm.vertRadio\" class=\"btn-group\">\r\n                <label ng-if=\"$index == 0\" ng-repeat-start=\"radio in vm.tableRadioList track by $index\">{{radio.ItemSelection.DisplayName}}</label>\r\n                <input type=\"radio\" name=\"option{{vm.obj.QuestionId}}\" ng-value=\"radio.ItemSelection.DisplayValue\"/>\r\n                <label ng-if=\"$index == vm.tableRadioList.length - 1\" ng-repeat-end>{{radio.ItemSelection.DisplayName}}</label>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</ng-form>\r\n");
    $templateCache.put("Directives/SurveyComponents/sc-text-input.directive.html", "<ng-form name=\"innerForm\">\r\n    <p>{{vm.question}}</p>\r\n    <input type=\"text\"/>\r\n</ng-form>");
}]);