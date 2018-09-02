app
// 指令: 处理多级联动下啦菜单 
// disabled-select="1" 设置该属性将不能设置区域
.directive('ysfDrtselectarea', function() {
    return {
        restrict: 'A',
        scope: {
            region: '=region',// 与控制器的$scope.region绑定
            selectedPlace: '=selectedplace' // 与控制器的$scope.selectedPlace (双向)绑定
        },
        replace: true,
        transclude: false,
        template:   '<div class="form_information_div">' +
                        '<div class="form_select_div" >' +
                            '<select ng-options="province.regionId as province.regionName for province in region.provinces" ng-model="selectedPlace.selectedprovince" placeholder="省份">' +
                                //'<option value="-1" >省份</option>' +
                                // '<option ng-repeat="province in region.provinces" value="{{province.regionId}}">{{province.regionName}}</option>' +
                            '</select>' +
                            '<select ng-options="city.regionId as city.regionName for city in region.cities" ng-model="selectedPlace.selectedcity" placeholder="市">' +
                                //'<option value="-1">城市</option>' +
                                // '<option ng-repeat="city in region.cities" value="{{city.regionId}}">{{city.regionName}}</option>' +
                           '</select>' +
                            '<select  ng-options="block.regionId as block.regionName for block in region.blocks" ng-model="selectedPlace.selectedblock" placeholder="区">' +
                                // '<option value="-1">区</option>' +
                                // '<option ng-repeat="block in region.blocks" value="{{block.regionId}}">{{block.regionName}}</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>',
        link: function(scope, iElement, iAttrs) {
            if(parseInt(iAttrs.disabledSelect,10) == 1){
                iElement.find('.form_select_div>select').attr('disabled','disabled');
            }
        },
        controller: function($scope, _chinaAddress){
            // 获取一次菜单
            _chinaAddress.getTree().then(function (data) {
                var noselected = {
                    id: -1,
                    parentId: '-1',
                    regionId: '-1',
                    regionName: '省份',
                    children: []
                };
                data.unshift(noselected);
                $scope.region.provinces = data;
                //$scope.selectedPlace.selectedprovince = '-1';
            });

            $scope.$watch('selectedPlace.selectedprovince', function(newVal, oldVal, scope) {
                
                // 如果值改变            
                if(!!newVal) {

                    // 设置显示的值 城市与区域
                    
                    _chinaAddress.getCities($scope.selectedPlace.selectedprovince).then(function(data){
                        var noselected = {
                            id: -1,
                            parentId: '-1',
                            regionId: '-1',
                            regionName: '市',
                            children: []
                        };
                        data.unshift(noselected);
                        $scope.region.cities = data;
                    });
                    $scope.selectedPlace.selectedprovince = newVal;
                    $scope.selectedPlace.selectedcity = '-1';     
                }
            });

            // 市一级的变化
            $scope.$watch('selectedPlace.selectedcity', function(newVal, oldVal, scope){

                // 如果值改变
                if(!!newVal) {

                    // 设置显示的值 区域
                    _chinaAddress.getDistricts(
                        $scope.selectedPlace.selectedprovince, 
                        $scope.selectedPlace.selectedcity
                    ).then(function(data){
                        var noselected = {
                            id: -1,
                            parentId: '-1',
                            regionId: '-1',
                            regionName: '区',
                            children: []
                        };
                        data.unshift(noselected);
                        $scope.selectedPlace.selectedcity = newVal;
                        $scope.region.blocks = data;
                    });
                    $scope.selectedPlace.selectedblock = '-1';
                }
            });

            // 市一级的变化
            $scope.$watch('selectedPlace.selectedblock', function(newVal, oldVal, scope){
                if(newVal !== oldVal) {
                    $scope.selectedPlace.selectedblock = newVal;
                }                
            });

        }

    };
})
// 上传图片
.directive('ysfImgbase', function(){
    // Runs during compile
    return {
        scope: {
            cb:'&'
        },
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
            var ele = $(iElm),
                file = ele.get(0);
            var cb = $scope.cb();

            ele.change(function(e) {
                var reader = new FileReader(); 
                reader.readAsDataURL(file.files[0]); 
                reader.onload = function(ev){                    
                    cb(ev.currentTarget.result);
                    ele.val('');
                }; 
            });
        }
    };
})
// 地图选点返回坐标跟地址
.directive('ysfMap',function($timeout){
    // Runs during compile
    return {
        scope: {
            lat:'=',
            lng:'=',
            address:'='
        },
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
            var setPosition = function(lat, lng, address){
                $scope.lat = lat;
                $scope.lng = lng;
                $scope.address = address;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            },
            getPosition = function() {
                return $scope.address;
            };
            window.setPosition = setPosition;
            window.getPosition = getPosition; 

            $scope.$watch('address', function(newVal, oldVal) {
                if(newVal) {
                    if(iElm.get(0) && iElm.get(0).contentWindow && iElm.get(0).contentWindow.getAddressFromParentWin) {
                        iElm.get(0).contentWindow.getAddressFromParentWin(newVal);                        
                    }
                }
            });       
        }
    };
})
// 指令
.directive('ysfSearchUser', function($timeout, CommonService){
    // Runs during compile
    return {
        scope: {
            bindUser:'='
        },
        restrict: 'A',
        template: '<div class="search-user">'+
            '<span ng-if="bindUser.id" ng-bind-template="{{bindUser.name}}({{bindUser.mobile}})"></span>'+
            '<div class="search-user-input">'+
                '<input type="text" ng-model="searchUser" class="input-force-mb0" placeholder="请输接单人并选择" />' +
                '<ul ng-class="{active:list.length}">' +
                    '<li ng-click="act.setUser(item);" ng-repeat="item in list" ng-bind-template="{{item.name}}({{item.mobile}})"></li>' +
                '</ul>' +
            '</div>' +
        '</div>',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {
            $scope.searchUser = '';
            $scope.list = [];
            var timer = null;
            var getUser = function(opt, cb, cberr) {
                CommonService.getUser(opt)
                    .then(function(data) {
                        if(typeof cb === 'function')cb(data);
                    }, function(data) {
                        if(typeof cberr === 'function')cberr(data);
                    });
            },
            getUserHandler = function(data) {
                if($scope.searchUser) {
                    $scope.list = data;                    
                }
            };
            $scope.$watch('searchUser', function(newVal, oldVal) {
                if(newVal) {
                    if (timer) {
                        $timeout.cancel(timer);
                    }

                    $timeout(function() {
                        var ajaxParams = {
                            name:'',
                            mobile:''
                        };
                        ajaxParams.name = newVal;
                        getUser(ajaxParams, getUserHandler);
                    },2000);
                } else {
                    $scope.list = [];
                }
            });
            $scope.act = {
                setUser:function(item) {
                    $scope.bindUser.id = item.id;
                    $scope.bindUser.name = item.name;
                    $scope.bindUser.mobile = item.mobile;
                }
            };

            var input = iElm.find('input'),
                ul = iElm.find('ul'),
                win = $(window);
            var winHideUl = function() {
                ul.hide();
                win.off('click', winHideUl);
            };

            input.click(function(e) {
                e.stopPropagation();
                ul.toggle();
                if(ul.css('display') !== 'none') {
                    win.click(winHideUl);                    
                } else {
                    win.off('click', winHideUl); 
                }        
            });
            ul.click(function(e) {
                e.stopPropagation();
                ul.hide();
                win.off('click', winHideUl);
            });
        }
    };
})
.directive('ysfDatepick', function () {

    'use strict';

    return {
        scope: {
            bindDate: '='
        },
        restrict: 'A',
        link: function ($scope, iElm, iAttrs) {
            var format = iAttrs.dateFormat || 'YYYY-MM-DD hh:mm:ss'; //日期格式
            var timePick = /(hh|mm|ss)+/g.test(format); //是否开启时间选择
            var eid = iAttrs.id || 'datepick' + (Date.now() % 1e7) + parseInt(Math.random() * 1e3);
            iElm.attr('id', eid)
                .attr('placeholder', format)
                .addClass('laydate-icon')
                .on('click', function () {
                    var $this = $(this);
                    if (!$this.attr('readonly')) {
                        $this[0].dispatchEvent(new MouseEvent('dblclick', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }))
                    }
                    // 强制允许选择时间，无论是readyonly
                    if (($this.attr('forceenabled')==='1')) {
                        $this[0].dispatchEvent(new MouseEvent('dblclick', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        }))
                    }
                });
            $('#' + eid).one('dblclick', function () {
                var $this = $(this);
                setTimeout(function(){
                    $('#laydate_today').on('click', function () {
                        $scope.bindDate = $this.val();
                        if (!$scope.$$phase && !$scope.$root.$$phase) {
                            $scope.$apply();
                        }
                    });
                }, 0);
            });
            laydate({
                elem: '#' + eid,
                format: format,
                istime: timePick,
                event: 'dblclick',
                choose: function (dates) {
                    $scope.bindDate = dates;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                }
            });
            //初次数据
            var initW = $scope.$watch('bindDate', function (newVal, oldVal) {
                if (newVal) {
                    initW();
                    iElm.val(newVal);
                }
            });
        }
    }
})
.directive('ysfInputFilter',  function(){
    // Runs during compile
    return {
        scope: {
            key:'=', // 搜索关键字
            datafilte:'=', // 源数据
            datashow:'=' // 展示数据用
        },
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
            var searchin = iAttrs.searchin,
                filter = function(search, data) {
                var result = [];
                if(search && data && data.length) {
                    for(var i = 0, len = data.length; i <len; i++) {
                        if(data[i][searchin].indexOf(search) > -1) {
                            result.push(data[i]);
                        }
                    }
                }
                return result;
            };
            $scope.$watch('key', function(newVal, oldVal){
                var search = $.trim(newVal)?$.trim(newVal):'';
                if(search && $scope.datafilte){
                    $scope.datashow = filter(search ,$scope.datafilte);                    
                }else {
                    $scope.datashow = $scope.datafilte;
                }
            });
            $scope.$watch('datafilte', function(newVal, oldVal){
                var search = $.trim($scope.key)?$.trim($scope.key):'';
                if(search){
                    $scope.datashow = filter(search ,$scope.datafilte);
                }else {
                    $scope.datashow = $scope.datafilte;
                }
            });
        }
    };
})
.directive('ysfTeam',  function(){
    // Runs during compile
    return {
        scope: {
            selectdata:'='
        },
        restrict: 'A',
        template:   '<div class="shopbox">'+
			  			'<label ng-repeat="item2 in selectdata" for="" class="agencylabel">'+
			  				'{{item2.name}}<i class="fa fa-times" ng-click="couponDelete(item2.name);"></i>'+
			  			'</label>'+
			  		'</div>',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {
		    $scope.couponDelete = function(name){
				for(var i=0;i<$scope.selectdata.length;i++){
					if(name == $scope.selectdata[i].name){
						$scope.selectdata.splice(i,1);
					}
				}
		    }
        }
    };
})
.directive('ysfSelectBox',  function(){
    // Runs during compile
    return {
        scope: {
            selectdata:'='
        },
        restrict: 'A',
        template:   '<div class="shopbox">'+
			  			'<label ng-repeat="item2 in selectdata" for="" class="agencylabel">'+
			  				'{{item2[tempAttr]}}<i class="fa fa-times" ng-click="couponDelete(item2[tempAttr]);"></i>'+
			  			'</label>'+
			  		'</div>',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {
        	$scope.tempAttr = iElm.attr('key');
		    $scope.couponDelete = function(key){
				for(var i=0;i<$scope.selectdata.length;i++){
					if(key == $scope.selectdata[i][$scope.tempAttr]){
						$scope.selectdata.splice(i,1);
					}
				}
		    }
        }
    };
})


