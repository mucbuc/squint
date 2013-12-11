var assert = require( 'assert' ); 

function Model() {

	var instance = this;

	this.types = {};

	this.functions = {};

	this.namespaces = {};

	this.appendNamespace = function( name, obj ) {
		instance.namespaces[name] = {
			namespaces: obj.namespaces,
			types: obj.types,
			functions: obj.functions,
		};
	};

	this.appendType = function( name, obj ) {
		if (typeof obj !== 'undefined') {
			instance.types[name] = {
				types: obj.types,
				functions: obj.functions,
			};
		}	
		else {
			instance.types[name] = 'undefined';
		}
	}; 

	this.appendFunction = function( name, obj ) {
		// regression hack
		instance.functions[name] = '';
		instance.functions[name] += obj;
	};
};

exports.Model = Model;