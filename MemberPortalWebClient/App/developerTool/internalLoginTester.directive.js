(function() {
    'use strict';

    angular
        .module('MemberPortal')
        .directive('internalLoginTester', internalLoginTester);

    

    internalLoginTester.$inject = [];
    
    function internalLoginTester () {
        // Usage:
        //     <internalLoginTester></internalLoginTester>
        // Creates:
        // 
        var directive = {
            scope: {},
            link: link,
            restrict: 'E',
            template: '<div class="internalLoginTester"><p>Sign in with an internal access token by pasting the base 64 encoded response message here:</p><label>Base64 Encoded Response String: <input type="text" ng-model="vm.tokenInput"></label><button type="submit" ng-click="vm.login()">Submit</button></div>',
            controller: internalLoginTesterController,
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
        }
    }
    
    internalLoginTester.$inject = ['authService', '$state'];
    function internalLoginTesterController(authService, $state) {
        var vm = this;
        vm.tokenInput = '';

        vm.login = function () {
            authService.processLoginToken(vm.tokenInput).then(function () {
                $state.go('home');
            });
        };
    }

})();