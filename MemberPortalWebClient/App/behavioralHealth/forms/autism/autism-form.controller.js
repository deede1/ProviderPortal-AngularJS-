(function () {
    'use strict';
    var app = angular.module('MemberPortal');
    angular
    .module('MemberPortal')
    .controller('AutismMemberVerificationController', AutismMemberVerificationController);

    AutismMemberVerificationController.$inject = [
    '$http', "$state", "$scope", "$compile", "$rootScope", 'SharedAutismFormData', 'memberDataService', 'contentAuthorizationService'
    ];
    

    app.directive('autoGrow', function () {
        return function (scope, element, attr) {
            var update = function (event) {
                if (element[0].scrollHeight !== 0 && element[0].scrollHeight > element[0].offsetHeight) {
                    element.css('height', element[0].scrollHeight + 'px');
                }
            }

            element.bind('keyup', update);
            update();
        }
    });

    //app.directive('abhMaxlength', function () {

    //    function link(scope, element, attr) {  
    //        var update = function (event) {
    //            if (element.val().length > scope.length) {
    //                element.val(element.val().substr(0, scope.length));
    //                scope.$apply(function () {
    //                    scope.ngModel = element.val();
    //                });
    //            }
    //        }
    //        element.bind('keyup', update);
    //    }

    //    return {
    //        scope: {
    //            length: '=abhMaxlength'
    //        },
    //        link : link

    //    }
    //});

    //appBH.directive('onPress', function () {
    //    return function (scope, element, attrs) {
    //        element.bind("keydown keypress", function (event) {
    //            if (event.which === 13) {
    //                scope.$apply(function () {
    //                    scope.$eval(attrs.onPress);
    //                });

    //                event.preventDefault();
    //            }
    //        });
    //    };
    //});

    

    app.filter("titleCase", function () {
        return function (s) {
            s = (s === undefined || s === null) ? "" : s;
            return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) { return ch.toUpperCase(); });
        };
    });

    app.filter("spaceRemove", function () {
        return function (str) {
            return str.replace(/\s+/g, '');
        };
    });

    app.filter("infoNotAvailable", function () {
        return function (text) {
            if (text == "" || text == " " || text == null)
                return "N/A";
            else
                return text;
        };
    });

    app.filter("zip", function () {

        return function (zip) {
            if (!zip) return '';

            switch (zip.length) {
                case 9:
                    var five = zip.substr(0, 5);
                    var four = zip.substr(5, 9);
                    return five + "-" + four;
                case 5:
                    return zip;
                default:
                    return zip;
            }
        };
    });
    app.filter('tel', function () {
        return function (tel) {
            if (!tel) { return ''; }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;
            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country == 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);
            return (country + " (" + city + ") " + number).trim();
        };
    });

    function AutismMemberVerificationController($http, $state, $scope, $compile, $rootScope, SharedAutismFormData, memberDataService, contentAuthorizationService) {

        //CONTENT AUTHORIZATION DEFAULTS 
        $scope.siteItem = [];
        $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);

        var context = this;
        $rootScope.MemberInfo = true;
        context.searchMember = 0;
        SharedAutismFormData.Data = {};
        context.memberNotFound = null;
        context.providerSpecialty = "n/a";
        $scope.today = moment().format('MM/DD/YYYY');
        $scope.search = {};
        $scope.search.validateDate = function (date) {
            return moment().diff(moment(date)) >= 0; //make sure valid and not future date
        };

        context.SearchAuth = function () {
            context.searchMember = 1;
            context.AuthID = $('#AuthNumber').val();
            context.DateServiced = $('#DateServiced').val();
            $('#searchMemberButton').prop("disabled", true);
            //$('#datetimepicker1').datetimepicker('remove');
            //var AuthID = context.AuthID; //{ Subnum: context.memberId, Provnum: 0 };
            if (context.AuthID !== "" && context.AuthID.length == 8 && context.DateServiced != "") {
                $('#AuthNumber').prop("readonly", true);

                var authSearchParams = {
                    'AuthorizationNumber': context.AuthID,
                    'Date': context.DateServiced
                };
                memberDataService.GetMemberInfoFromAutismAuth(authSearchParams).success(function (response) {
                    if (response.AuthFilter.IsValid)
                    {
                        
                        //SharedAutismFormData.Data.MedHokAuthId = response.medhokID;//Need to fix
                        context.AuthType = response.AuthFilter.AuthType;
                        //if (response.Form != null)
                        //    SharedAutismFormData.Data.BehaviorList = response.Form.BehaviorList; // Add a separate call for this
                        if (response.AuthFilter.ErrorMessage != null) {
                            context.ResultMessage = response.AuthFilter.ErrorMessage;
                            if (context.ResultMessage != "valid") {
                                SharedAutismFormData.Data.ResultMessage = context.ResultMessage;
                            }
                        }

                        SharedAutismFormData.Data.WarningMessageList = response.AuthFilter.WarningList;

                        SharedAutismFormData.Data.MemberFound = true;
                        context.memberNotFound = null;
                        //Member Info
                        context.MemberInformation = response.FormsHeader.MemberInfo;
                        context.memberNameF = response.FormsHeader.MemberInfo.MemberFirstName;
                        context.memberNameL = response.FormsHeader.MemberInfo.MemberLastName;
                        context.memberCounty = response.FormsHeader.MemberInfo.MemberCounty;
                        context.memberAddress = response.FormsHeader.MemberInfo.MemberAddress2; + " " + response.FormsHeader.MemberInfo.MemberAddress1;
                        context.memberAddress = context.memberAddress == " " ? "N/A" : context.memberAddress;
                        context.memberCity = response.FormsHeader.MemberInfo.MemberCity;
                        context.memberState = response.FormsHeader.MemberInfo.MemberState;
                        context.memberZip = response.FormsHeader.MemberInfo.MemberZip;
                        context.memberPhone = response.FormsHeader.MemberInfo.MemberPhone;
                        context.memberLOB = response.FormsHeader.MemberInfo.MemberLob;
                        context.memberPERSNO = response.FormsHeader.MemberInfo.PersonNumber;
                        context.memberDOB = response.FormsHeader.MemberInfo.MemberDateOfBirth;
                        context.memberAge = response.FormsHeader.MemberInfo.MemberAge;
                        context.memberSex = response.FormsHeader.MemberInfo.MemberGender;
                        context.memberID1 = response.FormsHeader.MemberInfo.SubscriberNumber;
                        context.memberMedcaldId = response.FormsHeader.MemberInfo.MemberMedicalNumber;
                        context.memberMedcareId = response.FormsHeader.MemberInfo.MemberMedicareNumber;
                        context.Aid = response.FormsHeader.MemberInfo.MemberPlanAidCode;
                        context.Group = response.FormsHeader.MemberInfo.MemberGroup;
                        context.CIN = response.FormsHeader.MemberInfo.MemberCin;

                        //PCP Info
                        context.PcpInfo = response.FormsHeader.PcpInfo;
                        context.providerNameF = response.FormsHeader.PcpInfo.ProviderFirstName;
                        context.providerNameL = response.FormsHeader.PcpInfo.ProviderLastName;
                        context.providerNPI = response.FormsHeader.PcpInfo.ProviderNpi;
                        context.providerID = response.FormsHeader.PcpInfo.ProviderId;
                        SharedAutismFormData.Data.PCPId = response.FormsHeader.PcpInfo.ProviderId;
                        context.providerAddress = response.FormsHeader.PcpInfo.ProviderAddress1 + " " + response.FormsHeader.PcpInfo.ProviderAddress2;
                        context.providerCity = response.FormsHeader.PcpInfo.ProviderCity;
                        context.providerState = response.FormsHeader.PcpInfo.ProviderState; 
                        context.providerZip = response.FormsHeader.PcpInfo.ProviderZip;
                        context.providerPhone = response.FormsHeader.PcpInfo.ProviderPhone;
                        context.providerFax = response.FormsHeader.PcpInfo.ProviderFax;
                        context.SubNo = context.memberID1;

                        SharedAutismFormData.Data.SubNo = context.memberID1;

                        //if (response.provider.PASPEC2 !== "")
                        //    context.providerSpecialty = response.provider.PASPEC2;

                        //ABA Provider Info
                        context.ABAProviderInfo = response.FormsHeader.ServicingProviderInfo;
                        context.ABAProvider = {};
                        context.ABAProvider.providerNameF = response.FormsHeader.ServicingProviderInfo.ProviderFirstName;
                        context.ABAProvider.providerNameL = response.FormsHeader.ServicingProviderInfo.ProviderLastName;
                        context.ABAProvider.providerID = response.FormsHeader.ServicingProviderInfo.ProviderId;
                        SharedAutismFormData.Data.ABAProvider = response.FormsHeader.ServicingProviderInfo.ProviderId;
                        context.ABAProvider.providerAddress = response.FormsHeader.ServicingProviderInfo.ProviderAddress1;
                        if (response.FormsHeader.ServicingProviderInfo.ProviderAddress2 != null)
                            context.ABAProvider.providerAddress += response.FormsHeader.ServicingProviderInfo.ProviderAddress2;
                        context.ABAProvider.providerCity = response.FormsHeader.ServicingProviderInfo.ProviderCity;
                        context.ABAProvider.providerState = response.FormsHeader.ServicingProviderInfo.ProviderState;
                        context.ABAProvider.providerZip = response.FormsHeader.ServicingProviderInfo.ProviderZip;
                        context.ABAProvider.providerPhone = response.FormsHeader.ServicingProviderInfo.ProviderPhone;
                        context.ABAProvider.providerFax = response.FormsHeader.ServicingProviderInfo.ProviderFax;
                        context.ABAProvider.providerNPI = response.FormsHeader.ServicingProviderInfo.ProviderNpi;
                        //if (response.ABAProvider.PASPEC2 !== "")
                        //    context.ABAProvider.providerSpecialty = response.ABAProvider.PASPEC2;

                        //Get maladaptive history
                        var maladaptiveSearchFilter = {
                            'SubscriberNumber': response.FormsHeader.MemberInfo.SubscriberNumber,
                            'AuthorizationNumber': authSearchParams.AuthorizationNumber,
                            'Date': authSearchParams.Date
                        };

                        memberDataService.GetAutismMaladaptiveHistory(maladaptiveSearchFilter).success(function (data) {
                            SharedAutismFormData.Data.BehaviorList = [
                                { name: "Tantrum", Checked: false, MalBehavOptions: [] },
                                { name: "Elopement", Checked: false, MalBehavOptions: [] },
                                { name: "Self-Stimulatory Behavior", Checked: false, MalBehavOptions: [] },
                                { name: "PICA", Checked: false, MalBehavOptions: [] },
                                { name: "Non-Compliance", Checked: false, MalBehavOptions: [] },
                                { name: "Property Destruction", Checked: false, MalBehavOptions: [] },
                                { name: "Self-injurious Behavior", Checked: false, MalBehavOptions: [] },
                                { name: "Physical Aggression Towards Others", Checked: false, MalBehavOptions: [] },
                                { name: "Verbal Aggression", Checked: false, MalBehavOptions: [] },
                                { name: "Safety Concerns", Checked: false, MalBehavOptions: [] }
                            ];
                            if (data != null) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].MaladaptiveDetail != null && data[i].MaladaptiveDetail.length > 0) {
                                        var malbehaviorDetails = {
                                            'OperationalDef': data[i].MaladaptiveHeader.OperationalDefinition,
                                            'Antecedent': data[i].MaladaptiveHeader.Antecedent,
                                            'Consequence': data[i].MaladaptiveHeader.Consequence,
                                            'FunctionId': data[i].MaladaptiveHeader.BehaviorFunctionId,
                                            'DropDownId': data[i].MaladaptiveHeader.BehaviorValueDescriptionId,
                                            'Baseline': data[i].MaladaptiveDetail[0] != null ? data[i].MaladaptiveDetail[0].Data : null,
                                            'Month1': data[i].MaladaptiveDetail[1] != null ? data[i].MaladaptiveDetail[1].Data : null,
                                            'Month2': data[i].MaladaptiveDetail[2] != null ? data[i].MaladaptiveDetail[2].Data : null,
                                            'Month3': data[i].MaladaptiveDetail[3] != null ? data[i].MaladaptiveDetail[3].Data : null,
                                            'Month4': data[i].MaladaptiveDetail[4] != null ? data[i].MaladaptiveDetail[4].Data : null,
                                            'Month5': data[i].MaladaptiveDetail[4] != null ? '' : null,
                                            'BaselineDate': data[i].MaladaptiveDetail[0] != null ? data[i].MaladaptiveDetail[0].DatePatientServiced : null,
                                            'Month1Date': data[i].MaladaptiveDetail[1] != null ? data[i].MaladaptiveDetail[1].DatePatientServiced : data[i].MaladaptiveDetail[0] != null ? '' : null,
                                            'Month2Date': data[i].MaladaptiveDetail[2] != null ? data[i].MaladaptiveDetail[2].DatePatientServiced : data[i].MaladaptiveDetail[1] != null ? '' : null,
                                            'Month3Date': data[i].MaladaptiveDetail[3] != null ? data[i].MaladaptiveDetail[3].DatePatientServiced : data[i].MaladaptiveDetail[2] != null ? '' : null,
                                            'Month4Date': data[i].MaladaptiveDetail[4] != null ? data[i].MaladaptiveDetail[4].DatePatientServiced : data[i].MaladaptiveDetail[3] != null ? '' : null,
                                            'Month5Date': data[i].MaladaptiveDetail[4] != null ? '' : null,
                                            'Comment': ''
                                        };
                                        if (data[i].MaladaptiveHeader.BehaviorCategoryId === 1) {
                                            SharedAutismFormData.Data.BehaviorList[0].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[0].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 2) {
                                            SharedAutismFormData.Data.BehaviorList[1].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[1].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 3) {
                                            SharedAutismFormData.Data.BehaviorList[2].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[2].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 4) {
                                            SharedAutismFormData.Data.BehaviorList[3].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[3].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 5) {
                                            SharedAutismFormData.Data.BehaviorList[4].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[4].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 6) {
                                            SharedAutismFormData.Data.BehaviorList[5].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[5].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 7) {
                                            SharedAutismFormData.Data.BehaviorList[6].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[6].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 8) {
                                            SharedAutismFormData.Data.BehaviorList[7].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[7].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 9) {
                                            SharedAutismFormData.Data.BehaviorList[8].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[8].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else if (data[i].MaladaptiveHeader.BehaviorCategoryId === 10) {
                                            SharedAutismFormData.Data.BehaviorList[9].Checked = true;
                                            SharedAutismFormData.Data.BehaviorList[9].MalBehavOptions.push(malbehaviorDetails);
                                        }
                                        else {
                                            var customBehavior =
                                            {
                                                name: data[i].MaladaptiveHeader.CustomBehaviorName,
                                                Checked: true,
                                                MalBehavOptions: []
                                            }
                                            customBehavior.MalBehavOptions.push(malbehaviorDetails);
                                            SharedAutismFormData.Data.BehaviorList.push(customBehavior);
                                        }
                                    };
                                }
                            }

                            context.searchMember = 0;
                            $('#searchMemberButton').prop("disabled", true);


                            $rootScope.PartOne = true;
                            $rootScope.$broadcast('ShowForm', true);

                            $rootScope.$broadcast('AuthType', context.AuthType);
                        }).error(function (data) {
                            context.memberNotFound = "This service is currently unavailable. Please try again later.";
                            context.searchMember = 0;
                            $('#AuthNumber').prop('readonly', false);
                            $('#searchMemberButton').prop("disabled", false);
                        });
                    }
                    else {
                        context.memberNotFound = response.AuthFilter.ErrorMessage;
                        context.searchMember = 0;
                        $('#AuthNumber').prop('readonly', false);
                        $('#searchMemberButton').prop("disabled", false);
                    }
                }).error(function(data) {
                    context.memberNotFound = "This service is currently unavailable. Please try again later.";
                    context.searchMember = 0;
                    $('#AuthNumber').prop('readonly', false);
                    $('#searchMemberButton').prop("disabled", false);
                });
            }
            else {
                context.memberNotFound = "Invalid Authorization or Authorization Not Found.";
            }
            
        };



        context.checkDEA = function (input) {

            var lastName = context.providerNameL;
            var dea = input.MVCtrl.dea;
            switch (dea.length) {
                case 9:
                    if (dea[1] === lastName[0]) {

                        var sum1 = parseInt(dea[2]) + parseInt(dea[4]) + parseInt(dea[6]);
                        var sum2 = parseInt(dea[3]) + parseInt(dea[5]) + parseInt(dea[7]);
                        var fsum = (sum2 * 2) + sum1;
                        var stringSum = fsum.toString();
                        if (stringSum[stringSum.length - 1] === dea[dea.length - 1]) {
                            $('#deaNumber').removeClass('error');
                        } else {
                            $('#deaNumber').addClass('error');
                            $('#deaNumber').val('');
                        }

                    } else {

                        $('#deaNumber').addClass('error');
                        $('#deaNumber').val('');
                    }

                    break;
                default: break;
            }
        }

    };


    angular
    .module('MemberPortal')
    .controller('AutismCurrentMedicationController', AutismCurrentMedicationController);

    AutismCurrentMedicationController.$inject = [
    '$scope', '$rootScope', 'SharedAutismFormData', '$http', 'memberDataService'
    ];

    function AutismCurrentMedicationController($scope, $rootScope, SharedAutismFormData, $http, memberDataService) {

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

        /////////////////////////////////////////////
        /////////////////////////////////////////////
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

        //need to make 2 different functions since one is hitting a webservice and another a database, timing issue
        context.loadingRx = 1;
        $('#loadingRx').append('<div><label> Loading RX History </label></div>');

        memberDataService.GetMemberRxHistory(SharedAutismFormData.Data.SubNo).success(function (response) {
            $rootScope.$broadcast('rxEvent', response);
            context.loadingRxClaims = 1;
            $('#loadingRxClaims').append('<label Loading RX History </label></div>');

            memberDataService.GetMemberRxHistoryClaims(SharedAutismFormData.Data.SubNo).success(function (response2) {
                $rootScope.$broadcast('rxEventClaims', response2);
            }).error(function (e) {
                context.loadingRxClaims = 0;
                context.loadingRx = 0;
                $('#loadingRx').empty();
                $('#loadingRx').append("<div><strong> An Error Occurred Retrieving Pharmacy Information.</strong></div>");
                $('#loadingRxClaims').empty();
                $('#loadingRxClaims').append("<div><strong> An Error Occurred Retrieving Pharmacy Information.</strong></div>");
            });

        }).error(function () {
            context.loadingRxClaims = 0;
            context.loadingRx = 0;
            $('#loadingRx').empty();
            $('#loadingRx').append("<div><strong> An Error Occurred Retrieving Pharmacy Information.</strong></div>");
            $('#loadingRxClaims').empty();
            $('#loadingRxClaims').append("<div><strong> An Error Occurred Retrieving Pharmacy Information.</strong></div>");
        });

        $rootScope.$on('rxEvent', function (event, response) {

            if (response!=null && response.length > 0) {
                context.pageItems(response);
                context.loadingRx = 0;
                $('#loadingRx').empty();
                $('#loadingRx').hide();
            } else {
                context.RxTable = [];
                context.loadingRx = 0;
                $('#loadingRx').empty();
                $('#loadingRx').append("<div><span> No Rx Claims Found ( 6 months prior )</span></div>");

            }
        });
        $rootScope.$on('rxEventClaims', function (event, response) {

            if (response && response.length > 0) {
                context.pageItems2(response);
                $('#loadingRxClaims').empty();
                $('#loadingRxClaims').hide();
            } else {
                context.RxTableClaims = [];
                $('#loadingRxClaims').empty();
                $('#loadingRxClaims').append("<div><span> No Records Found ( 1 month prior )</span></div>");
            }
        });
    };










    angular
    .module('MemberPortal')
    .controller('AutismMemberInfoController', AutismMemberInfoController);

    AutismMemberInfoController.$inject = [
    '$scope', '$state', '$location', '$anchorScroll', '$http', "$rootScope", "SharedAutismFormData", "$filter", '$compile', 'memberDataService', 'plupLoadService'
    ];

    function AutismMemberInfoController($scope, $state, $location, $anchorScroll, $http, $rootScope, SharedAutismFormData, $filter, $compile, memberDataService, plupLoadService) {

        var context = this;
        context.formSubmittedDate = Date.now();
        context.FormName = "Autism Behavioral Health Treatment Application";
        context.WelcomeText = "Welcome to the Autism Behavioral Health Treatment Application. Access to the forms will be granted upon completion of this preliminary search.";
        context.AuthSearched = false;
        context.FormValid = false;
        context.PartTwoForm = false;
        context.PartThreeForm = false;
        //Delete Later -  Set these vars to true if want to start form unlocked
        //context.AuthSearched = true;
        //context.AuthType = 1;

        //Displays form on successful member info search
        $rootScope.$on('ShowForm', function (event, response) {
            context.PartTwoForm = response;
            context.PartThreeForm = response;
            if (response == false) {
                context.AuthType = 0;
                context.AuthSearched = false;
                context.WelcomeText = "Welcome to the Autism Behavioral Health Treatment Application. Access to the forms will be granted upon completion of this preliminary search.";
            }
        });
        context.CurrentDataTrendId = "";
        context.LastDataTrendId = 0;
        context.DiagnosisSearchTerm = "";
        context.Validating = false;

        context.formData = SharedAutismFormData.Data;
        context.formData.FileId = "";
        context.AttachmentFolderName = "";
        //Vars for Core Autistic Impairmentsr B section
        context.formData.B1None = false;
        context.formData.B2None = false;
        context.formData.B3None = false;
        context.formData.B4None = false;
        context.formData.AuthID = '';

        context.formData.VBMAPPData = [{ Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null },
                                       { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }];
        context.formData.IsFormRetrieval = false;
        context.formData.Date = new Date();
        context.formData.filesupped = [];
        context.formData.OtherConcern = [];
        context.formData.DateServiced = "";
        
        context.formData.Impairments = [];
        context.formData.MalBehaviors = [];
        context.formData.CurrentServices = [];
        context.formData.BehaviorList = [];
        context.formData.ABAS = [];
        context.formData.ABAProvider = {};
        context.formData.MedCaseTreatment = {};
        context.formData.ABAS = [{ name: "Communication" }, { name: "Community Use" }, { name: "Functional Academics" }, { name: "Home Living" },
                                 { name: "Health and Safety" }, { name: "Leisure" }, { name: "Self-Care" },
                                 { name: "Self-Direction" }, { name: "Social" }, { name: "Work" }];
        //context.formData.ABASOptions = [{ label: "1-3: Extremely Low" }, { label: "4-5: Low" }, { label: "6-7: Below Avg"}, { label: "8-12: Avg" }, {label: "13-14: Above Avg"}, { label: "15: High"}];
        context.ABASOptions = [{ Id: 1, name: "1-3: Extremely Low" }, { Id: 2, name: "4-5: Low" }, { Id: 3, name: "6-7: Below Average" },
                               { Id: 4, name: "8-12: Average" }, { Id: 5, name: "13-14: Above Average" }, { Id: 6, name: ">15: High" }];

        context.formData.Concerns = [{ name: "Anxiety" }, { name: "Asthma" }, { name: "Attention Problems" }, { name: "Auditory Hallucinations" }, { name: "Concentration Difficulty" },
                                          { name: "Confusion" }, { name: "Dementia" }, { name: "Depression" }, { name: "Dissociative Process" }, { name: "Dizziness or Light Headedness" },
                                          { name: "Ear Infection / Acute Rhinitis" }, { name: "Eating Disorder" }, { name: "Eczema / Skin Allergies" },
                                          { name: "Gastrointestinal Problems" }, { name: "Isolation" }, { name: "Obsessive or Compulsive" }, { name: "Paranoia" }, { name: "Phobia" },
                                          { name: "Seizure Activity" }, { name: "Severe Headaches / Migraines" }, { name: "Sleep Disturbance" }, { name: "Substance Abuse" },
                                          { name: "Visual Hallucinations" }, { name: "Weight Change" }];
        context.BHTreatments = [{ name: "Behavior Health Treatment (QAS Paraprofessional)", code: "H2019" }, { name: "Behavior Health Treatment (QAS Professional - Supervision)", code: "H0031" },
                                         { name: "Behavior Health Treatment (QAS Provider - Supervision)", code: "G9012" }, { name: "Group Parent Training", code: "90853" }, { name: "Group Social Skills Training", code: "H2014" }];

        context.formData.CaregiverProgressGoals = [{
            label: "A good working relationship exists between family/caregiver(s) in which the following are established: ",
            subLabels: [{ label: "Agreement that parent/caregiver is a critical component of treatment team", Checked: null }, { label: "Agreement on staff goodness-of-fit which is critical to a harmonious treatment team", Checked: null }, { label: "Agreement on treatment goals that are developmentally and socially significant", Checked: null },
                        { label: "Agreement on treatment strategies that are safe and effective", Checked: null }, { label: "Agreement on treatment activities that are safe and effective", Checked: null }, { label: "Agreement on structure of sessions (location, length, duration of sessions)", Checked: null },
                        { label: "Agreement on providing adequate working environment for staff free of distractions, undue stress, and interference", Checked: null }, { label: "Agreement on adequate attempts by parents to implement lessons outside of sessions", Checked: null },
                        { label: "Agreement on attendance, adherence to treatment schedule", Checked: null }, { label: "Agreement on the mandating reporting requirements by the State", Checked: null }]
        },
                                                   { label: "Family/Caregiver(s) interact positively with the child where parent uses positive reinforcements appropriately (i.e., immediacy, contingency, satiation/deprivation and size), to teach treatment goals", score: null },
                                                   { label: "Family/Caregiver(s) use daily family routines for practice, generalization as well as maintenance of the treatment goals (i.e., teaching proper chewing during meal times)", score: null },
                                                   { label: "Family/Caregiver(s) properly define a treatment skill/behavior in behavioral terms with fidelity across target skills/behaviors (i.e., child will urinate in his potty 3 times a day when placed on potty every 2 hours after told  “potty time”)", score: null },
                                                   { label: "Family/Caregiver(s) identify developmentally and socially appropriate goals that foster the child’s independence and overall quality of life (i.e., family teaches a 5 year old to tie their shoes but not 3 year old).", score: null },
                                                   { label: "Family/Caregiver(s) promote prosocial behavior (i.e., attending, listening, commenting, sharing, taking turn, delaying reinforcement, accepting change)", score: null },
                                                   { label: "Family/Caregiver(s) does not provide over prompting (i.e., allowing the child to solve problems  independently)", score: null },
                                                   { label: "Family/Caregiver(s) does not allow child to be disengaged  (i.e., allowing the child to stare in empty space for minutes)", score: null },
                                                   { label: "Family/Caregiver(s) is emotionally attuned to the child’s social motivation/initiation and build reciprocal interaction/social referencing based on the child’s motivations (i.e., child moves toward the door, parent/caregiver says, “you want to go to the backyard. Let’s open the door… Open the door. Wow, look! You opened the door). ", score: null },
                                                   { label: "Family/Caregiver(s) organize the day into routines that allow for predictable structure", score: null },
                                                   { label: "Family/Caregiver(s) give clear and developmentally appropriate direction, setting limits and rules, and stating behavioral expectations and consequences", score: null },
                                                   { label: "Family/Caregiver(s) are able to identify the antecedent (s) to the child’s behavior and plan an antecedent base treatment response.", score: null },
                                                   { label: "Family/Caregiver(s) are able to identify the consequence(s) to the child’s behavior and plan a consequence base treatment response.", score: null },
                                                   { label: "Family/Caregiver(s) actively cooperate in assessment, evaluation, and monitoring of program and child progress, including data collection as necessary.", score: null },
                                                   { label: "Family/Caregiver(s)  is reporting self efficacy with the child’s behavior management.", score: null },
                                                   { label: "Family/Caregiver(s) is able teach developmental skills independently with minimal consultation or supervision from a professional.", score: null }];

        context.NewSearch = function () {
            context.formData.AuthID = '';
            $state.reload();
        };

        //Main function that controlls displaying each of the 3 forms
        context.DisplayForm = function (type) {
            context.AuthDisplayError = null;
            if (type == "FBA" && context.AuthorizationType == 1) {
                context.AuthType = 1;
                context.WelcomeText = "Welcome to the Initial Functional Behavioral Assessment Form. Please fill out all the required fields below.";
                context.FormName = "Initial Functional Behavioral Assessment Form";
                context.AttachmentFolderName = "Autism FBA";
                context.AuthSearched = true;
                context.AuthorizationSearched = false;
            }
            else if (type == "Monthly" && context.AuthorizationType == 2) {
                context.AuthType = 2;
                context.WelcomeText = "Welcome to the ABA Progress Report. Please fill out all the required fields below.";
                context.FormName = "Monthly ABA Progress Report";
                context.AttachmentFolderName = "Autism Monthly";
                context.AuthSearched = true;
                context.AuthorizationSearched = false;
            }
            else if (type == "6Month" && (context.AuthorizationType == 2 || context.AuthorizationType == 3)) {
                context.AuthType = 3;
                context.WelcomeText = "Welcome to the 6 Month ABA Request for Additional Services Form. Please fill out all the required fields below.";
                context.FormName = "6 Month ABA Request for Additional Services Form";
                context.AttachmentFolderName = "Autism 6 Month ABA RAS";
                context.AuthSearched = true;
                context.AuthorizationSearched = false;
            }
                //else if(type == "6Month" && context.AuthorizationType == 3)
                //{
                //    context.AuthType = 4;
                //    context.WelcomeText = "Welcome to the 6 Month ABA Request for Additional Services Form. Please fill out all the required fields below."
                //    context.FormName = "6 Month ABA Request for Additional Services Form";
                //    context.AuthSearched = true;
                //    context.AuthorizationSearched = false;
                //}
            else {
                context.AuthDisplayError = "This Authorization is not approved to display this type of Form.";
            }
            context.formData.AuthType = context.AuthType;
            context.formData.VerbalDate = context.formData.DateServiced;
            context.formData.ABASDate = context.formData.VerbalDate;
            context.DateServiced = new Date(context.formData.DateServiced);
            //ICD9/10 Conversion
            context.PrimaryCode = context.DateServiced >= new Date("10/01/2015") ? "F84.0" : "299.00";
            context.PrimaryDescription = context.DateServiced >= new Date("10/01/2015") ? "Autistic disorder" : "Autistic disorder, current or active state";
            context.PrimaryDiagnosis = context.PrimaryCode + " " + context.PrimaryDescription;
            //refresh fileuploader when form is displayed
            function submissionlogic() { //define submission logic before initializing plupload
                var instance = plupLoadService.getPluploadInstance();
                instance.bind('UploadComplete', function () {
                    //After docs are uploaded, submit entire form
                    memberDataService.SubmitAutismForm(context.formData).success(function (data, status, headers, config) {
                        if (data.ErrorsList.length > 0) {
                            context.SubmitDisabled = false;
                            $scope.SubmitError = data.ErrorsList;
                        } else {
                            //Disable all inputs on success
                            $("label, input, textarea, .custBtn").attr("disabled", true);
                            $("button, select").prop("disabled", true);
                            $(".active.custBtn").addClass("custBtnClicked").removeClass("btn-primary");
                            $(".active.custRadio").addClass("custRadioClicked").removeClass("btn-default");
                            $("#ViewPdf").prop("disabled", false);
                            $("#ResetDiv").prop("disabled", false);
                            context.SubmissionSuccessful();
                            context.formData.BhHeaderDOMId = data.BhHeaderDOMId;
                        }

                    }).error(function (data, status, headers, config) {
                        context.SubmitDisabled = false;
                        $scope.SubmitError = ["Error in submitting. Please try again."];
                    });

                });
                instance.bind('Error', function (up, info, files) {
                    context.SubmitDisabled = false;
                    $scope.SubmitError = ["Error in submitting. Please try again."];
                });
            }
            plupLoadService.initializePlupload(submissionlogic);
        };

        context.LoadRxHistory = function () {
            $rootScope.$broadcast('lazyLoadRxHistory', context.memberID1);
        };
        $rootScope.$on('AuthType', function (event, response) {
            //context.IsMonthlyUpdate = !response;
            if (SharedAutismFormData.Data.BehaviorList != null)
                context.formData.BehaviorList = SharedAutismFormData.Data.BehaviorList;
            context.AuthorizationType = response;
            context.AuthorizationSearched = true;
            if (SharedAutismFormData.Data.ResultMessage != null)
                context.AuthorizationError = SharedAutismFormData.Data.ResultMessage;
            if (SharedAutismFormData.Data.ABAProvider != null) {
                context.formData.RequestingProvider = SharedAutismFormData.Data.ABAProvider;
            }
            context.formData.PCPId = SharedAutismFormData.Data.PCPId;
            context.formData.SubNo = SharedAutismFormData.Data.SubNo;
            context.WarningMessagesDisplayList = SharedAutismFormData.Data.WarningMessageList;
        });

        context.ValidDate = function (date, errorNum) {
            context.DateError1 = false;
            context.DateError2 = false;
            context.DateError3 = false;
            var todaysDate = errorNum == 1 ? new Date() : new Date(context.formData.DateServiced);
            var choosenDate = new Date(date);
            if (choosenDate > todaysDate) {
                if (errorNum == 1) {
                    context.DateError1 = true;
                    //context.formData.DateServiced = todaysDate;
                }
                else if (errorNum == 2) {
                    context.DateError2 = true;
                    //context.formData.VerbalDate = todaysDate;
                }
                else if (errorNum == 3) {
                    context.DateError3 = true;
                    //context.formData.ABASDate = todaysDate;
                }
            }
        };

        context.SelectConcern = function (c) {
            context.formData.Concerns.push({ name: c.name });
        };
        //Edit member info toggle
        context.EditMemberInfo = function () {
            context.EditInfo = context.EditInfo === false ? true : false;
        };

        context.ScrollToNext = function (nextDiv) {
            $location.hash(nextDiv);
            $anchorScroll();
        };

        //Section: This code used to be in separate controllers and use a shared service/variable, but for the resume functionality of our form
        //It only works when we bind everything to one variable - out formdata var
        //When using the shared variable betw controllers, when we retrieve our var from the DB, it does not update the copeies that are in the controllers
        //Therefore, added all the controllers into our main controller instead - this fixes the issue

        //Adding Concerns to Med and Behavioral Section
        context.AddConcern = function () {
            context.formData.OtherConcern.push({ name: null });
        };
        context.RemoveConcern = function (index) {
            context.formData.OtherConcern.splice(index, 1);
        };

        var delayTimer;
        context.SearchDiagnosis = function () {
            clearTimeout(delayTimer);
            context.DiagRepeatError3 = '';
            context.DiagRepeatError2 = '';
            context.DiagNotFound3 = '';
            context.DiagNotFound2 = '';
            if (context.DiagnosisSearchTerm !== "") {

                delayTimer = setTimeout(function () {
                    context.LoadingDiagnosis = true;
                    var start = new Date().getTime();
                    var filter = {
                        "IcdCode": context.DiagnosisSearchTerm,
                        "Date": context.DateServiced
                    };
                    memberDataService.SearchIcdCode(filter).success(function (data) {
                        context.LoadingDiagnosis = false;
                        context.DiagnosisList = data;
                        if (context.DiagnosisList === null || context.DiagnosisList.length === 0 || context.DiagnosisList[0].Code === null) {
                            context.ErrorDiagnosis = true;
                            context.DiagNotFound3 = "Could not find diagnosis. Please try a different search.";
                            context.DiagNotFound2 = "Could not find diagnosis. Please try a different search.";
                        } else {
                            context.ErrorDiagnosis = false;
                            context.DiagNotFound3 = '';
                            context.DiagNotFound2 = '';
                        }
                    }).error(function () {
                        context.LoadingDiagnosis = false;
                    });
                }, 400);
            } else {
                context.DiagnosisList = [];
                context.LoadingDiagnosis = false; 
            }
        };


        context.SelectDiagnosis2 = function (diag) {
            var code = diag.Code.trim();
            var diagnosis = code + " " + diag.Description.trim() + diag.Description2.trim();

            if (code !== context.PrimaryCode && code !== context.formData.TertiaryDiagnosis && code !== context.formData.SecondaryDiagnosis) {
                context.SecondaryDiagnosisDisplay = diagnosis;
                context.formData.SecondaryDiagnosis = code;
                $("#myModals2").modal('hide');
            }
            else
                context.DiagRepeatError2 = "The Selected Diagnosis is Already Assigned to this Patient. Please Choose Another.";
        }
        context.SelectDiagnosis3 = function (diag) {
            var code = diag.Code.trim();
            var diagnosis = code + " " + diag.Description.trim() + diag.Description2.trim();

            if (code !== context.PrimaryCode && code !== context.formData.TertiaryDiagnosis && code !== context.formData.SecondaryDiagnosis) {
                context.TertiaryDiagnosisDisplay = diagnosis;
                context.formData.TertiaryDiagnosis = code;
                $("#myModals3").modal('hide');
            }
            else
                context.DiagRepeatError3 = "The Selected Diagnosis is Already Assigned to this Patient. Please Choose Another.";
        }

        context.ClearSecondDiag = function () {
            context.SecondaryDiagnosisDisplay = context.TertiaryDiagnosisDisplay;
            context.formData.SecondaryDiagnosis = context.formData.TertiaryDiagnosis;
            context.TertiaryDiagnosisDisplay = null;
            context.formData.TertiaryDiagnosis = null;
        };

        context.ClearDiagSearch = function () {
            context.DiagnosisSearchTerm = "";
            context.DiagnosisList = [];
            context.ErrorDiagnosis = false;
            context.DiagRepeatError3 = '';
            context.DiagRepeatError2 = '';
            context.DiagNotFound3 = '';
            context.DiagNotFound2 = '';
        };

        //Case Summary/ Adding Current Services 
        context.formData.CurrentServices = [{ Name: null, Intensity: null, TimeDescriptor: null }];

        context.AddService = function () {
            context.formData.CurrentServices.push({ Name: null, Intensity: null, TimeDescriptor: null });
        }
        context.RemoveService = function (index) {
            context.formData.CurrentServices.splice(index, 1);
        };

        //Medications
        context.formData.medicationInstance = [{ brandname: null, medtype: null, dosage: null, quantity: null }];

        context.AddInstance = function () {
            context.formData.medicationInstance.push({ brandname: null, medtype: null, dosage: null, quantity: null });
        }

        context.RemoveInstance = function (instance) {
            if (context.formData.medicationInstance.length > 1) {
                var idx = context.formData.medicationInstance.indexOf(instance);
                context.formData.medicationInstance.splice(idx, 1);
            }
        }
        context.ResetMedications = function () {
            context.formData.medicationInstance = [{ brandname: null, medtype: null, dosage: null, quantity: null }];
            //context.medicationInstance.push({ brandname: guid + "0", medtype: guid + "1", dosage: guid + "2", quantity: guid + "3" });
        }

        //context.A1IsValid = null;
        //context.A2IsValid = null;
        //context.A3IsValid = null;
        //context.B1IsValid = null;
        //context.B2IsValid = null;
        //context.B3IsValid = null;
        //context.B4IsValid = null;
        //Core Impairments
        context.ImpairmentValidation = function () {
            context.A1IsValid = context.ImpairmentRangeCheck(0, 15);
            context.A2IsValid = context.ImpairmentRangeCheck(16, 26);
            context.A3IsValid = context.ImpairmentRangeCheck(27, 54);
            context.B1IsValid = context.ImpairmentRangeCheck(55, 74);
            if (!context.B1IsValid)
                context.B1IsValid = context.formData.B1None ? true : null;
            context.B2IsValid = context.ImpairmentRangeCheck(75, 79);
            if (!context.B2IsValid)
                context.B2IsValid = context.formData.B2None ? true : null;
            context.B3IsValid = context.ImpairmentRangeCheck(80, 85);
            if (!context.B3IsValid)
                context.B3IsValid = context.formData.B3None ? true : null;
            context.B4IsValid = context.ImpairmentRangeCheck(86, 92);
            if (!context.B4IsValid)
                context.B4IsValid = context.formData.B4None ? true : null;

        }
        //fix
        context.ImpairmentRangeCheck = function (LowerRange, UpperRange) {
            for (var i = LowerRange; i <= UpperRange; i++) {
                if (context.formData.Impairments[i] != null && context.formData.Impairments[i].Checked) {
                    return true;
                }
            }
            return null;
        }
        //Treatments
        context.formData.Treatments = [];
        context.AddTreatment = function (t) {
            var TreatmentValid = true;
            //var RemoveIndex = 0;
            if (t != null) {
                for (var i = 0; i < context.formData.Treatments.length; i++) {
                    if (context.formData.Treatments[i].code == t.code)
                        TreatmentValid = false;
                }
                if (TreatmentValid) {
                    context.formData.Treatments.push({ name: t.name, code: t.code });
                    context.TreatmentValidation = 1;
                    //for (i = 0; i < context.BHTreatments.length; i++) {
                    //    if (context.BHTreatments[i].code == t.code)
                    //        RemoveIndex = i;
                    //}
                    //context.BHTreatments.splice(RemoveIndex, 1);
                }
                context.treat = null;
            }
        };
        context.removeTreatment = function (index, treatment) {
            context.formData.Treatments.splice(index, 1);
            if (index == 0)
                context.TreatmentValidation = null;
            //context.BHTreatments.push(treatment);

        };

        //Maladaptive Behaviors
        context.formData.BehaviorList = [{ name: "Tantrum", Checked: false, MalBehavOptions: [] }, { name: "Elopement", Checked: false, MalBehavOptions: [] }, { name: "Self-Stimulatory Behavior", Checked: false, MalBehavOptions: [] },
        { name: "PICA", Checked: false, MalBehavOptions: [] }, { name: "Non-Compliance", Checked: false, MalBehavOptions: [] }, { name: "Property Destruction", Checked: false, MalBehavOptions: [] },
        { name: "Self-injurious Behavior", Checked: false, MalBehavOptions: [] }, { name: "Physical Aggression Towards Others", Checked: false, MalBehavOptions: [] }, { name: "Verbal Aggression", Checked: false, MalBehavOptions: [] }, { name: "Safety Concerns", Checked: false, MalBehavOptions: [] }];

        context.Dimension = [{ id: "1", name: "Frequency" }, { id: "2", name: "Duration" }, { id: "3", name: "Intensity" }, { id: "4", name: "Percentage" }];
        context.Function = [{ id: "1", name: "Attention Seeking" }, { id: "2", name: "Escape / Avoidance" }, { id: "3", name: "Access to Tangible Items" }, { id: "4", name: "Self-Stimulatory Behavior" }];

        context.AddOption = function (currentBehav, newBehav) {
            if (newBehav != null && newBehav.OperationalDef != null && newBehav.Antecedent != null && newBehav.Consequence != null && newBehav.Function != null && newBehav.DropDown != null) {
                if (context.BehaviorNotExisting(currentBehav, newBehav)) {
                    currentBehav.MalBehavOptions.push({
                        OperationalDef: newBehav.OperationalDef, Antecedent: newBehav.Antecedent, Consequence: newBehav.Consequence,
                        DropDownId: newBehav.DropDown.id, FunctionId: newBehav.Function.id
                    });
                    newBehav.OperationalDef = null;
                    newBehav.Antecedent = null;
                    newBehav.Consequence = null;
                    newBehav.DropDown = null;
                    newBehav.Function = null;
                    currentBehav.MalBehavAddError = "";

                    currentBehav.ToggleMaladaptiveForm = false;
                }
                else
                    currentBehav.MalBehavAddError = "This behavior already exists in the list below. Please add a different behavior.";
            }
            else
                currentBehav.MalBehavAddError = "Please fill all fields before adding a behavior.";
        };

        context.BehaviorNotExisting = function (currentBehav, newBehav) {
            if (currentBehav.MalBehavOptions != null) {
                for (var i = 0; i < currentBehav.MalBehavOptions.length; i++) {
                    if (currentBehav.MalBehavOptions[i].FunctionId == newBehav.Function.id && currentBehav.MalBehavOptions[i].DropDownId == newBehav.DropDown.id)
                        return false;
                }
            }
            else
                currentBehav.MalBehavOptions = [];
            return true;
        }

        context.RemoveOption = function (currentBehav, index) {
            currentBehav.MalBehavOptions.splice(index, 1);
        };

        context.AddMaladaptiveBehavior = function () {
            context.formData.BehaviorList.push({ name: '', Checked: true, MalBehavOptions: [], type: "custom" });
        };
        context.RemoveBehavior = function (index) {
            context.formData.BehaviorList.splice(index, 1);
        };

        //VBMAPP Validation
        context.Toggle = function (index) {
            if (index === 1)
                context.formData.B1None = !context.formData.B1None;
            else if (index === 2)
                context.formData.B2None = !context.formData.B2None;
            else if (index === 3)
                context.formData.B3None = !context.formData.B3None;
            else
                context.formData.B4None = !context.formData.B4None;
        }

        context.VBAllChecked = "Please select a score for each category below. The categories with missing scores are outlined in red.";
        context.VBMAPPCount = function (index, val) {
            context.formData.VBMAPPData[index].Checked = (context.formData.VBMAPPData[index].Value != val || context.formData.VBMAPPData[index].Checked == null) ? true : false;
            context.formData.VBMAPPData[index].Value = context.formData.VBMAPPData[index].Checked ? val : -1;

            var count = 0;
            for (var i = 0; i < context.formData.VBMAPPData.length; i++) {
                if (context.formData.VBMAPPData[i].Checked == true) {
                    count++;
                }
            }
            context.VBAllChecked = count == 13 ? "" : "Please select a score for each category below. The categories with missing scores are outlined in red.";
            context.VBValid = count == 13 ? true : null;
        };
        context.CheckVBClicked = function (index, val) {
            if (context.formData.VBMAPPData[index].Value == null || context.formData.VBMAPPData[index].Value == -1)
                return null;
            else if (context.formData.VBMAPPData[index].Value == val)
                return true;
            else
                return false;
        };

        //ABAS
        context.SetABASDescription = function (Score, Behavior) {
            if (Score >= 1 && Score <= 3)
                Behavior.Description = "Extremely Low";
            else if (Score >= 4 && Score <= 5)
                Behavior.Description = "Low";
            else if (Score >= 6 && Score <= 7)
                Behavior.Description = "Below Average";
            else if (Score >= 8 && Score <= 12)
                Behavior.Description = "Average";
            else if (Score >= 13 && Score <= 14)
                Behavior.Description = "Above Average";
            else if (Score == 15)
                Behavior.Description = "High";
            else
                Behavior.Description = null;
        };

        context.ClearABAS = function () {
            context.formData.ABAS = [{ name: "Communication" }, { name: "Community Use" }, { name: "Functional Academics" }, { name: "Home Living" },
                         { name: "Health and Safety" }, { name: "Leisure" }, { name: "Self-Care" },
                         { name: "Self-Direction" }, { name: "Social" }, { name: "Work" }];
            context.formData.ABASDate = context.formData.DateServiced;
            context.DateError3 = false;
        };

        //Medical Case Management
        context.MedCaseManagementSelected = function () {
            if (context.formData.MedCaseTreatment.Eval) {
                context.MedManagementRequired = true;
                if (context.formData.MedCaseTreatment.MultipleERVisits || context.formData.MedCaseTreatment.MultipleAdmissions || context.formData.MedCaseTreatment.Readmission || context.formData.MedCaseTreatment.ChronicCond)
                    context.MedManagementRequired = false;
            }
            else {
                context.MedManagementRequired = false;
            }
        };
        context.ChronicConditionSelected = function () {
            if (context.formData.MedCaseTreatment.ChronicCond) {
                context.ChronicConditionsRequired = true;

                if (context.formData.MedCaseTreatment.DM || context.formData.MedCaseTreatment.COPD || context.formData.MedCaseTreatment.CHF || context.formData.MedCaseTreatment.Otherr)
                    context.ChronicConditionsRequired = false;
            }
            else {
                context.ChronicConditionsRequired = false;

            }
        };


        //Uncheck checkbox reset section
        context.UncheckMalBehav = function (behav) {
            behav.MalBehavAddError = "";
            if (behav.Behavior != null) {
                behav.Behavior.OperationalDef = '';
                behav.Behavior.Antecedent = '';
                behav.Behavior.Consequence = '';
                behav.Behavior.DropDown = null;
                behav.Behavior.Function = null;
            }
            //context.DeleteBehaviorList(behav);

        };

        //context.CloseMaladaptiveForms = function()
        //{
        //    for(i = 0; i < context.formData.BehaviorList.length; i++)
        //    {
        //        context.formData.BehaviorList[i].ToggleMaladaptiveForm = false;
        //    }
        //    $('#MalBehavForm').hide();
        //}

        context.DeleteBehaviorList = function (b) {
            b.MalBehavOptions = [];
        };

        context.UncheckMedCaseManagement = function () {
            context.formData.MedCaseTreatment.MultipleERVisits = false;
            context.formData.MedCaseTreatment.MultipleAdmissions = false;
            context.formData.MedCaseTreatment.Readmission = false;
            context.formData.MedCaseTreatment.ChronicCond = false;
            context.ChronicConditionsRequired = false;
            context.MedManagementRequired = false;
            context.UncheckChronicCondtns();
        };

        context.UncheckChronicCondtns = function () {
            context.formData.MedCaseTreatment.DM = false;
            context.formData.MedCaseTreatment.COPD = false;
            context.formData.MedCaseTreatment.CHF = false;
            context.formData.MedCaseTreatment.Other = '';
            context.formData.MedCaseTreatment.Otherr = false;
        };

        context.UncheckImpairment = function (impairIndex) {
            if (context.formData.Impairments[impairIndex] != null) {
                context.formData.Impairments[impairIndex].Rating = null;
                context.formData.Impairments[impairIndex].Example = '';
            }
        };
        context.NoImpairments = function (FirstElement, LastElement) {
            for (var i = FirstElement; i <= LastElement; i++) {
                if (context.formData.Impairments[i] != null) {
                    if (context.formData.Impairments[i].Checked != null)
                        context.formData.Impairments[i].Checked = false;
                    if (context.formData.Impairments[i].Rating != null)
                        context.formData.Impairments[i].Rating = null;
                    if (context.formData.Impairments[i].Example != null)
                        context.formData.Impairments[i].Example = '';
                }
            }
        };

        context.NoVBMapp = function () {
            context.formData.VerbalDate = context.formData.DateServiced;
            context.DateError2 = false;
            context.formData.VBMAPPData = [{ Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null },
                                       { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }, { Checked: null, Value: null }];
        };

        //Submission Section
        //Reveal All
        context.ShowAll = function () {
            $rootScope.PartOne = true;
            $rootScope.MemberInfo = $rootScope.PartOne;
            context.PartTwoForm = true;
            context.PartThreeForm = true;
            $(".pageswitch").hide();
            $(".accordion-body").each(function () { if (!$(this).hasClass("in")) $(this).addClass("in"); });
            $(".accordion-toggle").each(function () { $(this).removeAttr("href") });
        }

        //context.ProgressError = true;
        //context.UpdateGoalCount = function () {
        //    var CheckCount = 0;
        //    for (i = 0; i < context.formData.CaregiverProgressGoals[0].subLabels.length; i++) {
        //        if (context.formData.CaregiverProgressGoals[0].subLabels[i].Checked != null)
        //            CheckCount++;
        //    }
        //    context.ProgressError = CheckCount != context.formData.CaregiverProgressGoals[0].subLabels.length ? true : false;
        //};
        //context.UpdateGoalCountMonthly = function () {
        //    var CheckCount = 0;
        //    for (i = 1; i < context.formData.CaregiverProgressGoals.length; i++) {
        //        if (context.formData.CaregiverProgressGoals[i].score != null)
        //            CheckCount++;
        //    }
        //    context.ProgressError = CheckCount != context.formData.CaregiverProgressGoals.length - 1 ? true : false;
        //};

        //Validate
        context.ValidateForm = function () {
            context.ShowAll();
            context.Validating = true;

            //context.ScrollToNext("TopOfForm");
            //check if provider selected
            //context.ProviderError = context.formData.ABAProvider.Name == null? "Please Select an ABA Provider." : '';
            //check if all cargiver goals are selected


            if ($scope.BHForm.$valid) {
                context.FormValid = true;
                context.ScrollToNext("submitFormButton");
            }
            else {
                var errorDiv = $($(".ng-invalid").filter(":input")[0]);
                if (errorDiv.attr('style') === 'display: none')
                {
                    errorDiv = errorDiv.parent();
                }
                var errorPosition = errorDiv.offset().top;

                errorPosition -= 100;
                $('html,body').animate({
                    scrollTop: errorPosition
                }, 1000);
            }

        }
        context.PreSubmit = function () {
            $scope.SubmitError = "";
            context.ShowAll();
            //context.CloseMaladaptiveForms();
            context.formData.DynamicMonthTrends = SharedAutismFormData.Data.DynamicMonthTrends;
            context.formData.MonthlyTrends = SharedAutismFormData.Data.MonthlyTrends;
            context.formData.DateSubmitted = new Date();
            context.formData.FormName = context.FormName;
            context.formData.LoggedInProvider = '000'; //fix later
            context.formSubmittedDate = Date.now();
            $('#form-submitted-date label').text("Submitted to IEHP on " +$filter('date')(context.formSubmittedDate, "MM/dd/yyyy h:mma"));
            $('#form-submitted-date').show();
            context.formData.DOM = cloneDOM();
            $('#form-submitted-date').hide();
            context.SubmitScreenShot();
        };
        //Submit
        context.submit = function () {
            context.PreSubmit();

            //context.formData.DOM = cloneDOM();

            //console.log(context.formData);

            //$("#BHForm").valid();
        };



        context.SubmitScreenShot = function () {

            $scope.filterObject = {
                SubscriberNumber: SharedAutismFormData.Data.SubNo,
                FormName: context.AttachmentFolderName,
                Department: "BH"
            }
            plupLoadService.bindFilterObject($scope.filterObject);
            var submitDocumentsResult = plupLoadService.submitDocuments();
            context.formData.FileId = submitDocumentsResult.FileId;

        };

        context.SubmissionSuccessful = function () {
            context.Success = true;
            context.SubmitDisabled = false;
            $scope.SubmitSuccess = "Form has been successfully submitted. Click below to download the PDF.";
        };

        context.GetPdf = function () {
            context.SubmitDisabled = true;
            var confirmationNumber = context.formData.AuthID.toUpperCase();
            memberDataService.BhGetPdf(context.formData.BhHeaderDOMId, confirmationNumber).success(function (response) {
                context.SubmitDisabled = false;
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }), "Behavioral Health");
                } else {
                    var file = new Blob([response], { type: 'application/pdf' });
                    var fileUrl = URL.createObjectURL(file);
                    window.open(fileUrl);
                }

            }).error(function (data) {
                context.SubmitDisabled = false;
            });
        }

        //context.OpenPDF = function () {
        //    var req = {
        //        method: 'POST',
        //        url: Global.BuildUrl('/AutismBHT', '/AutismBHT/DisplayPDF'),
        //        contentType: "application/json; charset=utf-8",
        //        data: { BhHeaderDOMId: context.formData.BhHeaderDOMId, AuthId: context.formData.AuthID }
        //    };

        //    $http(req).success(function (data, status, headers, config) {
        //        //window.open(data, '_blank');
        //        window.open("data:application/pdf;base64, " + data);
        //    }).error(function (data, status, headers, config) {
        //        //console.log("nay");
        //    });
        //};

        //context.SaveFormForReview = function () {
        //    //context.formData.VBTable = ($('<div>').append($('#VBTable').clone()).html());
        //    context.formData.IsFormRetrieval = true;
        //    context.formData.DateSaved = new Date();
        //    //updateFileUploadList(filesuploaded);
        //    $http({
        //        url: Global.BuildUrl('/AutismBHT', '/AutismBHT/SaveFormForReview'),
        //        method: 'POST',
        //        data: { FormUnreviewed: JSON.stringify(context.formData) }
        //    });
        //};

        context.ClearForm = function () {
            context.formData = {};
            SharedAutismFormData.Data = {};
        }
        //context.RetrieveUreviewedForm = function () {
        //    $http({
        //        url: Global.BuildUrl('/AutismBHT', '/AutismBHT/RetrieveUnreviewedForm'),
        //        method: 'GET',
        //    }).success(function (data) {
        //        context.formData = data.formData;
        //        context.formData.DateServiced = $filter('date')(context.formData.DateServiced, "MM/dd/yyyy");
        //        context.formData.VerbalDate = $filter('date')(context.formData.VerbalDate, "MM/dd/yyyy");
        //        context.formData.ABASDate = $filter('date')(context.formData.ABASDate, "MM/dd/yyyy");

        //        //context.formData = data;
        //        //SharedAutismFormData.Data = data;
        //        //$('#hideForm').show();
        //        //$('#hideForm2').show();
        //        //context.PartTwoForm = true;
        //        //context.PartThreeForm = true;
        //        //$rootScope.PartOne = true;
        //        //$rootScope.MemberInfo = true;
        //    });
        //};

        //updateFileUploadList = function (filesuploaded) {
        //    for (i = 0; i < filesuploaded.length; i++) {
        //        context.formData.filesupped.push(filesuploaded[i]);
        //    }
        //}

        //$rootScope.$on('AuthRetrieved', function (event, response) {
        //    context.
        //});

        $rootScope.$on('UploaderInitialize', function (event, response) {
            context.FileUploader = response;
        });

        //context.Test = function(t)
        //{
        //    console.log(t);
        //}

    };

    angular
    .module('MemberPortal')
    .controller('AutismMonthTrendController', AutismMonthTrendController);

    AutismMonthTrendController.$inject = [
    '$scope', 'SharedAutismFormData'
    ];

    function AutismMonthTrendController($scope, SharedAutismFormData) {
        var context = this;
        context.Data = SharedAutismFormData.Data;
        var TrendIndex = 0;
        context.Data.DynamicMonthTrends = [];
        context.Data.MonthlyTrends = [{ name: "Requesting", TrendData: "" }, { name: "Labeling", TrendData: "" }, { name: "Following Instructions", TrendData: "" }, { name: "Visual Perceptual", TrendData: "" },
                                  { name: "Motor Imitation", TrendData: "" }, { name: "Verbal Imitation", TrendData: "" }, { name: "Play Skills", TrendData: "" }, { name: "Social Skills", TrendData: "" },
                                  { name: "Spontaneous Talk", TrendData: "" }, { name: "Advanced Discrimination", TrendData: "" }, { name: "Reciprocal Conversation", TrendData: "" }, { name: "Classroom Routines", TrendData: "" },
                                  { name: "Linguistic", TrendData: "" }, { name: "Dressing", TrendData: "" }, { name: "Bathing", TrendData: "" }, { name: "Feeding", TrendData: "" },
                                  { name: "Toileting", TrendData: "" }];

        context.AddTrend = function () {
            context.Data.DynamicMonthTrends.push({ Trendex: TrendIndex, NewTrend: "", TrendData: "" });
            TrendIndex++;
        }
        context.RemoveTrend = function (index) {
            context.Data.DynamicMonthTrends.splice(index, 1);
        };

        context.MonthTrendValidation = function () {
            var IsValid = true;
            for (var i = 0; i < context.Data.MonthlyTrends.length; i++) {
                if (context.Data.MonthlyTrends[i].TrendData == "")
                    IsValid = false;
            }
            for (var i = 0; i < context.Data.DynamicMonthTrends.length; i++) {
                if (context.Data.DynamicMonthTrends[i].TrendData == "")
                    IsValid = false;
            }
            if (IsValid)
                context.MonthTrendBehaviorError = "false";
            else
                context.MonthTrendBehaviorError = null;
        }
    };

})();