.directive('ysfCopylink',  function(){
    // Runs during compile
    return {
        scope: {
            dataurl:'=',
            datavalue:'='
        },
        restrict: 'A',
        template:   '<a href="javascript:void(0);" data-clipboard-action="copy"  data-url="{{dataurl}}">{{datavalue}}</a>',
        replace: true,
        link: function($scope, iElm, iAttrs, controller) {
        	
        	var clipboard = new Clipboard(iElm.get(0),{
				text: function(trigger) {
			        return trigger.getAttribute('data-url');
			    }
			});
			clipboard.on('success', function(e) {
			    layer.alert('复制成功。')
			});
        }
    };
})

.directive('grouponerBinghtml', function() {//将页面上的标签编译出来
    return  {
        scope:{
            bindData:'='
        },
        restrict:'A',
        link:function($scope, iElm, iAttrs, controller){
            $scope.$watch('bindData', function(newVal, oldVal) {
                iElm.empty().append(newVal);
            });
        }
    };
})

// 多图片上传
    .directive('ysfImageupload', function(_tools, _httpPost, CommonService,$timeout) {
        // Runs during compile
        return {
            scope: {
                appid: '=',
                useType: '=',
                cb: '&',
                cberr: '&',
                bindbase:'='
            },
            restrict: 'AE',
            template:   '<input type="file" style="display: none;" value="" />',
            replace: true,
            link: function($scope, iElm, iAttrs, controller) {
                var $file = $(iElm);
                var cb = $scope.cb(),
                    cberr = $scope.cberr();

                $file.on('change',function(e) {
                    var files = $file.get(0).files;
                    var count = 0;
                    if(files.length) {
                        for(var i = 0; i < files.length; i++) {
                            (function(idx) {
                                var reader = new FileReader();
                                reader.readAsDataURL(files[idx]);
                                reader.onload = function(ev){
                                    count++;
                                    if(count == files.length) {
                                        $file.val('');
                                    }
                                    var setting = {
                                        appid: $scope.appid || 4,
                                        useType: $scope.useType || 'project',
                                        base64File:''
                                    };
                                    //$scope.bindbase = ev.target.result
                                    $timeout(function () {
                                        $scope.bindbase = '123';
                                    },100)


                                    console.log(ev.target.result)
                                    //CommonService.doUploadImg(angular.merge(setting, {
                                    //    base64File: ev.currentTarget.result
                                    //})).then(function(data) {
                                    //    if(typeof cb === 'function')cb(data);
                                    //}, function(data) {
                                    //    if(typeof cberr === 'function')cberr(data);
                                    //});
                                };
                            })(i);
                        }
                    }
                });

            }
        };
    })


;