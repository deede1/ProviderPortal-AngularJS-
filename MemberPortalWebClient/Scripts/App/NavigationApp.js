(function() {
    var app = angular.module('Nav', ['MemberPortalDirectives', 'MemberPortalServices']);


    app.controller('NavCtrl', ['$scope', 'authService', function ($scope, authService) {
        var context = this;


        authService.fillAuthData();
        context.isAuth = authService.authentication.isAuth;
        context.userName = authService.authentication.userName;

        

        context.menuOpenStatus = false;
        context.menuOpenStatusEligibility = false;
        context.menuOpenStatusIEHPIDCard = false;
        context.menuOpenStatusMyDoctor = false;
        context.menuOpenStatusResources = false;
        context.menuOpenStatusMyInformation = false;
        context.menuOpenStatusHealth = false;


        context.openMenu = function() {
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




    }]);
})();