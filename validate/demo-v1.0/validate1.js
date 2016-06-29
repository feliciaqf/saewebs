(function(window, document, undefined) {
    var defaults = {
    	i18n:{
    		"en":{
    			required: 'The %s field is required.',
	            matches: 'The %s field does not match the %s field.',
	            "default": 'The %s field is still set to default, please change.',
	            valid_email: 'The %s field must contain a valid email address.',
	            valid_emails: 'The %s field must contain all valid email addresses.',
	            min_length: 'The %s field must be at least %s characters in length.',
	            max_length: 'The %s field must not exceed %s characters in length.',
	            exact_length: 'The %s field must be exactly %s characters in length.',
	            greater_than: 'The %s field must contain a number greater than %s.',
	            less_than: 'The %s field must contain a number less than %s.',
	            alpha: 'The %s field must only contain alphabetical characters.',
	            alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
	            alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
	            numeric: 'The %s field must contain only numbers.',
	            integer: 'The %s field must contain an integer.',
	            decimal: 'The %s field must contain a decimal number.',
	            is_natural: 'The %s field must contain only positive numbers.',
	            is_natural_no_zero: 'The %s field must contain a number greater than zero.',
	            valid_ip: 'The %s field must contain a valid IP.',
	            valid_base64: 'The %s field must contain a base64 string.',
	            valid_credit_card: 'The %s field must contain a valid credit card number.',
	            is_file_type: 'The %s field must contain only %s files.',
	            valid_url: 'The %s field must contain a valid URL.',
	            greater_than_date: 'The %s field must contain a more recent date than %s.',
	            less_than_date: 'The %s field must contain an older date than %s.',
	            greater_than_or_equal_date: 'The %s field must contain a date that\'s at least as recent as %s.',
	            less_than_or_equal_date: 'The %s field must contain a date that\'s %s or older.'
    		},
    		"zh-cn":{
    			required: '%s不能为空！',
	            matches: '%s与%s不匹配 ！',
	            "default": '%s值仍是默认值，请修改！',
	            valid_email: '请在%s输入正确的邮件格式！',
	            valid_emails: '请在%s输入全部正确的邮件格式！',
	            min_length: '%s必须包含至少%s个字符！',
	            max_length: '%s必须包含少于%s个字符！',
	            exact_length: '%s必须包含%s个字符！',
	            greater_than: '%s必须输入多于%s个的字符！',
	            less_than: '%s必须输入少于%s个的字符！',
	            alpha: '%s只能输入字母！',
	            alpha_numeric: '%s只能输入字母和数字！.',
	            alpha_dash: '%s只能输入字母、数字、下划线和破折号！',
	            numeric: '%s只能输入数字',
	            integer: '%s只能输入整数！',
	            decimal: '%s只能输入十进制数！',
	            is_natural: '%s只能输入自然数！',
	            is_natural_no_zero: '%s只能输入大于0 的自然数',
	            valid_ip: '%sIP格式错误！',
	            valid_base64: '%s只能输入base64字符串！',
	            valid_credit_card: '请在%s中输入正确的信用卡卡号！',
	            is_file_type: '%s只能包含 %s格式文件！',
	            valid_url: '请在%s中输入正确的URL！',
	            greater_than_date: '%s中的日期必须大于%s.',
	            less_than_date: '%s中的日期必须小于 %s.',
	            greater_than_or_equal_date: '%s中的日期必须大于等于%s.',
	            less_than_or_equal_date: '%s中的日期必须小于等于%s.'
    		}
    	}
    },
    dfLang = defaults.i18n[navigator.appName == "Microsoft Internet Explorer" ? navigator.browserLanguage.toLowerCase() : navigator.language.toLowerCase()];
    
    var ruleRegex = /^(.+?)\[(.+)\]$/,
        numericRegex = /^[0-9]+$/,
        integerRegex = /^\-?[0-9]+$/,
        decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
        emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        alphaRegex = /^[a-z]+$/i,
        alphaNumericRegex = /^[a-z0-9]+$/i,
        alphaDashRegex = /^[a-z0-9_\-]+$/i,
        naturalRegex = /^[0-9]+$/i,
        naturalNoZeroRegex = /^[1-9][0-9]*$/i,
        ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        base64Regex = /[^a-zA-Z0-9\/\+=]/i,
        numericDashRegex = /^[\d\-\s]+$/,
        urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
        dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;


	/*
	 * @param {Object} | {String} formNameOrNode:form name or formNode
 	 * @param {Object} fieldConfig:{name:{rules:'',depends:function(){},display:'',}}
 	 * @param {Function} callback
	 */
    function FormValidator(formNameOrNode, fieldConfig, callback) {
        this.callback = callback;
        this.errors = [];
        this.fields = fieldConfig;
        this.form = this._formByNameOrNode(formNameOrNode) || {};
        this.messages = {};
        this.handlers = {};
        this.conditionals = {};
        
		for(var k in this.fields){
			var field = this.fields[k],
				rules = field.rules,
				check = field.check;
			if(field && !rules && !check){
				console && console.warn('validate.js:The following field is being skipped due to a misconfiguration:') && console.warn(k) && console.warn('Check to ensure you have properly configured rules and check function for this field');
				delete this.fields[k];
				continue;
			}
			if(field && (rules || check)){
				try{
					if(rules && typeof rules === "object"){
						field.rules = new RegExp(rules);
					}
				}catch(e){
					var msg = 'validate.js:The following field\'s rules is being ignored due to a misconfiguration,field name: ' + k +'.Check to ensure you have properly configured rules for this field';
					console && console.warn(msg);
					if(typeof check !== 'function'){
						console && console.warn('validate.js:The following field check function is being ignored due to a misconfiguration,field name:'+k+'Check to ensure you have properly configured check function for this field');
						delete this.fields[k];
						continue;
					}
				}
				var element = this.form[k];
				field.name = k;
	            field.display = field.display || k;
	            field.depends = field.depends;
	            if(element && element !== undefined){
	            	field.element = element;
	            	field.id = attributeValue(element, 'id') || null;
		            field.type =  (element.length>0 && element[0].type)?element[0].type : element.type;
		            field.value = attributeValue(element, 'value') || null;
		            field.checked = attributeValue(element, 'checked') || null;
	            }
			}
		}
	
		return this._validateForm(event);
    }


	FormValidator.prototype = {
	    _validateForm: function(evt) {
	        this.errors = {};
	
	        for (var key in this.fields) {
	            if (this.fields.hasOwnProperty(key)) {
	                var field = this.fields[key] || {},
	                    element = field.element;
	
	                if (element) {
	                    if (field.depends && typeof field.depends === "function") {
	                        if (field.depends.call(this, field)) {
	                            this._validateField(field);
	                        }
	                    } else if (field.depends && typeof field.depends === "string" && this.conditionals[field.depends]) {
	                        if (this.conditionals[field.depends].call(this,field)) {
	                            this._validateField(field);
	                        }
	                    } else {
	                        this._validateField(field);
	                    }
	                }
	            }
	        }
	
	        if (typeof this.callback === 'function') {
	            this.callback(this.errors, evt);
	        }
			
			for(var k in this.errors){
				if(this.errors.hasOwnProperty(k)){
		            if (evt && evt.preventDefault) {
		                evt.preventDefault();
		            } else if (event) {
		                event.returnValue = false;
		            }
					return false;
				}
			}
	        return true;
	    },
	    _validateField: function(field) {
	    	var failed = false;
        	if(typeof field.rules === "string"){
		        var i, j,l,
		        	rules = field.rules.split(/\s*\|+\s*/),
		            indexOfRequired = field.rules.indexOf('required'),
		            isEmpty = (!field.value || field.value === '' || field.value === undefined);
		
		        for (i = 0, l = rules.length; i < l; i++) {
		            var method = rules[i],
		                param = null,
		                parts = ruleRegex.exec(method);
		
		
		            if (indexOfRequired === -1 && method.indexOf('!callback_') === -1 && isEmpty) {
		                continue;
		            }
		
		            if (parts) {
		                method = parts[1];
		                param = parts[2];
		            }
		
		            if (method.charAt(0) === '!') {
		                method = method.substring(1, method.length);
		            }
		
		            if (typeof this._hooks[method] === 'function') {
		                if (!this._hooks[method].apply(this, [field, param])) {
		                    failed = true;
		                }
		            } else if (method.substring(0, 9) === 'callback_') {
		                method = method.substring(9, method.length);
		
		                if (typeof this.handlers[method] === 'function') {
		                    if (this.handlers[method].apply(this, [field.value, param, field]) === false) {
		                        failed = true;
		                    }
		                }
		            }
		            
		            if(failed){ break; }
	        	}
        	}else{
    			failed = field.rules.test(field.value);
        	}
        	if(!failed && field.check && typeof field.check === 'function'){
        		method = 'customize';
            	failed = !field.check(field);
            }
        	
            if (failed) {
                var source,
                    message = 'An error has occurred with the ' + field.display + ' field.';
            	
            	if(method == 'required'){
            		source = field[method] || dfLang[method];
            	}else{
            		source = field.errorMsg || dfLang[method];
            	}

                if (source) {
                    message = source.replace('%s', field.display);

                    if (param) {
                        message = message.replace('%s', (this.fields[param]) ? this.fields[param].display : param);
                    }
                }

                var existingError;
                if(this.errors[field.name]){
                	existingError = this.errors[field.name];
                }

                var errorObject = existingError || {
                    id: field.id,
                    display: field.display,
                    element: field.element,
                    name: field.name,
                    message: message,
                    messages: [],
                    rule: method
                };
                errorObject.messages.push(message);
                if (!existingError) this.errors[field.name] = errorObject;
            }
	    },
	    _formByNameOrNode: function(formNameOrNode) {
	        return (typeof formNameOrNode === 'object') ? formNameOrNode : document.forms[formNameOrNode];
	    },
		setMessage: function(rule, message) {
	        this.messages[rule] = message;
	        return this;
	    },
	    registerCallback: function(name, handler) {
	        if (name && typeof name === 'string' && handler && typeof handler === 'function') {
	            this.handlers[name] = handler;
	        }
	
	        return this;
	    },
	    registerConditional: function(name, conditional) {
	        if (name && typeof name === 'string' && conditional && typeof conditional === 'function') {
	            this.conditionals[name] = conditional;
	        }
	
	        return this;
	    },
	    _getValidDate: function(date) {
	        if (!date.match('today') && !date.match(dateRegex)) {
	            return false;
	        }
	
	        var validDate = new Date(),
	            validDateArray;
	
	        if (!date.match('today')) {
	            validDateArray = date.split('-');
	            validDate.setFullYear(validDateArray[0]);
	            validDate.setMonth(validDateArray[1] - 1);
	            validDate.setDate(validDateArray[2]);
	        }
	        return validDate;
	    },
	    _hooks: {
	        required: function(field) {
	            var value = field.value;
	
	            if ((field.type === 'checkbox') || (field.type === 'radio')) {
	                return (field.checked === true);
	            }
	
	            return (value !== null && value !== '');
	        },
	
	        "default": function(field, defaultName){
	            return field.value !== defaultName;
	        },
	
	        matches: function(field, matchName) {
	            var el = this.form[matchName];
	
	            if (el) {
	                return field.value === el.value;
	            }
	
	            return false;
	        },
	
	        valid_email: function(field) {
	            return emailRegex.test(field.value);
	        },
	
	        valid_emails: function(field) {
	            var result = field.value.split(/\s*,\s*/g);
	
	            for (var i = 0, resultLength = result.length; i < resultLength; i++) {
	                if (!emailRegex.test(result[i])) {
	                    return false;
	                }
	            }
	
	            return true;
	        },
	
	        min_length: function(field, length) {
	            if (!numericRegex.test(length)) {
	                return false;
	            }
	
	            return (field.value.length >= parseInt(length, 10));
	        },
	
	        max_length: function(field, length) {
	            if (!numericRegex.test(length)) {
	                return false;
	            }
	
	            return (field.value.length <= parseInt(length, 10));
	        },
	
	        exact_length: function(field, length) {
	            if (!numericRegex.test(length)) {
	                return false;
	            }
	
	            return (field.value.length === parseInt(length, 10));
	        },
	
	        greater_than: function(field, param) {
	            if (!decimalRegex.test(field.value)) {
	                return false;
	            }
	
	            return (parseFloat(field.value) > parseFloat(param));
	        },
	
	        less_than: function(field, param) {
	            if (!decimalRegex.test(field.value)) {
	                return false;
	            }
	
	            return (parseFloat(field.value) < parseFloat(param));
	        },
	
	        alpha: function(field) {
	            return (alphaRegex.test(field.value));
	        },
	
	        alpha_numeric: function(field) {
	            return (alphaNumericRegex.test(field.value));
	        },
	
	        alpha_dash: function(field) {
	            return (alphaDashRegex.test(field.value));
	        },
	
	        numeric: function(field) {
	            return (numericRegex.test(field.value));
	        },
	
	        integer: function(field) {
	            return (integerRegex.test(field.value));
	        },
	
	        decimal: function(field) {
	            return (decimalRegex.test(field.value));
	        },
	
	        is_natural: function(field) {
	            return (naturalRegex.test(field.value));
	        },
	
	        is_natural_no_zero: function(field) {
	            return (naturalNoZeroRegex.test(field.value));
	        },
	
	        valid_ip: function(field) {
	            return (ipRegex.test(field.value));
	        },
	
	        valid_base64: function(field) {
	            return (base64Regex.test(field.value));
	        },
	
	        valid_url: function(field) {
	            return (urlRegex.test(field.value));
	        },
	
	        valid_credit_card: function(field){
	            // Luhn Check Code from https://gist.github.com/4075533
	            // accept only digits, dashes or spaces
	            if (!numericDashRegex.test(field.value)) return false;
	
	            // The Luhn Algorithm. It's so pretty.
	            var nCheck = 0, nDigit = 0, bEven = false;
	            var strippedField = field.value.replace(/\D/g, "");
	
	            for (var n = strippedField.length - 1; n >= 0; n--) {
	                var cDigit = strippedField.charAt(n);
	                nDigit = parseInt(cDigit, 10);
	                if (bEven) {
	                    if ((nDigit *= 2) > 9) nDigit -= 9;
	                }
	
	                nCheck += nDigit;
	                bEven = !bEven;
	            }
	
	            return (nCheck % 10) === 0;
	        },
	
	        is_file_type: function(field,type) {
	            if (field.type !== 'file') {
	                return true;
	            }
	
	            var ext = field.value.substr((field.value.lastIndexOf('.') + 1)),
	                typeArray = type.split(','),
	                inArray = false,
	                i = 0,
	                len = typeArray.length;
	
	            for (i; i < len; i++) {
	                if (ext.toUpperCase() == typeArray[i].toUpperCase()) inArray = true;
	            }
	
	            return inArray;
	        },
	
	        greater_than_date: function (field, date) {
	            var enteredDate = this._getValidDate(field.value),
	                validDate = this._getValidDate(date);
	
	            if (!validDate || !enteredDate) {
	                return false;
	            }
	
	            return enteredDate > validDate;
	        },
	
	        less_than_date: function (field, date) {
	            var enteredDate = this._getValidDate(field.value),
	                validDate = this._getValidDate(date);
	
	            if (!validDate || !enteredDate) {
	                return false;
	            }
	
	            return enteredDate < validDate;
	        },
	
	        greater_than_or_equal_date: function (field, date) {
	            var enteredDate = this._getValidDate(field.value),
	                validDate = this._getValidDate(date);
	
	            if (!validDate || !enteredDate) {
	                return false;
	            }
	
	            return enteredDate >= validDate;
	        },
	
	        less_than_or_equal_date: function (field, date) {
	            var enteredDate = this._getValidDate(field.value),
	                validDate = this._getValidDate(date);
	
	            if (!validDate || !enteredDate) {
	                return false;
	            }
	
	            return enteredDate <= validDate;
	        }
	    }
	};
	
	function attributeValue(element, attributeName) {
        var i;

        if(element.length>0){
        	if(element[0].tagName.toLowerCase() !== "option"){
        		if(element[0].type === 'radio' || element[0].type === 'checkbox'){
        			for (i = 0, elementLength = element.length; i < elementLength; i++) {
		                if (element[i].checked) {
		                    return element[i][attributeName] || element[i].getAttribute(attributeName);
		                }
		            }
        			return null;
        		}
        	}else{
        		for (i = 0, elementLength = element.length; i < elementLength; i++) {
	                if (element[i].selected) {
	                    return element[i][attributeName] || element[i].getAttribute(attributeName);
	                }
	            }
        	}
        }
		return element[attributeName] || element.getAttribute(attributeName);
    };
    
	window.formValidate = function(formNameOrNode, fields, callback){
		return new FormValidator(formNameOrNode, fields, callback);
	}
})(window, document);

/*
 * Export as a CommonJS module
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidator;
}
