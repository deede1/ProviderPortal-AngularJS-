
(function () {
    
    function indexOfCpt(code, array) {
        var index = -1;
        for (var i = 0; i < array.length; i++) {
            if (array[i] !== null && array[i].cpt.trim() === code) {
                index = i;
                break;
            }
        }
        return index;
    }
    function indexOfIcd(code, array) {
        var index = -1;
        if (code !== undefined && code !== null) {
            if (array !== null) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] !== null)
                    console.log(array[i].code.trim());
                    if (array[i] !== null && (array[i].code.toLowerCase().trim() === code.toLowerCase().trim())) {
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    }

    var app = angular.module('MemberPortal');
    app.directive('whenScrollEnds', function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                var visibleHeight = element.height();
                var threshold = 500;

                element.scroll(function () {
                    var scrollableHeight = element.prop('scrollHeight');
                    var hiddenContentHeight = scrollableHeight - visibleHeight;

                    if (hiddenContentHeight - element.scrollTop() <= threshold) {

                        scope.$apply(attrs.whenScrollEnds);
                    }
                });
            }
        };
    });
    app.directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

    app.service('specialJcodes', function () {
        var jcodesArray = [];
        return {
            getJcodes: function () {
                return jcodesArray;
            },

            setJcodes: function (array) {
                jcodesArray = array;
            }
        }
    });

    app.controller('InitializeUpaController', [
        '$scope', '$http', '$rootScope', '$state', 'contentAuthorizationService',
        function ($scope, $http, $rootScope, $state, contentAuthorizationService) {


            $scope.siteItem = [];
            $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);
        }
    ]);

    app.controller('GlobalController', [
        '$scope', 'universalPriorAuthoirzationService', function ($scope, universalPriorAuthoirzationService) {

          
            $scope.memberData = {};
            $scope.providerData = {};
            $scope.drugsGlobal = universalPriorAuthoirzationService.getDrugs();
            $scope.icdsGlobal = universalPriorAuthoirzationService.getIcds();
            $scope.memberLobDescrtion = "";

            $scope.submissionloading = false;
            $scope.pdfLoading = false;

            $scope.setGlobalMemberData = function (elem) {
                $scope.memberData = elem;
            }

            $scope.setGlobalProviderData = function (elem) {
                $scope.providerData = elem;
            }


        }
    ]);


    app.controller('MedicationMedicalController', [
        '$scope', '$http', '$rootScope', 'memberDataService', 'universalPriorAuthoirzationService', function ($scope, $http, $rootScope, memberDataService, universalPriorAuthoirzationService) {

            var context = this;
            context.reset = true;
            $scope.SelectedDrugs = [];
            $scope.DrugSearchString = "";
            $scope.NDC = "";
            $scope.SearchParamString = "";
            $scope.showAjaxSpinner = false;
            $scope.SearchResults = [];
            $scope.gcn = "";
            $scope.Type = "0";
            $scope.NDCflag = false;
            $scope.isNDC = true;
            $scope.drugSelToggle = null;
            $scope.SpecialtyPharmacies = [];
            $scope.PharmacySelected = false;
            $scope.SelectedPharmacy = null;
            $scope.NDCPharmacies = [];
            $scope.NDCLoader = false;
            $scope.NDCPharmaciesSearched = false;
            $scope.PharmSearchLoader = false;

            var searchDrugsSpinner = $('#searchDrugsSpinner');
            var PAerrorMessage = $('#PAerrorMessage');
            var limit = 10;
            var returnAmount = 500;
            var renderAmount = 30;

            $scope.dropdown = [];


            angular.element(document).ready(function () {
                memberDataService.GetSigDropDown().success(function (response) {
                    $scope.dropdown = response;
                });

                $("#memberId").focus();
            });


            //check date of therapy
            $scope.checkDate = function (item, position) {

                item.date1Valid = (item.date1 && item.date1.length === 10);
                item.date2Valid = (item.date2 && item.date2.length === 10);
                item.date3Valid = (item.date3 && item.date3.length === 10);


                switch (position) {

                    case 0:
                        if (item.date1Valid) {
                            item.date1 = moment(item.date1).format('MM/DD/YYYY');
                            item.date1Valid = true;

                            item.date2 = null;
                            item.date3 = null;
                        }
                        break;
                    case 1:
                        if (item.date1Valid && item.date2Valid) {
                            item.date1 = moment(item.date1).format('MM/DD/YYYY');
                            item.date2 = moment(item.date2).format('MM/DD/YYYY');

                            var d1 = new Date(item.date1);
                            var d2 = new Date(item.date2);

                            if (d2 > d1) {
                                item.date1Valid = true;
                                item.date2Valid = true;
                                item.showMessage1 = false;
                                item.date3 = null;

                            } else {
                                item.showMessage1 = true;
                                item.date2 = null;
                            }
                        }
                        break;
                    case 2:
                        if (item.date2Valid && item.date3Valid) {
                            item.date2 = moment(item.date2).format('MM/DD/YYYY');
                            item.date3 = moment(item.date3).format('MM/DD/YYYY');

                            var d22 = new Date(item.date2);
                            var d3 = new Date(item.date3);

                            if (d3 > d22) {
                                item.date2Valid = true;
                                item.date3Valid = true;
                                item.showMessage2 = false;

                            } else {
                                item.showMessage2 = true;
                                item.date3 = null;
                            }
                        }
                        break;
                    default:
                        break;

                }

        

            }
            //assign service to share variables
            universalPriorAuthoirzationService.setDrugs($scope.SelectedDrugs);
            //reset form for resubmission
            $scope.$on('resetAngular', function () {

                $scope.Type = "0";
                $scope.SelectedDrugs = [];
                universalPriorAuthoirzationService.setDrugs($scope.SelectedDrugs);
                universalPriorAuthoirzationService.clearMedicines();

                $scope.SearchResults = [];
                $scope.RenderedResults = [];
                $scope.filteredSearchResults = [];
                $scope.pageOn = 1;
                $scope.indexOfPagination = 0;
                $scope.paginationAmount = 30;
                $scope.FilterDrugSearch = '';


                context.reset = true;
                $scope.SpecialtyPharmacies = [];
                $scope.PharmacySelected = false;
                $scope.SelectedPharmacy = null;
                $scope.NDCPharmacies = [];
                $scope.NDCPharmaciesSearched = false;
                $scope.NDCflag = false;
                $scope.isNDC = true;
                $scope.CMSCoverageForm.$submitted = false;

                $('#search-results').show();
                $('#pharmacySelection').val("");
                $('#comment').val("");

            });

            //Search Drugs
            $scope.searchDrugs = function () {
                $scope.FilterDrugSearch = "";



                if ($scope.CMSCoverageForm.hcpcSearchInput.$viewValue !== '' || $scope.CMSCoverageForm.NDCHCPCS.$viewValue !== "") {
                    searchDrugsSpinner.empty();
                    $scope.NDCLoader = true;
                    if ($scope.Type === "1") {
                        if ($scope.SelectedDrugs.length < limit) {

                            $scope.searchDrugs_HCPC();
                        } else {
                            PAerrorMessage.empty();
                            PAerrorMessage.append(
                                '<div class="alert alert-danger" role="alert">' +
                                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                                '<span class="sr-only">Error:</span> Only ' + limit + ' HCPCS are allowed per submission.' +
                                '</div>');
                            $('#PAErrorModal').modal('toggle');
                            $scope.NDCLoader = false;
                        }

                    }
                    if ($scope.Type === "0") {
                        if ($scope.SelectedDrugs.length === 0) {
                            $scope.searchDrugsALL();

                        } else {
                            PAerrorMessage.empty();
                            PAerrorMessage.append(
                                '<div class="alert alert-danger" role="alert">' +
                                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                                '<span class="sr-only">Error:</span> Only 1 NDC is allowed per submission.' +
                                '</div>');
                            $('#PAErrorModal').modal('toggle');
                            $scope.NDCLoader = false;
                        }
                    }
                }
                return false;

            };
            //reset search results 
            $scope.resetResults = function (bool) {

                var quantityUiMessage = $("#QuantityUIMessage");
                $scope.isNDC = bool;
                $scope.SearchResults = [];
                $scope.RenderedResults = [];
                $scope.filteredSearchResults = [];
                $scope.pageOn = 1;
                $scope.indexOfPagination = 0;
                $scope.paginationAmount = 30;
                $scope.FilterDrugSearch = '';


                $rootScope.$broadcast('DrugType', bool);
                $scope.RemovePharmacies();



                if ($scope.isNDC) {

                    quantityUiMessage.empty();
                    quantityUiMessage.append("<span>Only 1 NDC may be submitted per submission</span>");
                }
                if (!$scope.isNDC) {

                    quantityUiMessage.empty();
                    quantityUiMessage.append("<span>Up to " + limit + " HCPCS may be submitted per submission</span>");
                }


            }

            $scope.pageOn = 1;
            $scope.indexOfPagination = 0;
            $scope.paginationAmount = 30;
            $scope.filteredSearchResults = [];



            //fiters through all pagination object
            $scope.customFilter = function () {

            
                $scope.filteredSearchResults = [];
                var tempArray = [];

                if ($scope.FilterDrugSearch !== "" && $scope.FilterDrugSearch !== null && $scope.FilterDrugSearch !== undefined) {

                    var upperCaseSearch = $scope.FilterDrugSearch.toUpperCase();

                    if ($scope.isNDC) {
                        for (var i = 0; i < $scope.SearchResults.length; i++) {

                            var searchTerm1 = $scope.SearchResults[i]["BrandNameAndDosage"];
                            var searchTerm2 = $scope.SearchResults[i]["GenericNameAndDosage"];

                            if (searchTerm1.indexOf(upperCaseSearch) !== -1) {
                                tempArray.push($scope.SearchResults[i]);
                                continue;
                            }

                            if (searchTerm2.indexOf(upperCaseSearch) !== -1) {
                                tempArray.push($scope.SearchResults[i]);
                            }
                        }
                    } else {

                        for (var j = 0; j < $scope.SearchResults.length; j++) {

                            var searchTerm3 = $scope.SearchResults[j]["FullDescription"];

                            if (searchTerm3.indexOf(upperCaseSearch) !== -1) {
                                tempArray.push($scope.SearchResults[j]);

                            }


                        }

                    }
                    $scope.filteredSearchResults = tempArray;

                } else {
                    $scope.filteredSearchResults = $scope.SearchResults;
                }
            }


            $scope.paginateDrugSearch = function () {

                if ($scope.filteredSearchResults.length > ($scope.pageOn * renderAmount)) {
                    $scope.paginationAmount = ($scope.pageOn + 1) * renderAmount;
                    $scope.pageOn++;

                }
            }

            //Search Drugs display both
            $scope.searchDrugsALL = function () {
                $scope.SearchParamString = "Drug search for: ";
                $scope.SearchParamString += ($scope.NDC !== "") ? $scope.NDC + " " : "";
                $scope.SearchParamString += ($scope.DrugSearchString !== "") ? $scope.DrugSearchString : "";

                var obj = {
                    "SearchString": $scope.DrugSearchString,
                    "NdcNumber": $scope.NDC,
                    "ReturnAmount": returnAmount
                }
                memberDataService.searchNdc(obj).success(function (data) {

                    $scope.NDCLoader = false;
                    $scope.SearchResults = data;
                    $scope.filteredSearchResults = data;

       

                    context.reset = false;
                });
            };


            $scope.clearDates = function (item) {
                item.date1 = null;
                item.date2 = null;
                item.date3 = null;
                item = {};
            }
            //Search Drugs HCPCS
            $scope.searchDrugs_HCPC = function () {

                $scope.SearchParamString = "HCPC search for: ";
                $scope.SearchParamString += ($scope.NDC !== "") ? $scope.NDC + " " : "";
                $scope.SearchParamString += ($scope.DrugSearchString !== "") ? $scope.DrugSearchString : "";

                var obj = {
                    "SearchString": $scope.DrugSearchString,
                    "Id": $scope.NDC,
                    "ReturnAmount": returnAmount
                };


                memberDataService.searchDrugsHcpc(obj)
                    .success(function (data) {
                        $scope.NDCLoader = false;
                        $scope.SearchResults = data;
                        $scope.filteredSearchResults = data;


                        context.reset = false;
                        if ($scope.SearchResults.length === 0) {
                            PAerrorMessage.empty();
                            PAerrorMessage.append(
                                '<div class="alert alert-danger" role="alert">' +
                                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                                '<span class="sr-only"></span> This HCPCS cannot be found or is not available through this application.' +
                                '</div>');
                            $('#PAErrorModal').modal('toggle');
                        }

                    });
            };


            $scope.removeDrug = function (item) {

                var idx = $scope.SelectedDrugs.indexOf(item);
                $scope.SelectedDrugs.splice(idx, 1);

                universalPriorAuthoirzationService.RemoveMedication(idx);
                universalPriorAuthoirzationService.setJcodes($scope.SelectedDrugs);
                $rootScope.$broadcast('deleteSpecialJcodes', {
                    deleted: item.procedureCode
                });

                if ($scope.SelectedDrugs.length === 0) {
                    $('#search-results').show();
                    $scope.NDCflag = false;
                }
                if ($scope.SelectedDrugs.length > 1 && !$scope.NDCflag) {
                    $('#search-results').show();
                }
            };
            $scope.addDrug = function (item) {
                //UI clean up
                var hcpcSearchInput = $("#hcpcSearchInput");
                var ndcSearchInput = $("#ndcSearchInput");
                var drugProcessing = $("#drugProcessing");


                hcpcSearchInput.val("");
                ndcSearchInput.val("");
                $scope.DrugSearchString = "";
                $scope.NDC = "";
                drugProcessing.empty();


                if (item.hasOwnProperty('Ndc')) { //if user selects NDC
                    memberDataService.GetDrugByGcnSequenceNumber(item.NdcSequenceNumber).success(function (response, data) {

                        var topNdc = response;
                        var drug = {
                            name: item.name,
                            brandName: item.BrandName,
                            genericName: item.GenericName,
                            dosage: item.Dosage,
                            strength: item.Strength,
                            ndc: topNdc.Ndc,
                            seqno: topNdc.Ndc,
                            procedureCode: item.ProcedureCode,
                            type: "N",
                            InclusionId: -1,
                            Bn: null,
                            dropdown: null,
                            Sig: null,
                            refill: null,
                            qty: null,
                            therapy: null,
                            date1: null,
                            date2: null,
                            date3: null,
                            Admin: null,
                            otherAdmn: null,
                            Administration: null,
                            hospital: null,
                            otherAdmin: null
                        }
                        $scope.SelectedDrugs.push(drug);
                        drugProcessing.empty();


                        universalPriorAuthoirzationService.AddMedication(drug);
                    }).error(function (data) {

                    });
                    $scope.NDCflag = true;
                    $('#search-results').hide();


                } else { //user selected HCPCS
                    drugProcessing.empty();
                    var notFound = true;
                    if (!$scope.NDCflag) {
                        memberDataService.validateHcpcs(item.ProcedureCode).success(function (response, data) {
                            if (response) {
                                if ($scope.SelectedDrugs.length <= limit) {
                                    //search array for Duplicates
                                    for (var m = 0; m < $scope.SelectedDrugs.length; m++) {
                                        if ($scope.SelectedDrugs[m].procedureCode === item.ProcedureCode) {
                                            //cannot have both HCPCS and NDC
                                            PAerrorMessage.empty();
                                            PAerrorMessage.append(
                                                '<div class="alert alert-danger" role="alert">' +
                                                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                                                '<span class="sr-only">Error:</span> Sorry, you cannot select duplicate HCPCS.' +
                                                '</div>');
                                            $('#PAErrorModal').modal('toggle');
                                            notFound = false;
                                            break;
                                        }
                                    }
                                    if (notFound) {

                                        var drug = {
                                            name: item.name,
                                            brandName: item.FullDescription,
                                            genericName: item.genericName,
                                            dosage: item.dosage,
                                            strength: item.strength,
                                            ndc: item.seqno,
                                            seqno: item.ProcedureCode, //this is the JCODe
                                            procedureCode: item.ProcedureCode,
                                            type: "H",
                                            InclusionId: item.InclusionId,
                                            Bn: null,
                                            dropdown: null,
                                            Sig: null,
                                            refill: null,
                                            qty: null,
                                            therapy: null,
                                            date1: null,
                                            date2: null,
                                            date3: null,
                                            Admin: null,
                                            otherAdmn: null,
                                            Administration: null,
                                            hospital: null,
                                            otherAdmin: null
                                        }
                                        $scope.SelectedDrugs.push(drug);
                                        universalPriorAuthoirzationService.setJcodes($scope.SelectedDrugs);
                                        $rootScope.$broadcast('checkSpecialJcodes', {
                                            code: item.ProcedureCode
                                        });
                                        universalPriorAuthoirzationService.AddMedication(drug);
                                    }
                                }
                                if ($scope.SelectedDrugs.length === limit) {
                                    $('#search-results').hide();

                                }
                            } else {
                                PAerrorMessage.empty();
                                PAerrorMessage.append(
                                    '<div class="alert alert-danger" role="alert">' +
                                    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                                    '<span class="sr-only">Error:</span>The HCPCS <strong>' + item.ProcedureCode + '</strong> is termed.  You must submit this request in paper form.' +
                                    '</div>');
                                $('#PAErrorModal').modal('toggle');
                            }


                        });
                    }
                }
            };
            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.openOne = function ($event, example) {

                example.open1 = true;
            };
            $scope.openTwo = function ($event, example) {

                example.open2 = true;
            };
            $scope.openThree = function ($event, example) {

                example.open3 = true;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };
            $scope.manSubmitPharm = function () {



                if ($scope.manualPharmacyForm.$valid) {

                    $scope.PharmacySelected = true;
                    $scope.SelectedPharmacy = {
                        pharm: {
                            PharmacyName: $scope.manualPharmacyForm.manPharmName.$viewValue,
                            PharmacyNPI: $scope.manualPharmacyForm.manualPharmacyNPI.$viewValue,
                            PharmacyCity: $scope.manualPharmacyForm.manPharmCity.$viewValue,
                            PharmacyAddress1: $scope.manualPharmacyForm.manPharmAddress.$viewValue,
                            PharmacyState: $scope.manualPharmacyForm.manPharmState.$viewValue.description,
                            PharmacyPhone: $scope.manualPharmacyForm.manPharmPhone.$viewValue,
                            PharmacyFax: $scope.manualPharmacyForm.manPharmFax.$viewValue,
                            PharmacyZip: $scope.manualPharmacyForm.manualPharmacyZip.$viewValue
                        }
                    };

                    $('#addedPharmacy').val(1);
                    $('#PharmacySearchModal').modal('toggle');
                    $scope.EnterPharmInfo = false;
                }
            }

            $scope.OpenPharmacySearchModal = function () {
                //get specialty pharmacies from database
                if (!$scope.isNDC) {
                    memberDataService.GetSpecialtyPharmacies().success(function (response) {
                        $scope.SpecialtyPharmacies = response;
                        $('#PharmacySearchModal').modal('toggle');
                    });
                } else {
                    $('#PharmacySearchModal').modal('toggle');
                }
            }
            $scope.SelectPharmacy = function (elem) {

                $scope.SelectedPharmacy = elem;
                $scope.PharmacySelected = true;
                $('#addedPharmacy').val(0);
                $('#PharmacySearchModal').modal('hide');

                var temp = elem.pharm.Pharmacy_Name;
                if (elem.pharm.PharmacyName > 50) {
                    temp = "";
                    for (var i = 0; i < 50; i++) {
                        temp += elem.pharm.PharmacyName[i];
                    }
                }
                $scope.pharmSelection = temp;

            }
            $scope.NDCPharmacySearch = function () {
                var NDCSearchStatus = $('#NDCSearchStatus');
                NDCSearchStatus.empty();

                $scope.NDCPharmaciesSearched = true;

                var data = {
                    "PharmacyName": $('#NDCSearchName').val() || null,
                    "PharmacyCity": $('#NDCSearchCity').val() || null,
                    "PharmacyZip": $('#NDCSearchZip').val() || null,
                    "ReturnAmount": 0
                }
                $scope.PharmSearchLoader = true;
                memberDataService.GetNdcPharamcy(data).success(function (response) {
                    $scope.PharmSearchLoader = false;
                    $scope.NDCPharmacies = response;
                    NDCSearchStatus.empty();
                    if (response.length === 0) {
                        NDCSearchStatus.append('<label class="redMessage"> No Records Found.</label>');
                    }
                });
            }
            $scope.ResetNDCSearch = function () {
                $scope.NDCPharmaciesSearched = false;
                $scope.NDCPharmacies = [];
                $('#NDCSearchName').val("");
                $('#NDCSearchCity').val("");
                $('#NDCSearchZip').val("");
            }
            $scope.RemovePharmacies = function () {

                $scope.SpecialtyPharmacies = [];
                $scope.PharmacySelected = false;
                $scope.SelectedPharmacy = null;
                $scope.NDCPharmacies = [];
                $scope.NDCPharmaciesSearched = false;
                $('#NDCSearchName').val("");
                $('#NDCSearchCity').val("");
                $('#NDCSearchZip').val("");
                $('#pharmacySelection').val("");
            }

            $scope.states = [
                {
                    "lookup": "CA",
                    "description": "California"
                },
                {
                    "lookup": "AL",
                    "description": "Alabama"
                },
                {
                    "lookup": "AK",
                    "description": "Alaska"
                },
                {
                    "lookup": "AZ",
                    "description": "Arizona"
                },
                {
                    "lookup": "AR",
                    "description": "Arkansas"
                },
                {
                    "lookup": "CO",
                    "description": "Colorado"
                },
                {
                    "lookup": "CT",
                    "description": "Connecticut"
                },
                {
                    "lookup": "DE",
                    "description": "Delaware"
                },
                {
                    "lookup": "DC",
                    "description": "District Of Columbia"
                },
                {
                    "lookup": "FL",
                    "description": "Florida"
                },
                {
                    "lookup": "GA",
                    "description": "Georgia"
                },
                {
                    "lookup": "HI",
                    "description": "Hawaii"
                },
                {
                    "lookup": "ID",
                    "description": "Idaho"
                },
                {
                    "lookup": "IL",
                    "description": "Illinois"
                },
                {
                    "lookup": "IN",
                    "description": "Indiana"
                },
                {
                    "lookup": "IA",
                    "description": "Iowa"
                },
                {
                    "lookup": "KS",
                    "description": "Kansas"
                },
                {
                    "lookup": "KY",
                    "description": "Kentucky"
                },
                {
                    "lookup": "LA",
                    "description": "Louisiana"
                },
                {
                    "lookup": "ME",
                    "description": "Maine"
                },
                {
                    "lookup": "MD",
                    "description": "Maryland"
                },
                {
                    "lookup": "MA",
                    "description": "Massachusetts"
                },
                {
                    "lookup": "MI",
                    "description": "Michigan"
                },
                {
                    "lookup": "MN",
                    "description": "Minnesota"
                },
                {
                    "lookup": "MS",
                    "description": "Mississippi"
                },
                {
                    "lookup": "MO",
                    "description": "Missouri"
                },
                {
                    "lookup": "MT",
                    "description": "Montana"
                },
                {
                    "lookup": "NE",
                    "description": "Nebraska"
                },
                {
                    "lookup": "NV",
                    "description": "Nevada"
                },
                {
                    "lookup": "NH",
                    "description": "New Hampshire"
                },
                {
                    "lookup": "NJ",
                    "description": "New Jersey"
                },
                {
                    "lookup": "NM",
                    "description": "New Mexico"
                },
                {
                    "lookup": "NY",
                    "description": "New York"
                },
                {
                    "lookup": "NC",
                    "description": "North Carolina"
                },
                {
                    "lookup": "ND",
                    "description": "North Dakota"
                },
                {
                    "lookup": "OH",
                    "description": "Ohio"
                },
                {
                    "lookup": "OK",
                    "description": "Oklahoma"
                },
                {
                    "lookup": "OR",
                    "description": "Oregon"
                },
                {
                    "lookup": "PA",
                    "description": "Pennsylvania"
                },
                {
                    "lookup": "RI",
                    "description": "Rhode Island"
                },
                {
                    "lookup": "SC",
                    "description": "South Carolina"
                },
                {
                    "lookup": "SD",
                    "description": "South Dakota"
                },
                {
                    "lookup": "TN",
                    "description": "Tennessee"
                },
                {
                    "lookup": "TX",
                    "description": "Texas"
                },
                {
                    "lookup": "UT",
                    "description": "Utah"
                },
                {
                    "lookup": "VT",
                    "description": "Vermont"
                },
                {
                    "lookup": "VA",
                    "description": "Virginia"
                },
                {
                    "lookup": "WA",
                    "description": "Washington"
                },
                {
                    "lookup": "WV",
                    "description": "West Virginia"
                },
                {
                    "lookup": "WI",
                    "description": "Wisconsin"
                },
                { "lookup": "WY", "description": "Wyoming" }
            ];

        }
    ]);

    app.controller('LegalController', [
        '$rootScope', '$scope', 'universalPriorAuthoirzationService', function ($rootScope, $scope, universalPriorAuthoirzationService) {
            var context = this;
            $scope.showCDInfo = true;
            $scope.addSpecialJcodeMessage = null;
            $scope.dynamicMinLength = 0;


            function checkCommentString(jcodeString) {
                var string1 = "This request J3490 =";
                var string2 = "This request J9999 =";

                var re1 = new RegExp(string1, 'g');
                var re2 = new RegExp(string2, 'g');

                jcodeString = jcodeString.replace(re1, '');
                jcodeString = jcodeString.replace(re2, '');

                return jcodeString;
            }

            $scope.$on('checkSpecialJcodes', function (event, data) {
                $scope.checkIfSpecialJcode(data.code);
            });
            $scope.$on('deleteSpecialJcodes', function (event, data) {
                $scope.deleteIfSpecialJcode(data.deleted);
            });
            $scope.checkIfSpecialJcode = function (code) {
                if (code === "J9999" || code === "J3490") {
                    var commentValue2 = $scope.comment;
                    if (commentValue2 == undefined) {
                        commentValue2 = "";
                    }
                    $scope.comment = "";

                    commentValue2 = checkCommentString(commentValue2);
                    $scope.comment = "This request " + code + " = " + "\n";
                    $scope.J3490comment = "This request " + code + " = " + "\n";
                    $scope.comment += commentValue2;

                }
            }


            $scope.deleteIfSpecialJcode = function (code) {

                if (code === "J9999" || code === "J3490") {

                    $scope.comment = checkCommentString($scope.comment);
                }
            }
            $scope.$on('resetAngular', function () {
                var QuantityUIMessage = $("#QuantityUIMessage");
                QuantityUIMessage.empty();
                QuantityUIMessage.append("<span>Only 1 NDC may be submitted per submission</span>");
                context.attest = false;
                context.confidential = false;
                context.Medicare1 = false;
                context.Medicare2 = false;
                context.Medicare3 = false;
                context.Medicare4 = false;
                context.expedite = false;
                $scope.comment = "";
                $scope.showCDInfo = true;
            });
            $rootScope.$on('DrugType', function (event, data) {
                $scope.showCDInfo = data;
            });

        }
    ]);

    app.controller('PatientInformationController', [
        '$scope', function ($scope) {
            var context = this;

        }
    ]);

    app.controller('AllergyController', [
        '$scope', function ($scope) {
            var context = this;

            context.SelectedAllergy = [];


            context.countAllergy = function (newAllergy) {
                var count = 0;
                var allow = true;
                for (var i = 0; i < context.SelectedAllergy.length; i++) {

                    count += context.SelectedAllergy[i].length;
                }
                count += newAllergy.length;
                if (count > 300) {
                    allow = false;
                }
                return allow;
            }

            context.AddAllergy = function (code) {
                if (code && context.countAllergy(code)) {
                    var idx = context.SelectedAllergy.indexOf(code);
                    if (idx < 0) {
                        context.SelectedAllergy.push(code);
                    }
                    context.inputAllergy = '';
                }
            };
            context.RemoveCode = function (code) {
                var idx = context.SelectedAllergy.indexOf(code);
                context.SelectedAllergy.splice(idx, 1);
            };
            $scope.HeightSelection = function (measurement) {
                var metric = "";
                context.height = null;
                context.weight = null;
                if (measurement === 'cm') {
                    metric = "kg";
                } else {
                    metric = 'lbs';
                }
                $('#heightMeasurementDisplay').html(measurement);
                $('#hiddenHeight').val(measurement);
                $('#weightMeasurementDisplay').html(metric);
                $('#hiddenWeight').val(metric);
            }
            $scope.WeightSelection = function (measurement) {
                var metric = "";
                var currentMetric = $('#weightMeasurementDisplay').text();
                if (measurement === 'lbs') {
                    metric = "in";
                } else {
                    metric = 'cm';
                }
                if (measurement !== currentMetric)
                    $scope.Convert(metric);
                $('#weightMeasurementDisplay').html(measurement);
                $('#hiddenWeight').val(measurement);
                $('#heightMeasurementDisplay').html(metric);
                $('#hiddenHeight').val(metric);
            }
        }
    ]);

    app.controller('ProcedureController', [
        '$scope', '$rootScope', '$http', 'memberDataService', function ($scope, $rootScope, $http, memberDataService) {
            var context = this;
            $scope.CPTLoader = false;
            context.inputCPT = "";
            context.inputModifier = "";
            context.inputQty = "";
            context.SelectedProcedure = [];
            context.SelectedDescription = [];
            $scope.ShowCPT = true;
            $scope.EnterPharmInfo = false;
            $scope.$on('resetAngular', function () {
                context.SelectedProcedure = [];
                context.SelectedDescription = [];
                $scope.ShowCPT = true;

            });
            $rootScope.$on('DrugType', function (event, data) {
                $scope.ShowCPT = data;
            });
            var CPTSpinner = $('#CPTspinner');
            context.AddCPT = function (code, mod, qty) {

                if (code !== "" && qty !== "" && context.SelectedProcedure.length < 8 && code.length === 5) {

                    CPTSpinner.empty();

                    var obj = {
                        "CptCode": code,
                        "Modifier": mod
                    }
                    $scope.CPTLoader = true;
                    memberDataService.GetCptCode(obj).success(function (response) {
                        $scope.CPTLoader = false;
                        if (response.CptCodeResult.CptCode != null) {

                            if (response.ModifierResult.Modifier === null) {
                                response.ModifierResult.Modifier = "";
                                response.ModifierResult.ModifierDescription = "";
                            }
                            var idx = indexOfCpt(code, context.SelectedProcedure);

                            if (idx < 0) {
                                if (response.ModifierResult.Modifier !== "") {
                                    context.SelectedProcedure.push({
                                        cpt: response.CptCodeResult.CptCode,
                                        mod: response.ModifierResult.Modifier,
                                        qty: qty,
                                        cptDesc: response.CptCodeResult.CptFullDescriptioin,
                                        modDesc: response.ModifierResult.ModifierDescription
                                    });
                                    context.inputCPT = "";
                                    context.inputModifier = "";
                                    context.inputQty = "";
                                    CPTSpinner.empty();

                                } else {
                                    context.SelectedProcedure.push({
                                        cpt: response.CptCodeResult.CptCode,
                                        mod: "n/a",
                                        qty: qty,
                                        cptDesc: response.CptCodeResult.CptFullDescriptioin,
                                        modDesc: response.ModifierResult.ModifierDescription
                                    });
                                    context.inputCPT = "";
                                    context.inputModifier = "";
                                    context.inputQty = "";
                                    CPTSpinner.empty();

                                }
                                //set focus on cpt input
                                angular.element("[name='CptCodeInput']").focus();

                            } else {
                                CPTSpinner.empty();
                                CPTSpinner.append(
                                    '<label class="redMessage">Cannot Enter Duplicate CPT Codes'
                                );
                            }
                        } else if (response.CptCodeResult.CptCode == null && response.ModifierResult.Modifier != null) {
                            CPTSpinner.empty();
                            CPTSpinner.append(
                                '<label class="redMessage">CPT code not found'
                            );
                        } else if (response.CptCodeResult.CptCode != null && response.ModifierResult.Modifier == null) {
                            CPTSpinner.empty();
                            CPTSpinner.append(
                                '<label class="redMessage">Modifier code not found'
                            );
                        } else {
                            CPTSpinner.empty();
                            CPTSpinner.append(
                                '<label class="redMessage">CPT & Modifier codes not found'
                            );
                            context.inputCPT = "";
                            context.inputModifier = "";
                            context.inputQty = "";
                        }

                    });
                } else if (code.length < 5 || code.length > 5) {
                    CPTSpinner.empty();
                    CPTSpinner.append(
                        '<label class="redMessage">Please Enter a 5 digit CPT code'
                    );
                } else if (code === "") {
                    CPTSpinner.empty();
                    CPTSpinner.append(
                        '<label class="redMessage">Please Enter CPT Code'
                    );
                } else if (qty === "") {
                    CPTSpinner.empty();
                    CPTSpinner.append(
                        '<label slass="redMessage">Please Enter a Quantity'
                    );
                } else if (context.SelectedProcedure.length === 8) {
                    CPTSpinner.empty();
                    CPTSpinner.append(
                        '<label class="redMessage">Only 8 CPT codes per submission'
                    );
                }
            };


            context.RemoveCPT = function (code) {

                var idx = context.SelectedProcedure.indexOf(code);
                context.SelectedProcedure.splice(idx, 1);

            };
        }
    ]);

    app.controller('DiagnosesController', [
        '$scope', '$rootScope', '$http', 'memberDataService', 'universalPriorAuthoirzationService', function ($scope, $rootScope, $http, memberDataService, universalPriorAuthoirzationService) {
            var context = this;
            $scope.ICDLoader = false;

            $scope.$on('resetAngular', function () {
                context.SelectedDiagnoses = [];
                context.SelectedCodes = [];
                context.inputCodePrimary = "";
                context.inputCodeSecondary = "";
                context.inputCodeTertiary = "";

            });

            context.SelectedDiagnoses = [];
            context.RemoveDiag = function (code) {
                var idx = context.SelectedDiagnoses.indexOf(code);
                context.SelectedDiagnoses.splice(idx, 1);
            };
            context.SelectedCodes = [null, null, null];
            universalPriorAuthoirzationService.setIcds(context.SelectedCodes);
            $scope.$on('resetAngular', function () {
                context.SelectedCodes = [null, null, null];
                universalPriorAuthoirzationService.setIcds(context.SelectedCodes);

            });
            context.AddCode = function (code, index) {
                var ICDspinner = $('#ICDspinner');


                var idx = indexOfIcd(code, context.SelectedCodes);
                if (idx > -1) {
                    context.inputCode = "";
                    ICDspinner.empty();
                    ICDspinner.append('<label class="redMessage">Cannot Enter Duplicate ICD codes.</label>');
                    switch (index) {
                        case 0:
                            context.inputCodePrimary = "";

                            break;
                        case 1:
                            context.inputCodeSecondary = "";
                            break;
                        case 2:
                            context.inputCodeTertiary = "";
                            break;

                    }
                } else if (code !== "" && code !== undefined) {
                    ICDspinner.empty();
                    $scope.ICDLoader = true;

                    var obj = {
                        "IcdCode": code,
                        "Date": $('#TESTDATE').val()
                    }

                    memberDataService.GetIcdCode(obj).success(function (response) {

                        $scope.ICDLoader = false;
                        if (response != null && response.Code != null) {

                            var icdCodeRank = "";
                            switch (index) {
                                case 0:
                                    icdCodeRank = "Primary: ";
                                    break;
                                case 1:
                                    icdCodeRank = "Secondary: ";
                                    break;
                                case 2:
                                    icdCodeRank = "Tertiary: ";
                                    break;

                            }
                            context.SelectedCodes[index] = {
                                rank: icdCodeRank,
                                code: response.Code,
                                desc: response.Description + " " + response.Description2
                            };
                            context.SelectedDiagnoses[index] = (response.Description + " " + response.Description2);


                            if (index === 0) {
                                $("#icdCode1").prop('readonly', true);
                                angular.element("#icdCode2").focus();
                            } else if (index === 1) {
                                angular.element("#icdCode3").focus();
                                $("#icdCode2").prop('readonly', true);
                            } else if (index === 2) {
                                $("#icdCode3").prop('readonly', true);
                            }


                            ICDspinner.empty();
                        } else {
                            ICDspinner.empty();
                            context.inputCode = "";
                            ICDspinner.append(
                                '<label class="redMessage">ICD code not found</label>');
                        }

                    });
                }
            };
            context.RemoveCode = function (item) {
                $('#ICDspinner').empty();
                var idx = indexOfIcd(item.code, context.SelectedCodes);
                context.SelectedCodes[idx] = null;
                context.SelectedDiagnoses[idx] = null;

                if (idx === 0) {
                    $("#icdCode1").prop('readonly', false);
                    context.inputCodePrimary = '';
                } else if (idx === 1) {
                    $("#icdCode2").prop('readonly', false);
                    context.inputCodeSecondary = '';
                } else if (idx === 2) {
                    $("#icdCode3").prop('readonly', false);
                    context.inputCodeTertiary = '';
                }

            };
        }
    ]);

    app.controller('MemberVerificationController', [
        '$http', "$scope", "$compile", "$rootScope", "$state", "memberDataService", "plupLoadService", "universalPriorAuthoirzationService", "memberLobTranslationService", function ($http, $scope, $compile, $rootScope, $state, memberDataService, plupLoadService, universalPriorAuthoirzationService, memberLobTranslationService) {

            var context = this;
            context.memberId = "";
            context.memberNotFound = "";
            context.providerSpecialty = "n/a";
            $scope.loading = false;

            context.reloadUpaForm = function() {
                $state.reload();
            }
            context.SearchMember = function (event) {

                if ($scope.CMSCoverageForm.memberId.$valid) {

                    function submissionlogic() { //define submission logic before initializing plupload
                        $scope.loading = true;
                        var instance = plupLoadService.getPluploadInstance();
                        instance.bind('UploadComplete', function () {

                            var form = $("#CMSCoverageForm");
                            var domId = 'PdfData';



                            var formData = universalPriorAuthoirzationService.GetFormData(form, domId, $scope.CMSCoverageForm);


                            memberDataService.UploadUPAForm(formData).success(function (response) {

                                universalPriorAuthoirzationService.SetRecordId(response.RecordId);
                                universalPriorAuthoirzationService.AddResultToDom(response);
                                universalPriorAuthoirzationService.DisplayResubmissionInterface();

                            });


                        });
                    }

                    //function upaPluploadError() {
                    //    $('#CMSresub').modal('toggle');
                    //}

                    plupLoadService.initializePlupload(submissionlogic);
                    //plupLoadService.bindOnError(upaPluploadError);


                    var searchMemberButton = $('#searchMemberButton');
                    if (event.keyCode !== 8) {
                        var memberId = $('#memberId');
                        var searchingForMember = $('#searchingForMember');

                        context.memberId = memberId.val();
                        searchMemberButton.prop("disabled", true);

                        if ($scope.CMSCoverageForm.memberId.$valid) {

                            $('#testdatediv').hide();
                            memberId.prop("readonly", true);
                            searchingForMember.empty();

                            memberDataService.UpaGetMemberInformation(context.memberId).success(function (response) {
                                $scope.loading = false;
                                var searchDiv = $("#searchDiv");
                                if (response.MemberData.SubscriberNumber !== null && response.ProviderData.ProviderId !== null) {

                                    universalPriorAuthoirzationService.SaveMemberInformation(response.MemberData);
                                    $scope.setGlobalMemberData(response.MemberData);

                                    context.memberNotFound = "";
                                    context.memberNameF = response.MemberData.MemberFirstName;
                                    context.memberNameM = response.MemberData.MemberMiddleName;
                                    context.memberNameL = response.MemberData.MemberLastName;
                                    context.memberAddress = response.MemberData.MemberAddress2 + " " + response.MemberData.MemberAddress1;
                                    context.memberCity = response.MemberData.MemberCity;
                                    context.memberState = response.MemberData.MemberState;
                                    context.memberZip = response.MemberData.MemberZip;
                                    context.memberPhone = response.MemberData.MemberPhone;
                                    context.memberLOB = response.MemberData.MemberLob;
                                    context.memberPERSNO = response.MemberData.PersonNumber;
                                    context.memberDOB = response.MemberData.MemberDateOfBirth;
                                    context.memberSex = response.MemberData.MemberGender;

                                    context.memberAge = response.MemberData.MemberAge;
                                    context.memberCin = response.MemberData.MemberCin;
                                    context.MediCare = response.MemberData.MemberMedicareNumber;
                                    context.MediCal = response.MemberData.MemberMedicalNumber;
                                    var county = response.MemberData.MemberCounty;

                                    if (county === "33") county = "Riverside";
                                    if (county === "36") county = "San Bernardino";

                                    context.memberCounty = county;
                                    context.Aid = response.MemberData.MemberPlan;
                                    context.translatedLOB = memberLobTranslationService.translateMemberLob(response.MemberData.MemberLob,
                                                                     response.MemberData.MemberGroup,
                                                                     response.MemberData.MemberPlan);
                                    context.Group = response.MemberData.MemberGroup;


                                    universalPriorAuthoirzationService.SaveProviderInformation(response.ProviderData);

                                    $scope.setGlobalProviderData(response.ProviderData);
                                    context.providerNameF = response.ProviderData.ProviderFirstName;
                                    context.providerNameL = response.ProviderData.ProviderLastName;
                                    context.providerID = response.ProviderData.ProviderId;
                                    context.providerAddress = response.ProviderData.ProviderAddress1 + response.ProviderData.ProviderAddress2;
                                    context.providerCity = response.ProviderData.ProviderCity;
                                    context.providerState = response.ProviderData.ProviderState;
                                    context.providerZip = response.ProviderData.ProviderZip;
                                    context.providerPhone = response.ProviderData.ProviderPhone;
                                    context.providerFax = response.ProviderData.ProviderFax;
                                    context.providerNPI = response.ProviderData.ProviderNpi;

                                    if (response.ProviderData.PASPEC2 !== "")
                                        context.providerSpecialty = response.ProviderData.ProviderSpec2;


                                    $('#hideForm').show();
                                    $('#hideForm2').show();
                                    searchDiv.remove();
                                    searchMemberButton.hide();
                                    searchingForMember.empty();
                                  
                                    $('#hideForm3').show();

                                } else if (response.MemberData.SubscriberNumber == null && response.ProviderData.ProviderId !== null) {

                                    context.memberNotFound = "Member Not Found";
                                    memberId.prop('readonly', false);
                                    searchDiv.remove();

                                } else if (response.MemberData.SubscriberNumber !== null && response.ProviderData.ProviderId === null) {
                                    context.memberNotFound = "Provider Information Not Found for this Member";
                                    searchDiv.remove();
                                    memberId.prop('readonly', false);
                                } else {
                                    context.memberNotFound = "Member Not Found or Member Not Eligible";
                                    searchDiv.remove();
                                    memberId.prop('readonly', false);
                                }

                            }).error(function () {
                                $scope.loading = true;

                            });
                        };
                    }
                    searchMemberButton.prop("disabled", false);
                }
            };

            context.NewSearch = function () {
                location.reload();
            };

            //context.checkDEA = function (input) {
            //    var deaNumber = $('#deaNumber');
            //    var lastName = context.providerNameL;
            //    var dea = input.MVCtrl.dea;
            //    switch (dea.length) {
            //        case 9:
            //            if (dea[1] === lastName[0]) {

            //                var sum1 = parseInt(dea[2]) + parseInt(dea[4]) + parseInt(dea[6]);
            //                var sum2 = parseInt(dea[3]) + parseInt(dea[5]) + parseInt(dea[7]);
            //                var fsum = (sum2 * 2) + sum1;
            //                var stringSum = fsum.toString();
            //                if (stringSum[stringSum.length - 1] === dea[dea.length - 1]) {
            //                    deaNumber.removeClass('error');
            //                    deaNumber.addClass('deaGood');
            //                } else {
            //                    deaNumber.addClass('error');
            //                    deaNumber.val('');
            //                }
            //            } else {
            //                deaNumber.addClass('error');
            //                deaNumber.val('');
            //            }
            //            break;
            //        default:

            //            break;
            //    }
            //}
        }
    ]);

    app.controller('ResetController', [
        "$scope", "$rootScope", "memberDataService", "universalPriorAuthoirzationService", function ($scope, $rootScope, memberDataService, universalPriorAuthoirzationService) {
            var context = this;
            context.ResetForm = function () {


                $rootScope.$broadcast('resetAngular', {
                    reset: "reset"
                });


                $('#form-submitted-date').hide();
                $('#addedPharmacy').val(0);
                $("#MedicationTherapy").val('');
                $("#ResponseReason").val('');
                $('#ResubmissionDiv').hide();
                $('#CMSCoverageForm :input').prop("disabled", false);
                $('#CMSCoverageForm :button').prop("disabled", false);
                $('#SubmitPriorAuthForm').prop('disabled', false).show();
                $('#icdCode1').prop('readonly', false);
                $('#icdCode2').prop('readonly', false);
                $('#icdCode3').prop('readonly', false);
                $('#search-results').show();
                var uploader = $("#plupLoadUploader").pluploadQueue();
                uploader.splice();
                uploader.refresh();
                $('html, body').animate({
                    scrollTop: $("#scrollToIfCont").offset().top
                }, 1000);

                $('#CMSresub').modal('toggle');
                $('#ndcRadio').prop("checked", "checked");

                universalPriorAuthoirzationService.SetHasFiles(false);
                universalPriorAuthoirzationService.SetFileId("");
                universalPriorAuthoirzationService.SetRecordId(0);
            }

            context.ClearForm = function () {
                location.reload();
            }

            context.GetPdf = function () {
                $scope.pdfLoading = true;
                var confirmationNumber = universalPriorAuthoirzationService.GetConfirmationNumber();
                memberDataService.GetPdf(universalPriorAuthoirzationService.GetRecordId(), confirmationNumber).success(function (response) {
                    $scope.pdfLoading = false;

                    if (window.navigator.msSaveOrOpenBlob) {

                        window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }), "UPA");
                    } else {

                        var file = new Blob([response], { type: 'application/pdf' });
                        var fileUrl = URL.createObjectURL(file);
                        window.open(fileUrl);
                    }

                }).error(function (data) {
                    $scope.pdfLoading = false;
                });
            }
        }
    ]);

    app.controller('UPASubmitController', [
         '$http', "$scope", "$rootScope", "$filter","plupLoadService", "universalPriorAuthoirzationService", function ($http, $scope, $rootScope,$filter, plupLoadService, universalPriorAuthoirzationService) {

             $scope.drugs = [];
             $scope.icds = [];
             $scope.drugs = universalPriorAuthoirzationService.getDrugs();
             $scope.icds = universalPriorAuthoirzationService.getIcds();
             $scope.filterObject = {};




             $scope.$on('resetAngular', function () {
                 $scope.drugs = universalPriorAuthoirzationService.getDrugs();
                 $scope.icds = universalPriorAuthoirzationService.getIcds();
             });


             $scope.SubmitDocs = function () {

                 $('#ICDspinner').empty();
                 $('#CPTspinner').empty();
                 $scope.drugs = universalPriorAuthoirzationService.getDrugs();
                 $scope.icds = universalPriorAuthoirzationService.getIcds();

                 $scope.CMSCoverageForm.$submitted = true;

                 if ($scope.CMSCoverageForm.$valid && $scope.drugs.length && $scope.icds[0]) {
                     $('#form-submitted-date label').text("Submitted to IEHP on " + $filter('date')(Date.now(), "MM/dd/yyyy h:mma"));
                     $('#form-submitted-date').show();
                     $("#id").css("display", "block");
                     $scope.filterObject = {
                         SubscriberNumber: $('#memberId').val(),
                         FormName: "UPA",
                         Department: "Pharmacy"
                     }
                     plupLoadService.bindFilterObject($scope.filterObject);
                     var submitDocumentsResult = plupLoadService.submitDocuments();
                     universalPriorAuthoirzationService.SetHasFiles(submitDocumentsResult.HasFiles);
                     universalPriorAuthoirzationService.SetFileId(submitDocumentsResult.FileId);
                     $scope.submissionloading = false;
                 }
                 else {

                     angular.element("[name='" + $scope.CMSCoverageForm.$name + "']").find('.ng-invalid:visible:first').focus();

                 }
             }
         }]);

})();

