(function() {
    angular.module('MemberPortal').config(StyleGuideStateConfig);

    var urlBase = $('meta[name="ApplicationRoot"]').attr('content'),
			cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
    //use this helper function to minimize repeated code in the routes
    function url(url) {
        return urlBase + url + cacheBust;
    }

    StyleGuideStateConfig.$inject = ['$stateProvider'];
    function StyleGuideStateConfig($stateProvider) {
        $stateProvider
            .state('surveys', {
                url: '/surveys',
                views: {
                    '': { templateUrl: url('/App/layout/two-column-wide-right.html') },
                    'navigation@surveys': { template: '<div left-navigation></div>' },
                    'content@surveys': { template: '<input type="text" ng-model="surveyId"/>', controller: 'SurveyController' },
                },
                params: { 'surveyId': '1234' }
            })
            .state('surveys.page1', {
                url: '/page-1',
                views: {
                    'content@surveys': { template: '<new-survey survey-id="34"></new-survey>', controller: 'SurveyController' },
                },
                params: { 'surveyId': '5678' }
            })
            .state('surveys.page2', {
                url: '/page-2',
                views: {
                    'content@surveys': { template: '<new-survey survey-id="32"></new-survey>', controller: 'SurveyController' },
                },
                params: { 'surveyId': '9101' }
            });
            
    
    }

})();