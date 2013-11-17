var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Parser = require( '../src/parser' ).Parser 
  , Tester = require( './tester' ).Tester
  , testLog = Tester.testLog
  , makeEmitTester = Tester.makeEmitTester;

module.exports = {
  run : runTest
};

runTest();
 
function runTest() {

  typeDeclaration();
  functionSignatures();
  typeTemplateDeclaration();
  templatesAsFunctionParameters();
  templateParameters();
  functionLikeMacrosAsTemplateParameter();
  functionLikeMacrosAsTemplateParameter2();
  functionLikeMacrosAsTemplateParameter3();
  functionLikeMacrosAsTemplateParameter4();

  testLog( 'analyzer passed' );
}

function templateParameters() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );

  parser.expect( 'open', 'template class< arg >' );
  analyzer.expect( 'template parameters', 'template class< arg >' );
  parser.process( 'template class< arg >{' );

  testLog( 'templateParameters passed' );
}

function functionLikeMacrosAsTemplateParameter() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );

  parser.expect( 'open', 'template class< MACRO( arg ) >' );
  analyzer.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) >{' );
  testLog( 'functionLikeMacrosAsTemplateParameter passed' );

}

function functionLikeMacrosAsTemplateParameter2() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
  parser.expect( 'open', 'template class< MACRO( arg ) > class C' );
  analyzer.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) > class C{' );
}

function functionLikeMacrosAsTemplateParameter3() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
  parser.expect( 'open', 'template class< MACRO( arg ), U > class C' );
  analyzer.expect( 'template parameters', 'template class< MACRO( arg ), U >' );
  parser.process( 'template class< MACRO( arg ), U > class C{' );
}

function functionLikeMacrosAsTemplateParameter4() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
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

  testLog( 'functionSignatures passed' );
}

function templatesAsFunctionParameters() {
  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );

  parser.expect( 'open', 'type foo( st< abc > )' );
  analyzer.expect( 'function signature', 'type foo( st< abc > )' );
  parser.process( 'type foo( st< abc > ){' );

  testLog( 'templatesAsFunctionParameters passed' );
}

function typeTemplateDeclaration() {

  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
  
  parser.expect( 'open', 'template<class, class> type XYZ' );
  analyzer.expect( 'template parameters', 'template<class, class>' );
  analyzer.expect( 'type declaration', 'type XYZ' );
  parser.process( 'template<class, class> type XYZ{' );

  testLog( 'typeTemplateDeclaration passed' );
}

function typeDeclaration() {
  var parser = makeEmitTester( new Parser() )
    , analyzer = makeEmitTester( new Analyzer( parser ) );
  
  parser.expect( 'open', 'type XYZ' );
  analyzer.expect( 'type declaration', 'type XYZ' );
  parser.process( 'type XYZ{' );

  testLog( 'typeDeclaration passed' );
}

