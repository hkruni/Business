$(function(){



    //为select下拉框获取所有的公司
	$.ajax({ 
		type :'post',
        cache:false,
        async : true,
        dataType : "json",
        url:  'getCompanyName',
        data: {},
        success:function(data){
        	
        	$.each(data,function(i,item){
        		$("select[name='name']").append("<option value=\"" + item.id + "\" >" + item.name + "</option>")
        	});
        }
	});
    
	//为select下拉框获取所有的产品
	$.ajax({ 
		type :'post',
        cache:false,
        async : true,
        dataType : "json",
        url:  'getProductName',
        data: {},
        success:function(data){
        	$.each(data,function(i,item){
        		$("#search_product").append("<option value=\"" + item.value + "\" >" + item.name + "</option>");
        		$("#product").append("<option value=\"" + item.value + "\" >" + item.name + "</option>")
        	});
        }
	});
    
	
	//查询按钮
	$("#search_submit").on('click',function(){
		oTable.Init();
	});
    
    
    //表单提交的校验
    $('#form').bootstrapValidator({
    	message: 'This value is not valid',
            　	feedbackIcons: {
    　　　　　　　　valid: 'glyphicon glyphicon-ok',
    　　　　　　　　invalid: 'glyphicon glyphicon-remove',
    　　　　　　　　validating: 'glyphicon glyphicon-refresh'
            　　　　　　　　   },
        fields: {
                name: {
                    message: '用户名验证失败',
                    validators: {
                        notEmpty: {
                            message: '单位不能为空'
                        }
                    }
                },
                num: {
                    validators: {
                        notEmpty: {
                            message: '数量不能为空'
                        }
                    }
                },
                changeDate: {
                    validators: {
                        notEmpty: {
                            message: '日期不能为空'
                        }
                    }
                },
                totalPrice: {
                    validators: {
                        notEmpty: {
                            message: '总价不能为空'
                        }
                    }
                }
            }
    });
    
    
    $("#changeDate,#search_startDate,#search_startDate_money").datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',//只显示到日 期
        language: 'zh-CN',
        autoclose:true,//选中日期后自动关闭
        startDate:'2015-01-01',
        DateTime :'2016-03-31',
        todayBtn:true,
        showMeridian: true,
        todayHighlight: true,//是否高亮当前时间
        initialDate:new Date()//初始化日期的值，在点击控件时帮你自动定位到选中这个日期，但是不点击时对话框不出现
    }).on("click",function(){
       
    });
    
    $("#search_endDate").datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        endDate:new Date(),
        //autoclose:true,
        todayBtn:true,
        showMeridian: true,
        //todayHighlight: true,//是否高亮当前时间
    }).on('click',function(){
    	$("#search_endDate").datetimepicker("setStartDate", $("#search_startDate").val());  
    });
    
    $("#search_endDate_money").datetimepicker({
        format: 'yyyy-mm-dd',
        minView:'month',
        language: 'zh-CN',
        endDate:new Date(),
        //autoclose:true,
        todayBtn:true,
        showMeridian: true,
        //todayHighlight: true,//是否高亮当前时间
    }).on('click',function(){
    	$("#search_endDate_money").datetimepicker("setStartDate", $("#search_startDate_money").val());  
    });
    
    
    
    //下拉列表获取公司
    $("input[name='name'],#search_name").autocomplete({  
    	   source:function(query,process){  
    	      var matchCount =10;//允许返回结果集最大数量  
    	      $.post("/getCompanyName",{"name":query,"matchCount":matchCount},function(respData){  
    	          respData =$.parseJSON(respData);//解析返回的数据  
    	          if(!respData) {  
    	              alert('输入名称不正确');  
    	           }  
    	           return process(respData);  
    	       });  
    	    }  
    });  
    
    
    //订单删除
    $("#btn_delete").on('click',function(){
    	var selRow = $('#order_info').bootstrapTable('getSelections');
    	$.ajax({
            type: "POST",
            cache:false,
            async : true,
            dataType : "json",
            url:  'deleteOrder',
            data: {'id':selRow[0].id},
            success: function(data){
            	if ( data.message == 'success' ){
            		alert('删除成功');
                    $('#order_info').bootstrapTable('refresh');
                }
            }
         });

    });
    
    //订单添加
    $("#btn_edit").on('click',function(){
    	var selRow = $('#order_info').bootstrapTable('getSelections');
    	
    	if (selRow.length == 0 || selRow.length > 1)
    	{
    		alert("请选择一条记录修改");
    		return;
    	}
    	
    	var id = selRow[0].id;
    	var name = selRow[0].name;
    	var detail = selRow[0].detail;
    	var type = selRow[0].type;
    	var product = selRow[0].product;
    	var changeDate = selRow[0].changeDate;
    	var totalPrice = selRow[0].totalPrice;
    	var num = selRow[0].num;
    	
    	$("input[name='id']").val(id);
    	$("#name option:contains('" + name + "')").attr('selected',true);
    	$("input[name='totalPrice']").val(totalPrice);
    	$("input[name='num']").val(num);
    	$("select[name='type']  option:contains('" + type + "')").attr('selected',true);
    	$("#product option:contains('" + product + "')").attr('selected',true);
    	$("input[name='changeDate']").val(changeDate);
    	$("input[name='detail']").val(detail);
    	$('#myModal').modal('show');  
    });
    
    
    //订单添加
    $("#btn_edit_money").on('click',function(){
    	var selRow = $('#money_info').bootstrapTable('getSelections');
    	
    	if (selRow.length == 0 || selRow.length > 1)
    	{
    		alert("请选择一条记录修改");
    		return;
    	}
    	
    	var id = selRow[0].id;
    	var name = selRow[0].name;
    	var detail = selRow[0].detail;
    	var type = selRow[0].type;
    	var type_change = selRow[0].type_change;
    	var changeDate = selRow[0].changeDate;
    	var totalPrice = selRow[0].totalPrice;
    	
    	$("input[name='id']").val(id);
    	$("#name_money option:contains('" + name + "')").attr('selected',true);
    	$("input[name='totalPrice']").val(totalPrice);
    	$("select[name='type']  option:contains('" + type + "')").attr('selected',true);
    	$("select[name='type_change']  option:contains('" + type_change + "')").attr('selected',true);
    	$("input[name='changeDate']").val(changeDate);
    	$("input[name='detail']").val(detail);
    	$('#myMoneyModal').modal('show');  
    });
    
    
    
    type = GetQueryString('type');
    if(type ==2){
    	$('#myTab a:last').tab('show');
    }
    
	//查询按钮
	$("#search_submit_money").on('click',function(){
		oTable1.Init();
	});
	
	
	today = getNowFormatDate();
	$('#search_endDate_money,#search_endDate').val(today);
	
    //1.初始化订单表
    var oTable = TableInit();
    oTable.Init();
    //初始化回款表
    var oTable1 = TableInit_money();
    oTable1.Init();
    
});







