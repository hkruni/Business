$(function(){
	
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('order_num'));

    // 指定图表的配置项和数据
	option = {
	    title : { 
	        text: '',
	        subtext: '单位（万个）',
	        x:'left',//水平位置，默认为left
	        textStyle:{
	            fontSize: 5,
	            fontWeight: 'bolder',
	            color: '#666'
	        }  
	    },
	    tooltip : {
	        trigger: 'axis'
	    },
//	    toolbox: {//工具箱
//	        show : true,
//	        itemGap:20,
//	        effectiveColor:'red',
//	        color : ['#1e90ff','#22bb22','#4b0082','#d2691e'],
//	        backgroundColor: 'rgba(0,0,0,0)', // 工具箱背景颜色
//	        borderColor: '#ccc',       // 工具箱边框颜色
//	        borderWidth: 0,            // 工具箱边框线宽，单位px，默认为0（无边框）
//	        padding: 5,                // 工具箱内边距，单位px，默认各方向内边距为5，
//	        feature : {
//	            mark : {
//        			show: true,
//        			title : {
//        		            mark : '辅助线开关',
//        		            markUndo : '删除辅助线',
//        		            markClear : '清空辅助线'
//        		    },
//        		    lineStyle : {
//        		            width : 2,
//        		            color : '#1e90ff',
//        		            type : 'dashed'
//        		    }
//	           	},
//	            dataZoom : {
//	                show : true,
//	                title : {
//	                    dataZoom : '区域缩放',
//	                    dataZoomReset : '区域缩放后退'
//	                }
//	            },
//	            dataView : {show: true, readOnly: false},
//	            magicType : {show: true, type: ['line', 'bar']},
//	            restore : {show: true},
//	            saveAsImage : {show: true}
//	        }
//	    },
	    calculable : true,
	    xAxis : [
	        {
	            type : 'category',
	            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value'
	        }
	    ],
	};
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
	
	$.ajax({
		type :'get',
        cache:false,
        async : true,
        dataType : "json",
        url:  '/getOrderNumByYear',
        data: {'year':2017},
        success:function(data){
        	legend = {data:[]};
        	series = [];
        	$.each(data,function(i,item){
        		legend.data.push(item.name);
        		var v1 = {name:item.name,type:'bar',data:item.value}
        		series.push(v1);
        	});
            myChart.setOption({
            	legend:legend,
            	series:series
            });
        }
	});
	
	
	
	$('#select_order_num').on('change',function(){
		year = $('#select_order_num').val();
		$.ajax({
			type :'get',
	        cache:false,
	        async : true,
	        dataType : "json",
	        url:  '/getOrderNumByYear',
	        data: {'year':year},
	        success:function(data){
	        	legend = {data:[]};
	        	series = [];
	        	$.each(data,function(i,item){
	        		legend.data.push(item.name);
	        		var v1 = {name:item.name,type:'bar',data:item.value}
	        		series.push(v1);
	        	});
                myChart.setOption({
                	legend:legend,
                	series:series
                });
	        }
		});
	});
});

