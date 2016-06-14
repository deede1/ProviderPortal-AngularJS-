(function () {
	/***********************************INITIALIZE IN MEMBER PORTAL SCOPE************************************************/
	var app = angular.module('MemberPortalDirectives');
	var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
	var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');


	/***************************DIRECTIVE DEFINITIONS***********************************************/
	app.directive('myMaxlength', ['$compile', '$log', function ($compile, $log) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				attrs.$set("ngTrim", "false");
				var maxlength = parseInt(attrs.myMaxlength, 10);
				ctrl.$parsers.push(function (value) {

					if (value.length > maxlength) {

						value = value.substr(0, maxlength);
						ctrl.$setViewValue(value);
						ctrl.$render();
					}
					return value;
				});
			}
		};
	}]);

	app.directive("renderCheckBoxCombo", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUICheckBoxCombo' + cacheBust,
		};
	});

	app.directive("renderDisableChildrenRadio", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIDisableChildrenRadio.html' + cacheBust,
		};
	});

	app.directive("renderTrueFalseRadio", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUI2ChoiceRadio.html' + cacheBust,
		};
	});

	app.directive("renderAgree", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIAgreement.html' + cacheBust,
		};
	});

	app.directive("renderComputedRadioTable", function () {

		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIComputedRadioTable.html' + cacheBust,
		};
	});

	app.directive("renderCheckboxMultigroup", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUICheckBoxMultiGroup.html' + cacheBust,
		};
	});

	app.directive("renderCalendar", function () {
		return {

			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUICalendar.html' + cacheBust,
			controller: 'surveyCalendarController',
			controllerAs: 'surveyCalendarCtrl'
		};
	});

	app.directive('pickdate', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModelCtrl) {

			}
		};
	});

	app.directive("renderTable", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUITable.html' + cacheBust
		};
	});

	app.directive("renderCheckbox", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUICheckBoxQuestions.html' + cacheBust
		};
	});

	app.directive("renderComputedRadio", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIRadioComputedField.html' + cacheBust
		}
	});

	app.directive("renderRadio", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIRadioQuestion.html' + cacheBust
		}
	});

	app.directive("renderComputedUserInput", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUITextComputedfield.html' + cacheBust
		};
	});

	app.directive("renderUserInput", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIUserInput.html' + cacheBust
		};
	});

	app.directive("showSurveyHistory", function () {
		return {
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyHistory.html' + cacheBust,
			controller: 'surveyHistoryController',
			controllerAs: 'surveyHistoryCtrl'
		};
	});

	app.directive("surveyFormSidePanel", function () {
		return {
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUISidePanelMemberPortal.html' + cacheBust
		};
	});

	app.directive("historySummary", function () {
		return {
			scope: true,
			controller: 'surveyHistoryController',
			controllerAs: 'surveyHistoryCtrl',
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIHistorySummary.html' + cacheBust
		}
	});

	app.directive("surveyFinish", function () {
		return {
			scope: true,
			controller: ['$scope', function ($scope) {
			}],
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIFinish.html' + cacheBust
		}
	});

	app.directive("surveyForm", function () {
		return {
			restrict: "EA",
			templateUrl: urlBase + '/App/directives/survey-ui/surveyUIv2.html' + cacheBust,
			controller: 'surveyUIController',
			controllerAs: 'SurveyCtrl'
		};
	});

	/*********************************ANGULAR FACTORY THAY HANDLES HTTP REQUESTS SURVEY UI**************************************************/
	//app.factory('surveyService', [
	//	'$http', function ($http) {
	//		var surveyService = {};

	//		//
	//		surveyService.getSurveySection = function (params) {
	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/Get?';
	//			var serviceBase = 'http://svc-dev.iehp.org/SurveyService/ClientSurvey/Get?';

	//			serviceBase += 'surveyId=' + params.SurveyId
	//				+ '&languageCode=' + params.Language
	//				+ '&respondentValue=' + params.MemberId
	//				+ '&respondentTransId=' + params.RespondentTransId
	//				+ '&respondentTypeId=' + params.RespondentTypeId;

	//			return $http.get(serviceBase);
	//		};
	//		//request initial survey section
	//		surveyService.requestSurveySection = function (params) {

	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/Section?';
	//			var serviceBase = 'http://svc-dev.iehp.org/SurveyService/ClientSurvey/Section?';


	//			serviceBase += 'surveyId=' + params.SurveyId
	//				+ '&languageCode=' + params.Language
	//				+ '&respondentValue=' + params.MemberId
	//				+ '&respondentTransId=' + params.RespondentTransId
	//				+ '&respondentTypeId=' + params.RespondentTypeId
	//				+ '&sectionId=' + params.SectionId;

	//			return $http.get(serviceBase);
	//		}


	//		surveyService.requestSurveySummary = function (params) {
	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/Summary?';
	//			var serviceBase = 'http://svc-dev.iehp.org/SurveyService/ClientSurvey/Summary?';

	//			serviceBase += 'surveyId=' + params.SurveyId
	//				+ '&languageCode=' + params.Language
	//				+ '&respondentValue=' + params.MemberId
	//				+ '&respondentTransId=' + params.RespondentTransId
	//				+ '&respondentTypeId=' + params.RespondentTypeId;

	//			return $http.get(serviceBase);
	//		}

	//		surveyService.createSurvey = function (params) {
	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/Create?';
	//			var serviceBase = 'https://svc-dev.iehp.org/SurveyService/ClientSurvey/Create?';

	//			serviceBase += 'surveyId=' + parseInt(params.SurveyId)
	//				+ '&language=' + params.Language
	//				+ '&respondentValue=' + params.MemberId
	//				+ '&respondentCode=' + params.RespondentCode
	//				+ '&respondentTypeId=' + params.RespondentTypeId
	//				+ '&version=' + params.VersionId;

	//			return $http.get(serviceBase);
	//		}

	//		surveyService.getSurveyHistory = function (params) {
	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/History?';
	//			var serviceBase = 'http://svc-dev.iehp.org/SurveyService/ClientSurvey/History?';

	//			serviceBase += 'respondentValue=' + params.RespondentValue
	//				 + '&surveyId=' + params.SurveyId;

	//			return $http.get(serviceBase);
	//		}

	//		//Get list of surveys
	//		surveyService.getSurveyList = function (surveyId) {
	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/List?';
	//			var serviceBase = 'http://svc-dev.iehp.org/SurveyService/ClientSurvey/List?';

	//			serviceBase += 'surveyId=' + surveyId;

	//			return $http.get(serviceBase);
	//		}

	//		surveyService.CancelSurvey = function (respondentInfo) {
	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/Cancel?';
	//			var serviceBase = 'http://svc-dev.iehp.org/SurveyService/ClientSurvey/Cancel?';

	//			return $http.post(serviceBase, respondentInfo);
	//		}

	//		//save survey as you go
	//		surveyService.SaveSurveySectionAnswers = function (answers) {

	//			//var serviceBase = 'http://svc-dev.iehp.org/SurveyServiceUAT/ClientSurvey/Answers';
	//			var serviceBase = 'http://svc-dev.iehp.org/SurveyService/ClientSurvey/Answers';

	//			return $http.post(serviceBase, answers);
	//		}

	//		return surveyService;
	//	}
	//]);


	//Main Controller
	app.controller('surveyUIController', [
		'$scope', 'authStatusService', 'memberDataService', '$routeParams', '$rootScope', '$location',
		function ($scope, authStatusService, memberDataService, $routeParams, $rootScope, $location) {


			/*********************************INITIALIZE SURVEY SCOPE AND INNER FUNCTOIN VARIABLES****************************************/

			$scope.SurveyName = "";                             //name of the survey         
			$scope.sectionOn = 0;                               //the current section the user is on
			$scope.CurrentSectionFromSurvey = 0;
			$scope.totalSections = 0;                           //total number of sections            
			$scope.ActiveSection = [];                          //the Section currently being rendered   
			$scope.SurveySectionTitles = [];                    //Titles of the different sections
			$scope.validForm = false;                           //set initial form validation to true
			$scope.SurveyIsFinshed = false;                     //boolean to keep track if the survey is finished    
			$scope.memberSubNo = authStatusService.status.claims.username; //get subno from authservice service
			$scope.internalUser = authStatusService.status.claims.internaluser;
			$scope.userLoggedIn = authStatusService.status.claims.username;
			$scope.language = $rootScope.currentLanguage.substr(0, 2).toUpperCase();
			$scope.surveySectionRecieved = false;
			$scope.SurveySummaryInformation = [];               //initialize summary information array
			$scope.demo = {};
			$scope.Gender = null;
			$scope.Age = 0;
			$scope.SurveyError = false;
			$scope.ErrorMsg = "";
			$scope.formattedDOB = "";
			$scope.Today = new Date();

			var valueIdvalue = "";

			//extract sruvey css and data
			$scope.surveySectionHTML = "";
			$scope.surveyCSS = "";
			//

			var respondentType = 1;
			var inSurveyId = parseInt($routeParams.surveyId);
			var inVersionId = parseInt($routeParams.versionId);
			var surveyType = parseInt($routeParams.typeId);

			function changeDateFormat(input) {
				var parts = input.match(/(\d+)/g);
				return new Date(parts[0], parts[1] - 1, parts[2]);
			}

			function calculateAge(val) {

				var formDate = new changeDateFormat(val);
				var todaysDate = new Date();
				var diff = todaysDate - formDate;
				var age = Math.floor(diff / 31536000000);
				return age;
			}

			$scope.extractHtml = function () {
				$scope.surveySectionHTML = "<!DOCTYPE html>" +
				"<html xmlns='http://www.w3.org/1999/xhtml'>" +
				"<head>" + $scope.surveyCSS +
				"</head>" +
				"<body>" + $("#survey-window").html() +
				"</body>" +
				"</html>";

				$scope.surveySectionHTML = $("#survey-window").html();

			}

			$scope.extractCSS = function () {

				$("link").each(function (key, value) {
					var obj = $(value);
					var href = obj.attr('href');
					if (href.indexOf("Survey") > -1) {
						$scope.surveyCSS =
						"<link href=" + href + " rel=stylesheet>";
					}
				});
			}

			memberDataService.GetDemographics().success(function (data) {

				$scope.demo = data;
				$scope.DateOfBirth = $scope.demo.DateOfBirth;
				$scope.formattedDOB = new Date($scope.DateofBirth);
				$scope.Age = calculateAge($scope.demo.DateOfBirth);

			});

			memberDataService.getCurrentEligibility().success(function (data) {
				$scope.Gender = data[0].Gender;
			});

			/// CUSTOM FUNCTIONALITY
			function disableGenderSpeficQuestions() {

				if ($scope.sectionOn === 4) {
					if ($scope.Gender === 'M') {

						$scope.ActiveSection.Questions.splice(0, 6);
					}
					else if ($scope.Age < 40) {
						$scope.ActiveSection.Questions.splice(0, 3);
					}
				}
				else if ($scope.sectionOn === 3) {

					if ($scope.Gender === 'M') {
						$scope.ActiveSection.Questions.splice(4, 1);
					}
				}
			};

			$scope.redirectHome = function () {

				var respondentInfo = {
					"RespondentTransId": $scope.SurveySection.RespondingUser.RespondentTransId,
					"isHidden": true
				}

				memberDataService.CancelSurvey(respondentInfo).success(function () {
					var link = 'App/HealthCare/HASurvey/History';
					$location.path(link);
				});
			}

			///***************FUNCTION THAT POINTS TO EITHER NEW SURVEY, PENDING SURVEY, OR SURVEY SUMMARY********************************/

			function initializeTypeOfSurvey(surveyType) {
				//type will be stored in parameters
				//call init function depending on survey type

				switch (surveyType) {
					case 1:

						CreateSurvey(inSurveyId, $scope.language, $scope.memberSubNo, null, respondentType, inVersionId);
						break;

					case 2:

						var transId = parseInt($routeParams.transId);
						GetSurveySection(inSurveyId, $scope.language, $scope.memberSubNo, transId);
						break;

					default:
						break;
				}

			}

			/*********************************************INITIAL SECTION CALL AND INITIALIZATION METHODS ******************************/
			//determines which inputs have been answered and adds an "isChecked" property in order to properly validate in ng-form

			function validateCheckBoxMultiGroup() {

				$scope.MultiGroupArray = [];

				if ($scope.MultiGroupArray.length === 0) {
					for (var i = 0; i < $scope.ActiveSection.Questions.length; i++) {
						if ($scope.ActiveSection.Questions[i].DisplayTypeCode === 'Table-OneColumnDisplay' ||
							$scope.ActiveSection.Questions[i].DisplayTypeCode === 'Table-TwoColumnDisplay') {
							$scope.MultiGroupArray.push($scope.ActiveSection.Questions[i]);
						}
					}
				}

				$scope.ValidMultiGroup = false;
				for (var j = 0; j < $scope.MultiGroupArray.length; j++) {
					for (var k = 0; k < $scope.MultiGroupArray[j].Answers.length; k++) {

					    if ($scope.MultiGroupArray[j].Answers[k].ValueId !== valueIdvalue) {
							$scope.ValidMultiGroup = true;
							break;
						}
					}

				}
			}

			function findNumericInput() {

				if ($scope.sectionOn === 3) {

					var questions = $scope.ActiveSection.Questions;

					for (var i = 0; i < questions.length; i++) {
						for (var k = 0; k < questions[i].Answers.length; k++) {
							if (questions[i].Answers[k].ItemDisplayValue === 'Pounds') {

								questions[i].Answers[k].maxLength = 7;
								questions[i].Answers[k].range = '1999.99';
								questions[i].Answers[k].pattern = /^(1[0-9]{3}|[0-9]{3}|[0-9]{2}|[0-9]{1})(\.\d{0,2})?$/;
							} else if (questions[i].Answers[k].ItemDisplayValue === 'Feet') {

								questions[i].Answers[k].maxLength = 2;
								questions[i].Answers[k].range = '10';
								questions[i].Answers[k].pattern = /^([1-9]|10)$/;

							} else if (questions[i].Answers[k].ItemDisplayValue === 'Inches') {

								questions[i].Answers[k].maxLength = 5;
								questions[i].Answers[k].range = '11.99';
								questions[i].Answers[k].pattern = /^(11|10|\d)(\.\d{1,2})?$/;

							}


						}
					}
				}
			}

			function findQuestionChildren() {

				var questions = $scope.ActiveSection.Questions;

				for (var i = 0; i < questions.length; i++) {
					var children = [];
					questions[i].Children = [];
					for (var k = i; k < questions.length; k++) {

						if (questions[i].QuestionId === questions[k].ParentQuestionId) {

							if (k < questions.length - 1) {

								children.push(questions[k]);

							} else if (k === questions.length - 1) {

								children.push(questions[k]);
								questions[i].Children = children;
								questions[i].hasChildren = true;

							}
						} else {

							if (children.length > 0) {

								questions[i].Children = children;
								questions[i].hasChildren = true;
							}
						}
					}
				}
			}

			function addIsCheckedToSurveyObject() {

				for (var i = 0; i < $scope.ActiveSection.Questions.length; i++) {

					$scope.ActiveSection.Questions[i].Answers.isChecked = false;
					$scope.ActiveSection.Questions[i].isChecked = false;

					for (var j = 0; j < $scope.ActiveSection.Questions[i].Answers.length; j++) {

					    if ($scope.ActiveSection.Questions[i].Answers[j].ValueId !== valueIdvalue) {
							$scope.ActiveSection.Questions[i].isChecked = true;
							$scope.ActiveSection.Questions[i].AnswerIndex = j;
							$scope.ActiveSection.Questions[i].Answers.isChecked = true;
							$scope.ActiveSection.Questions[i].Answers[j].isChecked = true;
						}
					}
				}
				validateCheckBoxMultiGroup();
			}


			function setInitialSection() {
				var idx = -1;
				var sectionId = $scope.SurveySection.Sections[0].SectionId;

				for (var i = 0; i < $scope.SurveySection.SurveySimpleList.length; i++) {
					if ($scope.SurveySection.SurveySimpleList[i].SectionId === sectionId) {
						idx = i;
					}
				}
				return idx;
			}

			function findTableStart() {
				var questions = $scope.SurveySection.Sections[0].Questions;
				var tableSegmentCount = 0;
				for (var i = 0; i < questions.length; i++) {
					if (questions[i].DisplayTypeCode.indexOf("Table-FiveColumnDisplay") > -1) {
						tableSegmentCount++;
						if (tableSegmentCount !== 1) {
							questions[i].DisplayTypeCode = "tableChild";
						}
					} else {
						tableSegmentCount = 0;
					}
				}
			}

			function checkForNoaDisabledButtons() {

				var questions = $scope.SurveySection.Sections[0].Questions;
				for (var i = 0; i < questions.length; i++) {

					if (questions[i].InputType === 'checkbox') {

						for (var j = 0; j < questions[i].Answers.length; j++) {

						    if (questions[i].Answers[j].ValueId !== valueIdvalue && questions[i].Answers[j].ItemDisplayValue === 'None of the above') {
								for (var k = 0; k < questions[i].Answers.length; k++) {
									if (questions[i].Answers[k].ItemSequenceId !== questions[i].Answers[j].ItemSequenceId) {
										questions[i].Answers[k].isDisabled = true;
									}
								}
							}
						}
					}
				}
			}

			function disableChildrenOnLoad() {

				var question = $scope.ActiveSection.Questions;
				var disableChildren = false;

				for (var x = 0; x < question.length; x++) {

					if (question[x].InputType === 'DisableChildren') {

						for (var y = 0; y < question[x].Answers.length; y++) {
						    if (question[x].Answers[y].ItemDisplayName === 'No' && question[x].Answers[y].ValueId !== valueIdvalue) {
								disableChildren = true;
							}
						}

						if (disableChildren) {

							for (var z = 0; z < question[x].Children.length; z++) {
								for (var a = 0; a < question[x].Children[z].Answers.length; a++) {
									question[x].Children[z].isDisabled = true;
									question[x].Children[z].Answers.isDisabled = true;
									question[x].Children[z].Answers.isChecked = true;
									question[x].Children[z].Answers[a].isDisabled = true;
									question[x].Children[z].Answers[a].isChecked = true;
								}

								if (question[x].Children[z].Children.length > 0) {
									for (var b = 0; b < question[x].Children[z].Children.length; b++) {
										question[x].Children[z].Children[b].Answers.isDisabled = true;
										question[x].Children[z].Children[b].Answers.isChecked = true;


										for (var c = 0; c < question[x].Children[z].Children[b].length; c++) {
											question[x].Children[z].Children[b].Answers[c].isDisabled = true;
											question[x].Children[z].Children[b].Answers[c].isChecked = true;
										}
									}
								}

							}
						}
					}
					disableChildren = false;
				}
			}

			function setInitialValues(data) {

				$scope.SurveySection = data;
				$scope.surveySectionRecieved = true;

				if ($scope.SurveySection.Sections.length > 0) {


					$scope.ActiveSectionName = $scope.SurveySection.Sections[0].Title;
					$scope.ActiveSection = $scope.SurveySection.Sections[0];

					addIsCheckedToSurveyObject();
					checkForNoaDisabledButtons();
					findQuestionChildren();
					disableChildrenOnLoad();
					findNumericInput();
					findTableStart();


					$scope.sectionOn = setInitialSection() + 1;
					$scope.SurveySectionTitles = $scope.SurveySection.SurveySimpleList;
					$scope.SurveySectionTitles.push({
						"SectionId": "last", "SectionName": "Summary"
					});

					//add the summary side nav element
					$scope.totalSections = $scope.SurveySection.SurveySimpleList.length;
					$scope.SurveyName = $scope.SurveySection.Name;
					$scope.SurveyDetail = $scope.SurveySection.Version;
				}
			}

			function CreateSurvey(surveyId, language, respondentValue, respondentCode, respondentTypeId, versionId) {

				var parmObj = {

					"SurveyId": surveyId,
					"Language": language,
					"MemberId": respondentValue,
					"RespondentCode": respondentCode,
					"RespondentTypeId": respondentTypeId,
					"VersionId": versionId
				}

				memberDataService.createSurvey(parmObj).success(function (data) {

					setInitialValues(data);

				}).error(function (error) {

					$scope.SurveyName = " Survey Not Available";
					$scope.SurveyError = true;
					$scope.ErrorMsg = error;
					console.log(error);

				});
			}

			//get survey section by section
			function GetSurveySection(surveyId, language, respondentValue, transId) {

				var firstSectionObj = {
					"SurveyId": surveyId,
					"Language": language,
					"MemberId": respondentValue,
					"RespondentTransId": transId,
					"RespondentTypeId": 1
				}

				memberDataService.getSurveySection(firstSectionObj).success(function (data) {

					setInitialValues(data);

				}).error(function (error) {
					$scope.SurveyName = " Survey Not Available";
					$scope.SurveyError = true;
					$scope.ErrorMsg = error;
					console.log(error);
				});

			}

			initializeTypeOfSurvey(surveyType);
			/***************************************ANSWER TRACKING METHODS*********************************/
			function validateCheckBoxGroup(elem, question, idx) {

				question.isChecked = false;
				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].isChecked) {
						question.isChecked = true;
					}
				}
			}

			//tracks the states of a radio button, adds is checked if it is checked
			function trackRadioButtonState(elem, question) {
				question.Answers.isChecked = false;
				for (var n = 0; n < question.Answers.length; n++) {
					question.Answers[n].isChecked = false;
				}
				question.isChecked = false;
				for (var i = 0; i < question.Answers.length; i++) {
				    if (question.Answers[i].ValueId !== null && question.Answers[i].ValueId !== valueIdvalue) {
						question.Answers[i].isChecked = true;
						question.Answers.isChecked = true;
						question.isChecked = true;
					}
				}

			}

			$scope.RecordDropDown = function (elem, question) {

				for (var i = 0; i < question.Answers.length; i++) {

					if (question.Answers[i].ItemSequenceId === elem.radioButton.ItemSequenceId) {
						question.Answers[i].ValueId = elem.radioButton.ItemSequenceId;

					} else {
					    question.Answers[i].ValueId = valueIdvalue;
					}
				}
				trackRadioButtonState(elem, question);
			}

			/*******************************checkbox combo*********************************/
			function toggleNoaAnswers(ischecked, sequenceId, question) {

				if (ischecked) {

					for (var i = 0; i < question.Answers.length ; i++) {
						if (question.Answers[i].ItemSequenceId !== sequenceId) {
							question.Answers[i].isDisabled = true;
							question.Answers[i].ValueId = valueIdvalue;
							question.Answers[i].isChecked = false;
						}

					}

				} else {
					for (var j = 0; j < question.Answers.length; j++) {
						if (question.Answers[j].ItemSequenceId !== sequenceId) {
							question.Answers[j].isDisabled = false;
							question.Answers[j].ValueId = valueIdvalue;
						}

					}

				}
			}

			$scope.RecordCheckBoxCombo = function (elem, question, idx) {

				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].ItemSequenceId === elem.$parent.answer.ItemSequenceId) {

						if (question.Answers[i].ValueId === elem.$parent.answer.ItemSequenceId) {
						    question.Answers[i].ValueId = valueIdvalue;
							question.Answers[i].isChecked = false;
						} else {
							question.Answers[i].ValueId = elem.$parent.answer.ItemSequenceId;
							question.Answers[i].isChecked = true;
						}
					}
				}

				validateCheckBoxGroup(elem, question, idx);

				if (elem.elem.$parent.answer.DisplayTypeCode === 'Combo - CheckBox|Text')
					toggleNoaAnswers(elem.$parent.answer.isChecked, elem.$parent.answer.ItemSequenceId, question);

			}

			/*****checkbox multi group***************/

			$scope.RecordCheckBoxMultiGroupClick = function (elem, question, idx) {



				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].ItemSequenceId === elem.$parent.answer.ItemSequenceId) {
						if (question.Answers[i].ValueId === elem.$parent.answer.ItemSequenceId) {

						    question.Answers[i].ValueId = valueIdvalue;
							question.Answers[i].isChecked = false;

						} else {
							question.Answers[i].ValueId = elem.$parent.answer.ItemSequenceId;
							question.Answers[i].isChecked = true;

						}
					}
				}
				validateCheckBoxMultiGroup(elem, question, idx);
			}

			/****Radio Button*****/
			$scope.RecordRadioClick = function (elem, question) {

				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].ItemSequenceId === elem.answer.ItemSequenceId) {
						question.Answers[i].ValueId = elem.answer.ItemSequenceId;
					} else {
					    question.Answers[i].ValueId = valueIdvalue;
					}
				}
				trackRadioButtonState(elem, question);
			}

			function disableChildren(elem, question) {

				for (var i = 0; i < question.Children.length; i++) {

					if (elem.answer.ItemDisplayValue === "No") {

						question.Children[i].isDisabled = true;
						question.Children[i].Answers.isDisabled = true;
						question.Children[i].Answers.isChecked = true;

						for (var n = 0; n < question.Children[i].Answers.length; n++) {
						    question.Children[i].Answers[n].ValueId = valueIdvalue;
						    question.Children[i].Answers[n].Value = valueIdvalue;
						}

						if (question.Children[i].Children.length > 0) {

							for (var j = 0; j < question.Children[i].Children.length; j++) {
								question.Children[i].Children[j].Answers.isDisabled = true;
								question.Children[i].Children[j].Answers.isChecked = true;
								for (var m = 0; m < question.Children[i].Children[j].Answers.length; m++) {
								    question.Children[i].Children[j].Answers[m].ValueId = valueIdvalue;
								}
							}
						}
					} else {

						question.Children[i].isDisabled = false;
						question.Children[i].Answers.isDisabled = false;
						question.Children[i].Answers.isChecked = false;

						for (var n = 0; n < question.Children[i].Answers.length; n++) {
						    question.Children[i].Answers[n].ValueId = valueIdvalue;
							question.Children[i].Answers[n].isChecked = false;
						}


						if (question.Children[i].Children.length > 0) {

							for (var j = 0; j < question.Children[i].Children.length; j++) {
								question.Children[i].Children[j].Answers.isDisabled = false;
								question.Children[i].Children[j].Answers.isChecked = false;
								for (var m = 0; m < question.Children[i].Children[j].Answers.length; m++) {
								    question.Children[i].Children[j].Answers[m].ValueId = valueIdvalue;
									question.Children[i].Children[j].Answers[m].isChecked = false;
								}
							}
						}
					}

				}
			}

			$scope.RecordRadioClickDisableChildren = function (elem, question) {

				for (var i = 0; i < question.Answers.length; i++) {

					if (question.Answers[i].ItemSequenceId === elem.answer.ItemSequenceId) {
						question.Answers[i].ValueId = elem.answer.ItemSequenceId;

					} else {
					    question.Answers[i].ValueId = valueIdvalue;
					}
				}

				trackRadioButtonState(elem, question);
				disableChildren(elem, question);
			}

			/****Radio Button Group on Table*****/
			$scope.RecordRadioClickTable = function (elem, question) {

				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].ItemSequenceId === elem.as.ItemSequenceId) {
						question.Answers[i].ValueId = elem.as.ItemSequenceId;
					} else {

					    question.Answers[i].ValueId = valueIdvalue;
					}
				}
				trackRadioButtonState(elem, question);
			}

			/****Text Input *****/
			$scope.RecordInput = function (elem, question) {

				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].ItemSequenceId === elem.answer.ItemSequenceId) {
						question.Answers[i].ValueId = elem.answer.ValueId;
					}
				}
			}


			/***Record date input*/
			$scope.RecordCalendar = function (elem, question) {

				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].ItemSequenceId === elem.answer.ItemSequenceId) {
						question.Answers[i].ValueId = elem.answer.ValueId;
					}
				}
			}

			/****Check Box Group Type*****/
			$scope.RecordCheckBoxClick = function (elem, question, idx) {

				for (var i = 0; i < question.Answers.length; i++) {
					if (question.Answers[i].ItemSequenceId === elem.$parent.answer.ItemSequenceId) {
						if (question.Answers[i].ValueId === elem.$parent.answer.ItemSequenceId) {

						    question.Answers[i].ValueId = valueIdvalue;
							question.Answers[i].isChecked = false;

						} else {
							question.Answers[i].ValueId = elem.$parent.answer.ItemSequenceId;
							question.Answers[i].isChecked = true;
						}
					}
				}
				validateCheckBoxGroup(elem, question, idx);
			}
			$scope.RecordCheckBoxClickNOA = function (elem, question, idx) {

				for (var i = 0; i < question.Answers.length; i++) {


					if (question.Answers[i].ItemSequenceId === elem.$parent.answer.ItemSequenceId) {

						if (question.Answers[i].ValueId === elem.$parent.answer.ItemSequenceId) {

						    question.Answers[i].ValueId = valueIdvalue;
							question.Answers[i].isChecked = false;
						} else {
							question.Answers[i].ValueId = elem.$parent.answer.ItemSequenceId;
							question.Answers[i].isChecked = true;
						}
					}
				}
				validateCheckBoxGroup(elem, question, idx);
				toggleNoaAnswers(elem.$parent.answer.isChecked, elem.$parent.answer.ItemSequenceId, question);
			}


			//used for radio group tables
			/****Checkbox Group in a Table*****/
			$scope.RecordTableClick = function (elem, question, idx) {
				for (var i = 0; i < question.Answers.length; i++) {
					question.Answers[i].ValueId = "";
					question.Answers[i].isChecked = false;

					if (question.Answers[i].ItemSequenceId === elem.as.ItemSequenceId) {
						question.Answers[i].ValueId = elem.as.ItemSequenceId;
						question.Answers[i].isChecked = true;

					}
				}
				validateCheckBoxGroup(elem, question, idx);
			}



			/*************************************************NAVIGATION METHODS****************************************************/
			$scope.nextClicked = false;

			$scope.NextQuestionSection = function (isFormValid) {

				$scope.nextClicked = true;
				if ($scope.sectionOn !== $scope.totalSections && isFormValid) {

					$scope.surveyform.$setPristine();
					$scope.surveySectionRecieved = false;

					memberDataService.SaveSurveySectionAnswers($scope.SurveySection).success(function (data) {

						var getNextSection = $scope.sectionOn;
						var params = {
							"SurveyId": inSurveyId,
							"Language": $scope.language,
							"MemberId": $scope.memberSubNo,
							"RespondentTransId": $scope.SurveySection.RespondingUser.RespondentTransId,
							"RespondentTypeId": $scope.SurveySection.RespondingUser.RespondentTypeId,
							"SectionId": $scope.SurveySection.SurveySimpleList[getNextSection].SectionId
						}
						$scope.SurveySection = [];
						memberDataService.requestSurveySection(params).success(function (data) {

						    console.log(data);
							$scope.surveySectionRecieved = true;
							$scope.nextClicked = false;
							$scope.sectionOn++;
							$scope.SurveySection = [];
							$scope.SurveySection = data;
							$scope.ActiveSectionName = $scope.SurveySection.Sections[0].Title;
							$scope.ActiveSection = [];
							$scope.ActiveSection = $scope.SurveySection.Sections[0];
							$scope.validForm = true;



							addIsCheckedToSurveyObject();
							checkForNoaDisabledButtons();
							findQuestionChildren();
							disableChildrenOnLoad();
							findNumericInput();
							disableGenderSpeficQuestions();
							findTableStart();

							$("html, body").animate({ scrollTop: 0 });

						}).error(function (error) {

							$scope.SurveyError = true;
							$scope.ErrorMsg = error;
						});
					}).error(function (error) {

						$scope.SurveyError = true;
						$scope.ErrorMsg = error;

					});

				} else {

					$scope.validForm = false;
				}
			}

			$scope.PreviousQuestionSection = function () {


				var getPrevSection = $scope.sectionOn;
				getPrevSection -= 2;
				$scope.surveySectionRecieved = false;

				var prevSecionObj = {
					"SurveyId": inSurveyId,
					"Language": $scope.language,
					"MemberId": $scope.memberSubNo,
					"RespondentTransId": $scope.SurveySection.RespondingUser.RespondentTransId,
					"RespondentTypeId": $scope.SurveySection.RespondingUser.RespondentTypeId,
					"SectionId": $scope.SurveySection.SurveySimpleList[getPrevSection].SectionId
				}
				$scope.SurveySection = [];
				memberDataService.requestSurveySection(prevSecionObj).success(function (data) {
					$scope.surveySectionRecieved = true;
					if ($scope.sectionOn > 1) {

						$scope.surveyform.$setPristine();
						$scope.sectionOn--;
						$scope.validForm = true;
						$scope.SurveySection = [];
						$scope.SurveySection = data;
						$scope.ActiveSection = [];
						$scope.ActiveSection = $scope.SurveySection.Sections[0];
						$scope.ActiveSectionName = $scope.SurveySection.Sections[0].Title;


						addIsCheckedToSurveyObject();
						checkForNoaDisabledButtons();
						findQuestionChildren();
						disableChildrenOnLoad();
						findNumericInput();
						disableGenderSpeficQuestions();
						findTableStart();


						$("html, body").animate({ scrollTop: 0 });


					}
				}).error(function (error) {
					$scope.SurveyError = true;
					$scope.ErrorMsg = error;
					console.log(Error);
				});
			}


			//finish survey
			$scope.PrintLogoUrl = $('meta[name="ApplicationRoot"]').attr('content') + '/Content/Images/IEHP_LOGO_Survey.png';
			$scope.FinishSurvey = function (isFormValid) {
				//save last survey question
				$scope.nextClicked = true;
				if ($scope.sectionOn === ($scope.totalSections - 1) && isFormValid) {

					$scope.surveySectionRecieved = false;
					var nextSection = $scope.ActiveSection.SectionId;
					nextSection++;
					$scope.SurveySection.IsCompleted = true;

					memberDataService.SaveSurveySectionAnswers($scope.SurveySection).success(function (data) {
						$scope.sectionOn++;
						$scope.ActiveSectionName = "Summary";

						var params = {
							"SurveyId": inSurveyId,
							"Language": $scope.language,

							"RespondentTransId": $scope.SurveySection.RespondingUser.RespondentTransId,
							"RespondentTypeId": $scope.SurveySection.RespondingUser.RespondentTypeId
						};

						memberDataService.requestSurveySummary(params).success(function (data) {


							$scope.SurveySummaryInformation = data;
							$scope.SurveyIsFinshed = true;
							$("html, body").animate({ scrollTop: 0 });

						}).error(function (error) {
							console.log(error);
							$scope.SurveyError = true;
							$scope.ErrorMsg = error;
						});
					}).error(function (error) {
						$scope.SurveyError = true;
						console.log(error);
						$scope.ErrorMsg = error;
					});

				} else {
					$scope.SurveyIsFinshed = false;
				}
			}



			/************************Print Summary************************/
			$scope.PrintSummary = function () {

				var documentContainer = document.getElementById('divtoprint');
				var windowObject = window.open("", "PrintWindow");
				windowObject.document.writeln(
					'<style> ' +
					'.survey-summary-history-info {text-align:center;font-weight:bold;margin:0;color: #00477E;}' +
					'.survey-completed-date{text-align:center; font-size:12px;}' +
					'.survey-print-logo{height:70px;}' +
					'.survey-summary-list {list-style-type: none;padding: 10px;}' +
					'.survey-summary-history-indent {padding-left: 18px;}' +
					'.survey-summary-history-name {margin: 0px 0px 15px;}' +
					'.non-printable{display:none;}' +
					'.survey-print-logo-wrapper{text-align:center;margin-bottom:8px!important;}' +

					'@media print {' +
					'.non-printable {display: none;}' +
					'.survey-summary-history-indent{padding-left:20px;}' +
					'.survey-print-logo{height:55px;}' +
					'.survey-print-logo-wrapper{margin-bottom:8px!important;}' +
					'.survey-summary-history-header{margin:0 !important;font-size:12px;}' +
					'.survey-summary-list{list-style:none;}' +
					'.survey-hr-non-printable {display: none;}' +
					'.survey-summary-history-info{margin-bottom:8px;text-align:center !important;font-size:14px;}' +
					'.center-span{display:none;}' +
					'.survey-summary-history-labels{ font-size:10;font-weight:300;margin-bottom:5px;}' +
					'.survey-completed-date{text-align:center; font-size:12px;}' +
					'.survey-list-no-bullet { list-style:none;}' +
					'</style>' +

				   documentContainer.innerHTML);
				windowObject.document.close();
				windowObject.focus();
				windowObject.print();
				windowObject.close();
			}
			/*******************************************DEBUG FUNCTIONALITY******************************************************************/

			$scope.PrintSurvey = function () {
				console.log($scope.SurveySection);
			}
			$scope.PrintSurveyCopy = function () {
				console.log($scope.ActiveSection);
			}
		}]);


	app.controller('surveyHistoryController', [
		'$scope', '$rootScope', 'memberDataService', 'authStatusService', '$routeParams', '$location', '$filter', '$modal',
		function ($scope, $rootScope, memberDataService, authStatusService, $routeParams, $location, $filter, $modal) {

			$scope.SurveysToTakeArray = [];
			$scope.PendingSurveysArray = [];
			$scope.SurveySummariesArray = [];
			$scope.memberSubNo = authStatusService.status.claims.username;
			$scope.language = $rootScope.currentLanguage.substr(0, 2).toUpperCase();
			$scope.PendingSurvey = {};
			$scope.SurveyList = [];
			$scope.foundPendingSurvey = false;
			$scope.SuccessfulHistoryRetrieval = false;
			$scope.ShowAttestation = false;
			$scope.ShowContinue = false;
			$scope.Attestation = "";
			$scope.Overwrite = null;
			$scope.AgeVerification = 0;
			$scope.sortReverse = false;
			$scope.DateOfBirth = "";
			$scope.Age = 0;
			$scope.showButtons = false;
			$scope.SurveyIsFinshedLoading = false;

			var orderBy = $filter('orderBy');
			$scope.sortType = "ResponseCreatedOn";
			var surveyId = 2;

			function changeDateFormat(input) {
			    var date = new Date;
			    if (input !== null && input !== undefined) {
			        var parts = input.match(/(\d+)/g);
			        date = new Date(parts[0], parts[1] - 1, parts[2]);
			    }
			    return date;
			}

			function calculateAge(val) {
				var newDate = changeDateFormat(val);
				var todaysDate = new Date();
				var diff = todaysDate - newDate;
				var age = Math.floor(diff / 31536000000);
				return age;
			}

			$scope.PrintSummary = function () {
				window.print();
			}

			$scope.showAttestation = function (value) {

				$scope.Overwrite = false;
				if (value) {
					$scope.Overwrite = true;
				}

				$scope.ShowAttestation = true;
				$scope.DateOfBirth = "";
			}


			$scope.hideAttestation = function () {
				$scope.ShowAttestation = false;
				$('#regDOB').prop("readonly", false);

			}

			$scope.showContinue = function () {
				$scope.ShowContinue = true;
			}

			//sorts history table
			$scope.changeSort = function (value) {
				$scope.sortReverse = !$scope.sortReverse;
				$scope.sortType = value;
				$scope.TempArray = [];

				for (var i = 0; i < $scope.PagedArray.length; i++) {
					for (var k = 0; k < $scope.PagedArray[i].length; k++) {
						$scope.TempArray.push($scope.PagedArray[i][k]);
					}
				}
				$scope.TempArray = orderBy($scope.TempArray, value, $scope.sortReverse);
				$scope.pageItems($scope.TempArray);
			}

			$scope.createNewSurvey = function () {
				var link = 'App/HealthCare/HASurvey/';
				var path = '2' + '/' + '1' + '/' + '1';
				link += path;
				$location.path(link);
			}

			$scope.createNewSurveyFromList = function (elem) {
				var link = 'App/HealthCare/HASurvey/';
				var respondentInfo = {
					"RespondentTransId": $scope.PendingSurvey.RespondentTransId,
					"isHidden": true
				}

				memberDataService.CancelSurvey(respondentInfo).success(function (data) {
					var link = 'App/HealthCare/HASurvey/';
					var path = '2' + '/' + '1' + '/' + '1';
					link += path;
					$location.path(link);

				}).error(function (error) {
					console.log(error);
				});

			}

			$scope.LoadPendingSurvey = function () {

				var link = 'App/HealthCare/HASurvey/';
				var path = $scope.PendingSurvey.SurveyId + '/' + '2' + '/' + '2' + '/' + $scope.PendingSurvey.RespondentTransId;
				link += path;
				$location.path(link);
			}


			/*************************Date Mask*************************************************/
			$scope.newDOB = '';
			$scope.maskDate = function (e, valid) {

				var thisDate = $('#regDOB').val();
				var numOnlyFilter = /[0-9]/;
				var pressedKey = String.fromCharCode(e.which);

				if (e.keyCode === 8) //delete
				{
					$scope.newDOB = $scope.newDOB.substring(0, $scope.newDOB.length - 1);
				}
				else {
					//Regex plus numkeypad support
					if (pressedKey.match(numOnlyFilter) || e.keyCode === 96
						|| e.keyCode === 97 || e.keyCode === 98 || e.keyCode === 99
						|| e.keyCode === 100 || e.keyCode === 101 || e.keyCode === 102
						|| e.keyCode === 103 || e.keyCode === 104 || e.keyCode === 105) {
						$scope.newDOB = thisDate;
					}


					if ($scope.newDOB.length === 2 || $scope.newDOB.length === 5) {
						$scope.newDOB += '/';
					}

					$('#regDOB').val($scope.newDOB);
				}

				if (valid) {
					var formDate = new Date($scope.newDOB);
					var todaysDate = new Date();
					var diff = todaysDate - formDate;
					var age = Math.floor(diff / 31536000000);

					$scope.AgeVerification = age;
					$scope.DateOfBirth = $scope.newDOB;

					if ($scope.AgeVerification > 17) {
						$('#regDOB').prop("readonly", true);
					}
				}
			}

			/*************************************Pagination Station**********************************/

			//arrays used for pagination of medication and case results
			$scope.PagedArray = [];
			$scope.itemsPerPage = 10;
			$scope.currentPage = 0;
			$scope.gap = 0;

			$scope.pageItems = function (arrayTopage) {

				for (var i = 0; i < arrayTopage.length; i++) {
					if (i % $scope.itemsPerPage === 0) {
						$scope.PagedArray[Math.floor(i / $scope.itemsPerPage)] = [arrayTopage[i]];
					} else {
						$scope.PagedArray[Math.floor(i / $scope.itemsPerPage)].push(arrayTopage[i]);
					}
				}
				$scope.gap = $scope.PagedArray.length;
			}

			$scope.range = function (size, start, end) {
				var ret = [];
				if (size < end) {
					end = size;
					start = size - $scope.gap;
				}
				for (var i = start; i < end; i++) {
					ret.push(i);
				}
				return ret;
			};

			$scope.setPage = function (n) {
				$scope.currentPage = n;
			};
			$scope.prevPage = function () {
				if ($scope.currentPage > 0) {
					$scope.currentPage--;
				}
			};

			$scope.nextPage = function () {
				if ($scope.currentPage < $scope.PagedArray.length - 1) {
					$scope.currentPage++;
				}
			};

			/************************************************************************C*******************/
			function getLatestPendingSurvey(data) {


				if (data.HistoryItems.length > 0) {
					for (var i = 0 ; i < data.HistoryItems.length; i++) {

						if (data.HistoryItems[i].RespondentCanContinue) {
							$scope.PendingSurvey = data.HistoryItems[i];
							data.HistoryItems.splice(i, 1);

							$scope.foundPendingSurvey = true;
						}
					}
				}

			}

			function getSurveyList(surveyId) {

				memberDataService.GetDemographics().success(function (data) {

					$scope.demo = data;
					$scope.DateOfBirth = $scope.demo.DateOfBirth;
					$scope.Age = calculateAge($scope.demo.DateOfBirth);
					memberDataService.getSurveyList(surveyId).success(function (data) {
						if ($scope.Age >= 18) {
							$scope.SurveyList = data;
						}
						$scope.SuccessfulHistoryRetrieval = true;
						//todo filter surveys to only show appropriate surveys, for now only one survey exists, survey 2
					}).error(function (error) {
						console.log(error);
					});
				});
			}

			function initializeHistory(memberId, surveyId) {
				var params = {
					"RespondentValue": memberId,
					"SurveyId": surveyId
				}
				memberDataService.getSurveyHistory(params).success(function (data) {
					if (data.HistoryItems.length > 0) {
						data.HistoryItems = orderBy(data.HistoryItems, 'ResponseCompletedOn', true);
						getLatestPendingSurvey(data);

						if ($scope.foundPendingSurvey) {
							data.HistoryItems.unshift($scope.PendingSurvey);
						}
						$scope.pageItems(data.HistoryItems);
						$scope.PendingSurveysArray = data;

					} else {
						$scope.PendingSurveysArray = data;
					}
					$scope.showButtons = true;

				}).error(function (error) {

					console.log(error);
				});
			}



			$scope.viewSummary = function (elem) {
				var params = {
					"SurveyId": elem.survey.SurveyId,
					"Language": $scope.language,
					"RespondentTransId": elem.survey.RespondentTransId,
					"RespondentTypeId": elem.survey.RespondentTypeId
				};
				memberDataService.requestSurveySummary(params).success(function (data) {
					$scope.SurveyIsFinshedLoading = true;
					$scope.openSummaryModal(data, elem);

				}).error(function (data) {
					console.log(error);
				}).error(function (error) {
					console(error);
				});

			}
			//Initialize history data
			initializeHistory($scope.memberSubNo, surveyId);
			getSurveyList(surveyId);

			/***********SHOW PAST SUMMARIES IN MODAL WINDOW*******************/
			$scope.PrintSummary = function () {

				var documentContainer = document.getElementById('divtoprint');
				var windowObject = window.open("", "PrintWindow", "");
				windowObject.document.writeln(
					'<style> ' +
					'.survey-summary-history-info {text-align:center;font-weight:bold;margin:0;color: #00477E;}' +
					'.survey-completed-date{text-align:center; font-size:12px;}' +
					'.survey-print-logo{height:70px;}' +
					'.survey-summary-list {list-style-type: none;padding: 10px;}' +
					'.survey-summary-history-indent {padding-left: 18px;}' +
					'.survey-summary-history-name {margin: 0px 0px 15px;}' +
					'.non-printable{display:none;}' +
					'.survey-print-logo-wrapper{text-align:center;margin-bottom:8px!important;}' +

					'@media print {' +
					'.non-printable {display: none;}' +
					'.survey-summary-history-indent{padding-left:20px;}' +
					'.survey-print-logo{height:55px;}' +
					'.survey-print-logo-wrapper{margin-bottom:8px!important;}' +
					'.survey-summary-history-header{margin:0 !important;font-size:12px;}' +
					'.survey-summary-list{list-style:none;}' +
					'.survey-hr-non-printable {display: none;}' +
					'.survey-summary-history-info{margin-bottom:8px;text-align:center !important;font-size:14px;}' +
					'.center-span{display:none;}' +
					'.survey-summary-history-labels{ font-size:10;font-weight:300;margin-bottom:5px;}' +
					'.survey-completed-date{text-align:center; font-size:12px;}' +
					'.survey-list-no-bullet { list-style:none;}' +
					'</style>' +
				documentContainer.innerHTML);
				windowObject.document.close();
				windowObject.focus();
				windowObject.print();
				windowObject.close();
			}

			$scope.openSummaryModal = function (summaries, elem) {

				var modalInstance = $modal.open({

					animation: true,
					templateUrl: 'myModalContent.html',
					size: 'lg',
					scope: function () {
						var scope = $rootScope.$new();
						scope.items = summaries;
						scope.surveySummaryInfo = elem.survey;
						scope.PrintLogoUrl = $('meta[name="ApplicationRoot"]').attr('content') + '/Content/Images/IEHP_LOGO_Survey.png';
						scope.cancel = function () {
							modalInstance.dismiss();
						}
						return scope;
					}()
				});

			};
		}]);


	//controller used for Calender types
	app.controller('surveyCalendarController', [
		'$scope', '$rootScope',
		function ($scope, $rootScope) {

			$scope.max = new Date();

			$scope.open = function ($event, dt) {
				$event.preventDefault();
				$event.stopPropagation();
				dt.opened = true;
			};

			$scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1,
				showWeeks: false,
				yearRange: 2,
				showButtonBar: false
			};
			$scope.format = 'MM/dd/yyyy';
		}]);
})();


