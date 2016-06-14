(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.controller('EncounterController', EncounterController);

	EncounterController.$inject = [
		'$scope', '$state', '$rootScope', '$translate', '$timeout', 'contentAuthorizationService', 'searchTypeService', 'memberDataService', '$filter', '$uibModal', '$stateParams'
	];

	function EncounterController($scope, $state, $rootScope, $translate, $timeout, contentAuthorizationService, searchTypeService, memberDataService, $filter, $uibModal, $stateParams) {
		authorizationDefaults(); //Security First

		$scope.alert = {};
		$scope.report = {};
		$scope.report.getTranscationReport = getTranscationReport;
		$scope.selectProvider = selectProvider;
		$scope.selectIcd = selectIcd;
		$scope.isArray = angular.isArray;
		$scope.getPdf = getPdf;

		$scope.today = moment().format('MM/DD/YYYY');
		$scope.providerModal = function() { $('#ProviderModal').modal('toggle'); };
		$scope.posModal = function() { $('#POSModal').modal('toggle'); };
		$scope.icdModal = function(index) { $('#icdModal-' + index).modal('toggle'); };
		initSearch();
		getProviderList();
		commonInit();
		getTranscationReport();


		////////////////////////////////////////////////////////////////////////////////////////////////////////////

		function initSearch() {
			$scope.search = {};
			$scope.prelimForm = {};

			$scope.encounterForm = {};

			//search options
			$scope.search.acceptedTypes = $scope.search.acceptedTypes || ['CIN', 'SSN', 'IEHPID'];
			$scope.search.maxIcd = 12;
			$scope.search.maxVisit = 6;

			//initiate add buttons for ICD and Visit fields
			initIcd();
			$scope.search.addIcd = function() {
				if ($scope.search.icd.length < $scope.search.maxIcd) {
					$scope.search.icd.push({});
					//since we are using jlite (angular.element) here instead of in a directive, we need to delay for icd to be created before focusing on it
					$timeout(function() {
						angular.element("[name='icd-" + ($scope.search.icd.length - 1) + "']").focus();
					}, 30);
				}
			};
			$scope.search.addVisit = function() {
				if ($scope.search.icd.length < $scope.search.maxVisit) {
					$scope.search.visit.push(new Visit());
				}
			};
			$scope.search.removeInput = function(list, value) {
				$scope.search[list].splice(value, 1);
				//splice, validate, and then subtract 1 from all higher indexes
				_.each($scope.search.visit, function(visit) {
					for (var i = 0; i < visit.diagnosisCodePointers.length; i++) {
						//if index is higher than selected remove value, it will check if valid, and then subtract 1
						if (visit.diagnosisCodePointers[i] > value + 1) {
							if ($scope.search.icd[i].check) { //make sure icd code is valid
								visit.diagnosisCodePointers.splice(i, 1);
							}
							if (visit.diagnosisCodePointers[i]) {
								visit.diagnosisCodePointers[i]--;
							}
						} else if (value + 1 === visit.diagnosisCodePointers[i]) {
							visit.diagnosisCodePointers.splice(i, 1);
							visit.diagnosisCodePointers[i]--;
						}
					}
					visit.diagnosisCodePointers = _.compact(visit.diagnosisCodePointers); //remove null and empty values in the array, and also bind it back to the scope
				});

			};

			//form submission functions
			$scope.search.formEligibility = formEligibility;
			$scope.search.submitEncounter = submitEncounter;
			$scope.search.clearSubmission = clearSubmission;

			//form validation
			$scope.search.state = {};
			$scope.search.state.validated = validated;
			$scope.search.date = moment().format('MM/DD/YYYY');
			$scope.search.validateDate = function(date) {
				return moment().diff(moment(date)) >= 0; //make sure valid and not future date
			};
			$scope.search.type = searchTypeService.type($scope.search.query);
			$scope.search.updateType = updateType;
			if (!$scope.search.clickInput) {
				$scope.search.clickInput = null;

			}

			$scope.search.checkId = checkId;
			$scope.search.checkIcdCode = checkIcdCode; //make sure icd is valid by checking an api
			$scope.search.checkProcCode = checkProcCode;
			$scope.search.checkModCode = checkModCode;

			$scope.search.clear = $scope.search.clear || clear;

			///////////////////////////
			function validated() {
				return $scope.search.type.string;
			}

			function updateType() {
				var query = $scope.search.query;


				$scope.search.type = searchTypeService.type(query, $scope.search.acceptedTypes);
			}

			function checkId(id) {
				if (id) {
					var type = null;
					switch ($scope.search.type.string) {
					case 'IEHPID':
						type = 'CheckMemberId';
						break;
					case 'SSN':
						type = 'CheckMemberSsn';
						break;
					case 'CIN':
						type = 'CheckMemberCin';
						break;
					default:
						$scope.prelimForm.memberId.$setValidity('check', false);
						break;
					}
					if (type) {
						memberDataService[type](id).success(function(data) {
							var validity = data.SubscriberNumber !== null;
							$scope.prelimForm.memberId.$setValidity( 'check', validity );
							console.log( 'iehpid type >', type, validity );
						});
					}
				}
			}

			function checkIcdCode(code, instance) {
				if (code) {
					var params = {
						validationParameter: code,
						dateOfService: $scope.search.date
					};
					memberDataService.CheckIcdCode(params).success(function(data) {
						$scope.encounterForm['icd-' + instance].$setValidity('check', data);
					});

					//check if duplicate
					var icdList = _.map($scope.search.icd, function(icd) {
						return icd.val;
					});
					if (icdList.indexOf(code) !== instance) {
						$scope.encounterForm['icd-' + instance].$setValidity('duplicate', false);
					} else {
						$scope.encounterForm['icd-' + instance].$setValidity('duplicate', true);
					}
				}
			}

			function checkProcCode(code, instance) {
				if (code) {
					var params = {
						validationParameter: code,
						dateOfService: $scope.search.date
					};
					memberDataService.CheckProcCode(params).success(function(data) {
						$scope.encounterForm['proc-' + instance].$setValidity('check', data);
					});
				}
			}

			function checkModCode(code, instance) {
				if (code) {
					var params = {
						validationParameter: code,
						dateOfService: $scope.search.date
					};
					memberDataService.CheckModCode(params).success(function(data) {
						$scope.encounterForm['mod-' + instance].$setValidity('check', data);
					});
				}
			}

			function clear() {
				$scope.search.query = null;
				$scope.search.type = {};
				$scope.search.providerOfService = null;
				$scope.prelimForm = null;
			}

			//structure object to pass onto API
			function param() {
				var data = $scope.search.formEligibilityData ? $scope.search.formEligibilityData : {};
				data.MemberInfo = data.MemberInfo ? data.MemberInfo : {};

				return {
					eligibility: {
						ProviderOfService: $scope.search.providerOfService,
						MemberSearchValue: $scope.search.query,
						SearchType: $scope.search.type.num,
						DateOfService: $scope.search.date
					},
					submit: {
						SubNo: data.MemberInfo.SubscriberNumber,
						PersNo: data.MemberInfo.PersonNumber,
						ServicingProviderId: $scope.search.providerOfService,

						Dos: $scope.search.date,
						EncounterVisitsDetails: $scope.search.visit,
						Icd1: $scope.search.icd[0] ? $scope.search.icd[0].val : null,
						Icd2: $scope.search.icd[1] ? $scope.search.icd[1].val : null,
						Icd3: $scope.search.icd[2] ? $scope.search.icd[2].val : null,
						Icd4: $scope.search.icd[3] ? $scope.search.icd[3].val : null,
						Icd5: $scope.search.icd[4] ? $scope.search.icd[4].val : null,
						Icd6: $scope.search.icd[5] ? $scope.search.icd[5].val : null,
						Icd7: $scope.search.icd[6] ? $scope.search.icd[6].val : null,
						Icd8: $scope.search.icd[7] ? $scope.search.icd[7].val : null,
						Icd9: $scope.search.icd[8] ? $scope.search.icd[8].val : null,
						Icd10: $scope.search.icd[9] ? $scope.search.icd[9].val : null,
						Icd11: $scope.search.icd[10] ? $scope.search.icd[10].val : null,
						Icd12: $scope.search.icd[11] ? $scope.search.icd[11].val : null,
					}
				};
			};

			/////////////////////////
			//form submit functions//
			function formEligibility(valid) {
				console.log($scope.encounterForm);

				if (valid.$valid && $scope.search.validateDate($scope.search.date)) {
					$scope.encounterForm.$setPristine();
					$scope.encounterForm.$setUntouched();
					memberDataService.GetEncounter('EncounterEligibility', param().eligibility)
						.success(function(data) {
							console.log('EncounterEligibility >', data);

							if (data.ErrorList.length > 0) {
								console.log('Error >', data);
								$scope.errorMessage = data.ErrorList;
								$scope.search.formEligibilityData = null;
								$scope.search.state.formEligibility = false;
								//								angular.element("[name='" + form.$name + "']").find('.ng-invalid:visible:first').focus();
							} else {

								console.log('Success >', data);
								$scope.errorMessage = '';
								$scope.alert.success = '';
								$scope.search.formEligibilityData = data;
								$scope.search.state.formEligibility = true;
								initVisit();


							}
						}).error(function(data) {
							$scope.search.state.formEligibility = false;
							console.log('Error >', data);
							//							$scope.errorMessage = 'Please correctly fill out the form.';
						})
						.finally(function() {
							$scope.search.status = 2;
							if (!_.isEmpty($scope.prelimForm)) {
								$scope.prelimForm.$setPristine();
							}
						});
				} else {
					//					$scope.errorMessage = 'Please correctly fill out the form.';
					$scope.search.state.formEligibility = false;
				}
			};

			function submitEncounter(form) {

				$scope.errorMessage = '';
				if (form.$valid) {
					memberDataService.GetEncounter('SubmitEncounter', param().submit)
						.success(function(data) {
							console.log('SubmitEncounter >', data);
							if (data.IsValid) {
								$scope.search.formEligibilityData = null;
								$scope.search.state.formEligibility = false;
								$scope.search.query = null;
								$scope.search.providerOfService = null;
								$scope.report.expand = false;
								clear();
								clearSubmission();
								$scope.search.date = moment().format('MM/DD/YYYY');
								$scope.errorMessage = '';
								$scope.alert.success = true;
								getTranscationReport();
								if (!_.isEmpty($scope.encounterForm)) {
									$scope.encounterForm.$setPristine();
								}
								//								$timeout(function() { $scope.alert.success = false }, 5000);

							} else {
								$scope.errorMessage = data.ErrorsList;
							}
						}).error(function(data) {

							console.log(data);
							$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
						})
						.finally(function() {
							$scope.search.status = 2;
							if (!_.isEmpty($scope.prelimForm)) {
								$scope.prelimForm.$setPristine();
							}
						});
				} else {
					console.log(form);
					$scope.errorMessage = 'Please correctly fill out the form.';
					angular.element("[name='" + form.$name + "']").find('.ng-invalid:visible:first').focus();
				}
			}


			function clearSubmission() {
				$scope.errorMessage = '';
				if (!_.isEmpty($scope.prelimForm)) {
					$scope.prelimForm.$setPristine();
				}
				if (!_.isEmpty($scope.encounterForm)) {
					$scope.encounterForm.$setPristine();
				}
				initIcd();
				initVisit();
				$scope.search.query = null;
				$scope.search.type = {};
				$scope.search.providerOfService = '';
				$scope.search.formEligibilityData = null;
				$scope.report.expand = false;
			}

			/////////////////////////
			//search init functions//
			function initIcd() {
				$scope.search.icd = [{}];
			}

			function initVisit() {
				//initiate visit information array
				$scope.search.visit = [];
				$scope.search.visit.push(new Visit());
			};

			function Visit() {
				this.pos = 11;
				this.icd = null;
				this.qty = 1;
				this.dDos = $scope.search.date;
			}
		};

		function selectProvider(provider) {
			$scope.search.providerOfService = provider;
			$('#ProviderModal').modal('hide');
		}

		//toggle a value inside an array on or off
		function toggle(a, b) {
			return _.indexOf(a, b) === -1 ? _.union(a, [b]) : _.without(a, b);
		}

		function selectIcd(current, selCode) {
			return toggle(current, selCode).sort();
		}


		function getProviderList() {
			$scope.search.status = 1;
			memberDataService.GetProviderOfServices()
				.success(function(data) {
					console.log('Providers >', data);
					$scope.providers = data;
				}).error(function(data) {

					console.log(data);
					$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
				})
				.finally(function() {
					$scope.search.status = 2;
					if (!_.isEmpty($scope.prelimForm)) {
						$scope.prelimForm.$setPristine();
					}
				});
		}

		function getTranscationReport() {
			$scope.search.status = 1;
			memberDataService.GetEncounter('TransactionReport?date=' + moment().format('MM/DD/YYYY'))
				.success(function(data) {
					console.log('TransactionReport >', data);
					$scope.report.data = data;
					$scope.report.expand = !$scope.report.expand;
				}).error(function(data) {
					$scope.report = {};
					console.log(data);
					$scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
				})
				.finally(function() {
					$scope.search.status = 2;
					if (!_.isEmpty($scope.prelimForm)) {
						$scope.prelimForm.$setPristine();
					}
				});
		}


		function getPdf() {
			if ($scope.loaded >= 0) {
				$uibModal.open({
					animation: true,
					templateUrl: 'pdfModal.html',
					controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
						$scope.ok = function() {
							$modalInstance.close();
						};
					}]
				});
				memberDataService.GetPdfData($('#pdf').html()).success(function(response) {


					if (window.navigator.msSaveOrOpenBlob) {

						window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }), 'Claims RA Print');
					} else {

						var file = new Blob([response], { type: 'application/pdf' });
						var fileUrl = URL.createObjectURL(file);
						window.open(fileUrl);
					}

				});
			} else {
				console.log('Still Loading Page');
			}
		}

		//COMMON PAGE INITIALIZATION 
		function commonInit() {
			$scope.errorMessage = '';
			$scope.infoMessage = '';
			$scope.successMessage = '';

			$scope.TestUserMode = $rootScope.TestUserMode;
			$scope.ShareDataWithState = 1; //On by default 
		}

		//CONTENT AUTHORIZATION DEFAULTS 
		function authorizationDefaults() {
			$scope.siteItem = [];
			$scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);
		}
	};
})();