///Validation directives



var Global = (function () {


    var init = function () {
        $.support.cors = true;
        $.ajaxSetup({ cache: false }); //clears cache
    };

    var buildUrl = function (current, newroute) {
        var lccurrent = current.toLowerCase();
        var protocol = window.location.protocol;
        var host = window.location.host;
        var pathname = window.location.pathname.toLowerCase();
        var realpath = pathname.split(lccurrent)[0];
        var lastchar = realpath.substring(realpath.length - 1);
        if (lastchar === '/') {
            realpath = realpath.substring(0, realpath.length - 1);
        }
        var url = protocol + '//' + host + realpath + newroute;
        return url;
    };

    return {
        Init: init,
        BuildUrl: buildUrl,

    };
})();

function cloneDOM() { //clones The DOM to be sent to MEDHOK

    //$('body').width($('body').width());
    //$('.container').width(1300);
    //$('.MalBehavForm').hide();

    //filter dom elements to capture data

    $("input[type=text]").each(function (key, value) {
        var item = $(value);
        item.css('word-break', 'break-word');
        item.attr('value', $(value).val());
        //item.css('height', item[0].scrollHeight);
        item.attr('placeholder', '');
    });

    $("input[type=number]").each(function (key, value) {
        var item = $(value);
        item.css('word-break', 'break-word');
        item.attr('value', item.val());
        //item.css('height', item[0].scrollHeight);
        item.attr('placeholder', '');
    });

    $("textarea").each(function (key, value) {
        var item = $(value);
        item.css('word-break', 'break-word');
        item.html(item.val());
        item[0].scrollHeight; //IE8 fix, scroll height returns correct value only on 2nd call
        item.css('height', item[0].scrollHeight * 1.15);
        item.attr('placeholder', '');
    });

    $("select").each(function (key, value) {
        //var selectedVal = $(value).value;
        $($(value)[0][0]).removeAttr("selected");
        $(value).find(":selected").attr('selected', 'selected')
    });

    //$("link").each(function (key, value) {
    //    $(value).attr('href', $(value).prop('href'));
    //});

    $("img").each(function (key, value) {
        $(value).attr('src', $(value).prop('src'));
    });
    
    $("input[type=radio]").each(function (key, value) {
        $(value).attr('checked', $(value).prop('checked'));
    });

    $("input[type=checkbox]").each(function (key, value) {
        $(value).attr('checked', $(value).prop('checked'));
    });

    $("#RemoveOnCopy").remove();
    $("#ShowOnCopy").css('display', 'table-header-group');
    $("#RemoveOnCopy2").remove();
    $("#ShowOnCopy2").css('display', 'table-header-group');
    $("#VBTable").attr('style', '');
    $('#paginationFooter').remove();
    $('#paginationFooter2').remove();
    $('#submitFormButton').hide();
    $("#ReleaseFormLink").removeAttr('href');
    $("#TreatmentRequirementsFBA").removeAttr('href');
    $("#TreatmentRequirements6Month").removeAttr('href');
    $('#form-submitted-date').removeClass('ng-hide');

    var domWithoutScripts = $("*").find('script').remove().end();


    var domBody = domWithoutScripts.find("#PdfData").html().replace(/(\r\n|\n|\r|\t)/gm, '').replace(/ +(?= )/g, '').replace(/<!--(.*?)-->/gm, '');
    
    var htmlStringWithCss = "";
    $("link").each(function (key, value) {
        var templink= "<link href='" + value.href +"' rel='stylesheet'>";
        htmlStringWithCss += templink;
    });

    //var domHead = domWithoutScripts.find("head").html();
    var dom = "<head>" + htmlStringWithCss + "</head>" + "<body>" + domBody + "</body>";

    $("#VBTable").attr('style', 'overflow-x: scroll; overflow-y: hidden; width: 941px; height: 557px; white-space: nowrap;');

    $('#submitFormButton').show();

    return dom;
};

