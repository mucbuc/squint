var TemplateHeader = require( './factory' ).Factory

TemplateHeader.function = function( name ) {
	return '\n' + name + ';'; 
};

TemplateHeader.type = function() {
	return '';
};

exports.TemplateHeader = TemplateHeader; 
