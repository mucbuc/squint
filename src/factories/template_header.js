var Factory = require( './factory' ).Factory

function TemplateHeader() {

	Factory.call( this );

	this.function = function( name ) {
		return '\n' + name + ';'; 
	};
	this.type = function() {
		return '';
	};
};

TemplateHeader.prototype = new Factory();

exports.TemplateHeader = TemplateHeader; 
