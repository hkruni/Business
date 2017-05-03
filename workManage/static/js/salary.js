$(function(){
	
	
    //1.初始化Table
    var oTable_worker = TableInit_worker();
    oTable_worker.Init();
    
    
    $("a[href='#salary']").on('click',function(e){//tab切换时采取执行ajax请求数据
      var oTable = TableInit();
      oTable.Init();
    });
    
    $("a[href='#attendance']").on('click',function(e){
        var oTable_attendance = TableInit_attendance();
        oTable_attendance.Init();
    });
    
    
    $('#btn_add_attendance').on('click',function(){
    	var params = {index:0, row:{'name':'0','date':new Date().Format("yyyy-MM-dd"),'detail':'备注'}};
    	$('#attendance_info').bootstrapTable('insertRow',params);
    });
    
    $('#btn_add_salary').on('click',function(){
    	var params = {index:0, row:{'name':'0','date':new Date().Format("yyyy-MM-dd"),'money':0,'detail':'备注'}};
    	$('#salary_info').bootstrapTable('insertRow',params);
    });
    
 
});





var TableInit_attendance = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#attendance_info').bootstrapTable({
            url: '/getAttendance',         		//请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#attendance_toolbar',                //工具按钮用哪个容器
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
            //height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                  //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'name',
                title: '员工姓名',
                editable: {  
                    type: 'select',  
                    source: function () {
                        var result = [{value:"0",text:"编辑"},{value:"1",text:"小毕"},{value:"2",text:"小工"},{value:"3",text:"胡凯"}];
                        return result;
                    },
                    validate: function (value) {  
                        if ($.trim(value) == '' || $.trim(value) == '0') {  
                            return '名称不能为空!';  
                        }  
                    } 
                } 
            }, {
                field: 'date',
                title: '请假日期',
                editable: {  
                	 type: 'combodate',
                	 viewformat: 'YYYY-MM-DD',
                	 template: 'YYYY-MM-DD',
                	 format: 'YYYY-MM-DD',
                	 combodate: {
            	        minuteStep: 1,
            	        secondStep: 1,
            	        maxYear: 2025,
            	        minYear: 2015,
                	 },
                     validate: function (value) {  
                         if ($.trim(value) == '' || $.trim(value) == '0') {  
                             return '日期不能为空!';  
                         }  
                     } 
                } 
            }, {
                field: 'detail',
                title: '备注',
                editable: {  
                    type: 'text',  
                    validate: function (value) {  
                        if ($.trim(value) == '') {  
                            return '名称不能为空!';  
                        }  
                    }  
                } 
            },{
                field: 'opt',
                title: '操作',
                formatter: function(value, row, index) {
                           return [
                                   '<button class="btn btn-primary btn-sm btn-xs save" >保存</button>',
                                   '<button class="btn btn-primary btn-sm btn-xs delete" style="margin-left:10px">删除</button>'
                                  ].join('');
                },
                events:{
                	  'click .save': function(e, value, row, index) {
                		  name = row.name;
                		  break_date = row.date;
                		  detail = row.detail;
                		  id = row.id;
                		  
                		  $.ajax({
                			  url:'/addAttendance',
                			  method:'post',
                			  dataType:'json',
                		      cache:false,
                		      async : true,
                		      data: {'id':id,'name':name,'break_date':break_date,'detail':detail},
                		      success:function(data){
                		    	  if(data.message == 'success'){
                		    		  $('#attendance_info').bootstrapTable('refresh');
                		    	  }
                		      }
                		  });
                  　				   
                	  },
                  	  'click .delete': function(e, value, row, index) {
                		  id = row.id;
                		  bootbox.setLocale("zh_CN"); 
                		  bootbox.confirm("确认要删除该条记录吗?", function(result) {  
                		        if (result) {  
                		        	$.ajax({
                		                type: "POST",
                		                cache:false,
                		                async : true,
                		                dataType : "json",
                		                url:  'deleteAttendance',
                		                data: {'id':id},
                		                success: function(data){
                		                	if ( data.message == 'success' ){
                		                		alert('删除成功');
                		                        $('#attendance_info').bootstrapTable('refresh');
                		                    }
                		                }
                		             });
                		        } 
                		      });  
                  　				   
                	  }
                }
            }]
    });
    }

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   				//这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,    //页面大小
            offset: params.offset,  //页码
        };
        return temp;
    }
    
    return oTableInit;
} 

