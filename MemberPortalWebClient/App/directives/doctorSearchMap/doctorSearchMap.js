(function() {
    var app = angular.module('MemberPortalDirectives');

    app.directive("doctorSearchMap", function() {
        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        var cacheBust = '?v=' + $('meta[name="templateCacheBust"]').attr('content');

        
        var link = function (scope, element, attrs) {
            scope.map = {};
            scope.markers = [];
            var mapOptions = {
                zoom: 8,
                center: new google.maps.LatLng(34.081915, -117.568733),
                mapTypeControl: false,
                scrollwheel: false,
                streetViewControl : false
            };

        scope.map = new google.maps.Map($(element).find('.mapObject')[0], mapOptions);

        

            
            
        };


        return {
            scope: {},
            restrict: "EA",
            //replace: true,
            templateUrl: urlBase + '/App/directives/doctorSearchMap/doctorSearchMap.html' + cacheBust,
            controller: 'doctorSearchMapCtrl',
            controllerAs: 'ctrl',
            link: link
        };
    });
    app.controller('doctorSearchMapCtrl', ['$scope', '$filter', function ($scope, $filter) {
        var urlBase = $('meta[name="ApplicationRoot"]').attr('content');
        

        $scope.$on('searchResultsReady', function (event, markers) {
            var bounds = new google.maps.LatLngBounds();

            //Remove Markers from map
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(null);
            }
            //Empty marker array
            $scope.markers = [];

            if (markers.length < 1) {
                //Re-center the map and set zoom default
                //scope.map.setCenter(new google.maps.LatLng(34.081915, -117.568733)).setZoom(10);  //Change to use search input location

                return;
            }

            //Icon Setup
            var icon = getMarkerIcon('pcd', true);

            //Build marker objects, and append to map.
            for (var i = 0; i < markers.length; i++) {
                var item = markers[i];
                var latLng = new google.maps.LatLng(item.Locations[0].Lat, item.Locations[0].Lng);

                var a = $filter;

                var newMarker = new google.maps.Marker({
                    position: latLng,
                    map: $scope.map,
                    icon: icon,
                    objectScope: $scope,
                    properties: item,
                    relatedResults: getProvidersWithSameLocation(markers, item) //Set an array of any results with same location

                });
                $scope.markers.push(newMarker);
                bounds.extend(latLng);

                setInfoWindowEvents(newMarker, $scope.map); //Infobox 
            }

            $scope.map.fitBounds(bounds);

            if ($scope.map.getZoom() > 20) {
                $scope.map.setZoom(18);
            } else {
                $scope.map.setZoom($scope.map.getZoom() - 1);
            }



        });
        var getProvidersWithSameLocation = function(markers, marker) {
            //TODO: Switch to using an angular filter instead of jQuery grep.

            var matches = $.grep(markers, function (e, i) {
                return e.Locations[0].Lat == marker.Locations[0].Lat && e.Locations[0].Lng == marker.Locations[0].Lng;
            });

            var providers = [];
            angular.forEach(matches, function (value, key, obj) {
                providers.push(value.ProvId);
            });
            return providers;
        };

        var setInfoWindowEvents = function (marker, map) {

            var infoBoxTemplate = function (marker) {
                if (marker.relatedResults && marker.relatedResults.length > 1) {
                    //marker.properties....
                    return '<div class="infoBubble" style="font-size:7pt;">' +
                              '<div style="float:right;"><span style="font-size:15px;font-weight:bold;">' + Number(marker.properties.Locations[0].Distance).toFixed(1) + '</span> mile(s)</div>' +
                              '<p><strong>Multiple Results: ' + marker.relatedResults.length + '</strong></p>' +
                              '<p>' +
                                '<div>' + marker.properties.Locations[0].StreetAddr + '</div>' +
                                '<div>' + marker.properties.Locations[0].CityStZip + '</div>' +
                              '</p>' +
                          '<div class="infoBubbleArrow"></div><div class="infoBubbleArrow_after"></div></div>';
                }
                else {
                    //marker.properties....
                    return '<div class="infoBubble" style="font-size:7pt;">' +
                              '<div style="float:right;"><span style="font-size:15px;font-weight:bold;">' + Number(marker.properties.Locations[0].Distance).toFixed(1) + '</span> mile(s)</div>' +
                              '<p><strong>' + marker.properties.FullName + '</strong></p>' +
                              '<p>' +
                                '<div>' + marker.properties.Locations[0].StreetAddr + '</div>' +
                                '<div>' + marker.properties.Locations[0].CityStZip + '</div>' +
                              '</p>' +
                          '<div class="infoBubbleArrow"></div><div class="infoBubbleArrow_after"></div></div>';
                }
            };

            var infoBox = new InfoBox({
                boxClass: 'mapInfoBox',
                content: infoBoxTemplate(marker),
                disableAutoPan: false,
                pixelOffset: new google.maps.Size((marker.ProvType == 'Here') ? -99 : -92, -46), //(X, Y) //Need to replace static height offset with dynamic value.
                zIndex: null,
                boxStyle: {
                    width: "200px"
                },
                closeBoxMargin: "10px 2px 2px 2px",
                closeBoxURL: "",
                infoBoxClearance: new google.maps.Size(1, 1),
                isHidden: false,
                enableEventPropagation: false,
                alignBottom: true
            });

            //Marker: Mouse Over
            google.maps.event.addListener(marker, 'mouseover', function () {
                infoBox.open(map, marker);
            });
            //Marker: Mouse Out
            google.maps.event.addListener(marker, 'mouseout', function () {
                infoBox.close();
            });
            google.maps.event.addListener(marker, 'click', function() {
                //Show this item and any related
                var dude = $.grep($scope.$parent.searchResults, function (e, i) {
                    var isMatch = false;
                    angular.forEach(marker.relatedResults, function (relatedId, key, obj) {
                        if (relatedId == e.ProvId) {
                            isMatch = true;
                        }
                    });
                    return isMatch;
                });

                $scope.$parent.selectedResults = dude;
                $scope.$apply();

            });
        };

        var getMarkerIcon = function (type, isDefault) {
            var size = new google.maps.Size(24, 37, 'px', 'px'); //Our standard marker size

            var originPosition = [];
            switch ((type.trim().toLowerCase())) {
                case 'here': //"You are Here" Marker.
                    originPosition.push(new google.maps.Point(450, 0));
                    originPosition.push(new google.maps.Point(490, 0));
                    size = new google.maps.Size(39, 34, 'px', 'px'); //'Here' icon is a different size
                    break;
                case 'hosp': //Hospital : Selected Hospital
                    (isDefault) ? originPosition.push(new google.maps.Point(100, 0)) : originPosition.push(new google.maps.Point(125, 0));
                    break;
                case 'ph': //Pharmacy : Selected Pharmacy
                    (isDefault) ? originPosition.push(new google.maps.Point(150, 0)) : originPosition.push(new google.maps.Point(175, 0));
                    break;
                case 'uc': //Urgent Care : Selected Urgent Care
                    (isDefault) ? originPosition.push(new google.maps.Point(0, 0)) : originPosition.push(new google.maps.Point(25, 0));
                    break;
                case 'vs': //Vision Services : Selected Vision Services
                    (isDefault) ? originPosition.push(new google.maps.Point(250, 0)) : originPosition.push(new google.maps.Point(275, 0));
                    break;
                case 'sp': //Specialist : Selected Specialist
                    (isDefault) ? originPosition.push(new google.maps.Point(200, 0)) : originPosition.push(new google.maps.Point(225, 0));
                    break;
                default: //Default or PCD : Selected Default
                    (isDefault) ? originPosition.push(new google.maps.Point(300, 0)) : originPosition.push(new google.maps.Point(325, 0));
            }

            var icon = new google.maps.MarkerImage(urlBase + '/Content/Images/doctor-search-icons/ps_sprite.png', size, originPosition[0]);

            return icon;
        };

    }]);


})();