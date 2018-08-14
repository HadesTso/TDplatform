app
// 过滤器：是否推荐
.filter('filtstatus',function() {
    return function(val) {
        var result = '';
        val = +val;
        switch(val) {
            case 0: {
                result = '待审核';
                break;
            }
            case 10: {
                result = '审核不通过';
                break;
            }
            case 20: {
                result = '已上架';
                break;
            }
            case 30: {
                result = '已过期';
                break;
            }
        }
        return result;
    };
})
// 过滤器：房源订单状态
.filter('rentOrderType',function(){
    return function(n){
        if(n == '0'){
            return '已预约';
        }if(n == '10'){
            return '已看房';
        }if(n == '20'){
            return '已租赁';
        }if(n == '30'){
            return '已失效';
        }
    };
})
// 过滤器：截取时间前半段
.filter('datepre',function() {
    return function(val) {
        var result = val;
        if(val) {
            result = val.split(' ')[0];
        }
        return result;
    };
})
// 过滤器：房屋出租状态
    .filter('rentStatusType',function(){
        return function(n){
            if(n == '0'){
                return '待出租';
            }if(n == '1'){
                return '已出租';
            }
        };
    })

;
