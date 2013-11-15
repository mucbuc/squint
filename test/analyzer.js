var assert = require( 'assert' )
  , events = require( 'events' )
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Parser = require( '../src/parser' ).Parser 
  , makeEmitTester = require( './tester' ).makeEmitTester;


module.exports = {
  run : runTest
};
  
function runTest() {

  typeDeclaration();
  typeTemplateDeclaration();
  templatesAsFunctionParameters();
/* 
  functionSignatures();
 functionLikeMacrosAsTemplateParameter();
  templateParameters();
*/

  process.on( 'exit', function() {
    console.log( 'analyzer passed' );
  } );
}

function templateParameters() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );

  parser.expect( 'open', 'template class< arg >' );
  analyzer.expect( 'template parameters', 'template class< arg >' );
  parser.process( 'template class< arg >{' );
}

function functionLikeMacrosAsTemplateParameter() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
    
  parser.expect( 'open', 'template class< MACRO( arg ) >' );
  analyzer.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) >{' );

  parser.expect( 'open', 'template class< MACRO( arg ) > class C' );
  analyzer.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) > class C{' );

  parser.expect( 'open', 'template class< MACRO( arg ), U > class C' );
  analyzer.expect( 'template parameters', 'template class< MACRO( arg ), U >' );
  parser.process( 'template class< MACRO( arg ), U > class C{' );
  
  parser.expect( 'open', 'template class< MACRO( arg ), template <class U> class > class C' );
  analyzer.expect( 'template parameters', 'template class< MACRO( arg ), template <class U> class >' );
  parser.process( 'template class< MACRO( arg ), template <class U> class > class C{' );
} 

function functionSignatures() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );

  parser.expect( 'open', 'type foo()' );
  analyzer.expect( 'function signature', 'type foo()' );
  parser.process( 'type foo(){' );
}

function templatesAsFunctionParameters() {
  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );

  parser.expect( 'open', 'type foo( st< abc > )' );
  analyzer.expect( 'function signature', 'type foo( st< abc > )' );
  parser.process( 'type foo( st< abc > ){' );
}

function typeTemplateDeclaration() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
  
  parser.expect( 'open', 'template<class, class> type XYZ' );
  analyzer.expect( 'template parameters', 'template<class, class>' );
  analyzer.expect( 'type declaration', 'type XYZ' );
  parser.process( 'template<class, class> type XYZ{' );
}

function typeDeclaration() {
  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
  
  parser.expect( 'open', 'type XYZ' );
  analyzer.expect( 'type declaration', 'type XYZ' );
  parser.process( 'type XYZ{' );
}

