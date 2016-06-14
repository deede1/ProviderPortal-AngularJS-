(function () {
    var app = angular.module('MemberPortalDirectives');

    app.directive("temporaryIdFrame", ['memberDataService', function (memberDataService) {
        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

        var link = function (scope, element, attrs) {
            //$scope.idCardUrl = 'https://www.iehp.org/Secure_Site/Eligibility/IdCards/Forms/CMCDuals.asp?id=19961000153801&dos=07/02/2014';
            scope.idCardUrl = 'https://www.iehp.org/Secure_Site/Eligibility/IdCards/Forms/';
            scope.loading = true;
            var getTodaysDate = function() {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd;
                }

                if (mm < 10) {
                    mm = '0' + mm;
                }

                today = mm + '/' + dd + '/' + yyyy;
                return today;
            };

            var determineIdCardFormName = function(elig) {
                //Using the eligibility line, determine which Id card form to use

                var plan = (elig.LobDescription == "Healthy Kids") ? "HealthyKids" :
                    (elig.LobDescription == "Medi-Medi") ? "MediMedi" :
                    (elig.LobDescription == "Cal MediConnect") ? "CMCDuals" :
                    (elig.LobDescription == "Open Access") ? "OpenAccess" :
                    (elig.LobDescription == "Medicare") ? "Medicare" : "MediCal";

                return plan + '.asp';
            };

            memberDataService.getCurrentEligibility().success(function (data) {
                    var elig = memberDataService.utility.getPrimaryEligibilityRecord(data);

                    //Append Id Card Form to Url
                    scope.idCardUrl += determineIdCardFormName(elig);

                    //Append Subno and DOS
                    scope.idCardUrl += "?id=" + elig.SubscriberId + '&dos=' + getTodaysDate();

                    //Update Iframe src with Url
                    angular.element(element[0].querySelector('iframe')).attr('src', scope.idCardUrl);
                    scope.loading = !scope.loading;
            }).error(function () {
                scope.loading = !scope.loading;
            });

            //var printWindow;

            //var xx = function printAppend() {
            //    console.log('@printAppend');
            //    var p = document.createElement('h1');
            //    var t = document.createTextNode('Hallo!');
            //    p.appendChild(t);
            //    console.log(printWindow);

            //    var e = printWindow.document.getElementsByClassName('main')[0];
            //    console.log('e=' + e);
            //    e.appendChild(p); 
  
            //}

            $("#imgPrintTempCard").click(function () {
                //  var divContents = $("#ifTempIDCard").document;
             
                printWindow = window.open(scope.idCardUrl, '', 'height=400,width=650,location=no,'); 

             //  setTimeout( xx(), 5000); 
        
             //  window.print();
            });

        };


        return {
            scope: {},
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/temporaryIdFrame/temporaryIdFrame.html' + cacheBust,
            link: link
        };
    }]);
    

})();