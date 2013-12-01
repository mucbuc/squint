/* 
objective: 
	- create basic components to be assembled by builder

notes: 
	- doesn't holds product specific states
*/ 

var Utills = { 
	indent: function( code ) {
		code = '\t' + code;
		return code.replace( /\n/, '\n\t' ); 
	} 
};

function Factory() {
}

Factory.prototype = {

	openNamespace: function( name ) {
		return name + '\n{\n';
	},

	closeNamespace: function( name ) { 
		return '\n} // ' + name + '\n'; 
	},

	defineNamespace: function( name, code ) {
		var result = this.openNamespace( name );
		result += Utills.indent( code );
		result += this.closeNamespace( name ); 
		return result;
	},

};

exports.Factory = Factory; 