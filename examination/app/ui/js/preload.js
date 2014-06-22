function initData(cb)
{
    
    global.rt(

         global.__dirname+"\\config.js"

        ,function (err,data)
        {
            if ( err ) cb( err )
            else
            {
                try
                {
                    global.config1=JSON.parse( data );
                    cb( null );
                }
                catch ( e )
                {
                    alert( data )
                    cb( e );
                }
                
            }
        }

    );

}

var preload=function ( cb )
{
    initData( cb )
}