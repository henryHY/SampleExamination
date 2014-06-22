$( function ()
{

    if ( !global.sysLoaded ) return;

    _win=global.getWin( window );

    window.addEventListener( 'keydown',function ( e )
    {

        if ( e.keyIdentifier==='F12' )
        {

            global.showDevTools( _win );

        }
        else if ( e.keyIdentifier==='F5' )
        {

            _win.reloadIgnoringCache();

        }

    } );

} );