(function() {

    angular
        .module('customFilters', [])
        .filter('ifTextReturnNumber', ifTextReturnNumber)
        .filter('startFrom', startFrom)
        .filter('subString', subString)
        .filter('tel', formatTelPhoneNumber)
        .filter('zipcode', zipcode)
        .filter('isArray', isArray)
        .filter('titleCase', titleCase)
        .filter('gender', gender)
        .filter('toUpperCase', toUpperCase)
        .filter('noTime', noTime)
        .filter('gender', gender);

	////////////////////////////////
	ifTextReturnNumber.$inject = ['$filter'];

	function ifTextReturnNumber($filter) {
		return function(input, fractionSize) {
			if (isNaN(input)) {
				return '0'; //input;
			} else {
				return $filter('number')(input, fractionSize);
			};
		};
	};


    //JCASTRO 4.4.16 Zero based index; ie:  "sOmEsTrInG" | subString:0:4 -> sOmE
    function subString() { 
        return function (input, startIndex, endIndex) {
            if (input !== undefined)
            if (input.length > 0) {
                var s = input.substring(startIndex, endIndex); 
                return s; 
            }
        };
    }

    function startFrom() {
		return function(input, start) {
			start = +start; //parse to int
			var s = 0;
			if (input != undefined)
				s = input.slice(start);
			return s;
		};
	}

 	function formatTelPhoneNumber() {
		return function(tel) {
			if (!tel) {
				return '';
			}

			var value = tel.toString().trim().replace(/^\+/, '');

			if (value.match(/[^0-9]/)) {
				return tel;
			}

			var country, city, number;

			switch (value.length) {
			case 10: // +1PPP####### -> C (PPP) ###-####
				country = 1;
				city = value.slice(0, 3);
				number = value.slice(3);
				break;

			case 11: // +CPPP####### -> CCC (PP) ###-####
				country = value[0];
				city = value.slice(1, 4);
				number = value.slice(4);
				break;

			case 12: // +CCCPP####### -> CCC (PP) ###-####
				country = value.slice(0, 3);
				city = value.slice(3, 5);
				number = value.slice(5);
				break;

			default:
				return tel;
			}

			if (country == 1) {
				country = '';
			}

			number = number.slice(0, 3) + '-' + number.slice(3);

			return (country + ' (' + city + ') ' + number).trim();
		};

	};

    function gender() {
        return function(string) {
            var gender;
            switch (string) {
            case "F":
                gender = "Female";
                return gender;
            case "M":
                gender = "Male";
                return gender;
            default:
                gender = "";
                return gender;
            }
        }
    };

    function zipcode() {
		return function(input) {
			if (!input) {
				return input;
			}
			if (input.toString().length === 9) {
				return input.toString().slice(0, 5) + '-' + input.toString().slice(5);
			} else if (input.toString().length === 5) {
				return input.toString();
			} else {
				return input;
			}
		};
	}

	function isArray() {
		return function(input) {
			return angular.isArray(input);
		};
	}

	
	function titleCase() {

	    return function (s) {
	        s = (s === undefined || s === null) ? "" : s;
	        return s.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) { return ch.toUpperCase(); });
	    };
	}


    //example: T00:00:00 AM
	function noTime() {

	    return function (s) {
	        s = (s === undefined || s === null) ? "" : s;
	        return s.replace(/(T*\d*\d):(\d\d):(\d\d)\s*(AM|PM)*/, "");
	    };
	}

    /*Added by JC */
	function toUpperCase() {

	    return function (s) {
	        s = (s === undefined || s === null) ? "" : s;
	        return s.toUpperCase();
	    };
	}
     
    
    /*Added by JC */
	function tel() { 
	        if (!tel) { return ''; } 
	        var value = tel.toString().trim().replace(/^\+/, ''); 
	        if (value.match(/[^0-9]/)) {
	            return tel;
	        } 
	        var country, city, number; 
	        switch (value.length) {
	            case 1:
	            case 2:
	            case 3:
	                city = value;
	                break; 
	            default:
	                city = value.slice(0, 3);
	                number = value.slice(3);
	        }

	        if (number) {
	            if (number.length > 3) {
	                number = number.slice(0, 3) + '-' + number.slice(3, 7);
	            }
	            else {
	                number = number;
	            } 
	            return ("(" + city + ") " + number).trim();
	        }
	        else {
	            return "(" + city;
	        } 
	}

 


})();