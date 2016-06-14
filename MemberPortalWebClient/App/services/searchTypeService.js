(function() {
	'use strict';

	angular
		.module('MemberPortalServices')
		.factory('searchTypeService', searchTypeService);

	function searchTypeService() {
		var service = {
			type: type //determine search type
		};

		return service;

		/////////////////////////

		//type.string will return the name of the type (ie. type.string === 'ProviderName')

		//type.num will return the name of the type

		function type(query, acceptedTypes) {
			var string = null,
					num = null;

			if (query) {

				//check if there are invalid special characters
				if (query.search(/^[\w\-\s]+$/) === -1) {
					return false;
				} else {
					var fQuery = query.replace(/(\W)/g, ''); //remove extra characters 

					if (beginsWithALetter()) {
						if (isString() && isAccepted('ProviderName')) {
							string = 'ProviderName';
							num = 'ProviderName';
						} else if (isString() && isAccepted('Last Name')) {
							string = 'Last Name';
						}
						if (isThisLong(9, 15) && isNumWithinThisRange(1, 9)
							&& isAccepted('Claim')) {
							string = 'Claim';
							num = 'ClaimNumber';
						}
					} else {
						if (isThisLong(2, 8)
							&& isNum()
							&& isAccepted('Check')) {
							string = 'Check';
							num = 'CheckNumber';
						}
						if (isThisLong(9)) {
							if (isLetterAt(8) && isAccepted('CIN')) {
								string = 'CIN';
								num = 'Cin';
							} else if (isAccepted('SSN')) {
								string = 'SSN';
								num = 'Ssn';
							}
						}
						if (isThisLong(12, 14)
							&& isAccepted('ProviderId')) {
							string = 'ProviderId';
							num = 'ProviderId';
						}
						if (isThisLong(12, 25)
							&& beginsWith('20', '19')
							&& isAccepted('IEHPID')) {
							string = 'IEHPID';
							num = 'IehpId';
						}
					}
				}

			}

			//verbose helpers. just to make qualifications more obvious, rather than adding additional functionality (ie. isString is same as isNaN)
			function isAccepted( checkType ) {
				return acceptedTypes ? acceptedTypes.indexOf( checkType ) > -1 : null;
			}

			function isNum() {
				return !isNaN( fQuery );
			}

			function isString() {
				return isNaN( fQuery );
			}

			function beginsWithALetter() {
				return isNaN( fQuery[0] );
			}

			function beginsWith( str, str2 ) {
				var str2 = str2 || null;
				return fQuery.indexOf( str ) === 0 || fQuery.indexOf( str2 ) === 0;
			}

			function isLetterAt( position ) {
				return isNaN( fQuery.substring( position ) );
			}

			function isNumWithinThisRange( min, max ) {
				return !isNaN( fQuery.toString().substring( min, max ) );
			}

			function isThisLong( min, max ) {
				var maxCompare = max ? max : min;
				return fQuery.length >= min && fQuery.length <= maxCompare;
			}
			return {
				string: string,
				num: num
			};
		}

	}
})();