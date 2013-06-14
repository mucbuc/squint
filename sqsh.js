var squint = require( 'squint' )
  , fs = require( 'fs.extra' )
  , path = require( 'path' )
  , cp = require( 'child_process' )
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
      console.log( '  VERSION: 0.0.1' );
      console.log( '  SOURCE:' );
      console.log( '    https://github.com/mucbuc\n' );
    }
  , isValidFile = function( file ) {
      return config.valid.indexOf( path.extname( file ) ) != -1;
    }
  , isValidDirectory = function( dir ) {
      var base = path.basename( dir );
      return base[0] != '.';
    }
  , config = require( './config.json' );

var app = {
  print: function( str ) { 
    console.log( 'squint$ ' + str );
  },
  processPathArgument: function( arg ) {
    var view = path.join( config.out, arg );
    
    app.print( 'execute on argument: ' + arg );
    mkdir( view, function( err ) {
      if (err) throw err;
      cpdir( arg, view, function( err ) {
        if (err) throw err;
        fs.stat( view, processPath );
      } );
    } );
        
    function processPath( err, stat ) {
      if (err) throw err;
      if (!stat.isDirectory()) {
        processFile( view );
      }
      else {
        processDirectory( view );
      }
    }
    
    function processFile( file ) { 
      app.print( commandName + ' file: ' + file ); 
      fs.readFile( file, function( err, data ) {
        if (err) throw err;
        command( data.toString(), file );
      } );
    }
    
    function processDirectory( dir ) {
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
    }
    
    function mkdir( dir, done ) {
      systemExecute( 'mkdir -p ' + dir, done );
    }
    
    function cpdir( src, dst, done ) {
      systemExecute( 'cp -rfp ' + src + ' ' + dst, done );
    }
    
    function systemExecute( cmd, done ) {
      app.print( cmd ); 
      var p = cp.exec( cmd, [], function( err, stdout, stderr ) {
        if (err) done( err ); 
      } ); 
      p.stdout.on( 'data', function( data ) { 
        process.stdout.write( data ); 
      } );
      if (typeof done != 'undefined')
        p.on( 'exit', done ); 
      return p;
    }
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
            fs.unlink( file, function( err ) {
              if (err) throw err;
              fs.writeFile( file, app.stripCode( code ) );
            } );
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
