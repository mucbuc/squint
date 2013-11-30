function Document() {

	this.pushNamespace = function( name, code ) {
		console.log( 'pushNamespace', name, code );
	};

	this.pushTypeDefinition = function( signature, code ) {};

	this.pushTypeDeclaration = function( signature ) {};

	this.pushFunctionDefinition = function( signature, code ) {};

	this.pushFunctionDeclaration = function( signature ) {};
}

exports.Document = Document;