angular.module("filters",[])
.filter('rounding', [

            function () {
                return function (value, length, divider) {
                    value = value || 0;
                    var out = "",
                        sign = "";

                    switch (divider) {
                    case 1000:
                        sign = "K";
                        break;
                    case 1000000:
                        sign = "M";
                        break;
                    }

                    if (value >= divider) out = (value / divider).toFixed(0) + sign;
                    else if(value < 10){
                        var zeros = "";
                        for(var i = 1; i < length; i++)zeros += "0";
                            
                        out = zeros + value.toString();
                    }
                    else out = value;
                    return out;
                };
        }]);