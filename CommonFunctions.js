// 数字格式化，1234567890.32145 = 1,234,567,890.32145
function addCommas(num){
    var x = (num+'').split('.');
    var x1 = x[0],x2 = x.length > 1 ? '.' + x[1] : '';
    
    var reg = /(\d+)(\d{3})/;
    while(reg.test(x1)){
      x1 = x1.replace(reg,'$1,$2');
    }
    return x1+x2;
}