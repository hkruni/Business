$(function(){

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
    
    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();
    
    $("#submit_info").on('click',function(){
    	var form  = $("form")[0];
    	form.method = 'post';
    	form.action = 'addWorker';
    	form.submit();

    });
    
    $("#btn_delete").on('click',function(){
    	var selRow = $('#worker_info').bootstrapTable('getSelections');
    	
    	$.ajax({
            type: "POST",
            cache:false,
            async : true,
            dataType : "json",
            url:  'deleteWorker',
            data: {'id':selRow[0].id},
            success: function(data){
            	if ( data.message == 'success' ){
            		alert('删除成功');
            		//$table.bootstrapTable('hideRow', {index:selectIndex});
                    $('#worker_info').bootstrapTable('refresh');
                }
            }
         });

    });
    
    $("#btn_edit").on('click',function(){
    	var selRow = $('#worker_info').bootstrapTable('getSelections');
    	
    	
    	
    	if (selRow.length == 0 || selRow.length > 1)
    	{
    		alert("请选择一条记录修改");
    		return;
    	}
    	
    	var id = selRow[0].id;
    	var name = selRow[0].name;
    	var sex = selRow[0].sex;
    	var tel = selRow[0].tel;
    	var startDate = selRow[0].startDate;
    	var email = selRow[0].email;
    	
    	$("input[name='id']").val(id);
    	$(":text[name='name']").val(name);
    	$("select").val(sex);
    	$(":text[name='tel']").val(tel);
    	$("input[name='startDate']").val(startDate);
    	$(":text[name='email']").val(email);
    	$('#myModal').modal('show');  
    });
    
    
});

var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#worker_info').bootstrapTable({
            url: '/getWorkerInfo',         		//请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
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
            height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                  //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'name',
                title: '员工姓名'
            }, {
                field: 'sex',
                title: '性别'
            }, {
                field: 'tel',
                title: '手机号'
            }, {
                field: 'startDate',
                title: '入职时间'
            }, 
            {
                field: 'email',
                title: '邮箱'
            }, 
            {
                field: 'personPage',
                title: '个人主页'
            },]
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   				//这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,    //页面大小
            offset: params.offset,  //页码
            //departmentname: $("#txt_search_departmentname").val(),
            //statu: $("#txt_search_statu").val()
        };
        return temp;
    };
    
    return oTableInit;
};


var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        //初始化页面上面的按钮事件
    };

    return oInit;
};