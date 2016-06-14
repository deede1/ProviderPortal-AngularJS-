

(function () {
    var urlBase = $('meta[name="ApplicationRoot"]').attr('content'); 
    var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');
	var app = angular.module('MemberPortal');

    app.controller('changePasswordController', ['$scope', '$filter', '$translate', 'passwordStrength',
        function ($scope, $filter, $translate, passwordStrength) {
            var formSubmitButtonDisabled;
            $scope.formSubmitButtonDisabled = true;
           
         
        $scope.checkPasswordMatch = function (e) {
            $('#passwordMatchString').fadeIn('slow');
            var newPass1 = $('#txtPassword1').val();
            var newPass2 = $('#matchPassword').val(); 
            if ((newPass1 == newPass2) && (newPass1.trim() != '')) {
                $('#passwordMatchString').html($filter('translate')('form_passwordsMatch'));
                $('#passwordMatchIcon').removeClass('colorRed').addClass('colorGreen');
                
                    if ($('#currentPass').val() != '')
                    $scope.formSubmitButtonDisabled = false;
            }
            else {
                $('#passwordMatchString').html($filter('translate')('form_passwordsDoNotMatch'));
                $('#passwordMatchIcon').addClass('colorRed').removeClass('colorGreen');
                $scope.formSubmitButtonDisabled = true;
            }

        }

        //========= PASSWORD STRENGTH
        $scope.checkPasswordStrength = function (e) {
    
            passwordStrength.checkPasswordStrength(e);
        }

 


    }]);

 

    app.run(['$templateCache', '$interpolate', function ($templateCache, $interpolate) {
            var startSym = $interpolate.startSymbol();
            var endSym = $interpolate.endSymbol(); 
            $templateCache.put('/dialogs/notifications.html', '<div id="modalNotification" class="modal-header dialog-header-confirm"><button type="button" class="close" ng-click="closeModal()">&times;</button><h4 class="modal-title"><span class="' + startSym + 'icon' + endSym + '"></span> ' + startSym + '"DIALOGS_NOTIFICATIONS" | translate' + endSym + ' </h4></div><div class="modal-body" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="snooze()">' + startSym + '"DIALOGS_SNOOZE" | translate' + endSym + '</button><button type="button" class="btn btn-primary" ng-click="closeModal()">' + startSym + '"DIALOGS_CLOSE" | translate' + endSym + '</button></div>');
             }]);
    app.run(['$templateCache', '$interpolate', function ($templateCache, $interpolate) {
            var startSym = $interpolate.startSymbol();
        var endSym = $interpolate.endSymbol();
            $templateCache.put('/dialogs/rxReminders.html', ' <div id="modalNotification" class="modal-header dialog-header-confirm"><button type="button" class="close" ng-click="closeModal()">&times;</button><h4 class="modal-title"><i class="fa fa-clock-o fa-2x"></i><span class="' + startSym + 'icon' + endSym + '"></span> ' + startSym + '"DIALOGS_RXREMINDERS" | translate' + endSym + ' </h4></div><div class="modal-body" ng-bind-html="msg">  </div><div class="rxPrescriptionsReminderOptionsContainer"><ul><li><input id="ckbox_option0" class="notif_ckbox" ng-click="reminderOptionClicked(0)"  type="checkbox" value="1WK"><label ng-bind-html="reminderOption0Label"></label>     </li><li><input  id="ckbox_option1"  ng-click="reminderOptionClicked(1)" class="notif_ckbox"  type="checkbox" value="1Day"><label ng-bind-html="reminderOption1Label"></label> </li><li> <input  id="ckbox_option2" ng-click="reminderOptionClicked(2)"  class="notif_ckbox"  type="checkbox" value="DOF"><label ng-bind-html="reminderOption2Label"></label> </li><li> <input  id="ckbox_option3" ng-click="reminderOptionClicked(3)"  class="notif_ckbox"  type="checkbox" value="DOF"><label ng-bind-html="reminderOption3Label"></label> </li></ul> </div> <div class="modal-footer">   <button type="button" class="btn btn-primary" ng-click="closeReminderModal()">' + startSym + '"DIALOGS_SET" | translate' + endSym + '</button></div>');
 

   }]);


    /*
     * *****************************
     * --- LANGUAGE TRANSLATION  ---
     * *****************************
     */
    app.controller('Ctrl', ['$scope', '$rootScope', '$cookies', '$filter', '$translate', function ($scope, $rootScope, $cookies, $filter, $translate) {

        //Enable TestUser and mask sensitive data
        $rootScope.TestUserMode = false;
        $scope.changeLanguage = function (key) {
            //  $cookies.__APPLICATION_LANGUAGE = key;
    
            var date = new Date();
            var m = 10 * 60 * 24 * 30 * 6;
            date.setTime(date.getTime() + (m * 60 * 1000));
            $.cookie("__APPLICATION_LANGUAGE", key, {
                expires: date, path: '/'
            });
            $translate.use(key);
            $scope.currentLanguage = key;

            $('html').attr("lang", key);
            $rootScope.currentLanguage = key;
            $rootScope.$broadcast('language-change', key);
        };

        //$scope.toggleTestUserMode = function () {
        //    console.log('clickedObfuscation');
        //    $rootScope.TestUserMode = !$rootScope.TestUserMode;
        //    $rootScope.$broadcast('testUserMode_toggled', $rootScope.TestUserMode); //TestUserMode = !$rootScope.TestUserMode; 
        //};


        function init() {
            var lang = $cookies.__APPLICATION_LANGUAGE || 'en-us'; //default if !exists
            $scope.changeLanguage(lang.toLowerCase());
            $('#lan' + lang).addClass('langItemSelected'); //default 
        }
        init();
    }]);


    /*
    *******************************
    * ---------- MODAL BOX ------------
    *******************************
    */






    /*
     * *****************************
     * ------ NAVIGATION ----------
     * *****************************
     */
    app.controller('NavCtrl', ['$scope', '$rootScope', 'authStatusService', '$location',
        function ($scope, $rootScope, authStatusService, $location) {
        var context = this;

        $scope.$on('logged-out', function (event) {
            context.isAuth = false;
            context.userName = null;

        });

 

        authStatusService.status = authStatusService.getStatus();
        context.isAuth = authStatusService.status.isAuth;
        context.userName = authStatusService.status.userName;
        //if (context.isAuth && authStatusService.status.claims.firstname) {
        //    $rootScope.firstName = authStatusService.status.claims.firstname.toLowerCase();
        //    $rootScope.firstName = $rootScope.firstName.replace(/^[a-z]/, function (m) {
        //        return m.toUpperCase();
        //    });
        //}
        context.NavigateTo = function (path) {
            $location.path(path);
        };

        context.menuOpenStatus = false;
        context.menuOpenStatusEligibility = false;
        context.menuOpenStatusIEHPIDCard = false;
        context.menuOpenStatusMyDoctor = false;
        context.menuOpenStatusResources = false;
        context.menuOpenStatusMyInformation = false;
        context.menuOpenStatusHealth = false;


        context.openMenu = function () {
            context.menuOpenStatus = !context.menuOpenStatus;
        };
        context.openMenuEligibility = function () {
            $('.submenuContainer').fadeOut(500);
            $('#subNavEligibility').css('display', "block");
            context.menuOpenStatusEligibility = true;// !context.menuOpenStatusEligibility; 
            context.menuOpenStatusIEHPIDCard = false;
            context.menuOpenStatusMyDoctor = false;
            context.menuOpenStatusResources = false;
            context.menuOpenStatusMyInformation = false;
            context.menuOpenStatusHealth = false;
            $('.navItemSelected').removeClass('navItemSelected');
                if (context.menuOpenStatusEligibility)
                $('#navbtn1 div').addClass('navItemSelected');
        }
        context.openMenuIEHPIDCard = function () {
            $('.submenuContainer').fadeOut(500);
            $('#subNavIEHPCard').css('display', "block");
            context.menuOpenStatusIEHPIDCard = true;// !context.menuOpenStatusIEHPIDCard;
            context.menuOpenStatusEligibility = false;
            context.menuOpenStatusMyDoctor = false;
            context.menuOpenStatusResources = false;
            context.menuOpenStatusMyInformation = false;
            context.menuOpenStatusHealth = false;
            $('.navItemSelected').removeClass('navItemSelected');
            if (context.menuOpenStatusIEHPIDCard)
                $('#navbtn2 div').addClass('navItemSelected');
        }
        context.openMenuMyDoctor = function () {
            $('.submenuContainer').fadeOut(500);
            $('#subNavMyDoctor').css('display', "block");
            context.menuOpenStatusMyDoctor = true;//!context.menuOpenStatusMyDoctor;
            context.menuOpenStatusEligibility = false;
            context.menuOpenStatusIEHPIDCard = false;
            context.menuOpenStatusResources = false;
            context.menuOpenStatusMyInformation = false;
            context.menuOpenStatusHealth = false;
            $('.navItemSelected').removeClass('navItemSelected');
            if (context.menuOpenStatusMyDoctor)
                $('#navbtn3 div').addClass('navItemSelected');
        }
        context.openMenuResources = function () {
            $('.submenuContainer').fadeOut(500);
            $('#subNavResources').css('display', "block");
            context.menuOpenStatusResources = true;// !context.menuOpenStatusResources;
            context.menuOpenStatusEligibility = false;
            context.menuOpenStatusIEHPIDCard = false;
            context.menuOpenStatusMyDoctor = false;
            context.menuOpenStatusMyInformation = false;
            context.menuOpenStatusHealth = false;
            $('.navItemSelected').removeClass('navItemSelected');
            if (context.menuOpenStatusResources)
                $('#navbtn4 div').addClass('navItemSelected');
        }
        context.openMenuMyInformation = function () {
            $('.submenuContainer').fadeOut(500);
            $('#subNavMyInformation').css('display', "block");
            context.menuOpenStatusMyInformation = true;//  !context.menuOpenStatusMyInformation;
            context.menuOpenStatusEligibility = false;
            context.menuOpenStatusIEHPIDCard = false;
            context.menuOpenStatusMyDoctor = false;
            context.menuOpenStatusResources = false;
            context.menuOpenStatusHealth = false;
            $('.navItemSelected').removeClass('navItemSelected');
            if (context.menuOpenStatusMyInformation)
                $('#navbtn5 div').addClass('navItemSelected');
        }
        context.openMenuHealth = function () {
            $('.submenuContainer').fadeOut(500);
            $('#subNavHealth').css('display', "block");
            context.menuOpenStatusHealth = true;//  !context.menuOpenStatusHealth;
            context.menuOpenStatusEligibility = false;
            context.menuOpenStatusIEHPIDCard = false;
            context.menuOpenStatusMyDoctor = false;
            context.menuOpenStatusResources = false;
            context.menuOpenStatusMyInformation = false;
            $('.navItemSelected').removeClass('navItemSelected');
            if (context.menuOpenStatusHealth)
                $('#navbtn6 div').addClass('navItemSelected');
        }
        context.openMenuCourses = function () {
            $('.submenuContainer').fadeOut(500);
            $('#subNavCourses').css('display', "block");
            context.menuOpenStatusCourses = true;
            context.menuOpenStatusHealth = false; 
            context.menuOpenStatusEligibility = false;
            context.menuOpenStatusIEHPIDCard = false;
            context.menuOpenStatusMyDoctor = false;
            context.menuOpenStatusResources = false;
            context.menuOpenStatusMyInformation = false;
            $('.navItemSelected').removeClass('navItemSelected');
            if (context.menuOpenStatusCourses)
                $('#navbtn8 div').addClass('navItemSelected');
        }


        $scope.toggleTestUserMode = function () {
            $rootScope.TestUserMode = !$rootScope.TestUserMode;
            if ($rootScope.TestUserMode)
                $('#toggleTUM').addClass('obfuscationEnabled').removeClass('obfuscationDisabled');
            else
                $('#toggleTUM').addClass('obfuscationDisabled').removeClass('obfuscationEnabled');

            $rootScope.$broadcast('obfuscation_toggled', $rootScope.TestUserMode); //TestUserMode = !$rootScope.TestUserMode; 
 
        };


            $scope.$on('logon-success', function(event) {
                authStatusService.status = authStatusService.getStatus();
                context.isAuth = authStatusService.status.isAuth;
                context.userName = authStatusService.status.userName;
            });

        }]);

     


    /********************************************************************************/
    /********************************************************************************/
    //SideNavCtrl

    app.controller("SideNavCtrl", ['$scope', '$cookies', '$document', '$rootScope',
        function ($scope, $cookies, $document, $rootScope) {

        var lang = $cookies.__APPLICATION_LANGUAGE || 'en-us'; //default if !exists
        $scope.currentLanguage = lang;
        $scope.$on('language-change', function (event, key) {
            $scope.currentLanguage = key;
        });
    }]);

    //==== INCREASE/ DECREASE FONT SIZES
    app.controller("fontSizeController", ['$scope', '$rootScope','$filter', '$translate', '$document',
        function ($scope, $rootScope,$filter, $translate, $document) {

            $scope.TestUserMode = $rootScope.TestUserMode;
            $rootScope.$on('obfuscation_toggled', function () { 
                if ($rootScope.TestUserMode)
                    $scope.firstName = $filter('obfuscateValue')($scope.firstName);
                else
                    $scope.firstName = $rootScope.firstName;
            });

            $scope.isActive = [false, true, false];
            $scope.setActive = function (tabIndex) {
               
                switch (tabIndex) {
                    case 0:
                        $scope.isActive[0] = true;
                        $scope.isActive[1] = false;
                        $scope.isActive[2] = false;
                        $('html').addClass('smaller-font-size');
                        $('html').removeClass('normal-font-size');
                        $('html').removeClass('larger-font-size');
                    break;
                    case 1:
                        $scope.isActive[0] = false;
                        $scope.isActive[1] = true;
                        $scope.isActive[2] = false;
                        $('html').addClass('normal-font-size');
                        $('html').removeClass('smaller-font-size');
                        $('html').removeClass('larger-font-size');
                        break;
                    case 2:
                        $scope.isActive[0] = false;
                        $scope.isActive[1] = false;
                        $scope.isActive[2] = true;
                        $('html').addClass('larger-font-size');
                        $('html').removeClass('normal-font-size');
                        $('html').removeClass('smaller-font-size');
                        break;
                }
            };
       
    }]);


    app.directive("dropdown", function ($rootScope) {
        return {
            restrict: "E",
            templateUrl: "templates/dropdown.html",
            scope: {
                placeholder: "@",
                list: "=",
                selected: "=",
                property: "@"
            },
            link: function (scope) {
                scope.listVisible = false;
                scope.isPlaceholder = true;

                scope.select = function (item) {
                    scope.isPlaceholder = false;
                    scope.selected = item;
                };

                scope.isSelected = function (item) {
                    return item[scope.property] === scope.selected[scope.property];
                };

                scope.show = function () {
                    scope.listVisible = true;
                };

                $rootScope.$on("documentClicked", function (inner, target) {
                   // console.log($(target[0]).is(".dropdown-display.clicked") || $(target[0]).parents(".dropdown-display.clicked").length > 0);
                    if (!$(target[0]).is(".dropdown-display.clicked") && !$(target[0]).parents(".dropdown-display.clicked").length > 0)
                        scope.$apply(function () {
                            scope.listVisible = false;
                        });
                });

                scope.$watch("selected", function (value) {
                    scope.isPlaceholder = scope.selected[scope.property] === undefined;
                    scope.display = scope.selected[scope.property];
                });
            }
        }
    });

    app.filter('obfuscateValue', ['$rootScope', function ($rootScope) {
        return function (item) {
             
            if ($rootScope.TestUserMode) {
                return String(item).substring(0, 1) + 'xxxxxx' + String(item).substring(1, 2);
            }
            else {
                return item;
            }
        };
    }

    ]);

    app.filter('capitalize', function () {
        return function (input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
        }
    });

  

    app.directive("medhokMemberDetails", function () {
        return {
            scope: {
                member: '='
            },
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/shared/authorization/medhokMemberDetails.html'
        };
    });

    app.directive("messageBoxes", function () {
        return {
            scope: {
                errorMessage: '@',
                infoMessage: '@',
                successMessage: '@'
            },
            restrict: "EA",
            //replace: true,,
            template: '<div><danger-box message="{{errorMessage}}"></danger-box><info-box message="{{infoMessage}}"></info-box><success-box message="{{successMessage}}"></success-box></div>'
        };
    });

    app.directive("messageBox", function () {
        return {
            scope: {
                message: '@',
                type: '@'
            },
            restrict: "EA",
            //replace: true,,
            template: '<div class="info bg-{{type}} alert alert-{{type}}">{{message}}</div>'
        };
    });

    app.directive("infoBox", function () {
        return {
            scope: {
                message: '@',
            },
            restrict: "EA",
            //replace: true,
            template: '<div class="info bg-info alert alert-info" ng-show="message != \'\'">{{message}}</div>'
        };
    });

   app.directive("infoBoxWithCloseButton", function () {
        return {
                scope: {
                        message: '@',
        },
                restrict: "EA",
                //replace: true,
                template: '<div class="info bg-info alert alert-info" ng-show="message != \'\'">{{message}}   <i class="glyphicon glyphicon-remove" /></div>'
        };
        });


    app.directive("successBox", function () {
        return {
            scope: {
                message: '@',
            },
            restrict: "EA",
            //replace: true,
            template: '<div class="success bg-success alert alert-success" ng-show="message != \'\'">{{message}}</div>'
        };
    });

    app.directive("dangerBox", function () {
        return {
            scope: {
                message: '@',
            },
            restrict: "EA",
            //replace: true,
            template: '<div class="danger bg-danger alert alert-danger" ng-show="message != \'\'">{{message}}</div>'
        };
    });


    app.controller('SomeController', ['$scope', 'memberDataService', '$location', 'permission', function ($scope, memberDataService, $location, permission) {
        $scope.helloWorld = "THIS....IS.....ANGULAR!!!!";



    }]);



    /*******************************************************************
     * * * * * * * * * * * * * * * *  PAGES * * * * * * * * * * * * * * 
     *******************************************************************/

    /* New Id Card */
    app.controller('RequestNewIdController', ['$scope', '$translate', '$filter', 'memberDataService',
 function ($scope, $translate, $filter, memberDataService) {
        $scope.requestHistory = [];
        $scope.hasPendingChange = true;

        var setPendingChangeStatus = function () {
            $scope.hasPendingChange = false;
            if ($scope.requestHistory.length > 0) {
                //Check for and undelivered request (aka: pending)
                for (i = 0; i < $scope.requestHistory.length; i++) {
                    if ($scope.requestHistory[i].DateShipped == null) {
                        $scope.hasPendingChange = true;
                    }
                }
            }

        };

        $scope.GetCurrentIdCardRequests = function () {
            memberDataService.GetCurrentIdCardRequests().success(function (data) {
                $scope.requestHistory = data;
                $scope.data = data;
                setPendingChangeStatus(); $scope.infoMessage = "No requests currently available.";
            
            }).error(function () {
                $scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
            });
        };

        $scope.SubmitNewIdCardRequest = function () {
            memberDataService.SubmitNewIdCardRequest().success(function (data) {
                $scope.data = data;
                $scope.GetCurrentIdCardRequests();
            }).error(function () {
                $scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
            });
        };

        $scope.RemoveIdCardRequest = function (id) {
            memberDataService.DeleteIdCardRequest(id).success(function (data) {
                $scope.data = data;
                $scope.GetCurrentIdCardRequests();
            }).error(function () {
                $scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
            });
        };

        //memberDataService.DeleteIdCardRequest

        $scope.GetCurrentIdCardRequests();

    }]);

    /* Not Authorized */
    app.controller('NotAuthorizedController', ['$scope', '$location', function ($scope, $location) {
        $scope.search = $location.search();

    }]);

     
     

 

    /* Temp Id Card */
    app.controller('temporaryIdCardController',
        ['$scope', '$rootScope', '$translate', 'dialogs', '$filter', 'localStorageService', 'memberDataService', '$location', 'memberIDCardService',
        function ($scope, $rootScope, $translate, dialogs, $filter, localStorageService, memberDataService, $location, memberIDCardService) {
           
            $scope.cardViewSide = "front";
            $rootScope.ShowMemberIDCard = false
            $scope.errorMessage = "";
            $scope.message = "";
            $scope.infoMessage = $filter('translate')('form_fetchingIEHPMemberIDCard');
            $('#divIframeCont').fadeOut(50);
            $('#navbtn2 div').addClass('navItemSelected'); //Highlight Nav Item- Mt IEHP ID Card

            //Fetch Card Image 
           // $scope.GGGetTempCardImage = function (cardViewSide, src) {
           //     $scope.loading = !$scope.loading; //Toggle Loading 
           // };

            Date.prototype.addDays = function (days) {
                this.setDate(this.getDate() + parseInt(days));
                return this;
            }; 

            //Prepare Card Expiration Date (at end of month)
            var today = new Date();
            var expDate = new Date(); 
            $scope.formatDate = function (inDate) {
                var dd = inDate.getDate();
                var mm = inDate.getMonth() + 1; //January is 0!
                var yyyy = inDate.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                }

                if (mm < 10) {
                    mm = '0' + mm
                }

                today = mm + '/' + dd + '/' + yyyy;
                return today;
            }

            expDate = new Date(expDate.getFullYear(), expDate.getMonth() + 1, 0);
            $scope.todaysDate = $scope.formatDate(today);
            $scope.expirationDate = $scope.formatDate(expDate); // Last day of month
              
            //Listener for Successful broadcast
            $rootScope.$on('IDCardFetched', function () {
                //console.log('@@ ONFETCHED');
                $scope.infoMessage = "";
                if ($rootScope.IEHPTemporaryIDCardFetchStatus == "Success") {
                    $rootScope.ShowMemberIDCard = true;
                    $('#divIframeCont').fadeOut('slow');
                    $rootScope.IEHPTemporaryIDCardFrontSide = localStorageService.get('IDC_front');
                    $rootScope.IEHPTemporaryIDCardBackSide = localStorageService.get('IDC_back');
                }
                else {
                    $('#divIframeCont').fadeIn('slow');
                       $scope.infoMessage = "";
                }

            });
            
            //Listener for Unsuccessful broadcast
            $rootScope.$on('IDCardFetchingError', function () {
                //console.log('@@ FETCHEDERROR ');
                $scope.message = $scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
            });
  
            //Successful Retrieval of Member ID Card from Clarity
            //console.log('@@ MemberCard Fetch Status=' + $rootScope.IEHPTemporaryIDCardFetchStatus);

       

            if ($rootScope.IEHPTemporaryIDCardFetchStatus == "Success") {
        
            if ($rootScope.currentPage != "LoginForm" && $rootScope.IEHPTemporaryIDCardFrontSide == undefined) {
                //  $rootScope.IEHPTemporaryIDCardFrontSide = localStorageService.get('IDC_front');
                //  $rootScope.IEHPTemporaryIDCardBackSide = localStorageService.get('IDC_back');

                if ($rootScope.IEHPTemporaryIDCardFrontSide == undefined) {
                        memberIDCardService.GetMemberTempCardImage().then(function () {
                            //Success
                            $rootScope.IEHPTemporaryIDCardFrontSide = localStorageService.get('IDC_front');
                            $rootScope.IEHPTemporaryIDCardBackSide = localStorageService.get('IDC_back');
                            $rootScope.ShowMemberIDCard = true;
                        }, function () {
                            //Fail
                            $rootScope.ShowMemberIDCard = false;
                });
                }
                else {
                        $rootScope.ShowMemberIDCard = true;
                      $scope.errorMessage = "";
                      $scope.infoMessage = "";
            }
            }
            else {
               // console.log('@@ update Card Image');
                    $scope.infoMessage = "";
                    $rootScope.ShowMemberIDCard = true;
                    $('#divIframeCont').fadeOut('slow');
                    $rootScope.IEHPTemporaryIDCardFrontSide = localStorageService.get('IDC_front');
                    $rootScope.IEHPTemporaryIDCardBackSide = localStorageService.get('IDC_back');
            }
                    }
          //  else
          //  {
                //Display old card version, since NOT FOUND in Clarity
              //  if ($rootScope.IEHPTemporaryIDCardFetchStatus == 'Not Found') {
              //      $rootScope.ShowMemberIDCard = false;
              //      $scope.infoMessage = "";
              //  }
            //  }

            if ($rootScope.IEHPTemporaryIDCardFrontSide == undefined && localStorageService.get('IDC_fetchStatus') == "Success") {
                $rootScope.IEHPTemporaryIDCardFrontSide = localStorageService.get('IDC_front');
                $rootScope.IEHPTemporaryIDCardBackSide = localStorageService.get('IDC_back');
                $rootScope.ShowMemberIDCard = true;
                $scope.infoMessage = "";
            }
            if (localStorageService.get('IDC_fetchStatus') == "Not Found") {
                $scope.infoMessage = "";
                $('#divIframeCont').fadeIn('slow');
                }


        }]);
 

    

    /* PROVPORTAL PHARMACY  */
    app.controller('PharmacyController', [
        '$scope', '$state', '$stateParams',
        '$rootScope', '$filter', 'memberDataService', '$translate',
        'contentAuthorizationService',
        function($scope, $state, $stateParams, $rootScope, $filter, memberDataService, $translate, contentAuthorizationService) {


            $scope.siteItem = [];
            $scope.siteItem = contentAuthorizationService.processContentAuth($state.$current.ownParams.CGC.value());


        }
    ]);
     

     

    /* PROVPORTAL AUTHORIZATION STATUS  */
    app.controller('PPAuthorizationStatusController', ['$scope', '$rootScope', '$filter', 'memberDataService', '$translate', 'contentAuthorization', '$state',
        function ($scope, $rootScope, $filter, memberDataService, $translate, contentAuthorization, $state) {
            console.log('...@AUTHOR STATUS CONT');
            $scope.loading = false;
            $scope.errorMessage = "";
            $scope.infoMessage = "";
            $scope.successMessage = "";
            $scope.data = {};
            $scope.TestUserMode = $rootScope.TestUserMode;
            $scope.ShareDataWithState = 1; //On by default 
            $scope.SSNSearch = false;
            $scope.ActiveDetails = 0;
            $scope.Type = {};
            $scope.Type.types = ["A"];
   
            //========================= CONTENT AUTHORIZATION DEFAULTS  
            $scope.item = [];
            $scope.navItemID = "HOME.NAV11";
            var pageValidRoles = "IPA,PCP,BH,RX,VSN,HOSP"; //Authorized Roles To View This Page
            var pageSecureItems = "HOME, HOME.NAV1, HOME.NAV2,HOME.NAV3,HOME.NAV4,HOME.NAV5,HOME.NAV6,HOME.NAV7,HOME.NAV8,HOME.NAV9,HOME.NAV10, HOME.NAV11, HOME.NAV12, HOME.NAV13, HOME.NAV14, HOME.NAV15, HOME.NAV16, HOME.NAV17, HOME.NAV18, HOME.NAV19, HOME.NAV20,"; //Managed Content 
            pageSecureItems += ""; //Managed Content


            contentAuthorization.processAuthorizations($scope, pageValidRoles, pageSecureItems);

                //===== FETCH ROSTER
            $scope.RetrieveRoster = function (rosterType) {
                console.log('... fetching ' + rosterType);
                $scope.loading = true;



                $scope.requestParameters = {};
                $scope.requestParameters.ProviderTaxID = '330861491';
                $scope.requestParameters.ProviderType = 'PCP';
                $scope.requestParameters.UserId = 'DevTester';
                    //    $scope.requestParameters.ProviderNumber = 'ProvTester';
                $scope.requestParameters.PageNumber = 1;
                    //  $scope.requestParameters.SortByProperty = '';
                    //  $scope.requestParameters.SortDescending = true;
                //  $scope.requestParameters.ReturnLastUpdate = false;


                $scope.data = {};
                $scope.errorMessage = '';
                console.log('@RETRIEVEROSTER > GETROSTER ROSTERTYPE: ' + rosterType);
                memberDataService.GetRoster(rosterType, JSON.stringify($scope.requestParameters)).success(function (data) {
                    $scope.loading = false;

                    // $scope.item = item;

                    console.log('!!SUCCESS!!');
                    if (data != null) {
                        if (data.RosterCounts !== null) {
                            console.log('...DATA NOT NULL');
                            $scope.data = data;
    } else {
        $scope.errorMessage = ' No Data Available.';

                        }
                    } else {
    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    }
    }).error(function () {
                    $scope.loading = false;
                    console.log('!!ERROR!!');
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                    console.log('!!!' + $scope.errorMessage);
                    });
            }


            $scope.showDetails = function (n) {
                console.log('@SHOW DETAILS ');
              //  if (n == $scope.ActiveDetails)
               //     $scope.ActiveDetails = 0;
              //  else
                    $scope.ActiveDetails = n;
            }

            $("#cbxAuthStatusTypeMedical").click(function (event) {
                  event.stopPropagation();
             });



            $scope.showMore = false;
            $scope.showMoreAction = 'More';
            $scope.predicate = '';
            $scope.reverse = false;
            var orderBy = $filter('orderBy');
            $scope.order = function (predicate, reverse) {
                if ($scope.predicate != predicate) {
                    $scope.reverse = !$scope.reverse;
                    }
                $scope.data.List = orderBy($scope.data.List, predicate, reverse);
        //  $scope.LobDescription = eligArray.LobDescription;
    };


            $scope.changeState = function (rosterID, tabID, isSubview) {
                console.log('@ CHANGE STATE');
            $('.navItemSelected').removeClass('navItemSelected');
                $('#' + tabID).addClass('navItemSelected');
            $('.subNavRosters').fadeOut('slow'); $('.subnavItemSelected').removeClass('subnavItemSelected');
                $state.go('roster' + rosterID);
                if (!isSubview) {
                    console.log('.. IS NOT A SUBVIEW, OPEN ROSTER');
                  $scope.RetrieveRoster(rosterID);
                }
           };


            $scope.viewImmunizationDetail = function () {
        console.log('...SHOW IMMUNI DETAILS');
        $('.modalContainer').addClass('modalRostersImmunizationDetail').fadeIn('slow');
                $('#bakModal').fadeIn('slow');
    };



       }]);
 
     
 

  

    /* PROVPORTAL NOT YET  */
    app.controller('NotYetController', ['$scope', '$rootScope', '$filter', 'memberDataService', '$translate', 'contentAuthorization','$location',
        function ($scope, $rootScope, $filter, memberDataService, $translate, contentAuthorization, $location) { 
    //========================= CONTENT AUTHORIZATION DEFAULTS  
            $scope.item = [];
    
            $scope.navItemID = $location.search().navitem; // "HOME.NAV2";
            var pageValidRoles = "IPA,PCP,BH,RX,VSN,HOSP"; //Authorized Roles To View This Page
            var pageSecureItems = "HOME, HOME.NAV1, HOME.NAV2,HOME.NAV3,HOME.NAV4,HOME.NAV5,HOME.NAV6,HOME.NAV7,HOME.NAV8,HOME.NAV9,HOME.NAV10, HOME.NAV11, HOME.NAV12, HOME.NAV13, HOME.NAV14, HOME.NAV15, HOME.NAV16, HOME.NAV17, HOME.NAV18, HOME.NAV19, HOME.NAV20"; //Managed Content 
            pageSecureItems += "ROST, ROST.AR, ROST.DA, ROST.ED,ROST.PC,ROST.IH,ROST.HM,ROST.CCS,ROST.NA,ROST.EA,ROST.DS"; //Managed Content 
            contentAuthorization.processAuthorizations($scope, pageValidRoles, pageSecureItems);

        }]);





    /* REf Login Page */
    app.controller('refLoginPageController', ['$scope', '$stateParams', 'authStatusService', '$location', 'authService', function ($scope, $stateParams, authStatusService, $location, authService) {
        $scope.username = '';
        $scope.password = '';
        $scope.showResetForm = false;

        var paramReferrer = $stateParams.refSource;
 
        $scope.referrerSite = paramReferrer;
    }]);
     


    /* Current Elig */

//app.controller('CurrentEligibilityController', ['$scope', '$rootScope', '$filter', '$route', 'memberDataService','$translate',
//        function ($scope, $rootScope, $filter, $route, memberDataService, $translate) {
//        $scope.loading = false;
//        $scope.SubscriberNumber = "";
//        $scope.CurrentEligibilityString = "";
//        $scope.CurrentEligibility = {};
//        $scope.errorMessage = "";
//        $scope.infoMessage = ""; 
//        $scope.constructParameterObj = function () {
//            var obj = {
//        };
//            obj.subscriberNumber = $scope.SubscriberNumber;
//            return obj;
//    };

//$scope.getCurrentEligibility = function () {
//    $scope.loading = !$scope.loading;
//    memberDataService.getCurrentEligibility($scope.constructParameterObj()).success(function (data) {

//        $scope.CurrentEligibility = memberDataService.utility.getPrimaryEligibilityRecord(data); 
//        $scope.memberName = $scope.CurrentEligibility.FirstName + ' ' + $scope.CurrentEligibility.LastName; 
         
//                $scope.loading = !$scope.loading;
//                $scope.errorMessage = "";
//                //temp until enable custom filter @ Scripts/App/Filters/filters.js
//                if (isNaN($scope.CurrentEligibility.CoPayWell))
//                    $scope.CurrentEligibility.CoPayWell = 0;
//                if (isNaN($scope.CurrentEligibility.CoPaySick))
//                    $scope.CurrentEligibility.CoPaySick = 0;
//                if (isNaN($scope.CurrentEligibility.CoPayEr))
//                    $scope.CurrentEligibility.CoPayEr = 0;
//                if (isNaN($scope.CurrentEligibility.CoPayBrand))
//                    $scope.CurrentEligibility.CoPayBrand = 0;
//                if (isNaN($scope.CurrentEligibility.CoPayGeneric))
//                    $scope.CurrentEligibility.CoPayGeneric = 0;

//                    }).error(function () {
//                        $scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
//                                            $scope.loading = !$scope.loading;
//                    });
//    };


//$scope.$on('obfuscation_toggled', function () { 
//    $route.reload(); 
//});


//        $scope.getCurrentEligibility();
//}]);


    /* Historical Elig */

//    app.controller('HistoricalEligibilityController', ['$scope', '$route', 'memberDataService', '$filter','$translate',
//            function ($scope, $route, memberDataService, $filter, $translate) {
//        $scope.loading = false;
//        $scope.SubscriberNumber = "";
//        $scope.HistoricalEligibility = { 
//    };
//                $scope.elig00 = [];
//                $scope.elig01 = [];
//        $scope.errorMessage = "";
//        $scope.infoMessage = "";
//        $scope.LobDescription = "123";


//        $scope.constructParameterObj = function () {
//            var obj = {
//        };
//            obj.subscriberNumber = $scope.SubscriberNumber;
//            return obj;
//    };


//        $scope.getHistoricalEligibility = function () {
//            $scope.loading = !$scope.loading;
//            memberDataService.getHistoricalEligibility($scope.constructParameterObj()).success(function (data) {
//                $scope.LobDescription = data[0].LobDescription; 
//                $scope.elig00 = $.grep(data, function (n, i) {
//                    return (n.PersonNumber == '00');
//            });
//                $scope.elig01 = $.grep(data, function (n, i) {
//                    return (n.PersonNumber == '01');
//            });
//                $scope.HistoricalEligibility = data; 
//                $scope.loading = !$scope.loading;
//                $scope.errorMessage = "";
//                }).error(function () {
//                    $scope.loading = !$scope.loading;
//                    $scope.errorMessage = $filter('translate')('form_unableToRetrieveData');
//        });
//        };

//        $scope.$on('obfuscation_toggled', function () {   
//            $route.reload(); 
//        });

//$scope.getHistoricalEligibility();


    /* Staff */
    app.controller('StaffController', ['$scope', '$state', 'contentAuthorization', function ($scope, $state, contentAuthorization) {

        $scope.errorMessage = "";
        $state.go('staffDetails'); //Open initial partial view


        //========================= CONTENT AUTHORIZATION DEFAULTS  
        $scope.item = [];
        $scope.navItemID = 'HOME.NAV21';
        var pageValidRoles = 'IPA,PCP,BH,RX,VSN,HOSP'; //Authorized Roles To View This Page
        var pageSecureItems = 'HOME, HOME.NAV1, HOME.NAV2,HOME.NAV3,HOME.NAV4,HOME.NAV5,HOME.NAV6,HOME.NAV7,HOME.NAV8,HOME.NAV9,HOME.NAV10, HOME.NAV11, HOME.NAV12, HOME.NAV13, HOME.NAV14, HOME.NAV15, HOME.NAV16, HOME.NAV17, HOME.NAV18, HOME.NAV19, HOME.NAV20,HOME.NAV21'; //Managed Content 
        pageSecureItems += ''; //Managed Content


        contentAuthorization.processAuthorizations($scope, pageValidRoles, pageSecureItems);
    }]);

    /* Staff */
    app.controller('StaffDetailsController', ['$scope', 'memberDataService', function ($scope, memberDataService) {
        $scope.all = false;
        $scope.loadingSearchResults = false;
        $scope.errorMessage = "";
        $scope.checked = false;
        $scope.selection = [];
        $scope.options = 'activate';
        $scope.staff = [];
        $scope.toggleRows = function () {

            $scope.all = !$scope.all;
            if (!$scope.all)
                $scope.selection = [];
        };
        $scope.submit = function () {
            if ($scope.all)
                console.log('all selected');

            else
                console.log($scope.selection);

            console.log($scope.options);
        };
        $scope.toggleSelection = function (id) {
            var index = $scope.selection.indexOf(id);
            if (index > -1)
                $scope.selection.splice(index, 1);
            else
                $scope.selection.push(id);
        };
        getUserAccountInfo();

        //      $scope.staff =[
        //        {
        //            "active": "false",
        //            "role": "nurse",
        //            "id": "1223525",
        //            "username": "Luism",
        //            "lastname": "Stephens",
        //            "firstname": "Nancy",
        //            "phone": "123-587-9658",
        //            "address": "1458 valley Rd. Rancho, CA 98789"
        //        },
        //            {
        //            "active": "false",
        //            "role": "nurse",
        //            "id": "22223525",
        //            "username": "Luism",
        //            "lastname": "John",
        //            "firstname": "Smith",
        //            "phone": "123-587-9658",
        //            "address": "1458 valley Rd. Rancho, CA 98789"
        //        },
        //            {
        //            "active": "true",
        //            "role": "nurse",
        //            "id": "3223525",
        //            "username": "Luism",
        //            "lastname": "",
        //            "firstname": "Alammar",
        //            "phone": "123-587-9658",
        //            "address": "1458 valley Rd. Rancho, CA 98789"
        //        },
        //           {
        //               "active": "true",
        //               "role": "nurse",
        //               "id": "4223525",
        //               "username": "Luism",
        //               "lastname": "SALDANA",
        //               "firstname": "CHOLAS",
        //               "phone": "123-587-9658",
        //               "address": "1458 valley Rd. Rancho, CA 98789"
        //           },
        //               {
        //            "active": "true",
        //            "role": "nurse",
        //            "id": "5223525",
        //            "username": "Luism",
        //            "lastname": "CALDERON",
        //            "firstname": "Nancy",
        //            "phone": "123-587-9658",
        //            "address": "1458 valley Rd. Rancho, CA 98789"
        //        },
        //            {
        //            "active": "true",
        //            "role": "nurse",
        //            "id": "6223525",
        //            "username": "Luism",
        //            "lastname": "Johnson",
        //            "firstname": "JESSINNA",
        //            "phone": "123-587-9658",
        //            "address": "1458 valley Rd. Rancho, CA 98789"
        //        },
        //           {
        //               "active": "true",
        //               "role": "nurse",
        //               "id": "7223525",
        //               "username": "Luism",
        //               "lastname": "Hui",
        //               "firstname": "Kim",
        //               "phone": "123-587-9658",
        //               "address": "1458 valley Rd. Rancho, CA 98789"
        //           },
        //               {
        //            "active": "true",
        //            "role": "nurse",
        //            "id": "8223525",
        //            "username": "Luism",
        //            "lastname": "Stephens",
        //            "firstname": "Nancy",
        //            "phone": "123-587-9658",
        //            "address": "1458 valley Rd. Rancho, CA 98789"
        //        },
        //            {
        //            "active": "true",
        //            "role": "nurse",
        //            "id": "9223525",
        //            "username": "Luism",
        //            "lastname": "Stephens",
        //            "firstname": "Nancy",
        //            "phone": "123-587-9658",
        //            "address": "1458 valley Rd. Rancho, CA 98789"
        //}
        //];


        function getUserAccountInfo() {
            memberDataService.GetUserAccountInfo({ UserName: "PcpOfficeStaff" }).success(function (data) {
                $scope.loadingSearchResults = false;
                if (data != null) {
                    //if (data.RosterCounts !== null) {
                    console.log('...DATA NOT NULL');
                    $scope.staff = data;

                    //} else {
                    //    $scope.errorMessage = ' No Data Available.';

                    //}
                } else {
                    $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                }
            }).error(function () {
                $scope.loadingSearchResults = false;
                console.log('@GET Get User Account Info  ERROR !!');
                $scope.errorMessage = 'ERROR: Unfortunately we were not able to retrieve data at this time. Please try again in a few minutes.';
                console.log('!!!' + $scope.errorMessage);
            });

        };

    }]);


    
     
     
     
      
     
     
     
 
})();
