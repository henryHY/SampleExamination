
    global.sysLoaded=false

    //#region comm

global.common={};

    //#region grep

    //var arr = [1, 2, 3, 4, 5];
    //$c.grep(arr, function (v, i) {

    //    if (v == 2)
    //        return true;
    //    else
    //        return false

    //});

    //console.log(arr)

    //var arr = [{ x: 1 }, { x: 2 }, { x: 3 }];
    //$c.grep(arr, function (v, i) {

    //    if (v.x == 2)
    //        return true;
    //    else
    //        return false

    //});

    //console.log(arr)
common.grep=function ( arr,cb )
{

    //arr.forEach(function (v, i, a) 
    for ( var n=arr.length-1;n>=0;n-- )
    {

        var v=arr[n];
        !cb( v,n )&&( arr.splice( n,1 ) );

    };

}
    //#endregion

common.getTypeName=function ( o )
{
    var funcNameRegex=/function (.{1,})\(/;
    var results=( funcNameRegex ).exec(( o ).constructor.toString() );
    return ( results&&results.length>1 )?results[1]:"";
};

common.intRND=function ( i1,i2 )
{
    return parseInt( Math.random()*( i2-i1+1 )+i1 );
}

common.clone=function clone( obj )
{
    // Handle the 3 simple types, and null or undefined
    if ( null==obj||"object"!=typeof obj ) return obj;

    // Handle Date
    if ( obj instanceof Date )
    {
        var copy=new Date();
        copy.setTime( obj.getTime() );
        return copy;
    }

    // Handle Array
    if ( obj instanceof Array )
    {
        var copy=[];
        for ( var i=0,len=obj.length;i<len;i++ )
        {
            copy[i]=clone( obj[i] );
        }
        return copy;
    }

    // Handle Object
    if ( obj instanceof Object )
    {
        var copy={};
        for ( var attr in obj )
        {
            if ( obj.hasOwnProperty( attr ) ) copy[attr]=clone( obj[attr] );
        }
        return copy;
    }

    throw new Error( "Unable to copy obj! Its type isn't supported." );
}


    //属性个数
common.pCount=function ( obj )
{

    var count=0;

    for ( var i in obj )
    {

        count++;

    }

    return count;

};

    //#endregion

    //#region prototype

function setPrototype_Array( _Array )
{
    _Array.prototype.contains=function ( obj )
    {

        var i=this.length;
        while ( i-- )
        {
            if ( this[i]===obj )
            {
                return true;
            }
        }

        return false

    }

    _Array.prototype.remove=function ( obj )
    {

        common.grep( this,function ( v )
        {

            if ( obj===v )
            {
                return false;
            }
            else
            {
                return true;
            }

        } );

        return this;

    }

}

function setPrototype_String( _String )
{
    _String.prototype.contains=function ( it ) { return this.indexOf( it )!=-1; };

    _String.prototype.endsWith=function ( suffix )
    {
        return this.indexOf( suffix,this.length-suffix.length )!==-1;
    };

    _String.prototype.startsWith=function ( str )
    {
        return this.indexOf( str )==0;
    };

    _String.prototype.padLeft=function ( totalWidth,paddingChar )
    {
        if ( paddingChar!=null )
        {
            return this.padHelper( totalWidth,paddingChar,false );
        } else
        {
            return this.padHelper( totalWidth,'',false );
        }
    }

    _String.prototype.padRight=function ( totalWidth,paddingChar )
    {
        if ( paddingChar!=null )
        {
            return this.padHelper( totalWidth,paddingChar,true );
        } else
        {
            return this.padHelper( totalWidth,'',true );
        }
    }

    _String.prototype.padHelper=function ( totalWidth,paddingChar,isRightPadded )
    {
        if ( this.length<totalWidth )
        {
            var paddingString=new String();
            for ( i=1;i<=( totalWidth-this.length ) ;i++ )
            {
                paddingString+=paddingChar;
            }
            if ( isRightPadded )
            {
                return ( this+paddingString );
            } else
            {
                return ( paddingString+this );
            }
        } else
        {
            return this;
        }
    }

    _String.prototype.reverse=function () { return this.split( "" ).reverse().join( "" ); }
}

setPrototype_Array( global.Array );
setPrototype_String( global.String );

global.isString=function ( obj ) { return typeof obj=="string" }


    //#endregion

    //#region win

global.quitApp=function ()
{

    _app.closeAllWindows();
    _app.quit();

}

global.showDevTools=function ( win )
{
    win.showDevTools();
}

global.showWindow2=function ( win,width,height )
{

    win.resizeTo( width,height );
    setWinCenter( win );
    setTimeout( function () { showWindow( win ); },10 );

}

global.showWindow=function( win )
{
    win.show();
}

global.closeWindow=function ( win )
{
    win.hide();
}

global.closeWindow=function( win )
{
    win.close();
}

global.closeWindowForce=function ( win )
{
    win.close( true );
}

global.getWin=function ( window )
{
    return _gui.Window.get( window );
}

global.setWinCenter=function ( win )
{

    win.setPosition( "center" );

    var sw=win.window.screen.width;
    var sh=win.window.screen.height;

    win.x=sw/2-win.width/2;
    win.y=sh/2-win.height/2;

}

global.openWin=function( url,option )
{

    var newwin=global._gui.Window.open( url,option );

    return newwin;

}

    //#endregion

    //#region io

    global.deleteFolderRecursiveSync = function(path) {
    if( global._fs.existsSync(path) ) {
        global._fs.readdirSync(path).forEach(function(file,index){
                var curPath = path + "/" + file;
                if(global._fs.statSync(curPath).isDirectory()) { // recurse
                    global.deleteFolderRecursiveSync(curPath);
                } else { // delete file
                    global._fs.unlinkSync(curPath);
                }
            });
        global._fs.rmdirSync(path);
        }
    }

    global.getState=function(path)
    {

        return global._fs.statSync(path)

    }

    global.eachInDirRecursive= function ( path, callback )
    {

        if ( global._fs.existsSync( path ) )
        {
            global._fs.readdirSync( path ).forEach( function ( file, index )
            {

                var curPath = path + "/" + file;
                if ( global._fs.statSync( curPath ).isDirectory() )
                { // recurse
                    global.eachInDirRecursive( curPath,callback );
                } else
                {

                    curPath=curPath.replace(/\//g,"\\")
                    callback( curPath )
                }

            } );

        }

    }

    global.eachInDir=function(path,callback)
    {

        global._fs.readdirSync(path).forEach(function (file) {

            callback(file);

        });

    }

    global.getFileCountInDir=function(path)
    {
        var count = 0;
        global._fs.readdirSync(path).forEach(function (file) {

            var state=global._fs.statSync(path+"\\"+file);
            
            if (state.isFile())
            {

                count++;

            }

        });

        return count;

    }

    global.getDirCountInDir = function (path) {
        var count = 0;
        global._fs.readdirSync(path).forEach(function (file) {

            var state = global._fs.statSync(path + "\\" + file);

            if (state.isDirectory()) {

                count++;

            }

        });

        return count;

    }

    //support file and directory
    global.exists=function(path)
    {
        return global._fs.existsSync(path);
    }

    //Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.
    global.wt=function(path,txt,cb){

        global._fs.writeFile(path, txt,{"encoding":"utf8"}, cb);
    }

    global.wta=function(path,txt,cb){

        global._fs.appendFile(path, txt,{"encoding":"utf8"}, cb);
    }

    global.rt=function(path,cb)
    {
        global._fs.readFile( path,{ "encoding": "utf8" },cb );
    }

    //#endregion

exports.callback0=function (cb)
{

    if ( global._window ) return;

    global._window=global.window;//currentWindow
    global._gui=window.require( 'nw.gui' );
    global._path=require( 'path' )
    global._http=require( 'http' )
    global._iconv=require( 'iconv-lite' )
    global._bufferHelper=require( 'bufferhelper' )
    global._querystring=require( "querystring" )
    global._eventEmitter=require( 'events' ).EventEmitter
    global._dateformat=require( 'dateformat' )
    global._ejs=require( 'ejs' )
    global._moment=require( 'moment' )
    global._momentdf=require( 'moment-duration-format' )
    global._sys=require( 'sys' )
    global._exec=require( 'child_process' ).exec
    global._os=require( 'os' )
    global._childProcess=require( 'child_process' )
    global._execPath=process.execPath
    global._fs=require( "fs" )
    global._async=require( 'async' )
    global._net=require( './net.js' ).create()
    global._reg=require( './reg.js' ).create()
    global._dt=require( './dt.js' ).create()

    global._app=_gui.App;
    global._appArgs=_app.argv;

    setPrototype_Array( global._appArgs.constructor );
    global._isDebug=_appArgs.contains( "--DEBUG" );
    global.Object.defineProperty( global,"_win",{ get: global._gui.Window.get } )

    global.__dirname=global._path.resolve( process.execPath,'../..' );

    global.sysLoaded=true;

    cb();

}