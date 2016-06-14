(function () {
    var app = angular.module('MemberPortalServices');

    app.factory('IehpRegexService', function () {
        var svc = {};


        /*******************************************************************
		* * * * * * * * * * * * * *  PUBLIC METHODS * * * * * * * * * * * * 
		*******************************************************************/

        /*
           @identify

           Description: Returns an array of matched expression names.

           Parameters:
                str: string         //Required
                expressions: object //Required, array of named expression objects. Use buildExpressionConfig() to generate.
                flags: string       //Optional, string of regex modifiers.
       
       */

        var identify = function (str, expressions, flags) {
            //Compares the input string to all parts and returns an array of matching names
            if (!str | typeof str != 'string') {
                throw "must specifcy input string";
            }

            //Use expressions param (if specified)
            expressions = (expressions) ? expressions : AllExpressionsConfig();

            var matches = [];
            for (i = 0; i < expressions.length; i++) {

                var config = expressions[i];

                match = str.match(config.expression);
                if (match)
                    matches.push(config.name);
            }

            return matches;
        };

        /*
           @buildExpressionConfig

           Description: Processes various inputs to create the expression array parameter expected by the identify()

           Input Types: string|object|array

               String:  a string input will retreive a predefined expression object with name matching string input;
               Object:  an object input allows a mixture of results depending on object structure;
               Array:   an array can consist of strings, or objects;

               Object Example:
               {
                   name: ''            //Required, used to retreive predefined expression (unless custom expression is provided);
                   override: '',       //Optional, will override name on resulting expression object. only needed for overriding the name of predefined expressions.
                   expression: /^$/,   //Optional, will result in a custom expression object, using the specified expression and name properties.
               }
               
           Parameter Examples:

               string: 'PredefinedExpressionName'
               object: { name: 'PredefinedExpressionName', override: 'myCustomName' }
               object: { name: 'myCustomName', expression : /myCustomExpression/ }
               array: ['PredefinedExpressionName', { name: 'myCustomName', expression: /myCustomExpression/ }]  
           
            //Note: that you can mix/match types in an array
       
       */

        var buildExpressionConfig = function (input) {
            var output = [];

            if (typeof input === 'string') {
                //Handle Single Predefined Name Input
                output.push(toExpressionObject(input));
            } else if (input.constructor === Array) {
                //Handle Array of Inputs
                for (i = 0; i < input.length; i++) {
                    output.push(toExpressionObject(input[i]));
                }
            } else {
                //Handle Single Object Input
                output.push(toExpressionObject(input));
            }
            return output;
        };

        //TODO: Not yet exposed, needs to accept ExpressionConfig object
        var isValid = function (expression, str) {
            //Conveinience method, created to return a boolean if string matches the provided expression.
            var result = str.match(expression);
            return result != null;
        }

        /*
            @parts
               
             Description: predfined regular expressions.
        */

        var parts = {
            Cin: /((?:^[\d]{8}[a-zA-Z]{1}$)|(?:^AUL\S{4}\d{2}$)|(?:^HK\d{7}$))/,
            SubscriberNumber: /(^[1-2][90]\d{2}[01][0-9][0123][0-9]\d{4}$)/,
            RxAuthId: /((?:^R\d{10}$))/,
            MedicalAuthId: /((?:^H{1}\d{7}$))/,
            VisionAuthId: /(^0\d{7}$)/,
            Social: /(^(?!(?:000|666|9))\d{3}-?(?!00)\d{2}-?(?!0000)\d{4}$)/,
            ProviderId: /(^(?=0{3,6}\d{6,9}$)\d{12}$)/
            //,test: /^\d{12}$/
        };


        /*******************************************************************
        * * * * * * * * * * * * * *  PRIVATE METHODS * * * * * * * * * * * * 
        *******************************************************************/

        var combinator = function (expressions, flags) {
            //Returns a utility object with RegExp property of comined expressions, and an array of names.

            //Check input type
            if (expressions.constructor != Array) {
                throw "Input parameter must be an Array or RegExp objects";
            }

            var expression = '';
            var names = [];
            for (i = 0; i < expressions.length; i++) {

                //Check item type
                if (expressions[i].constructor != RegExp)
                    throw "Incorrect value type in array position [" + i + "]. Must be RegExp";

                var seperator = (i + 1 < expressions.length) ? "|" : "";
                expression += expressions[i].source + seperator;
                for (var name in parts) {
                    if (parts[name] == expressions[i]) {
                        names.push(name);
                    }
                }
            }
            return {
                expressionString: expression,
                expression: new RegExp(expression, flags),
                names: names
            };

        };

        var toExpressionObject = function(obj) {
            if (typeof obj === 'string') {
                //Retreive predefined expression by name
                var name = obj;
                obj = {
                    name : name,
                    expression : getExpressionByName(name)
                };
            }
            else if (typeof obj === 'object') {
                //Config Object Detected
                if (!obj['name'])
                    throw 'Config array object requires a name';

                if (!obj['expression']) {
                    //Predefined Expression Config
                    obj.expression = getExpressionByName(obj.name);
                } else {
                    //Ensure that the provided expression is a valid RegExp
                    if (obj.expression.constructor != RegExp)
                        throw 'invalid expression type'
                }
            }
            //Apply name override (if specified)
            obj.name = (obj['override']) ? obj['override'] : obj.name;
            
            return obj;
        };

        var getExpressionByName = function (name) {
            //Retreive expression from parts by name
            var expression = parts[name];
            if (!expression)
                throw 'Could not find predefined expression named: ' + name;
            return expression;
        };

        var AllExpressionsConfig = function() {
            var obj = [];
            var partNames = Object.keys(parts);
            for (i = 0; i < partNames.length; i++) {
                obj.push(toExpressionObject(partNames[i]));
            }
            return obj;
        };
        

        
        /*******************************************************************
		 * * * * * * * * * *  Expose Public Methods * * * * * * * * * * * * 
		*******************************************************************/
        svc.parts = parts;
        svc.getExpressionConfig = buildExpressionConfig;
        svc.identify = identify;
        return svc;
    });

})();