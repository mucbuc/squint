var Factory = require( './factory' ).Factory

function TemplateHeader() {
	Factory.call( this );
};

TemplateHeader.prototype = new Factory();

TemplateHeader.prototype.function = function( name ) {
	return '\n' + name + ';'; 
};

TemplateHeader.prototype.type = function() {
	return '';
};

exports.TemplateHeader = TemplateHeader; 
