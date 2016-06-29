(function(window, document, undefined) {
    var defaults = {
    	i18n:{
    		"en":{
    			required: 'The %s field is required.',
	            "default": 'The %s field is still set to default, please change.',
	            matches: 'The %s field does not match the %s field.',
	            email: 'The %s field must contain a valid email address.',
	            emails: 'The %s field must contain all valid email addresses.',
	            ip: 'The %s field must contain a valid IP.',
	            base64: 'The %s field must contain a base64 string.',
	            credit_card: 'The %s field must contain a valid credit card number.',
	            "url": 'The %s field must contain a valid URL.',
	            contact:'The %s field must contain a valid contact number.',
	            phone:'The %s field must contain a valid phone number.',
	            mobilephone:'The %s field must contain a valid china mobile phone number.',
	            unicomphone:'The %s field must contain a valid china unicom phone number.',
	            telecomphone:'The %s field must contain a valid china telecom phone number.',
	            landline:'The %s field must contain a valid landline number.',
	            idcard:'The %s field must contain a valid idcard number.',
	            length: 'The %s field must be exactly %s characters in length.',
	            min_length: 'The %s field must be at least %s characters in length.',
	            max_length: 'The %s field must not exceed %s characters in length.',
	            length_between:'The %s field must not exceed %s to %s characters in length.',
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
	            is_file_type: 'The %s field must contain only %s files.',
	            greater_than_date: 'The %s field must contain a more recent date than %s.',
	            less_than_date: 'The %s field must contain an older date than %s.',
	            greater_than_or_equal_date: 'The %s field must contain a date that\'s at least as recent as %s.',
	            less_than_or_equal_date: 'The %s field must contain a date that\'s %s or older.',
	            errormsg:'An error has occurred with the %s field.'
    		},
    		"zh-cn":{
    			required: '%s不能为空！',
	            "default": '%s值仍是默认值，请修改！',
	            matches: '%s与%s不匹配 ！',
	            email: '请在%s输入正确的邮件格式！',
	            emails: '请在%s输入全部正确的邮件格式！',
	            ip: '%sIP格式错误！',
	            base64: '%s只能输入base64字符串！',
	            credit_card: '请在%s中输入正确的信用卡卡号！',
	            "url": '请在%s中输入正确的URL！',
	            contact:'请在%s中输入正确的联系方式！',
	            phone:'手机号格式错误！',
	            mobilephone:'请在%s输入移动手机号！',
	            unicomphone:'请在%s输入联通手机号！',
	            telecomphone:'请在%s输入电信手机号！',
	            landline:'请在%s输入正确的固定电话号码！',
	            idcard:'请在%s输入正确的身份证地址！',
	            min_length: '%s必须包含至少%s个字符！',
	            max_length: '%s必须包含少于%s个字符！',
	            length_between:'%s值长度必须在%s-%s之间！',
	            length: '%s必须包含%s个字符！',
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
	            is_file_type: '%s只能包含 %s格式文件！',
	            greater_than_date: '%s中的日期必须大于%s.',
	            less_than_date: '%s中的日期必须小于 %s.',
	            greater_than_or_equal_date: '%s中的日期必须大于等于%s.',
	            less_than_or_equal_date: '%s中的日期必须小于等于%s.',
	            errormsg:'请输入正确的 %s'
    		}
    	}
    },
    dfLang = defaults.i18n[(navigator.appName == "Microsoft Internet Explorer" ? navigator.browserLanguage.toLowerCase() : navigator.language.toLowerCase())] || defaults.i18n.en;
    
    var ruleRegex = /^(.+?)\[(.+)\]$/,
        numericRegex = /^[0-9]+$/,//数字
        numericDashRegex = /^[\d\-\s]+$/,// 数字、中划线、空格
        integerRegex = /^\-?[0-9]+$/,// 整数
        decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,// 浮点数
        emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,//邮件
        alphaRegex = /^[a-z]+$/i,// 字母
        alphaNumericRegex = /^[a-z0-9]+$/i,//字母、数字
        alphaDashRegex = /^[a-z0-9_\-]+$/i,// 字母、数字、下划线、中划线
        naturalRegex = /^[0-9]+$/i,// 自然数
        naturalNoZeroRegex = /^[1-9][0-9]*$/i,// 非零自然数
        ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,// IP
        contactRegex=/(^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70)\d{8}$)|(^(?:\d{3,4}[-\s])?\d{7,8}$)/,
        phoneRegex = /^1(3[0-9]|4[57]|5[0-35-9]|8[0-9]|70)\d{8}$/,//所有手机号码  ，13[0-9], 14[5,7], 15[0, 1, 2, 3, 5, 6, 7, 8, 9], 17[6, 7, 8], 18[0-9], 170[0-9]
        landlineRegex = /^(?:\d{3,4}[-\s])?\d{7,8}$/,//座机手机号码  
        mobilePhoneRegex = /(^1(3[4-9]|4[7]|5[0-27-9]|7[8]|8[2-478])\d{8}$)|(^1705\d{7}$)/,//移动手机号码 ,134,135,136,137,138,139,150,151,152,157,158,159,182,183,184,187,188,147,178,1705
        unicomPhoneRegex = /(^1(3[0-2]|4[5]|5[56]|7[6]|8[56])\d{8}$)|(^1709\d{7}$)/,//联通手机号码  ,130,131,132,155,156,185,186,145,176,1709
        telecomPhoneRegex = /(^1(33|53|77|8[019])\d{8}$)|(^1700\d{7}$)/,//电信手机号码  ,133,153,180,181,189,177,1700
        idcardRegex = /(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$)/,// 身份证号
        photoRegex = /\.jpg$|\.jpeg$|\.gif|\.png|\.bmp$/i,//图片格式 
        base64Regex = /[^a-zA-Z0-9\/\+=]/i,
        urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,// URL
        dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;// 日期，- 分隔


	/*
	 * @param {Object} | {String} formNameOrNode:form name or formNode
 	 * @param {Object} fieldConfig:{name:{rules:'',depends:function(){},display:'',callback:function(errors){}}}
 	 * @param {Function} callback
	 */
    function FormValidator(formNameOrNode, fieldConfig) {
        this.errors = {};
        this.fields = fieldConfig;
        this.form = this._formByNameOrNode(formNameOrNode) || {};
        this._init();
		return this;
    }

	FormValidator.prototype = {
		check: function(fieldName,callback) {
		    var method,param,parts;
	    	if(fieldName && typeof fieldName === 'string'){
		    	var failed = false,
		    		field = this._init(fieldName);
		    	
		    	if(this.errors[fieldName]){
		    		delete this.errors[fieldName];
		    	}
		    	
	        	if(typeof field.rules === "string"){
			        var i, j,l,
			        	rules = field.rules.split(/\s*\|\s*/),
			            indexOfRequired = field.rules.indexOf('required'),
			            isEmpty = (!field.value || field.value === '' || field.value === undefined);
			
			        for (i = 0, l = rules.length; i < l; i++) {
			            method = rules[i];
			            param = null;
			            parts = ruleRegex.exec(method);
			
			
			            if (indexOfRequired === -1 && method.indexOf('callback_') === -1 && isEmpty) {
			                continue;
			            }
			
			            if (parts) {
			                method = parts[1];
			                param = parts[2];
			            }
			
			            if (typeof this._hooks[method] === 'function') {
			                if (!this._hooks[method].apply(this, [field, param])) {
			                    failed = true;
			                }
			            } else if (method.substring(0, 9) === 'callback_') {
			                method = method.substring(9, method.length);
			
			                if (typeof field[method] === 'function') {
			                    if (field[method].apply(this, [field, param]) === false) {
			                        failed = true;
			                    }
			                }
			            }
			            
			            if(failed){ break; }
		        	}
	        	}else if(typeof field.rules === "object"){
	        		try{
	        			field.rules = new RegExp(field.rules);
	    				failed = !field.rules.test(field.value);
	        		}catch(e){
	        			failed = false;
	        		}
	        	}
	        	
	            if (failed) {
	                var source,
	                    message = dfLang.errormsg;
	            	
	            	if(method == 'required'){
	            		source = field[method] || dfLang[method];
	            	}else{
	            		source = field.errorMsg || dfLang[method] || dfLang.errormsg;
	            	}
	
	                if (source) {
	                    message = source.replace('%s', field.display);
	
	                    if (param) {
	                        
	                        if(param.indexOf(",") !== -1){
	                        	param = param.split(/\s*,\s*/);
	                        	message = message.replace('%s', param[0]).replace('%s',param[1]);
	                        }else{
	                        	message = message.replace('%s', (this.fields[param]) ? this.fields[param].display : param);
	                        }
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
	            if(callback && typeof callback === 'function'){
	            	callback.call(this,this.errors,event);
	            }
	            return !failed;
	    		
	    	}else{
	    		return this._validateForm(arguments[arguments.length-1]);
	    	}
	    },
		_init: function(name) {
			var field;
			if(name){
				field = this.fields[name];
				return this._initField(field);
			}else{
				for(var k in this.fields){
					field = this.fields[k];
					field.name = k;
					this._initField(field);
				}
				return this.fields[k];
			}
		},
		_initField: function(field) {
			var rules = field.rules,
				name = field.name;
			if(!rules){
				console && console.warn('validate.js:The following field is being skipped due to a misconfiguration,field:'+ k);
				delete this.fields[name];
				return null;
			}else{
				var element = this.form[name];
	            field.display = field.display || name;
	            field.depends = field.depends;
	            if(element && element !== undefined){
	            	field.element = element;
	            	field.id = attributeValue(element, 'id') || null;
		            field.type =  (element.length>0 && element[0].type)?element[0].type : element.type;
		            field.value = attributeValue(element, 'value') || null;
		            field.checked = attributeValue(element, 'checked') || null;
	            }
            }
			return field;
		},
	    _validateForm: function(callback) {
	        var success = true;
	        this.errors = {};
	        this._init();
	    	for(var k in this.fields){
				if(this.fields.hasOwnProperty(k)){
					var field = this.fields[k],
						element = field.element;
		            if(element && element !== undefined){
	                    if (field.depends && typeof field.depends === "function") {
	                        if (field.depends.call(this, field)) {
	                            success = this.check(field.name);
	                        }
	                    } else {
	                        success = this.check(field.name);
	                    }
		            }
				}
			}
			if(callback && typeof callback === 'function'){
				callback.call(this,this.errors,event);
			}
	        return success;
	    },
	    _formByNameOrNode: function(formNameOrNode) {
	        return (typeof formNameOrNode === 'object') ? formNameOrNode : document.forms[formNameOrNode];
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
	        
	        contact: function(field) {
	        	return contactRegex.test(field.value);
	        },
			phone: function(field) {
				return phoneRegex.test(field.value);
			},
			
			landline: function(field) {
				return landlineRegex.test(field.value);
			},
			
			mobilephone: function(field) {
				return mobilePhoneRegex.test(field.value);
			},
			
			telecomphone: function(field) {
				return telecomPhoneRegex.test(field.value);
			},
			
			unicomphone: function(field) {
				return unicomPhoneRegex.test(field.value);
			},
			
			photo: function(field) {
				return photoRegex.test(field.value);
			},
			
			idcard: function(field) {
				return idcardRegex.test(field.value);
			},
			
	        email: function(field) {
	            return emailRegex.test(field.value);
	        },
	
	        emails: function(field) {
	            var result = field.value.split(/\s*,\s*/g);
	
	            for (var i = 0, resultLength = result.length; i < resultLength; i++) {
	                if (!emailRegex.test(result[i])) {
	                    return false;
	                }
	            }
	
	            return true;
	        },
	        
	        ip: function(field) {
	            return (ipRegex.test(field.value));
	        },
	
	        base64: function(field) {
	            return (base64Regex.test(field.value));
	        },
	
	        url: function(field) {
	            return (urlRegex.test(field.value));
	        },
	
	        credit_card: function(field){
	            if (!numericDashRegex.test(field.value)) return false;
	
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
	
	        length: function(field, length) {
	            if (!numericRegex.test(length)) {
	                return false;
	            }
	
	            return (field.value.length === parseInt(length, 10));
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
			
			length_between: function(field,length) {
				try{
					var length = length.split(',');
					
					if (!numericRegex.test(parseInt(length[0])) || !numericRegex.test(parseInt(length[1]))) {
		                return false;
		            }
					return field.value.length <= parseInt(length[1], 10) && field.value.length >= parseInt(length[0], 10);
				}catch(e){
					return false;
				}
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
    
	window.Validate = function(formNameOrNode, fields){
		return new FormValidator(formNameOrNode, fields);
	}
})(window, document);
/*
 * Export as a CommonJS module
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validate;
}
