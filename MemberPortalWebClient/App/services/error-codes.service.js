( function () {
	'use strict';

	angular
		.module('MemberPortalServices')
		.factory('errorCodesService', errorCodesService );

	function errorCodesService() {
		var service = {
			//add methods for your error codes here
			registration: registration, //error codes for account registration
			passwordReset: passwordReset
		};

		return service;

		/////////////////////////	 METHODS

		function registration( data ) {
			var msg = null,
					alert = null,
					code = data.Message ? parseInt( data.Message.replace( 'Error ', '' ) ) : null; //remove 'error ' from string

			switch ( code ) {
				case 1:
					msg = 'This Provider account already exists. Please log-in or call our IEHP Response Team at (909) 890-2054.';
					break;
				case 2:
					msg = 'The Provider ID entered is incorrect or invalid.  Please re-enter and try again.'; //Provider contract doesn't match with this provider id.
					break;
				case 3:
					msg = 'The Tax ID entered is incorrect or invalid.  Please re-enter and try again.'; //							 Provider contract doesn't match with this tax id.
					break;
				case 4:
					msg = 'Our records indicate this Provider is not active. If you feel this is incorrect, please call our IEHP Response Team at (909) 890-2054. ';
					break;
				case 6:
					alert = true;
					msg = "This Provider account already exists. Please log-in or call our IEHP Response Team at (909) 890-2054. ";
					break;
				case 10:
					msg = 'Please properly fill out all inputs.';
					break;
				case 11:
					msg = "Account couldn't be activated at this time. Please call our IEHP Response Team at (909) 890-2054.";
					break;
				case 12:
					msg = "Account couldn't be activated at this time. Please call our IEHP Response Team at (909) 890-2054.";
					break;
			}


			return {
				msg: msg,
				code: code,
				alert: alert
			};
		}

		function passwordReset( data ) {
			var msg = null,
					alert = null,
					code = data.Message ? parseInt( data.Message.replace( 'Error ', '' ) ) : null; //remove 'error ' from string

			switch ( code ) {
				case 6:
					alert = true;
					msg = "Your session has expired. Please start over from Step 1.";
					break;
				case 9:
					msg = "Your answer did not match the selected security question. Please try again.";
					break;
			}


			return {
				msg: msg,
				code: code,
				alert: alert
			};
		}

	}
} )();