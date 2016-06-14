
(function () {
    var app = angular.module('MemberPortal');

   

    function emptyChildren(div) {

        if (div !== null && div !== undefined) {
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }

        }
    }
    function disablePreliminaryForm() {

        var subCheckBoxes = document.getElementById('preFormDivID').getElementsByTagName('input');
        for (var i = 0; i < subCheckBoxes.length; i++) {
            subCheckBoxes[i].disabled = true;
        }

    }
    function padProviderId() {

        var prov = document.getElementById('prov');
        var length = prov.value.length;

        if (prov.value !== '') {
            var padding = "0";

            if (length < 12) {
                var loopCond = 12 - length;
                for (loopCond; loopCond > 1; loopCond--) {
                    padding += "0";
                }
            } else {
                padding = "";
            }
            var pid = prov.value;
            var paddedPid = (padding += pid);
            prov.value = paddedPid;
            return true;
        }
        return false;
    }
    function continueForm() {

        $("#continueform").fadeOut();
        $('#subHidden').val($('#sub').val());
        $('#provHidden').val($('#prov').val());
    }

    function validateAngularAtLeastOneGroup(objectToValidate, valueToCheck) {
        var isValid = false;  //return bool for use in html
        var validCount = 0;   //used to break out of loop 

        if (!valueToCheck) { //check to see if a "compare to" parameter was supplied

            for (var property in objectToValidate) {

                if (objectToValidate.hasOwnProperty(property)) {
                    if (objectToValidate[property]) {
                        validCount++;
                    }
                }
                if (validCount) {
                    break;
                }
            }

        } else {

            for (var property in objectToValidate) {

                if (objectToValidate.hasOwnProperty(property)) {
                    if (objectToValidate[property] === valueToCheck) {
                        validCount++;
                    }
                }
                if (validCount) {
                    break;
                }
            }
        }

        if (validCount)
            isValid = true;

        return isValid; //return bool

    }

    app.filter("jsDate", function () {
        return function (x) {
            return new Date(x);
        };
    });
    app.filter("na", function () {

        return function (value) {
            if (value === "") {
                return "N/A";
            } else {
                return value;
            }
        };
    });
    app.filter("comma", function () {

        return function (value) {
            if (value != null || value !== undefined)
                return value + ", ";
            return "";
        };
    });
    app.service('Data', function () {


        var isIcd10 = false;
        return {
            AssignIsIcd10: function (dos) {
                var dosDate = new Date(dos.val());
                var icd10Date = new Date("10/1/2015");

                if (dosDate < icd10Date) {
                    isIcd10 = false;
                } else {
                    isIcd10 = true;
                }
            },
            GetIsIcd10: function () {
                return isIcd10;
            }

        }
    });

    app.controller('InitializeBhController', [
     '$scope', '$http', '$rootScope', '$state', 'contentAuthorizationService', function ($scope, $http, $rootScope, $state, contentAuthorizationService) {
         $scope.siteItem = [];
         $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);
     }
    ]);

    app.controller('ReferralController', ['$http', '$scope', 'memberDataService', function ($http, $scope, memberDataService) {

        var context = this;
        context.pNotFound = false;
        context.providerResults = [];
        $scope.timeout;

        var myModal = $('#myModal');

        myModal.on('hidden.bs.modal', function () {
            $scope.searchTextBHPROV = '';
            context.providerResults = "";
            emptyChildren(document.getElementById('CoBHproviderSearchResults'));

        });

        context.ToggleBHSearchModal = function (which) {
            var myModal = $('#myModal1');
            myModal.modal('toggle');
        }

        $scope.clearProvider = function () {
            $scope.coTreatingProvSearch = "";
            document.getElementById('coBhProvider').value = '';
        }

        context.SearchBHproviders = function () {
            var searchString = $('#CoBhSearch').val();
            var coBHproviderSearchResults;

            if (/\S/.test(searchString)) {
                coBHproviderSearchResults = document.getElementById('CoBHproviderSearchResults');
                var bhSearch1 = document.getElementById('bhSearch1');

                emptyChildren(coBHproviderSearchResults);

                window.clearTimeout($scope.timeout);
                $scope.timeout = window.setTimeout(function () {
                    memberDataService.BhCocBroadSearchForProviders(searchString).success(function (response) {

                        if (response.length === 0) {

                            context.providerResults = response;
                            document.getElementById('BHproviderSearchResults').innerHTML = '<label style="color:red">No Providers found.</label>';

                        } else {

                            emptyChildren(document.getElementById('BHproviderSearchResults'));
                            context.providerResults = response;
                        }
                    }).error(function (error) {

                    });
                }, 280);
            } else {

                emptyChildren(coBHproviderSearchResults);
                context.providerResults = [];
                window.clearTimeout($scope.timeout);
            }
        }

        context.loadProviderTaxId = function (elem) {

            var myModal = $('#myModal');
            var provId = elem.address.ProviderId;
            var idString = "";


            if (provId !== undefined) {
                idString = "( " + provId + " )";
            }

            $scope.coTreatingProvSearch = elem.address.ProviderFirstName + " " + elem.address.ProviderLastName + +idString;
            var coBhProvider = $('#coBhProvider');
            coBhProvider.val(elem.address.ProviderFirstName + " " + elem.address.ProviderLastName + idString);
            $scope.searchTextBHPROV = '';
            myModal.modal('hide');
        }

        context.ManuallyEnterProv = function () {
            var myModal = $('#myModal');
            var coBhProvider = $('#coBhProvider');
            coBhProvider.val(document.getElementById('EnterProviderModal1').value);
            //coBhProvider.valid();
            myModal.modal('hide');
            context.enterProv = "";
        }

    }]);

    app.controller('CurrentMedicationController', ['$scope', '$rootScope', 'behavioralHealthService', function ($scope, $rootScope, behavioralHealthService) {

        var context = this;
        context.medicationInstance = [];
        context.RxTable = [];
        context.RxTableClaims = [];

        //arrays used for pagination of medication and case results
        context.PagedRx = [];
        context.itemsPerPage = 10;
        context.currentPage = 0;
        context.gap = 0;

        //pagination 2
        context.PagedRxClaims = [];
        context.currentPage2 = 0;
        context.gap2 = 0;


        context.pageItems = function (arrayTopage) {

            context.RxTable = arrayTopage;
            for (var i = 0; i < arrayTopage.length; i++) {
                if (i % context.itemsPerPage === 0) {
                    context.PagedRx[Math.floor(i / context.itemsPerPage)] = [arrayTopage[i]];
                } else {
                    context.PagedRx[Math.floor(i / context.itemsPerPage)].push(arrayTopage[i]);
                }
            }
            context.gap = context.PagedRx.length;
        }

        context.range = function (size, start, end) {
            var ret = [];
            if (size < end) {
                end = size;
                start = size - context.gap;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        context.setPage = function (n) {

            context.currentPage = n;

        };
        context.prevPage = function () {
            if (context.currentPage > 0) {
                context.currentPage--;
            }
        };

        context.nextPage = function () {
            if (context.currentPage < context.PagedRx.length - 1) {
                context.currentPage++;
            }
        };
        ///////////////2nd Pagination////////////////
        context.pageItems2 = function (arrayTopage) {

            context.RxTableClaims = arrayTopage;
            for (var i = 0; i < arrayTopage.length; i++) {
                if (i % context.itemsPerPage === 0) {
                    context.PagedRxClaims[Math.floor(i / context.itemsPerPage)] = [arrayTopage[i]];
                } else {
                    context.PagedRxClaims[Math.floor(i / context.itemsPerPage)].push(arrayTopage[i]);
                }
            }
            context.gap2 = context.PagedRxClaims.length;
        }

        context.range2 = function (size, start, end) {
            var ret = [];
            if (size < end) {
                end = size;
                start = size - context.gap;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            return ret;
        };

        context.setPage2 = function (n) {

            context.currentPage2 = n;

        };
        context.prevPage2 = function () {
            if (context.currentPage2 > 0) {
                context.currentPage2--;
            }
        };

        context.nextPage2 = function () {
            if (context.currentPage2 < context.PagedRx.length - 1) {
                context.currentPage2++;
            }
        };

        ///////////////End 2nd Pagination////////////


        context.ShowArray = function () {
            console.log(context.medicationInstance);
        }
        context.AddInstance = function () {
            if (context.medicationInstance.length <= 10) {
                context.medicationInstance.push({});
                behavioralHealthService.setMedications(context.medicationInstance);
            }
        }
        context.RemoveInstance = function (idx) {

            if (context.medicationInstance.length > 1) {
                context.medicationInstance.splice(idx, 1);
                behavioralHealthService.setMedications(context.medicationInstance);
            } else {
                context.Type = 'no';
                context.ResetMedications();
            }
        }

        context.ResetMedications = function () {
            context.medicationInstance.length = 0;
            behavioralHealthService.setMedications(context.medicationInstance);
        }

        $rootScope.$on('rxEvent', function (event, response) {
            var loadingRx = $('#loadingRx');
            if (response.length > 0) {
                context.pageItems(response);

                loadingRx.empty();
                loadingRx.hide();

            } else {
                context.RxTable = [];
                $('#CaseTable').remove();
                loadingRx.empty();
                loadingRx.append("<div><label> No Records Found ( 6 months prior )</span></div>");

            }
        });

        $rootScope.$on('rxEventClaims', function (event, response) {
            var loadingRx = $('#loadingRxClaims');
            if (response.length > 0) {

                context.pageItems2(response);
                loadingRx.empty();
                loadingRx.hide();
            } else {
                context.RxTableClaims = [];
                $('#ClaimsTable').remove();
                loadingRx.empty();
                loadingRx.append("<div><label> No Records Found ( 1 month prior )</span></div>");
            }
        });

    }]);

    app.controller('BehavioralHealthDiagController', ['$scope', function ($scope) {
        $scope.BehavDiag = {};
        $scope.isValid = false;
        $scope.validateCheck = function () {

            $scope.isValid = validateAngularAtLeastOneGroup($scope.BehavDiag);
        }

    }]);

    app.controller('CurrentTreatmentController', function () {


    });

    app.controller('ImpairmentsController', ['$scope', function ($scope) {
        $scope.Impairment = {};
        $scope.isValid = false;
        $scope.validateCheck = function () {

            $scope.isValid = validateAngularAtLeastOneGroup($scope.Impairment);
        }
    }]);

    app.controller('MajorProblemsController', ['$scope', function ($scope) {

        $scope.validateMajorProblems = {};
        $scope.isValid = false;
        $scope.validateCheck = function () {

            $scope.isValid = validateAngularAtLeastOneGroup($scope.validateMajorProblems);
        }

    }]);

    app.controller('SafetyAssesmentController', function () {


    });

    app.controller('MemberInformationController', function () {

    });

    ///main controller, parent controller
    app.controller('BhInitMainController', ['$http', '$scope', '$rootScope', '$state', '$filter', 'Data', 'memberDataService', 'plupLoadService', 'behavioralHealthService','memberLobTranslationService',
        function ($http, $scope, $rootScope, $state, $filter, Data, memberDataService, plupLoadService, behavioralHealthService, memberLobTranslationService) {

            var context = this;
            context.MemberPcp = "";                                //member pcp info
            context.Provid = "";                                   //provider Id
            context.memberLOB = "";                                //member LOB

            $scope.ContinuePressed = false;                        //if user pressed continue on prelim form
            $scope.showForm = false;                               //open up rest of form
            $scope.icdCodes = [];                                  //array used for ICD code display
            $scope.icdCodesDescription = [];                       //array used for ICD code description deisplay
            $scope.continueFormLoader = false;                     //loader variable
            $scope.search = {};                                    //object that holds search date validation
            $scope.search.date = moment().format('MM/DD/YYYY');
            $scope.formSubmmittedDate = Date.now();                 //variable that holds when the form was submitted
            $scope.ValidDate = true;                                //holds if the date is valid, set to true for expected behavior
            $scope.pdfLoading = false;                              //loader variable
            $scope.isIcd10 = false;                                 //checks date to to use icd 10 or 9
            $scope.filterObject = {};                               //object used for file submission holds information regarding form
            $scope.InitFileTrack = 0;                               //file tracker ammount    

            //plupload object
            $scope.pluploadObject = {};
            //validation objects
            $scope.develScreen = {};
            $scope.serviceRequested = {};
            $scope.serviceRequested.Top = {};
            $scope.serviceRequested.EvaluMedical = {};
            $scope.serviceRequested.chronicConditions = {};
            $scope.serviceRequestedSub = {};
            $scope.substance = {};
            //validation booleans
            $scope.isTopValid = false;
            $scope.isEvalTopValid = false;
            $scope.isChronicConditionsValid = false;
            $scope.isDevelopmentalDisordersValid = false;

            $scope.validateTopCheck = function () {
                $scope.isTopValid = validateAngularAtLeastOneGroup($scope.serviceRequested.Top);
            }

            $scope.validateDevelopmentalCheck = function () {
                $scope.isDevelopmentalDisordersValid = validateAngularAtLeastOneGroup($scope.serviceRequestedSub);
            }

            $scope.validateEvalTopCheck = function () {
                $scope.isEvalTopValid = validateAngularAtLeastOneGroup($scope.serviceRequested.EvaluMedical);
            }

            $scope.validateChronicConditionsCheck = function () {
                $scope.isChronicConditionsValid = validateAngularAtLeastOneGroup($scope.serviceRequested.chronicConditions);
            }

            $scope.search.validateDate = function () {

                if ($scope.BehavioralHealthForm.DateOfService.$valid) {
                    var elementDate = moment($scope.DateOfService);
                    var nowDate = moment($scope.search.date);
                    if (elementDate <= nowDate) {
                        $scope.ValidDate = true;
                        $scope.setProperIcdCodes();
                        context.ClearNotFoundMember(elementDate);
                    } else {
                        $scope.DateOfService = null;
                        $scope.ValidDate = false;
                    }
                }
            };

            $scope.ResetPreliminaryForm = function () {

                $state.reload();
            }

            context.GetPdf = function () {
                $scope.pdfLoading = true;
                var confirmationNumber = behavioralHealthService.GetConfirmationNumber();
                memberDataService.BhGetPdf(behavioralHealthService.GetRecordId(), confirmationNumber).success(function (response) {
                    $scope.pdfLoading = false;

                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }), "Behavioral Health");
                    } else {
                        var file = new Blob([response], { type: 'application/pdf' });
                        var fileUrl = URL.createObjectURL(file);
                        window.open(fileUrl);
                    }

                }).error(function (data) {
                    $scope.pdfLoading = false;
                });
            }

            $scope.invalidMemberId = false;
            context.ValidateMemberId = function () {
                context.MemberIdNotFound = "";
                var memberId = $scope.BehavioralHealthForm.sub.$viewValue;

                if ($scope.BehavioralHealthForm.sub.$valid) {
                    context.memberDisenrolledMessage = "";
                    memberDataService.CheckMemberId(memberId).success(function (response) {
                        if (response && response.SubscriberNumber) {
                            $scope.invalidMemberId = false;
                        } else {
                            context.MemberIdNotFound = "Member not found";
                            $scope.invalidMemberId = true;
                        }

                    }).error(function (error) {

                    });
                }
            }

            $scope.clearResultError = function () {
                emptyChildren(document.getElementById('authNumberError'));
            }

            //need to make 2 different functions since one is hitting a webservice and another a database, timing issue
            context.lazyLoadRxHistory = function (id) {

                var loadingRx = $('#loadingRx');
                var loadingRxClaims = $('#loadingRxClaims');

                var memberId = "";
                if (id === undefined) {
                    memberId = document.getElementById('sub').value;
                } else {
                    memberId = id;
                }

                loadingRx.append('<div><img src=../Content/loading.gif /> <label> Loading RX History </label></div>');

                memberDataService.GetMemberRxHistory(memberId).success(function (response) {

                    $rootScope.$broadcast('rxEvent', response);
                    loadingRxClaims.append('<div><img src=../Content/loading.gif /> <label Loading RX History </label></div>');

                    memberDataService.GetMemberRxHistoryClaims(memberId).success(function (response2) {

                        $rootScope.$broadcast('rxEventClaims', response2);
                    }).error(function (e) {
                        loadingRxClaims.empty();
                        loadingRxClaims.append("<div><strong> No Records Available.</strong></div>");
                    });

                }).error(function () {
                    var loadingRxClaims = $('#loadingRxClaims');
                    loadingRxClaims.empty();
                    loadingRxClaims.append("<div><strong> An Error Occurred Retrieving Pharmacy Information.</strong></div>");

                });


            }

            context.loadProviderTaxId = function (elem, index) {
                behavioralHealthService.setSelectedProvider(elem.address.ProviderId);
                $scope.provider = (elem.address.ProviderFirstName + " " + elem.address.ProviderLastName) + "  ( " + elem.address.ProviderId + " ) ";
                $('#ProviderModal').modal('hide');

                context.providerNotFound = "";

                memberDataService.BhGetProviderInfromationWithAltAddress(elem.address.ProviderId, elem.address.Address1).success(function (response) {

                    if (response.ProviderId != null) {
                        context.RequestingName = response.ProviderFirstName + " " + response.ProviderLastName;
                        context.RequestingId = response.ProviderId;
                        context.RequestingAddress = response.ProviderAddress1 + " " + response.ProviderAddress2;
                        context.Address1 = response.ProviderAddress1;
                        context.RequestingCity = response.ProviderCity;
                        context.RequestingState = response.ProviderState;
                        context.RequestingPhone = response.ProviderPhone;
                        context.RequestingZip = response.ProviderZip;
                        context.RequestingNPI = response.ProviderNpi;
                        context.RequestingFAX = response.ProviderFax;
                    }
                });
            }
            ////function that searches for providers with same tax id as user, takes into account member LOB

            $scope.providerSelected = false;
            context.providerTaxIdSearch = function () {
                var sub = $scope.BehavioralHealthForm.sub;
                if (sub.$valid && !$scope.memberDisenrolled) {
                    $('#providerSearchSpan').empty();
                    context.providerResults = "";
                    memberDataService.BhGetProivdersByTaxId(context.memberLOB).success(function (response) {

                        context.providerResults = response;
                        $('#ProviderModal').modal('toggle');
                        $scope.BehavioralHealthForm.$submitted = false;

                    });
                }
            }

            $scope.isHealthKids = false;
            $scope.memberDisenrolled = false;

            context.ClearNotFoundMember = function (elem) {
                $scope.isHealthKids = false;
                context.memberNotFound = "";
                context.memberDisenrolledMessage = "";
                context.providerNotFound = "";
                var memberSearchSpan = document.getElementById('memberSearchSpan');

                emptyChildren(memberSearchSpan);

                if ($scope.BehavioralHealthForm.sub.$valid) {

                    memberDataService.BhGetMemberInformation($scope.BehavioralHealthForm.sub.$viewValue, elem).success(function (response) {

                        if (response.MemberData && response.MemberData.SubscriberNumber !== null && response.ProviderData.ProviderId !== null) {

                            $("#searchProviderTaxIdButton").prop("disabled", false);
                            if (response.MemberData.MemberGroup === 'RVC-HKC') {
                                context.memberNotFound = "This is a Healthy Kids Member. Please refer Member for Behavioral Health assessment, diagnosis and treatment through the Intake Units established by the County Mental Health Plans at: (800) 706-7500 Riverside County";
                                $scope.isHealthKids = true;
                                emptyChildren(memberSearchSpan);
                            } else {

                                $('#disableButtons :input').prop('disabled', false);
                                $('#prov').prop('disabled', false);
                                $("#sub").prop('disabled', true);

                                emptyChildren(memberSearchSpan);


                                context.memberName = response.MemberData.MemberFirstName + " " + response.MemberData.MemberLastName;
                                context.memberAddress = response.MemberData.MemberAddress2 + " " + response.MemberData.MemberAddress1;
                                context.memberPhone = response.MemberData.MemberPhone;
                                //handle county codes
                                var county = response.MemberData.MemberCounty;
                                if (county === "33") county = "Riverside";
                                if (county === "36") county = "San Bernardino";
                                context.memberCounty = county;
                                context.memberId = response.MemberData.SubscriberNumber;

                                context.DOB = response.MemberData.MemberDateOfBirth;
                                context.MemberPcp = response.MemberData.MemberPcp;

                                context.Sex = response.MemberData.MemberGender;
                                context.City = response.MemberData.MemberCity;
                                context.State = response.MemberData.MemberState;
                                context.Zip = response.MemberData.MemberZip;
                                context.MediCare = response.MemberData.MemberMcr;
                                context.MediCal = response.MemberData.MemberMed;
                                context.memberLOB = response.MemberData.MemberLob;
                                context.translatedLOB = memberLobTranslationService.translateMemberLob(response.MemberData.MemberLob,
                                                                     response.MemberData.MemberGroup,
                                                                     response.MemberData.MemberPlan);
                                context.Age = response.MemberData.MemberAge;
                                context.Aid = response.MemberData.MemberPlan;
                                context.Group = response.MemberData.MemberGroup;
                                context.CIN = response.MemberData.MemberCin;
                                context.memberProviderID = response.ProviderData.ProviderId;
                                $scope.memberDisenrolled = false;

                            }
                        } else {
                            context.memberDisenrolledMessage = "";
                            context.memberDisenrolledMessage = "Member eligibility is disenrolled on Date Of Service " + $scope.DateOfService;
                            context.memberLOB = "";
                            emptyChildren(memberSearchSpan);
                            $scope.memberDisenrolled = true;
                            $scope.DateOfService = null;
                        }
                    });

                }

            }



            //loads member and provider information (requesting and member's)
            context.Load = function () {

                $scope.ContinuePressed = true;
                padProviderId();

                if ($scope.validatePreliminaryForm()) {

                    disablePreliminaryForm();
                    Data.AssignIsIcd10($("#DateOfService"));

                    if (context.MemberPcp !== "") {

                        $scope.continueFormLoader = true;
                        memberDataService.BhGetProviderInfromation(context.MemberPcp).success(function (response) {
                            $scope.continueFormLoader = false;
                            var pSS = document.getElementById('providerSearchSpan');

                            if (response.ProviderId !== null) {
                                emptyChildren(pSS);
                                //pSS.innerHTML = '<span style="color:green;padding-top:8px" class="glyphicon glyphicon-ok"></span>';

                                context.providerName = response.ProviderLastName + " " + response.ProviderFirstName;
                                context.providerId = response.ProviderId;
                                context.providerAddress = response.ProviderAddress1 + " " + response.ProviderAddress2;
                                context.providerCity = response.ProviderCity;
                                context.providerState = response.ProviderState;
                                context.providerPhone = response.ProviderPhone;
                                context.providerZip = response.ProviderZip;
                                context.providerNPI = response.ProviderNpi;
                                context.providerFAX = response.ProviderFax;


                                $('#searchDiv').remove();
                                $('#preFormDivID label').attr("disabled", true);

                                context.memberNotFound = "";
                                context.providerNotFound = "";
                                continueForm();
                                $scope.showForm = true;

                                //start lazy loading rx history
                                context.lazyLoadRxHistory();

                                function submissionlogic() { //define submission logic before initializing plupload
                                    $scope.loading = true;
                                    var instance = plupLoadService.getPluploadInstance();
                                    instance.bind('UploadComplete', function () {

                                        var form = $("#BehavioralHealthForm");
                                        var domId = 'PdfData';
                                        var formData = behavioralHealthService.GetFormData(form, domId, $scope.BehavioralHealthForm);

                                        memberDataService.UploadBHINITForm(formData).success(function (response) {
                                            //do stuff for user to show confirmation and what not from service
                                            behavioralHealthService.SetRecordId(response.RecordId);
                                            behavioralHealthService.AddResultToDom(response);
                                            behavioralHealthService.DisplayResubmissionInterface();
                                        });


                                    });
                                }

                                $scope.setProperIcdCodes();
                                plupLoadService.initializePlupload(submissionlogic);

                                //need to bind these functions in order for scope to update

                                $scope.pluploadObject = $("#plupLoadUploader").pluploadQueue();

                                $scope.pluploadObject.bind('FilesAdded', function () {
                                    $scope.InitFileTrack = $scope.pluploadObject.files.length;
                                    $scope.$apply();
                                });

                                $scope.pluploadObject.bind('FilesRemoved', function () {
                                    $scope.InitFileTrack = $scope.pluploadObject.files.length;
                                    $scope.$apply();
                                });

                            } else {

                                context.providerNotFound = "Provider not found";
                                $('#searchDiv').remove();
                            }

                            $('#continueform').prop("disabled", false);

                        }).error(function (e) {

                            context.memberNotFound = "Member not found";
                            context.providerNotFound = "Provider not found";
                            $('#searchDiv').remove();
                            $('#continueform').prop("disabled", false);

                        });
                    }
                } else {
                    angular.element("[name='" + $scope.BehavioralHealthForm.$name + "']").find('.ng-invalid:visible:first').focus();
                }
            };

            $scope.setProperIcdCodes = function () {
                //get icd codes
                Data.AssignIsIcd10($("#DateOfService"));
                $scope.isIcd10 = Data.GetIsIcd10();

                //assign icd codes
                if (!$scope.isIcd10) {
                    $scope.icdCodes = ["299.00", "299.80", "299.10", "299.80", "299.80", ""];
                    $scope.icdCodesDescription = ["Autistic Disorder", "Rett's Disorder", "Childhood Disintegration Disorder", "Asperger's Disorder", "Pervasive Developmental Disorder NOS", ""];
                } else {
                    $scope.icdCodes = ["F84.0", "F84.2", "F84.3", "F84.5", "F84.8", "F84.9"];
                    $scope.icdCodesDescription = ["Autistic disorder", "Rett's syndrome", "Other childhood disintegrative disorder", "Asperger's syndrome", "Other pervasive developmental disorders", "Pervasive developmental disorder, unspecified"];
                }

            }

            $scope.validatePreliminaryForm = function () {

                var v1 = $scope.BehavioralHealthForm.RiskAssessmentSuicidal.$valid;
                var v2 = $scope.BehavioralHealthForm.RiskAssessmentSuicidalPlans.$valid;
                var v3 = $scope.BehavioralHealthForm.RiskAssessmentSuicidalMeans.$valid;
                var v4 = $scope.BehavioralHealthForm.RiskAssessmentHomicidal.$valid;
                var v5 = $scope.BehavioralHealthForm.RiskAssessmentHomicidalPlans.$valid;
                var v6 = $scope.BehavioralHealthForm.RiskAssessmentHomicidalMeans.$valid;
                var v7 = $scope.BehavioralHealthForm.RiskAssessmentWithdrawals.$valid;
                var v8 = $scope.BehavioralHealthForm.RiskAssessmentClinic.$valid;
                var v9 = $scope.BehavioralHealthForm.RiskAssessmentProvider.$valid;
                var v10 = $scope.BehavioralHealthForm.RiskAssessmentSelfInjury.$valid;
                var v11 = $scope.BehavioralHealthForm.RiskAssessmentPhycHosp.$valid;
                var v12 = $scope.BehavioralHealthForm.RiskAssessmentRunAway.$valid;
                var v13 = $scope.BehavioralHealthForm.RiskAssessmentDisabled.$valid;
                var v14 = $scope.BehavioralHealthForm.sub.$valid;
                var v15 = $scope.BehavioralHealthForm.DateOfService.$valid;
                var v16 = $scope.BehavioralHealthForm.prov.$valid;
                var validate = (v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8 && v9 && v10 && v11 && v12 && v13 && v14 && v15 && v16);
                return validate;
            }

            $scope.submitForm = function (formName) {

                $scope.BehavioralHealthForm.$submitted = true;
                if ($scope.BehavioralHealthForm.$valid && !$scope.memberDisenrolled) {

                    $('#form-submitted-date label').text("Submitted to IEHP on " + $filter('date')(Date.now(), "MM/dd/yyyy h:mma"));
                    $('#form-submitted-date').show();
                    $scope.filterObject = {
                        SubscriberNumber: $('#subHidden').val(),
                        FormName: formName,
                        Department: "BH"
                    }
                    plupLoadService.bindFilterObject($scope.filterObject);
                    var submitDocumentsResult = plupLoadService.submitDocuments();
                    behavioralHealthService.SetHasFiles(submitDocumentsResult.HasFiles);
                    behavioralHealthService.SetFileId(submitDocumentsResult.FileId);
                } else {
                    //custome validate
                    var x = angular.element("[name='" + $scope.BehavioralHealthForm.$name + "']").find('.ng-invalid:visible:first').focus();

                    if (!x.length) {
                        $scope.scrollToValidate('mmpNoPage');
                    } else if (x.length && x[0].attributes.name.nodeValue === "CurrentTreatment") {
                        $scope.scrollToValidate('currentTreatmentValidate');

                    } else if (x.length && x[0].attributes.name.nodeValue === "release") {
                        $scope.scrollToValidate('releaseValidate');

                    } else if (x.length && x[0].attributes.name.nodeValue === "CurrentMentalMedication") {
                        $scope.scrollToValidate('currentMedicationValidate');

                    } else if (x.length && (x[0].attributes.name.nodeValue === "impairFunction" || x[0].attributes.name.nodeValue === "impair21")) {
                        $scope.scrollToValidate('impairSubValidate');
                    }
                }

            }

            $scope.scrollToValidate = function (id) {
                $("html, body").animate({ scrollTop: $('#' + id).offset().top }, 200);
            }
        }]);

    app.controller('BhCocMainController', ['$http', '$scope', '$rootScope', '$state', 'Data', 'memberDataService', 'plupLoadService', 'behavioralHealthService', 'memberLobTranslationService',
       function ($http, $scope, $rootScope, $state, Data, memberDataService, plupLoadService, behavioralHealthService, memberLobTranslationService) {

           var context = this;
           context.MemberPcp = "";
           context.Provid = "";
           context.memberLOB = "";
           $scope.develScreen = {};
           $scope.search = {};
           $scope.search.date = moment().format('MM/DD/YYYY');
           $scope.ValidDate = true;
           $scope.ContinuePressed = false;
           $scope.showForm = false;
           $scope.icdCodes = [];
           $scope.icdCodesDescription = [];
           $scope.continueFormLoader = false;
           $scope.requestingProvider = "";
           $scope.memberPcp = "";


           $scope.search.validateDateCoC = function () {

               if ($scope.BehavioralHealthForm.DateOfService.$valid) {
                   var elementDate = moment($scope.DateOfService);
                   var nowDate = moment($scope.search.date);
                   if (elementDate <= nowDate) {
                       $scope.ValidDate = true;
                       $scope.setProperIcdCodes();
                       context.CheckAuthorization();
                   } else {
                       $scope.DateOfService = null;
                       $scope.ValidDate = false;
                   }
               }
           };

           $scope.ResetPreliminaryFormCOC = function () {
               $state.reload();
           }

           $scope.invalidMemberId = false;
           context.ValidateMemberId = function () {
               context.MemberIdNotFound = "";
               var memberId = $scope.BehavioralHealthForm.sub.$viewValue;

               if ($scope.BehavioralHealthForm.sub.$valid) {
                   context.memberDisenrolledMessage = "";
                   memberDataService.CheckMemberId(memberId).success(function (response) {
                       if (response && response.SubscriberNumber) {
                           $scope.invalidMemberId = false;
                       } else {
                           context.MemberIdNotFound = "Member not found";
                           $scope.invalidMemberId = true;
                       }

                   }).error(function (error) {

                   });
               }
           }
           context.CheckAuthorization = function () {

               var authNumber = $scope.BehavioralHealthForm.authNumber;
               var dateOfService = $scope.BehavioralHealthForm.DateOfService;

               if (authNumber.$valid && dateOfService.$valid) {
                   Data.AssignIsIcd10($("#DateOfService"));
                   var authNumberError = document.getElementById('continueLoading');
                   emptyChildren(authNumberError);
                   $("#COCcontinue").prop("disabled", true);

                   var postObj = {
                       "AuthorizationNumber": authNumber.$viewValue,
                       "DateOfService": dateOfService.$viewValue
                   };

                   memberDataService.CocCheckAuthorization(postObj).success(function (response) {

                       var continueLoading = document.getElementById('continueLoading');
                       var dateOfServiceError = document.getElementById('DateOfServiceError');
                       var dateSuccessSpan = document.getElementById('DateSuccessSpan');
                       var authSearchSpan = document.getElementById('AuthSearchSpan');
                       var dateofService = document.getElementById('DateOfService');

                       emptyChildren(continueLoading);
                       emptyChildren(dateOfServiceError);
                       console.log(response);
                       if (response.CheckedAuthorization.CheckCode === 3) {
                           $("#authNumber").prop("readonly", true);
                           emptyChildren(dateSuccessSpan);
                           context.memberName = response.MemberData.MemberFirstName + " " + response.MemberData.MemberLastName;
                           context.memberAddress = response.MemberData.MemberAddress2 + " " + response.MemberData.MemberAddress1;
                           context.memberPhone = response.MemberData.MemberPhone;
                           var county = response.MemberData.MemberCounty;
                           if (county === "33") county = "Riverside";
                           if (county === "36") county = "San Bernardino";
                           context.memberCounty = county;
                           context.memberId = response.MemberData.SubscriberNumber;
                           $scope.SubNo = response.MemberData.SubscriberNumber;
                           context.DOB = response.MemberData.MemberDateOfBirth;
                           context.Age = response.ComputedAge;
                           context.Sex = response.MemberData.MemberGender;
                           context.City = response.MemberData.MemberCounty;
                           context.State = response.MemberData.MemberState;
                           context.Zip = response.MemberData.MemberZip;
                           context.MediCare = response.MemberData.MemberMedicareNumber;
                           context.MediCal = response.MemberData.MemberMedicalNumber;

                           context.memberLOB = response.MemberData.MemberLobMemberLob;
                           context.translatedLOB =  memberLobTranslationService.translateMemberLob(response.MemberData.MemberLob,
                                                                 response.MemberData.MemberGroup,
                                                                 response.MemberData.MemberPlan);
                           context.Aid = response.MemberData.MemberPlan;
                           context.Group = response.MemberData.MemberGroup;
                           context.CIN = response.MemberData.MemberCin;
                           context.PersNo = response.MemberData.PersonNumber;

                           context.serviceAuth = response.AuthorizationNumber;
                           context.DateOfService = document.getElementById('DateOfService').value;
                           context.memberNotFound = "";
                           context.providerNotFound = "";

                           $scope.memberPcp = response.MemberData.MemberPcp;


                           $("#authNumber").prop("readonly", true);
                           $("#DateOfService").prop("readonly", true);

                       } else {
                           var reason;
                           if (response.CheckedAuthorization.CheckCode === -1) {
                               reason = response.auth.result;
                               authNumberError.innerHTML = "<span style='color:red'><strong>" + reason + "</strong></span>";
                               emptyChildren(authSearchSpan);
                               emptyChildren(dateSuccessSpan);
                               dateofService.value = '';
                               $scope.DATE = "";
                           }
                           else if (response.CheckedAuthorization.CheckCode === 0) {
                               reason = response.CheckedAuthorization.CheckMessage;
                               authNumberError.innerHTML = "<span style='color:red'><strong>" + reason + "</strong></span>";
                               emptyChildren(authSearchSpan);
                               emptyChildren(dateSuccessSpan);
                               dateofService.value = '';
                               $scope.DATE = "";

                           } else if (response.CheckedAuthorization.CheckCode === 1) {
                               reason = response.CheckedAuthorization.CheckMessage;
                               dateOfServiceError.innerHTML = "<span style='color:red'><strong>" + reason + "</strong></span>";
                               emptyChildren(dateSuccessSpan);
                               dateofService.value = '';
                               $scope.DATE = "";

                           } else if (response.CheckedAuthorization.CheckCode === 2) {
                               reason = response.CheckedAuthorization.CheckMessage;
                               authNumberError.innerHTML = "<span style='color:red'><strong>" + reason + "</strong></span>";
                               emptyChildren(authSearchSpan);
                               emptyChildren(dateSuccessSpan);
                               dateofService.value = '';
                               $scope.DATE = "";
                           }
                           else if (response.CheckedAuthorization.CheckCode === 7) {
                               reason = response.CheckedAuthorization.CheckMessage;
                               authNumberError.innerHTML = "<span style='color:red'><strong>" + reason + "</strong></span>";
                               emptyChildren(authSearchSpan);
                               emptyChildren(dateSuccessSpan);
                               dateofService.value = '';
                               $scope.DATE = "";
                           }
                           else if (response.CheckedAuthorization.CheckCode === 6) {
                               reason = response.CheckedAuthorization.CheckMessage;;
                               authNumberError.innerHTML = "<span style='color:red'><strong>" + reason + "</strong></span>";
                               emptyChildren(authSearchSpan);
                               emptyChildren(dateSuccessSpan);
                               dateofService.value = '';
                               $scope.DATE = "";
                           }
                       }

                       $("#ProviderButton").prop("disabled", false);

                   }).error(function (error) {

                       var continueLoading = document.getElementById('continueLoading');
                       emptyChildren(document.getElementById('continueLoading'));
                       continueLoading.innerHTML = "<span style='color:red'><strong> An Error has occurred, please reload the page and try again. </strong></span>";

                   });
               }
           }

           $scope.clearResultError = function () {
               emptyChildren(document.getElementById('authNumberError'));
           }

           context.ContinueCocForm = function () {

               var postObj = {
                   "RequestingProvider": $scope.requestingProvider,
                   "Pcp": $scope.memberPcp
               }

               if (true /*validElem*/) {
                   memberDataService.BhGetRequestingAndPcpInfo(postObj).success(function (response) {

                       if (response) {
                           $rootScope.$broadcast('LoadAxisCodes');
                           context.providerName = response[1].ProviderFirstName + " " + response[1].ProviderLastName;
                           context.providerId = response[1].ProviderId;
                           context.providerAddress = response[1].ProviderAddress1 + " " + response[1].ProviderAddress2;
                           context.providerCity = response[1].ProviderCity;
                           context.providerState = response[1].ProviderState;
                           context.providerPhone = response[1].ProviderPhone;
                           context.providerZip = response[1].ProviderZip;
                           context.providerNPI = response[1].ProviderNpi;
                           context.providerFAX = response[1].ProviderFax;
                           context.serviceProviderName = response[0].ProviderFirstName + " " + response[0].ProviderLastName;


                           continueForm();
                           $scope.ContinuePressed = true;
                           context.lazyLoadRxHistory(context.memberId);
                           $('#COCcontinue').hide();
                       }
                   }).error(function (error) { });
               }
           }

           context.History = function () {
               var div = document.getElementById('bhHistorySearching');
               div.innerHTML = '<div><img src=../Content/loading.gif /> <label> Retrieving Member History </label></div>';
               context.auths = [];

               var params = {
                   MemberId: $('#sub').val(),
                   Type: 'IEHPID'
               }


               if (context.auths.length === 0) {

                   $http({
                       url: "GetMemberAuths",
                       method: 'Post',
                       data: { info: params }

                   }).success(function (response) {

                       context.auths = response.history;
                       emptyChildren(div);
                       $('#HistoryModal').modal('toggle');

                   }).error(function (error) {


                   });
               }
           }

           context.GetHtmlRecord = function (elem) {
               var recordNum = elem.$parent.record.HeaderId;

               $http({
                   url: "GetRecord",
                   method: 'Post',
                   data: { "RecordNumber": recordNum, Params: Params }
               }).success(function (response) {
                   var historyWindow = window.open("", "_blank");
                   historyWindow.document.write("<!DOCTYPE html>" + response.dom + "</html>");
               });
           }
           //need to make 2 different functions since one is hitting a webservice and another a database, timing issue
           context.lazyLoadRxHistory = function (id) {

               var loadingRx = $('#loadingRx');
               var loadingRxClaims = $('#loadingRxClaims');

               var memberId = "";
               if (id === undefined) {
                   memberId = document.getElementById('sub').value;
               } else {
                   memberId = id;
               }

               loadingRx.append('<div><img src=../Content/loading.gif /> <label> Loading RX History </label></div>');

               memberDataService.GetMemberRxHistory(memberId).success(function (response) {

                   $rootScope.$broadcast('rxEvent', response);
                   loadingRxClaims.append('<div><img src=../Content/loading.gif /> <label Loading RX History </label></div>');

                   memberDataService.GetMemberRxHistoryClaims(memberId).success(function (response2) {

                       $rootScope.$broadcast('rxEventClaims', response2);
                   }).error(function (e) {
                       loadingRxClaims.empty();
                       loadingRxClaims.append("<div><strong> No Records Available.</strong></div>");
                   });

               }).error(function () {
                   var loadingRxClaims = $('#loadingRxClaims');
                   loadingRxClaims.empty();
                   loadingRxClaims.append("<div><strong> An Error Occurred Retrieving Pharmacy Information.</strong></div>");

               });


           }

           context.loadProviderTaxIdCOC = function (elem, input) {
               $('#COCcontinue').prop('disabled', false);
               context.serviceProviderName = elem.$parent.$parent.prov.ProviderFirstName + " " + elem.$parent.$parent.prov.ProviderLastName;
               $scope.requestingProvider = elem.$parent.provid.ProviderId;
               $(input).val(elem.$parent.$parent.prov.ProviderFirstName + " " + elem.$parent.$parent.prov.ProviderLastName + " ( " + elem.$parent.provid.ProviderId + " ) ");
               $('#ProviderModal').modal('hide');
               $scope.searchTextProv = '';
           }
           ////function that searches for providers with same tax id as user, takes into account member LOB

           $scope.providerSelected = false;

           context.providerTaxIdSearch = function () {
               var sub = $scope.BehavioralHealthForm.sub;
               if (sub.$valid && !$scope.memberDisenrolled) {
                   $('#providerSearchSpan').empty();
                   context.providerResults = "";
                   memberDataService.BhGetProivdersByTaxId(context.memberLOB).success(function (response) {

                       context.providerResults = response;
                       $('#ProviderModal').modal('toggle');
                       $scope.BehavioralHealthForm.$submitted = false;

                   });
               }
           }

           context.providerTaxIdSearchCoc = function () {

               memberDataService.BhGetProivdersByTaxIdCoc().success(function (response) {

                   context.providerResults = response;
                   $('#ProviderModal').modal('toggle');
                   $scope.BehavioralHealthForm.$submitted = false;

               });

           }


           //loads member and provider information (requesting and member's)
           context.Load = function () {

               $scope.ContinuePressed = true;
               padProviderId();

               if ($scope.validatePreliminaryForm()) {

                   disablePreliminaryForm();
                   Data.AssignIsIcd10($("#DateOfService"));

                   if (context.MemberPcp !== "") {

                       $scope.continueFormLoader = true;
                       memberDataService.BhGetProviderInfromation(context.MemberPcp).success(function (response) {
                           $scope.continueFormLoader = false;
                           var pSS = document.getElementById('providerSearchSpan');

                           if (response.ProviderId !== null) {
                               emptyChildren(pSS);
                               //pSS.innerHTML = '<span style="color:green;padding-top:8px" class="glyphicon glyphicon-ok"></span>';

                               context.providerName = response.ProviderLastName + " " + response.ProviderFirstName;
                               context.providerId = response.ProviderId;
                               context.providerAddress = response.ProviderAddress1 + " " + response.ProviderAddress2;
                               context.providerCity = response.ProviderCity;
                               context.providerState = response.ProviderState;
                               context.providerPhone = response.ProviderPhone;
                               context.providerZip = response.ProviderZip;
                               context.providerNPI = response.ProviderNpi;
                               context.providerFAX = response.ProviderFax;


                               $('#searchDiv').remove();
                               $('#preFormDivID label').attr("disabled", true);

                               context.memberNotFound = "";
                               context.providerNotFound = "";
                               continueForm();
                               $scope.showForm = true;

                               //start lazy loading rx history
                               context.lazyLoadRxHistory();

                               function submissionlogic() { //define submission logic before initializing plupload
                                   $scope.loading = true;
                                   var instance = plupLoadService.getPluploadInstance();
                                   instance.bind('UploadComplete', function () {

                                       var form = $("#BehavioralHealthForm");
                                       var domId = 'PdfData';
                                       var formData = behavioralHealthService.GetFormData(form, domId, $scope.BehavioralHealthForm);

                                       memberDataService.UploadBHINITForm(formData).success(function (response) {

                                           //do stuff for user to show confirmation and what not from service
                                           behavioralHealthService.SetRecordId(response.RecordId);
                                           behavioralHealthService.AddResultToDom(response);
                                           behavioralHealthService.DisplayResubmissionInterface();
                                       });


                                   });
                               }

                               $scope.setProperIcdCodes();

                               plupLoadService.initializePlupload(submissionlogic);


                           } else {

                               context.providerNotFound = "Provider not found";
                               $('#searchDiv').remove();
                           }

                           $('#continueform').prop("disabled", false);

                       }).error(function (e) {

                           context.memberNotFound = "Member not found";
                           context.providerNotFound = "Provider not found";
                           $('#searchDiv').remove();
                           $('#continueform').prop("disabled", false);

                       });

                   }
               } else {
                   angular.element("[name='" + $scope.BehavioralHealthForm.$name + "']").find('.ng-invalid:visible:first').focus();
               }
           };
           $scope.setProperIcdCodes = function () {
               //get icd codes
               Data.AssignIsIcd10($("#DateOfService"));
               $scope.isIcd10 = Data.GetIsIcd10();

               //assign icd codes

               if (!$scope.isIcd10) {
                   $scope.icdCodes = ["299.00", "299.80", "299.10", "299.80", "299.80", ""];
                   $scope.icdCodesDescription = ["Autistic Disorder", "Rett's Disorder", "Childhood Disintegration Disorder", "Asperger's Disorder", "Pervasive Developmental Disorder NOS", ""];
               } else {
                   $scope.icdCodes = ["F84.0", "F84.2", "F84.3", "F84.5", "F84.8", "F84.9"];
                   $scope.icdCodesDescription = ["Autistic disorder", "Rett's syndrome", "Other childhood disintegrative disorder", "Asperger's syndrome", "Other pervasive developmental disorders", "Pervasive developmental disorder, unspecified"];
               }

           }
           $scope.filterObject = {};
           $scope.submitForm = function (formName) {
               $scope.BehavioralHealthForm.$submitted = true;
               //$scope.InitFileTrack= plupLoadService.getHasFiles();

               if ($scope.BehavioralHealthForm.$valid && !$scope.memberDisenrolled) {
                   $scope.formSubmmittedDate = Date.now();
                   $('#form-submitted-date').show();
                   $scope.filterObject = {
                       SubscriberNumber: $('#subHidden').val(),
                       FormName: formName,
                       Department: "BH"
                   }

                   plupLoadService.bindFilterObject($scope.filterObject);
                   var submitDocumentsResult = plupLoadService.submitDocuments();
                   behavioralHealthService.SetHasFiles(submitDocumentsResult.HasFiles);
                   behavioralHealthService.SetFileId(submitDocumentsResult.FileId);
               }
               else {
                   angular.element("[name='" + $scope.BehavioralHealthForm.$name + "']").find('.ng-invalid:visible:first').focus();
               }
           }
       }]);
    ////////////////////////////////////////COC SPECIFIC CONTROLLERS////////////////////////////////////
    app.controller('ProposedTreatmentController', ['$http', '$scope', 'memberDataService', function ($http, $scope, memberDataService) {

        var context = this;
        context.whichModal = "";
        context.GTdropDown = 1;
        context.BHproviderResult = [];
        context.pNotFound = false;
        context.providerResults = "";

        $('#ProposedTreatmentModal').on('hidden.bs.modal', function () {

            $scope.BHSearch = '';
            context.providerResults = "";
            emptyChildren(document.getElementById('BHproviderSearchResults'));
            document.getElementById('manuallyEnter').value = '';

        });


        $scope.clearProviderSelection = function (id) {
            $('#' + id).val("");
        }

        $scope.frequencies = [

        {
            value: '0',
            label: '< Make Selection >'
        },
         {
             value: '1',
             label: 'Weekly'
         },
        {
            value: '2',
            label: 'Every Two Weeks'
        },
        {
            value: '3',
            label: 'Monthly'
        }];

        $scope.durations = [
        {
            value: '0',
            label: '< Make Selection >'
        },
        {
            value: '4',
            label: '1 Month'
        },
          {
              value: '5',
              label: '3 Months'
          },
          {
              value: '6',
              label: '6 Months'
          }];


        $scope.groupTherapy = [
        {
            value: '0',
            label: '< Make Selection >'
        },
        {
            value: '1',
            label: 'Depression Management'
        },
        {
            value: '2',
            label: 'Pain Management'
        },
        {
            value: '3',
            label: 'ADHD Parent Training'
        },
        {
            value: '4',
            label: 'Anxiety Management'
        },
        {
            value: '5',
            label: 'Bereavement'
        },
        {
            value: '6',
            label: 'Other'
        }
        ];
  

        context.Select1 = $scope.frequencies[0];
        context.Select2 = $scope.durations[0];
        context.Select3 = $scope.frequencies[0];
        context.Select4 = $scope.durations[0];
        context.GTdropDown = $scope.groupTherapy[0];


        context.loadProviderTaxId = function (elem, index) {

            var provId = elem.info.provId;
            var idString = "";
            if (provId !== undefined) {
                idString = "( " + elem.info.provId + " )";
            }

            $("#provError").empty();
            $("#" + context.whichModal).val(elem.$parent.prov._name + idString);
            $('#ProposedTreatmentModal').modal('hide');
         
        }


        context.ManuallyEnterProv = function (id) {
            $("#" + context.whichModal).val($("#manuallyEnter").val());
            $('#ProposedTreatmentModal').modal('hide');
            context.enterProv = "";
        }

        context.ToggleBHSearchModal = function (which) {
            context.whichModal = which;
            $('#ProposedTreatmentModal').modal('toggle');
        }

        context.SearchBHproviders = function () {

            var searchString = $('#BHsearch').val();

            if (/\S/.test(searchString)) {

                emptyChildren(document.getElementById('BHproviderSearchResults'));
                var div = document.getElementById('bhSearch2');
                window.clearTimeout($scope.timeout);

                $scope.timeout = window.setTimeout(function () {

                    memberDataService.BhCocBroadSearchForProviders(searchString).success(function (response) {


                        if (response.length === 0) {

                            context.providerResults = response;
                            document.getElementById('BHproviderSearchResults').innerHTML = '<label style="color:red">No Providers found</label>';

                        } else {

                            emptyChildren(document.getElementById('BHproviderSearchResults'));
                            var holder = response;
                            context.providerResults = holder;
                        }
                    }).error(function (error) {

                    });

                }, 280);
            } else {
                context.providerResults = [];
                window.clearTimeout($scope.timeout);
            }
        }

    }]);

    app.controller('ICDController', function () {


    });

    app.controller('AxisController', ['$http', '$scope', '$rootScope', 'Data', 'memberDataService', function ($http, $scope, $rootScope, Data, memberDataService) {

        var context = this;
        context.codeIndex = 100;
        context.startPoint = 0;
        context.maxPage = 0;
        context.dataPageSize = 100;
        context.count = 0;
        context.nextArrayPage = 1;
        context.whichAxisInput = "";
        context.SearchAxisCodes = [];
        context.AllAxisCodes = [];
        context.AxisCodes = [];
        context.AxisIICodes = [];
        context.searchedMentalICD = false;
        context.searchedDevelopmentalICD = false;


        $('#AxisModal').on('hidden.bs.modal', function () {
            $scope.searchText = "";
            $scope.searched = false;
        });
        $('#SearchModal').on('hidden.bs.modal', function () {
            $scope.ICDSearch = "";
            context.ClearICD();
            $scope.searched = false;
        });
        $('#AxisIIModal').on('hidden.bs.modal', function () {
            $scope.searchText2 = "";
            $scope.searched = false;
        });





        context.setInput = function (which) {
            context.whichAxisInput = which;
        }


        context.GetAxis = function (which) {

            context.whichAxisInput = which;
            var date = moment().format('MM/DD/YYYY');

            if (context.AxisCodes.length === 0) {
                memberDataService.GetMentalHealthCodes(date).success(function (response) {
                    context.searchedMentalICD = true;
                    context.AxisCodes = response;
                }).error(function () {

                });
            }
        }

        context.GetAxisII = function (which) {
            context.whichAxisInput = which;
            var date = moment().format('MM/DD/YYYY');
            if (context.AxisIICodes.length === 0) {
                memberDataService.GetDevelopmentalCodes(date).success(function (response) {
                    context.searchedMentalICD = true;
                    context.AxisIICodes = response;
                }).error(function () {

                });
            }
        }


        $scope.timeout;
        $scope.searched = false;
        context.SearchICD = function () {

            var searchString = $("#ICDSearch").val();

            if (/\S/.test(searchString)) {
                window.clearTimeout($scope.timeout);
                $scope.timeout = window.setTimeout(function () {

                    var filter = {
                        "IcdCode": searchString,
                        "Date": moment().format('MM/DD/YYYY')
                    };

                    memberDataService.SearchIcdCode(filter).success(function (response) {


                        $scope.searched = true;
                        context.SearchAxisCodes = response;

                    }).error(function () {

                    });
                }, 280);
            } else {
                $scope.searched = false;
                context.SearchAxisCodes = [];
                window.clearTimeout($scope.timeout);
            }
        }

        context.SelectAxisCode = function (elem, id) {
            $scope.ICDSearch = "";
            $("#ICDSearch").val("");
            $("#" + context.whichAxisInput).val(elem.axis.Code + " " + elem.axis.Description1);
            $("#" + id).modal('hide');
        }

        context.ClearICD = function (elem) {
            var target = $('#' + elem);
            target.val('');
            $scope.ICDSearch = "";
            context.SearchAxisCodes = [];

        }

        context.ClearSelectedICD = function (elem) {
            var target = $('#' + elem);
            target.val('');
        }


    }]);

})();




