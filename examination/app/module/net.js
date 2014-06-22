var exec = null;
var http = null;
var iconv = null;
var bufferHelper = null;
var querystring = null;
var os = null;
var reg = null;
var dns = null;
var async = null;
    
var net = {

    created: false,

    getDomainIp: function (domain, onFound, onErr) {

        var ip, error, hasFound = false, retryCount = 0;

        async.whilst(

            function () {

                if (hasFound) return false;

                if (retryCount >= 5) return false;

                return true;

            }
            ,
            function (callback) {

                retryCount++;

                dns.resolve4(domain, function (err, addresses) {

                    if (err) {
                        //console.log("tg err" + retryCount)

                        error = err;
                        callback(null, null);
                    }
                    else {
                       // console.log("tg ok" + retryCount)

                        if (addresses.length > 0) {
                            ip = addresses[0];
                            hasFound = true;
                            callback(null, ip);
                        }
                        else {
                            callback(null, null);
                        }
                    }

                });
                
            },
            function (err) {

                if (error) {
                    onErr(error)
                }
                else {
                    onFound(ip);
                }

            }
        );

        //try {
        //    _sync(function () {

        //        console.log(1);

        //        var ip, err, hasFound = false;

        //        for (var i = 0; i < 5; i++) {

        //            try {

        //                (function (cb) {

        //                    dns.resolve4(domain, function (err, addresses) {

        //                        if (err)
        //                            throw err;

        //                        ip = addresses[0];

        //                    });

        //                })._sync(null);

        //                hasFound = true;
        //                onFound(ip);

        //                break;

        //            }
        //            catch (e) {
        //                err = e;
        //                console.log(e.message);
        //            }

        //        }

        //        if (!hasFound) onErr(err);

        //    });

        //}
        //catch (e) {
        //    console.log(e);
        //}

    },

    getMacAddress: function (onGet, onError) {

        exec("ipconfig /all", function (error, stdout, stderr) {

            //console.log(stdout)

            if (error) {
                onError(error);
                return;
            }

            if (stderr) {
                onError(stderr);
                return;
            }

            var macs = "";

            try {

                var reg = /[\ \:]([A-Z\d]{2}\-[A-Z\d]{2}\-[A-Z\d]{2}\-[A-Z\d]{2}\-[A-Z\d]{2}\-[A-Z\d]{2})[\ \r\n$]/gm;

                var mc = stdout.match(reg);

                mc.forEach(function (item) {

                    macs += item.trim() + ",";

                })

                if (onGet) {

                    onGet(macs);

                }


            }
            catch (e) {
                onError(e);
            }

        });

    },

    getLocalIPs: function () {

        var interfaces = os.networkInterfaces();
        var addresses = [];
        for (k in interfaces) {
            for (k2 in interfaces[k]) {
                var address = interfaces[k][k2];
                if (address.family == 'IPv4' && !address.internal) {
                    addresses.push(address.address)
                }
            }
        }

        return addresses;

    },

    getPubIP:function(cb){
    
        this.httpGet("iframe.ip138.com", 80, '/ic.asp', null, function (result) {

            reg.getMatches(result, "您的IP是\\：\\[(?<ip>[\\d\\.]+?)\\]\\ 来自：(?<summary>.+?)\\<", function (match) {
            
                cb(null, match.ip, match.summary);

                return true;

            });

        }, function (e) {

            cb(e, null, null);

        }, 'gb2312', 10000)

    },

    //#region HttpGet

    /*
    
         httpGet("commservicenode0001.ap01.aws.af.cm", 80, "/get_wip_tempus_shht_1.comm", null, function (result) {
    
                            alert(result);
    
                        }, function (e) {
    
                            alert(e);
    
                        }, "utf8");
    
    */
    httpGet: function (host, port, path, onData, onEnd, onError, responseEncoding, timeout) {

        var options = {
            host: host,
            path: path,
            port: port,
            method: 'GET'
        };

        var callback = function (response) {

            var str = '';

            //response.setEncoding(responseEncoding);

            var _bufferHelper = new bufferHelper();

            response.on('data', function (buffer) {

                _bufferHelper.concat(buffer);

                if (onData != null) {
                    onData(buffer);
                }

            });

            response.on('end', function () {

                if (onEnd != null) {
                    onEnd(iconv.decode(_bufferHelper.toBuffer(), responseEncoding));
                }

            });

            response.on('error', function (e) {

                if (onError != null) {
                    onError(e);
                }

                //$ne.console.log('problem with request: ' + e.message);

            });

        }

        var req = http.request(options, callback);

        if (timeout) {
            req.setTimeout(timeout, function () {
                req.abort();
            });
        }

        req.end();

    },

    //#endregion

    //#region HttpPost


    // EG.

    // try {

    //    $("#t1").focus();

    //    $ne.httpPost("webservice.webxml.com.cn", 80, "/WebServices/RandomFontsWebService.asmx/getCharFonts", null, function (result)
    //    {

    //        $("#t1").val(result);

    //    }, function (e) {

    //        $("#t1").val(e.message);

    //    }, "utf8", "utf8", "byFontsLength=3");

    //}
    //catch (e) {

    //    alert(e);
    //}

    httpPost: function (host, port, path, onData, onEnd, onError, responseEncoding, resquestEncoding, postStr, cookie, reqTimeout, respTimout) {

        var postBuff = iconv.encode(postStr, resquestEncoding);

        http.globalAgent.maxSockets = 10240;

        var options = {
            host: host,
            path: path,
            port: port,
            'Connection': 'keep-alive',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postBuff.length

            }
        };

        //#region set-cookie

        if (cookie) {
            options.headers["Set-Cookie"] = cookie;
        }

        //#endregion

        var callback = function (response) {

            //console.log('In Response');

            //response.setEncoding(responseEncoding);

            var _bufferHelper = new bufferHelper();

            response.on('data', function (buffer) {
                //console.log("get data");
                _bufferHelper.concat(buffer);

                if (onData != null) {
                    onData(buffer);
                }

            });

            //console.log('RES HEADERS: ' + JSON.stringify(response.headers));

            response.on('end', function () {

                try {

                    var result = iconv.decode(_bufferHelper.toBuffer(), responseEncoding);

                    if (onEnd != null) {

                        onEnd(result, response.headers);
                    }

                }
                catch (e) {

                    //console.log("error1");
                    //console.log(e);

                    if (onError != null) {
                        onError(e);
                    }

                }

            });

        }

        try {

            var req = http.request(options, callback);

            req.setSocketKeepAlive(true);

            req.on('error', function (e) {

                //console.log(e.code);
                //console.log(e.message);

                if (onError != null) {
                    onError(e);
                }

            });

            if (reqTimeout) {
                req.setTimeout(reqTimeout, function () {

                    req.abort();

                });
            }

            req.write(postBuff);

            req.end();

        }
        catch (e) {

            //console.log("error3");
            //console.log(e);

            if (onError != null) {
                onError(e);
            }
        }

    }

    //#endregion

};

function create() {

    if (net.created) return net;

    //#region require

    exec = require('child_process').exec;
    http = require('http');
    iconv = require('iconv-lite');
    bufferHelper = require('bufferhelper');
    querystring = require("querystring");
    os = require('os');
    reg = require('./reg.js').create();
    dns = require('dns');
    async = require('async');

    //#endregion

    net.created = true;

    return net;

}

module.exports.create = create;