//回款表
var TableInit_money = function () {
    var oTableInit = new Object();
    oTableInit.Init = function () {
    	 $('#money_info').bootstrapTable('destroy');  
         $('#money_info').bootstrapTable({
            url: '/getMoney',         		//请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            //toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                    //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                      //是否显示表格搜索，此搜索是客户端搜索。如果进行服务端搜索，可以在参数加入search:params.search
            strictSearch: false,
            showColumns: false,                  //是否显示列筛选按钮
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            height: 480,                        //行高，去掉解决表头内容不对齐问题
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                  //是否显示父子表
            formatLoadingMessage: function(){
                return "请稍等，正在加载中.....";
            },
            columns: [{
                checkbox: true
            }, {
                field: 'name',
                title: '单位'
            }, {
                field: 'type',
                title: '收款/打款'
            }, {
                field: 'type_change',
                title: '交易方式'
            },
            {
                field: 'changeDate',
                title: '日期'
            },
            {
                field: 'totalPrice',
                title: '总价（元）'
            },
            {
                field: 'detail',
                title: '备注'
            }]
        });
    };
    
    oTableInit.queryParams = function (params) {
        var temp = {   				
            limit: params.limit,    //页面大小
            offset: params.offset,  //页码
            companyId : $("#search_name").val(),
            startDate:$("#search_startDate_money").val(),
            endDate:$("#search_endDate_money").val(),
            productId:$("#search_product").val()
        }
        return temp;
    };
    
    return oTableInit;
};



//订单表
var TableInit = function () {
    var oTableInit = new Object();
    oTableInit.Init = function () {
    	 $('#order_info').bootstrapTable('destroy');  
         $('#order_info').bootstrapTable({
            url: '/getOrder',         		//请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            //toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortable: false,                    //是否启用排序
            sortOrder: "asc",                   //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,                       //每页的记录行数（*）
            pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
            search: false,                      //是否显示表格搜索，此搜索是客户端搜索。如果进行服务端搜索，可以在参数加入search:params.search
            strictSearch: false,
            showColumns: false,                  //是否显示列筛选按钮
            showRefresh: false,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            height: 480,                        //行高，去掉解决表头内容不对齐问题
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                  //是否显示父子表
            formatLoadingMessage: function(){
                return "请稍等，正在加载中.....";
            },
            columns: [{
                checkbox: true
            }, {
                field: 'name',
                title: '单位'
            }, {
                field: 'type',
                title: '进供货'
            }, {
                field: 'product',
                title: '货物名称'
            },
            {
                field: 'changeDate',
                title: '日期'
            },
            {
                field: 'num',
                title: '数量（个或吨）'
            }, 
            {
                field: 'totalPrice',
                title: '总价（元）'
            },
            {
                field: 'detail',
                title: '备注'
            }]
        });
    };
    
    oTableInit.queryParams = function (params) {
        var temp = {   				
            limit: params.limit,    //页面大小
            offset: params.offset,  //页码
            companyId : $("#search_name").val(),
            startDate:$("#search_startDate").val(),
            endDate:$("#search_endDate").val(),
            productId:$("#search_product").val()
        }
        return temp;
    };
    
    return oTableInit;
};












