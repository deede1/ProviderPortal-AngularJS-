 (function () { 

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content');

     angular
        .module('MemberPortalDirectives')
        .directive("ppChevronToggle", function () {
            return {
                scope: {
                    state: '@'
                },
                restrict: "EA",
                //replace: true,
                templateUrl: urlBase + '/App/directives/navigation/chevron-toggle/ppChevronToggle.html'
                //template : ''
                //controller: 'ppChevronToggleController'
            };
        });
})();
 