//薪酬发放表
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#salary_info').bootstrapTable({
            url: '/getSalary',         		//请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#salary_toolbar',                //工具按钮用哪个容器
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
            //height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                  //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'name',
                title: '姓名',
                editable: {  
                    type: 'select',  
                    source: function () {
                        var result = [{value:"0",text:"编辑"},{value:"1",text:"小毕"},{value:"2",text:"小工"}];
                        return result;
                    },
                    validate: function (value) {  
                        if ($.trim(value) == '' || $.trim(value) == '0') {  
                            return '名称不能为空!';  
                        }  
                    } 
                } 
            }, {
                field: 'date',
                title: '日期',
                editable: {  
                	 type: 'combodate',
                	 viewformat: 'YYYY-MM-DD',
                	 template: 'YYYY-MM-DD',
                	 format: 'YYYY-MM-DD',
                	 combodate: {
            	        minuteStep: 1,
            	        secondStep: 1,
            	        maxYear: 2025,
            	        minYear: 2015,
                	 },
                     validate: function (value) {  
                         if ($.trim(value) == '' || $.trim(value) == '0') {  
                             return '日期不能为空!';  
                         }  
                     } 
                },
                
            }, 
            {
                field: 'money',
                title: '工资',
                editable: {  
                     validate: function (v) {
                    	 value = $.trim(v);
                         if (value == '' || (value == '0') ) 
                             return '工资必须是正整数';  
                         if (isNaN(value)) 
                        	 return '工资必须是正整数';
                         var v = parseInt(value);
                         if (v <= 0) 
                        	 return '工资必须是正整数';
                         
                         }  
                     } 
            },
            {
                field: 'detail',
                title: '备注',
                editable: {  
                    type: 'text',  
                    validate: function (value) {  
                        if ($.trim(value) == '') {  
                            return '名称不能为空!';  
                        }  
                    }  
                } 
            },{
                field: 'opt',
                title: '操作',
                formatter: function(value, row, index) {
                           return [
                                   '<button class="btn btn-primary btn-xs ave" >保存</button>',
                                   '<button class="btn btn-primary btn-xs delete" style="margin-left:10px">删除</button>'
                                  ].join('');
                },
                events:{
                	  'click .save': function(e, value, row, index) {
                		  name = row.name;
                		  break_date = row.date;
                		  detail = row.detail;
                		  money = row.money;
                		  id = row.id;
                		  $.ajax({
                			  url:'/addSalary',
                			  method:'post',
                			  dataType:'json',
                		      cache:false,
                		      async : true,
                		      data: {'id':id,'name':name,'money_date':break_date,'detail':detail,'money':money},
                		      success:function(data){
                		    	  if(data.message == 'success'){
                		    		  $('#salary_info').bootstrapTable('refresh');
                		    	  }
                		      }
                		  });
                  　				   
                	  },
                	  'click .delete': function(e, value, row, index) {
                		  id = row.id;
                		  bootbox.setLocale("zh_CN"); 
                		  bootbox.confirm("确认要删除该条记录吗?", function(result) {  
                		        if (result) {  
                		        	$.ajax({
                		                type: "POST",
                		                cache:false,
                		                async : true,
                		                dataType : "json",
                		                url:  'deleteSalary',
                		                data: {'id':id},
                		                success: function(data){
                		                	if ( data.message == 'success' ){
                		                		alert('删除成功');
                		                        $('#salary_info').bootstrapTable('refresh');
                		                    }
                		                }
                		             });
                		        } 
                		      });  
                  　				   
                	  }
                }
            }]
    });
    }

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   				//这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,    //页面大小
            offset: params.offset,  //页码
        };
        return temp;
    }
    
    return oTableInit;
} 


//员工表
var TableInit_worker = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#worker_info').bootstrapTable({
            url: '/getWorker',         		//请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            //toolbar: '#salary_toolbar',                //工具按钮用哪个容器
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
            showRefresh: true,                  //是否显示刷新按钮
            minimumCountColumns: 2,             //最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            //height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
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
                title: '员工姓名'
            }, {
                field: 'month',
                title: '月份'
            }, 
            {
                field: 'break',
                title: '该月休息天数',
//                formatter: function (value, row, index) {
//                    return '<button onclick="text(\''+row.name +'\',\''+row.month+'\')">' + value+ '</button>';
//                }
                formatter: function (value, row, index) {
                    return '<a href="#" class="info">' + value+ '</a>';
                },
                events:{
              	  'click .info': function(e, value, row, index) {	
                　				    $.ajax({
                　						  url:'/getBreakDate',
                 						  method:'post',
                 						  dataType:'json',
                 					      cache:false,
                 					      async : true,
                 					      data: {'name':row.name,'month':row.month},
                 					      success:function(data){
                 					    	  result = $.map(data.rows,function(item){
                 					    		  return item +'号';
                 					    	  });
                 					    	  BootstrapDialog.show({
                 					              title: name + '本月休息情况',
                 					              message: '本月'+result+'休息没有上班'
                 					          });
                 					      }
                 					  });
              	  }
              }
            },
            {
                field: 'month_money',
                title: '该月已发工资',

            }]
    });
    }

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   				//这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            //limit: params.limit,    //页面大小
            //offset: params.offset,  //页码
        };
        return temp;
    }
    
    return oTableInit;
} 

function text(name,month){
	 $.ajax({
		  url:'/getBreakDate',
		  method:'post',
		  dataType:'json',
	      cache:false,
	      async : true,
	      data: {'name':name,'month':month},
	      success:function(data){
	    	  result = $.map(data.rows,function(item){
	    		  return item +'号';
	    	  });
	    	  BootstrapDialog.show({
	              title: name + '本月休息情况',
	              message: '本月'+result+'休息没有上班'
	          });
	      }
	  });
}








