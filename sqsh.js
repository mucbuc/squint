var squint = require( 'squint' )
  , fs = require( 'fs.extra' )
  , path = require( 'path' )
  , command = 0
  , commandName = ''
  , pathArguments = []
  , execute = function() {
      console.log( '\n    squint is a still very rough C++ source code tool.' );
      console.log( '    sqsh is the command line interface.' );
      console.log( '  USAGE:' );
      console.log( '    node sqsh [command] file ... ' ); 
      console.log( '  COMMANDS:' );
      console.log( '    strip -> strip comments, includes, defines, undefs, and string literals' );
      console.log( '  SOURCE:' );
      console.log( '    https://github.com/mucbuc\n' );
    }
  , isValidFile = function( file ) {
      var ext = path.extname( file );
      return   ext == '.h'
            || ext == '.hxx'
            || ext == '.cpp'
            || ext == '.cxx';
    }
  , isValidDirectory = function( dir ) {
      var base = path.basename( dir );
      return base[0] != '.';
    };
  
var app = {
  print: function( str ) { 
    console.log( 'squint$ ' + str );
  },
  processPathArgument: function( arg ) {
    app.print( 'execute on argument: ' + arg );
  
    fs.copyRecursive( arg, 'view/' + arg, function( err ) { 
      if (err) throw err;
    } );
  
    fs.stat( arg, function( err, stat ) {
      
      var processFile = function( file ) {
          app.print( commandName + ' file: ' + file ); 
          fs.readFile( file, function( err, data ) {
            if (err) throw err;
            command( data.toString(), file );
          } );
        }
        , processDirectory = function( dir ) {
          fs.readdir( dir, function( err, files ) {
            if (err) throw err;
            files.forEach( function( file ) {
              file = path.join( dir, file );
              fs.stat( file, function( err, stat ) {
                if (err) throw err;
                if (stat.isDirectory()) {
                  if (!isValidDirectory(dir)) return;
                  processDirectory( file );
                }
                else if (isValidFile(file)) {
                  processFile( file );
                }
              } );
            } );
          } );
        };
      
      if (err) throw err;
      if (!stat.isDirectory()) {
        processFile( arg );
      }
      else {
        processDirectory( arg );
      }
    } );
  },
  stripCode: function( code, file ) { 
    code = squint.stripStrings( code );
    code = squint.stripIncludes( code );
    code = squint.stripDefines( code );
    code = squint.stripComments( code );
    return code;
  }, 
  cleanup: function() {},
  parseArgs: function( args ) {
  
    var counter = args.length
      , decCounter = function() {
          if (!--counter) {
            execute();
          }
        };

    if (!counter) {
      execute();
      return;
    }
    args.forEach( function( arg ) { 
      switch (arg) {
        case '-h': case '--help':
          execute(); 
          process.exit( 0 ); 
          break;
        case 'strip': case 'declare':
          commandName = arg;
          command = function( code, file ) {
            fs.writeFile( file + 't', app.stripCode( code ) );
          };
          execute = function() {
            if (!pathArguments.length) {
              pathArguments.push( __dirname );
            }
            app.print( commandName );
            pathArguments.forEach( app.processPathArgument );
          };
          break;
        default:
          pathArguments.push( arg );
          break;
      }
      decCounter();
    } ); 
  },
};

process.on( 'exit', app.cleanup );
app.parseArgs( process.argv.slice(2) );
