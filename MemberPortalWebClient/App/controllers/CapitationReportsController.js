(function() {

    angular
        .module('MemberPortal')
        .controller('CapitationReportsController', CapitationReportsController);

    CapitationReportsController.$inject = ['memberDataService', '$scope', '$state', 'contentAuthorizationService'];

    function CapitationReportsController(memberDataService, $scope,$state, contentAuthorizationService) {

        $scope.summaryLoader = false;
        $scope.detailLoader = false;

        //UIContentAuthorization
        $scope.siteItem = [];
        $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.resolve.params[0]().CGC);


    $scope.GetCapitationSummary = function GetCapitationSummary() {

        $scope.summaryLoader = true;
        memberDataService.GetCapitationSummary().success(function (response) {
            console.log("response arraybuffer: ", response.byteLength);
            $scope.summaryLoader = false;
            
            if (response.byteLength <= 291) {
                var div = document.getElementById("capitationError");
                div.className = "text-center alert alert-danger";
                div.innerHTML = "No Capitated Members This Month";
            } else {
                $scope.detailLoader = false;
                console.log("Response: ", response);
                console.log("Success. Creating PDF.");
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }));
                } else {
                    var file = new Blob([response], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                }
            }
        });

        memberDataService.GetCapitationSummary().error(function (response) {
            $scope.summaryLoader = false;
            console.log("An error occured while trying to retrieve file. Error: ", response); 
        }); 

        };

    $scope.GetCapitationDetails = function GetCapitationDetails() {

            $scope.detailLoader = true; 
            memberDataService.GetCapitationDetails().success(function (response) {
                console.log("response: ", response);
                $scope.detailLoader = false;
                if (response.byteLength <= 291) {
                    var div = document.getElementById("capitationError");
                    div.className = "text-center alert alert-danger";
                    div.innerHTML = "No Capitated Members This Month";
                } else {
                    $scope.detailLoader = false;
                    console.log("Response: ", response);
                    console.log("Success. Creating PDF.");
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(new Blob([response], { type: 'application/pdf' }));
                    } else {
                        var file = new Blob([response], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(file);
                        window.open(fileURL);
                    }
                }
            });
            memberDataService.GetCapitationDetails().error(function (response) {
                $scope.detailLoader = false;
                console.log("An error occured while trying to retrieve file. Error: ", response);
            });
        };

    }
})
    ();
