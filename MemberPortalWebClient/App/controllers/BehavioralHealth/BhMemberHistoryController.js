
(function () {



    var app = angular.module('MemberPortal');

  

    app.controller('InitializeMemberHistoryController', [
       '$scope', '$http', '$rootScope', '$state', 'contentAuthorizationService', function ($scope, $http, $rootScope, $state, contentAuthorizationService) {

           $scope.siteItem = [];
           $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);

       }
    ]);
        
    app.controller('MemberHistoryController', ['$scope', '$http','memberDataService', function ($scope, $http, memberDataService) {

        $scope.memberHistoryList = [];
        $scope.searching = false;
        $scope.searched = false;
        $scope.inputSearchType = "";
        $scope.isInternal = "N";
      
        $scope.GetHistoricalRecord = function (elem) {

           var params = {
               "recordId": elem.$parent.record.HeaderId,
               "formType": elem.$parent.record.FormId,
                "subscriberNumber": elem.$parent.record.MemberId
            }
            memberDataService.GetClassicHtmlRecord(params).success(function (resp) {

                console.log(resp);
            });
        }


        $scope.GetHtmlRecord = function (elem) {

            memberDataService.GetHtmlRecord(elem.HeaderId).success(function (response) {

                console.log("getHtmlRecordResp" , response);


            });

        
        }

        $scope.inputSearchType = "";

        $scope.displayInputSearchType = function (form) {
            // var input = form.memberId.$viewValue;
            //ie 8 fix
            var input = $('#memberId').val();
            var reg1 = /^\d{12}0[0-1]$/;
            var reg2 = /^\d{12}$/;
            var reg3 = /^\d{9}$/;
            var reg4 = /^\d{8}[aA-pP]$/;

            var test1 = (reg1.test(input) || reg2.test(input));
            var test2 = reg3.test(input);
            var test3 = reg4.test(input);


            if (test1) {
                $("#memberId").addClass("inputGood");
                $scope.inputSearchType = "IEHP ID";
                $('#searchButton').prop('disabled', false);
            } else if (test2) {
                $("#memberId").addClass("inputGood");
                $scope.inputSearchType = "SSN";
                $('#searchButton').prop('disabled', false);
            } else if (test3) {
                $("#memberId").addClass("inputGood");
                $scope.inputSearchType = "CIN";
                $('#searchButton').prop('disabled', false);
            } else {
                $("#memberId").removeClass("inputGood");
                $scope.inputSearchType = "";
                $('#searchButton').prop('disabled', true);
            }

        }

        $scope.getInputSearchType = function (input) {
            var type = "IEHP";
            if (input !== null && input !== undefined) {

                switch (input.length) {

                    case 9:
                        //CIN or SS
                        type = "SSN";

                        break;
                    default:
                        type = "IEHP";
                        break;
                }
            }
            return type;
        }

        $scope.SearchAuths = function (form) {
            $scope.searched = false;
            //var input = form.memberId.$viewValue;
            //IE 8 fix
            var input = $('#memberId').val();
            var reg1 = /^\d{12}0[0-1]$/;
            var reg2 = /^\d{12}$/;
            var reg3 = /^\d{9}$/;
            var reg4 = /^\d{8}[aA-pP]$/;

            var test1 = (reg1.test(input) || reg2.test(input));
            var test2 = reg3.test(input);
            var test3 = reg4.test(input);


            if (test1 || test2 || test3) {

                $scope.memberHistoryList = [];
                $scope.searching = true;

                $("#loading").append(
                    "<h4>Retrieving Form History...</h4>");
                var params = {
                    MemberId: input,
                    Type: $scope.getInputSearchType(input)
                }
                memberDataService.FindMemberHistory(params).success(function (response) {
                    
                    $("#loading").empty();
                    $scope.memberHistoryList = response;
                    $scope.searching = false;
                    $scope.searched = true;
                    console.log(response);
                });
            }
        }
    }]);
})();

