(function () {
    var app = angular.module('MemberPortal');

    /* Survey */

    app.controller('SurveyController', ['$state', '$scope',
        function ($state, $scope) {
            //$state.params...
            //$state.
            $scope.surveyId = $state.$current.self.params.surveyId;
        }]);

})();