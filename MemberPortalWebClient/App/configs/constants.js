(function() {
	'use strict';

	angular
		.module('MemberPortal')
		.constant('p4pRaMap', {
			pm160: 'Well-child & Immunizations',
			diabetes: 'Diabetes',
			perinatal: 'Perinatal',
			dualChoice: 'Dual Choice'
		})
		.value('passwordRegex', new RegExp(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[0-9])(?=\S*[\'\"{}:;<>`\[\]!@#$%^&*\+\-=?_~\\\/|,.])(?=\S{8,}$)/));


})();