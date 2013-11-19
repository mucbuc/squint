var assert = require( 'assert' )
  , EventEmitter = require( 'events' ).EventEmitter
  , Parser = require( '../src/parser' ).Parser 
  , Analyzer = require( '../src/analyzer' ).Analyzer
  , Test = require( 'mucbuc-jsthree' ).Test
  , finalLog = Test.finalLog;

process.setMaxListeners( 0 );

checkAnalyzer();

function checkAnalyzer() {
  typeDeclaration();
  functionSignatures();
  typeTemplateDeclaration();
  templatesAsFunctionParameters();
  templateParameters();
  functionLikeMacrosAsTemplateParameter();
  functionLikeMacrosAsTemplateParameter2();
  functionLikeMacrosAsTemplateParameter3();
  functionLikeMacrosAsTemplateParameter4();
}

function templateParameters() {

  var parser = new Analyzer()
    , emitter = new Test.Emitter();

  emitter.expect( 'open', 'template class< arg >' );
  emitter.expect( 'template parameters', 'template class< arg >' );
  parser.process( 'template class< arg >{', emitter );

  finalLog( 'templateParameters passed' );
}

function functionLikeMacrosAsTemplateParameter() {

  var parser = new Analyzer()
    , emitter = new Test.Emitter();
  
  emitter.expect( 'open', 'template class< MACRO( arg ) >' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) >{', emitter );
}

function functionLikeMacrosAsTemplateParameter2() {

  var parser = new Analyzer()
    , emitter = new Test.Emitter();

  emitter.expect( 'open', 'template class< MACRO( arg ) > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ) >' );
  parser.process( 'template class< MACRO( arg ) > class C{', emitter );
}

function functionLikeMacrosAsTemplateParameter3() {

  var parser = new Analyzer()
    , emitter = new Test.Emitter();
  
  emitter.expect( 'open', 'template class< MACRO( arg ), U > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ), U >' );
  parser.process( 'template class< MACRO( arg ), U > class C{', emitter );
}

function functionLikeMacrosAsTemplateParameter4() {

  var parser = new Analyzer()
    , emitter = new Test.Emitter();
  
  emitter.expect( 'open', 'template class< MACRO( arg ), template <class U> class > class C' );
  emitter.expect( 'template parameters', 'template class< MACRO( arg ), template <class U> class >' );
  parser.process( 'template class< MACRO( arg ), template <class U> class > class C{', emitter );

  finalLog( 'functionLikeMacrosAsTemplateParameter passed' );
} 

function templatesAsFunctionParameters() {
  
  var parser = new Analyzer()
    , emitter = new Test.Emitter();
  
  emitter.expect( 'open', 'type foo( st< abc > )' );
  emitter.expect( 'function signature', 'type foo( st< abc > )' );
  parser.process( 'type foo( st< abc > ){', emitter );

  finalLog( 'templatesAsFunctionParameters passed' );
}

function typeTemplateDeclaration() {

  var parser = new Analyzer()
    , emitter = new Test.Emitter();
  
  emitter.expect( 'open', 'template<class, class> type XYZ' );
  emitter.expect( 'template parameters', 'template<class, class>' );
  emitter.expect( 'type declaration', 'type XYZ' );
  parser.process( 'template<class, class> type XYZ{', emitter );

  finalLog( 'typeTemplateDeclaration passed' );
}

function functionSignatures() {

  var parser = new Analyzer()
    , emitter = new Test.Emitter();

  emitter.expect( 'open', 'type foo()' );
  emitter.expect( 'function signature', 'type foo()' );
  parser.process( 'type foo(){', emitter );

  finalLog( 'functionSignatures passed' );
}

function typeDeclaration() {
  
  var parser = new Analyzer()
    , emitter = new Test.Emitter();

  emitter.expect( 'open', 'type XYZ' );
  emitter.expect( 'type declaration', 'type XYZ' );
  parser.process( 'type XYZ{', emitter );

  finalLog( 'typeDeclaration passed' );
}
