(function() {
    'use strict';
    var debug = false; //This toggles console log outputs.


    angular
        .module('MemberPortalDirectives')
        .directive('keepAlive', directive);

    directive.$inject = [];
    
    function directive () {
        // Usage:
        //     <keep-alive></keep-alive>
        // Creates:
        // 
        var directive = {
            scope: {},
            link: link,
            restrict: 'E',
            template: [
                '<div class="keepAliveBackdrop" ng-show="vm.showActivityPrompt">',
                    '<div style="position:relative;height:100%;width:100%;">',
                        '<div style="position:fixed;width:100%;top:45%;">',
                            '<div class="keepAliveContainer">',
                                '<danger-box message="{{vm.errorMessage}}"></danger-box>',
                                '<p>Are you still there?</p>',
                                '<p>You will be automatically logged out in<br/> {{vm.ActivityPromptCountdown}} second(s)</p>',
                                '<p>',
                                    '<button class="btn btn-primary" ng-click="vm.iAmStillHere()">Continue</button>',
                                    '<button class="btn btn-primary" ng-click="vm.LogOut()">Log Out</button>',
                                '</p>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''),
            controller: controller,
            controllerAs: 'vm'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.vm.init();
            element.on('$destroy', function () {
                $interval.cancel(scope.vm.inactivityPromptInterval);
                $interval.cancel(scope.vm.detectionInterval);
            });

        }

        controller.$inject = ['$scope', '$rootScope', '$document', 'authStatusService', 'authService', '$interval'];
        function controller($scope, $rootScope, $document, authStatusService, authService, $interval) {
            //Instantiate Variables
            var vm = this;

            var detectionInterval = null; //Sets detect() to be called periodically. (Ticks timer and idle time, and determine what (if any) action need to occur. (refresh/prompt/logout)
            vm.detectionFrequency = 60000; //60000 = 1 Minute
            vm.detectionCount = 0; //Keeps track of the number of times dection determined the use was idle.
            vm.showActivityPrompt = false;
            vm.inactivityThreshold = 10; //In minutes
            var inactivityPromptInterval = null;
            vm.inactvityPromptDuration = 60;
            vm.errorMessage = "";
            vm.idleTime = 0;

            /*
                Initialize on load, start if authenticated
                Start and stop the timer's on login/logout events
                    $scope.$on('logon-success', stuff...
                    $scope.$on('logged-out', stuff...
            */



            /****************************************
                    Event Listeners
            ****************************************/
            $scope.$on('logon-success', function () {
                vm.reset();
                vm.init();
            });
            $scope.$on('logged-out', function () {
                vm.reset();
            });
            $scope.$on('$destroy', function () {
                // Make sure that the interval is destroyed too
                vm.reset();
            });
            $scope.$on('inactivity-prompt', function () {
                if (debug) console.log('$on("inactivity-prompt")');
                vm.initActivityPrompt();
            });

            /****************************************
                    Public Functions
            ****************************************/
            vm.init = function () {
                //Get Status
                authStatusService.status = authStatusService.getStatus();

                //If authenticated, init, else clear
                if (authStatusService.status.isAuth) {
                    vm.setActivityDetectors();
                    detectionInterval = $interval(function () { vm.detect(); }, vm.detectionFrequency);  //Sets timerIncrement to be called periodically. (Ticks timer and idle time, and determine what (if any) action need to occur. (refresh/prompt/logout)
                } else {
                    //Clear intervals
                    vm.reset();
                }
            };
            
            vm.detect = function () {
                vm.detectionCount++; //Increment

                if (debug) console.log('keep-alive: detect();');
                //Get Status
                authStatusService.status = authStatusService.getStatus();

                //If not signed in, return and ignore the rest of this function
                if (!authStatusService.status.isAuth) {
                    vm.reset();
                    return;
                }

                //Check local_issue_date
                var issueDate = new Date(authStatusService.status.local_issue_time);
                var expirationDate = new Date(authStatusService.status.claims.exp * 1000);
                var timeRemaining = expirationDate - new Date();  //Difference in miliseconds

                //If expired, reset, loguut, return
                if (timeRemaining <= 0) {
                    vm.LogOut();
                    return;
                }

                //Convert time remaining to minutes
                timeRemaining = (timeRemaining / 1000) / 60;

                //Refresh the token: If time is runing out (timeRemaining < 2), AND the user has been active within the last 10 minutes (idleTime <= 5) 
                if (timeRemaining < 2 && vm.detectionCount <= vm.inactivityThreshold) {
                    authService.refreshToken();
                }
                //Open Inactive Propmt: If idle time is >= 10 minutes
                if (vm.detectionCount >= vm.inactivityThreshold && !inactivityPromptInterval) //Critical to make sure that inactivityPromptInterval is undefined before initializing the actiity prompt.
                {
                    /*
                    * prompt user for activity: "Are you still there?"
                    * set 1 minute countdown, and logout if no response 
                    */
                    vm.initActivityPrompt();
                }
            };

            vm.reset = function () {
                if(debug) console.log('keep-alive: reset()');
                //Should clear all intervals
                vm.errorMessage = "";
                vm.showActivityPrompt = false;
                vm.detectionCount = 0;
                var a = $interval.cancel(inactivityPromptInterval);
                inactivityPromptInterval = undefined;
                var b = $interval.cancel(detectionInterval);
                detectionInterval = undefined;
                vm.idleTime = 0;
            };

            /****************************************
                    Private Functions
            ****************************************/

            //Activity Detection Events
            vm.setActivityDetectors = function () {
                //Sets idle time to 0, when any of these events are triggered (mouse or keyboard use anywhere on the dom)
                var activityDetected = function () {
                    vm.idleTime = 0;
                };

                $document.on('click', activityDetected);
                $document.on('mousemove', activityDetected);
                $document.on('keypress', activityDetected);
            };

            //Activity Prompt
            vm.initActivityPrompt = function () {
                var decrementLogoutCountdown = function () {
                    if(debug) console.log('keep-alive: logout countdown');
                    --vm.ActivityPromptCountdown;
                    if (vm.ActivityPromptCountdown < 1) {
                        vm.LogOut();
                    }
                };

                vm.showActivityPrompt = true;
                vm.ActivityPromptCountdown = vm.inactvityPromptDuration; //Sets the countdown clock.
                inactivityPromptInterval = $interval(function () { decrementLogoutCountdown(); }, 1000);
            };
            

            //This handles the "Continue" response from the Activity Prompt
            vm.iAmStillHere = function () {
                authStatusService.status = authStatusService.getStatus();
                if (authStatusService.status.isAuth) {
                    authService.refreshToken()
                        .then(
                            function () {
                                if (debug) console.log('Keep-Alive: token refreshed');
                                vm.reset();
                                vm.init();
                            },
                            function () {
                                //Handle error on refresh
                                vm.errorMessage = "Uh oh, an error has occured. We were unable to refresh your session, you will need to log out, and log back in.";
                            }
                        );
                } else {
                    vm.LogOut();
                }

            };

            //This handles the "Logout" response from the Activity Prompt
            vm.LogOut = function () {
                vm.reset();
                authService.logOut();
            };
        }



    }

})();