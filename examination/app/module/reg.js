var xreg = null;

//#region test

//var result = [];
//reg.getMatches('AAAA111,BBBB222,CCCC333,DDDD444,EEEE555', '(?<int>\\d)(\\d)\\d', function (match) {

//    console.log("int:" + match.int);
//    result.push(match.int);

//    return false;

//});

//console.log(result);

//console.log(reg.isMatch('AAAA111,BBBB222,CCCC333,DDDD444,EEEE555', '(?<int>\\d)(\\d)\\d'));

//#endregion

var reg = {

    created: false
    ,
    getMatches: function (orgStr, regStr, onMatch) {

        var pos = 0;

        var match = null;

        while (match = xreg.exec
        (
              orgStr
            , xreg(regStr, 'imxg')
            , pos
        )) {

            if (onMatch(match)) {
                break;
            }

            pos = match.index + match[0].length;

        };

    }
    ,
    isMatch: function (orgStr, regStr) {

        return xreg(regStr, 'imxg').test(orgStr);

    }
    ,
    replace: function (orgStr, regStr, replacement) {
        return xreg.replace(orgStr, xreg(regStr, 'imxg'), replacement);
    }

};

function create() {

    if (reg.created) return reg;

    //#region require

    xreg = require('xregexp');

    //#endregion

    reg.created = true;

    return reg;

}

module.exports.create = create;