exports.regexMap = { 
	commentMultiple: /\/\*[\s\S]*?\*\//mg,
	commentSingle: /\/\/.*\n?/g,
	include: /#.*include.*\n?/g,
	defineNewLine: /\\[ \t]*\n/mg,
	define: /#.*define.*\s*\n?/g, 
	undefine: /#.*undef.*\n?/mg,
	stringLiteral: /".*?([^\\]")/g,
	arrayInitBlock: /\s*=.*?;/g, 
	preProcessorLine: /^\s*#.*/mg, 
	typeDef: /typedef.*?;/mg,
	typeDefinitionSplitter: /(.*)\s*:(.*)/,
	constructorSplitter: /(.*\))\s*:(.*)/,
	preProcessorDirectirive: /^\s*#.*\n/gm
};