var fileID = (function () {
    function s4() {
        return Math.floor((1 + Math.random(new Date().getTime())) * 0x10000)
                   .toString(16)
                   .substring(1);
    }
    return function () {
        return s4() + s4();
    };
})();

//(function () {

//})();

    ////////Validation
    //var names = "";
    //var current = "";

    //$(".validate-radiogroup-monthtrend :radio").each(function () {
    //    if(this.name != current)
    //        names += (this.name + " ");
    //     current = this.name;
    //});

    ////jQuery.validator.addMethod("BoxGroupValidation", function (value, element, param) {
    ////    var current = $(element);
    ////    while(current.parent().find(param).length == 1)
    ////    {
    ////        current = $(element).parent();
    ////    }
    ////    current = current.parent();
    ////    return (current.find(":checked").length > 0)
    ////    },
    ////    "Please make a selection for all categories above.");

    //jQuery.validator.addMethod("BoxGroupValidation", function (value, element, param) {
    //    return (($(param + " :checked").length == $(param).length && ($(".monthfirsttime").parent().find(":checked").val() == "true")) || ($(".monthfirsttime").parent().find(":checked").val() == null) || ($(".monthfirsttime").parent().find(":checked").val() == "false"))
    //},
    //    "Please make a selection for all categories above.");

    //var validator = $("#BHForm").validate({
    //    ignore: [],
    //    groups: {
    //        //monthtrendgroup: names
    //    },
    //    focusInvalid: false,
    //    invalidHandler: function(form, validator) {

    //    //$('html, body').animate({
    //    //    scrollTop: $('#TopOfForm').offset().top
    //        //});
    //    //$('html, body').animate({
    //    //    scrollTop: $('#comment').offset().top
    //    //});
    //    $('html, body').animate({
    //        scrollTop: $(validator.errorList[0].element).offset().top
    //    });

    //    },
    //    errorPlacement: function (error, element) {
    //        if (element.is(".validate-radiogroup-monthtrend :radio"))
    //            error.appendTo("#MonthTrendError")
    //        else if(element.is(".CoreAutisImp"))
    //            error.appendTo(element.parent.parent)
    //        else
    //            error.insertAfter(element);
    //    },
    //});

    //$(".validate-textbox").each(function () {
    //    $(this).rules('add', {
    //        required: true
    //    });
    //});

    //$(".validate-radiogroup :radio").each(function () {
    //    $(this).rules('add', {
    //        required: true
    //    });
    //});

    //$(".validate-radiogroup-monthtrend :radio").each(function () {
    //    $(this).rules('add', {
    //        BoxGroupValidation: ".validate-radiogroup-monthtrend"
    //    });
    //});

    //$(".validate-single").each(function () {
    //    $(this).rules('add', {
    //        required: true
    //    });
    //});


    ////$(".validate-textbox-behavior").each(function () {
    ////    $(this).rules('add', {
    ////        required: true,
    ////    });
    ////});

    //$("#CoreImpairments input:checkbox").click(function () {
    //        var parent = $(this).parent();
    //        while (parent.find(":radio").length == 0) {
    //            parent = parent.parent();
    //        }
    //        if ($(this).is(":checked")) {
    //            $(parent).find(":radio").each(function () {
    //                $(this).rules('add', {
    //                    required: true
    //                });
    //            });
    //        }
    //        else {
    //            $(parent).find(":radio").each(function () {
    //                $(this).rules('remove', 'required')
    //            });
    //        }
    //});

    //$("#MalBehav input:checkbox").click(function () {
    //    var parent = $(this).parent();
    //    while (parent.find(":text").length == 0) {
    //        parent = parent.parent();
    //    }

    //    if ($(this).is(":checked")) {
    //        $(parent).find(":text").each(function () {
    //            $(this).rules('add', {
    //                required: true
    //            });
    //        });

    //    }
    //    else {
    //        $(parent).find(":text").each(function () {
    //            $(this).rules('remove', 'required')
    //        });
    //    }
    //    //else
    //    //{
    //    //    $(parent).find(":text").each(function () {
    //    //        $(this).rules("remove", "required");
    //    //    });
    //    //}
    //});

    ////$(".custBtn input").click(function () {
    ////    $(this).toggleClass("VBmappbutton");
    ////});

    //Jquery toggle on VB-MAPP
    //$(document).on('click', '.custBtn', function () {
    //    //if ($(this).hasClass('active'))
    //    //{
    //    //    $(this).removeClass('active');
    //    //    $(this).parent().parent().parent().find("label.custBtn").removeClass('disabled');
    //    //}
    //    //else
    //    //{
    //    //    $(this).parent().parent().parent().find("label.custBtn").removeClass('active').addClass('disabled');
    //    //    $(this).removeClass('disabled').addClass('active');
    //    //}
    //    //return false;
    //})

    //////Date Jquery set up
    //$('#datetimepicker1').datetimepicker({
    //    minView: 'month',
    //    autoclose: true,
    //    todayBtn: true,
    //    format: "mm/dd/yyyy"
    //});

    //$('#datetimepicker2').datetimepicker({
    //    minView: 'month',
    //    autoclose: true,
    //    todayBtn: true,
    //    format: "mm/dd/yyyy"
    //});

    //$('#datetimepicker3').datetimepicker({
    //    minView: 'month',
    //    autoclose: true,
    //    todayBtn: true,
    //    format: "mm/dd/yyyy"
    //});


    //On Refresh, if cookie expired, create another one to pass data to controller to pass to refreshed view
    //window.onbeforeunload = function () {
    //    if (getCookie("AutismCookie") === "" && AutismCookie != null) {
    //        setCookie("AutismCookie", AutismCookie, 5);
    //    }
    //};

    //Cookie Helper Fxns Thx to W3 Schools
    //function setCookie(cname, cvalue, exminutes) {
    //    var d = new Date();
    //    d.setMinutes(d.getMinutes() + exminutes);
    //    var expires = "expires=" + d.toUTCString();
    //    document.cookie = cname + "=" + cvalue + "; " + expires;
    //}

    //function getCookie(cname) {
    //    var name = cname + "=";
    //    var ca = document.cookie.split(';');
    //    for (var i = 0; i < ca.length; i++) {
    //        var c = ca[i];
    //        while (c.charAt(0) == ' ') c = c.substring(1);
    //        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    //    }
    //    return "";
    //}
