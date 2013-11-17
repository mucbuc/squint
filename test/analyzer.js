var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Parser = require( '../src/parser' ).Parser 
  , Tester = require( './tester' )
  , testLog = Tester.testLog
  , makeEmitTester = Tester.makeEmitTester;

module.exports = {
  run : runTest
};
 
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

runTest();

function templateParameters() {

  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;
  
  analyze( emitter );

  emitter.expect( 'open', 'template class< arg >' );
  emitter.expect( 'template parameters', 'template class< arg >' );
  parser.process( 'template class< arg >{', emitter );

  testLog( 'templateParameters passed' );
}

function functionLikeMacrosAsTemplateParameter() {

  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;
  
  analyze( emitter );

  emitter.expect( 'open', 'template class< MACRO( arg ) >' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) >{', emitter );
  testLog( 'functionLikeMacrosAsTemplateParameter passed' );

}

function functionLikeMacrosAsTemplateParameter2() {

  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;
  
  analyze( emitter );
  emitter.expect( 'open', 'template class< MACRO( arg ) > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) > class C{', emitter );
}

function functionLikeMacrosAsTemplateParameter3() {

  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;
  
  analyze( emitter );
  emitter.expect( 'open', 'template class< MACRO( arg ), U > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ), U >' );
  parser.process( 'template class< MACRO( arg ), U > class C{', emitter );
}

function functionLikeMacrosAsTemplateParameter4() {

  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;
  
  analyze( emitter );
  emitter.expect( 'open', 'template class< MACRO( arg ), template <class U> class > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ), template <class U> class >' );
  parser.process( 'template class< MACRO( arg ), template <class U> class > class C{', emitter );
} 

function templatesAsFunctionParameters() {
  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;
  
  analyze( emitter );

  emitter.expect( 'open', 'type foo( st< abc > )' );
  emitter.expect( 'function signature', 'type foo( st< abc > )' );
  parser.process( 'type foo( st< abc > ){', emitter );

  testLog( 'templatesAsFunctionParameters passed' );
}

function typeTemplateDeclaration() {

  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;
  
  analyze( emitter );

  emitter.expect( 'open', 'template<class, class> type XYZ' );
  emitter.expect( 'template parameters', 'template<class, class>' );
  emitter.expect( 'type declaration', 'type XYZ' );
  parser.process( 'template<class, class> type XYZ{', emitter );

  testLog( 'typeTemplateDeclaration passed' );
}

function functionSignatures() {

  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;

  analyze( emitter );

  emitter.expect( 'open', 'type foo()' );
  emitter.expect( 'function signature', 'type foo()' );
  parser.process( 'type foo(){', emitter );

  testLog( 'functionSignatures passed' );
}

function typeDeclaration() {
  
  var parser = new Parser()
    , emitter = makeEmitTester()
    , analyze = require( '../src/analyzer' ).analyze;

  analyze( emitter );

  emitter.expect( 'open', 'type XYZ' );
  emitter.expect( 'type declaration', 'type XYZ' );
  parser.process( 'type XYZ{', emitter );

  testLog( 'typeDeclaration passed' );
}

