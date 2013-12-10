/* 
objective: 
	- create basic components to be assembled by builder

notes: 
	- doesn't holds product specific states
*/ 

Factory = {
	indent: function( code ) {
		code = '\t' + code;
		return code.replace( /\n/g, '\n\t' ); 
	}, 
	openScope: function( name ) {
		return '\n' + name + '\n{';
	},
	closeScope: function( name ) {
		return '\n}';
	}, 
	namespace: function( name, code ) {
		var result = this.openScope( name );
		result += this.indent( code );
		result += this.closeScope( name ) + ' // ' + name;
		return result;
	}
};

exports.Factory = Factory; 