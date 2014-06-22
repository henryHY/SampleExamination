var dateFormat = null;
var moment = null;

//var t = timer();
//t.start();
// do something
//t.stop();
//console.log(t.getTime());
//get ms
var timer = function () {

    var start,end;

    return {
        start: function () {
            start = new Date().getTime();
        },
        stop: function () {
            end = new Date().getTime();
        },
        getMS: function () {
            return time = end - start;
        }
    };
};

var dt = {

    created: false,

    getSW:function()
    {
        return timer();
    }
    ,
    toT1:function (date) {
        
        return dateFormat(date, "yyyy-mm-dd HH:MM:ss");

    }
    ,
    toT1_2: function (date) {

        return dateFormat(date, "mmdd HH:MM:ss");

    }
    ,
    toT1_3: function (date) {

        return dateFormat(date, "yyyy-mm-dd");

    }
    ,
    toT3:function (date) {
        
        return dateFormat(date, "yyyymmddHHMMss");

    }
    ,
    get now() {
        return new Date();
    }
    ,
    //type hours,seconds,years,days,months etc.
    //d1,d2 string or Date
    diff:function (d1,d2,type)
    {

        if (!d1._d)
        {
            d1 = moment(d1);
        }

        if (!d2._d) {
            d2 = moment(d2);
        }

        return Math.round( Math.abs( d1.diff( d2,type,true ) ),2 );
    },
    add:function(date,key,value)
    {
        return moment(date).add(key, value)._d;
    },
    parse: function (str)
    {

        return moment(str)._d;

    },
    //->20MAY
    toT4: function (d)
    {

        var md = moment(d);
        return md.format("DDMMM").toUpperCase();

    },
    //20MAY->data
    T4ToD: function (str) {

        var currentYear = moment().year();

        var currentMonth = moment().month();

        var currentDate = moment().date();
        
        var md = moment(str, "DDMMM");

        var now_md = moment([0, currentMonth, currentDate]);

        if (md < now_md) {
            md.year(currentYear + 1);
        }
        else {
            md.year(currentYear);
        }

        return md._d;

    },
    //->20MAY12
    toT5: function (d)
    {

        var md = moment(d);
        return md.format("DDMMMYY").toUpperCase();

    },
    //20MAY12->data
    T5ToD: function (str) {

        var md = moment(str, "DDMMMYY");
        return md._d;

    }
    
};

function create()
{

    if (dt.created) return dt;

    //#region require

    dateFormat = require('dateformat');
    moment = require('moment');

    //#endregion

    dt.created = true;

    return dt;

}

module.exports.create = create;
