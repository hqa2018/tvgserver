$(function(){
	var obtId = 99;//默认获取测震观测列表
	var img_src = '/smartweb/destop/icon/appicon/icon1.png'; //保存图标路径
	productIcon();//获取app图标
	getDestops();//初始化测震列表
	/*$('#sidebar-menu li').click(function(){
		obtId = $(this).find('a').attr('id');
		getDestops();//获取列表
	});*/
	
	$('.leftmenu dd a').on("click",function(){
		obtId = $(this).attr('id');
		getDestops();//获取列表
	});
	//获取数据列表
	function getDestops(){
		$.ajax({
		    type: 'POST',
		    url:'/smartweb/destop/getFunction',
		    data: {observerType:obtId},
		    dataType: 'json',
		    success: function (resp){
		    	$(".gridtable tr").off();
		    	$('.gridtable tbody').empty();
		    	var $tab1 = $('#normal-tabs-1 table tbody');
		    	var $tab2 = $('#normal-tabs-2 table tbody');
		    	var $tab3 = $('#normal-tabs-3 table tbody');
		    	if(!resp.DfunctionList) return;//没有数据则返回
		    	for(var j = 0 ; j < resp.DfunctionList.length; j++){
		    		var contents = "";
		    		contents +=	'<tr>'
	    					+ '<td>'+resp.DfunctionList[j].ID+'</td>'			
	    					+ '<td>'+resp.DfunctionList[j].iconName+'</td>'	 		
	    					+ '<td>'+resp.DfunctionList[j].iconUrl+'</td>'	 		
	    			//		+ '<td>'+resp.DfunctionList[j].moduleNumber+'</td>'	 		
	    					+ '<td id="zz" class='+resp.DfunctionList[j].observerType+'>'+resp.DfunctionList[j].monitorType+'</td>'	 	//class=观测学科代码，value为中文名	
	    			//		+ '<td>'+resp.DfunctionList[j].type+'</td>'	 		
	    					+ '<td>'+resp.DfunctionList[j].url+'</td>'
	    					+ '<td>'+getManCode(resp.DfunctionList[j].manCode)+'</td>'
	    				//	+ '<td>'+getDepartName(resp.DfunctionList[j].mNetType)+'</td>'	 		
	    					+ '<td>'+(resp.DfunctionList[j].mNetCode=='null'?'无':resp.DfunctionList[j].mNetCode)+'</td>' 
	    					+ '<td class="hide">'+resp.DfunctionList[j].observerType+'</td>'+ '</tr>'
	    				$tab1.append(contents);
 				}
		    	tdEvent();//tr行被点击事件
		    }
		});
	}
	
	function getManCode(manCode){
		if(manCode == "null" || manCode == null)
			return "无"
		else
			return manCode
	}
	
	//tr点击事件
	function tdEvent(){
		$('tr').on('click',function(){
			var $tds = $(this).find('td');
			$('#tb_tr_id').val($tds.get(0).innerHTML);		//应用id
      		$('#input_data1').val($tds.get(1).innerHTML);	//功能名称
      		$('#input_data2').val($tds.get(2).innerHTML);	//图标地址
      	//	console.info("1234="+document.getElementById("zz").className)
      		if(document.getElementById("zz").className=="99")
      			$('#input_data4').val(99);
      		else
      			$('#input_data4').val(document.getElementById("zz").className);	//获取观测学科代码
      		
      		$('#input_data6').val($tds.get(4).innerHTML);	//功能地址
      		$('#input_data9').val($tds.get(5).innerHTML);	//所属机构
      		$('#input_data8').val($tds.get(6).innerHTML);	//所属部门
    //  		$('#input_data8').val($tds.get(8).innerHTML=='无'?'null':$tds.get(8).innerHTM);
      		
      		$("#deleteAppDialog").dialog({
    			modal : true,
    			minWidth : 500,
    			minHeight : 300,
    			dialogClass : "modal-dialog",
    			show : "fadeIn"
    		});
      		
		});
	}
	
	/*添加数据*/
	$('.addDestopApp').on('click',function(){
		
		var observerType = $('#observerType').val()
		console.info("observerType="+observerType)
		
	//		alert("请选择观测手段！");
	//		return;
		
		var data = {};
		data.iconName = $('#add_name').val();
		data.type = $('#add_name').val();
		data.url = $('#add_url').val();
		data.observerType = $('#observerType').val();
		//data.moduleNumber = $('#moduleNumber').val();
		data.moduleNumber = 1;	//功能模块；应用管理tab
		data.iconUrl = img_src;
		//data.mNetType = $('#mNetType').val();
		data.mNetType = 0;			//部门类型
		data.mNetCode = $('#mNetCode').val();
		data.manCode = $('#manCode').val();
		$.ajax({
			type:'post',
			url:'/smartweb/destop/addData',
			data:data,
			success:function(resp){
				if(resp == "success")
					alert("添加成功！");
				else if(resp == "faild")
					alert("添加失败！！！");
				getDestops();//重新更新列表
			}
		})
		$('.pagebox1').each(function(){
			$(this).removeClass("iconCurrent");
	 	});
	});
	/*列表更新事件*/
	$('.updatas').on('click',function(){
		var data = {};
		data.id = $('#tb_tr_id').val();
		data.iconName =  $('#input_data1').val();		//功能名称
		data.iconUrl = $('#input_data2').val();			//图标地址
		data.moduleNumber = "1"		//功能模块默认为1
		if($('#input_data4').val()==99)	
			data.observerType = 99;
		else
			data.observerType = $('#input_data4').val();	//观测学科
		data.type  = $('#input_data1').val();								//功能描述默认为无
		data.url  =$('#input_data6').val();				//功能地址
		data.mNetType = "0";							//部门类型默认为0
		if($('#input_data9').val()=="无")
			data.manCode = "null"
		else		
			data.manCode = $('#input_data9').val();			//所属机构
		if($('#input_data8').val()=="无")
			data.mNetCode = "null"
		else
			data.mNetCode = $('#input_data8').val();		//所属部门
		$.ajax({
			type:'post',
			url:'/smartweb/destop/upData',
			data:data,
			dataType: 'text',
			success:function(resp){
				if(resp == "ok"){
					alert("更新成功");
				}
				getDestops();//重新更新列表
			}
		})
	});
	/*列表删除事件*/
	$('.delete').on('click',function(){
		$.ajax({ 
			type:'post',		 
			url:'/smartweb/destop/deleteData',
			data:{	
				id:$('#tb_tr_id').val()		
			},		
			success:function(resp){
				if(resp == 0){
					alert('找不到该记录')
				}else{
					alert('成功')	
				}
				getDestops();//重新更新列表
			}					
		});	
	});
	
	/*打开添加界面*/
	$('.openAddDialog').on('click',function(){
		$("#addAppDialog").dialog({
			modal : true,
			height : 430,
			minWidth : 500,
			minHeight : 430,
			dialogClass : "modal-dialog",
			show : "fadeIn"
		});
	});
	// 生成app图标对象
	function productIcon() {
		$.ajax({
			type : 'post',
			url : '/smartweb/destop/getimportFile' + '?timestamp='
					+ new Date().getTime(),
			dataType : 'text',
			success : function(resp) {
				var urlList = resp.split(',');
				var icon_count = urlList.length;
				for (var i = 0; i < urlList.length - 1; i++) {
					$("#realapp").append(
							"<div class='pagebox1'>"
									+ "<a  href='javascript:;'>"
									+ "<img src='/smartweb/destop/icon/appicon/"
									+ urlList[i] + "'>" + "</a>" + "</div>");
				}
				$windowapp = $(".apply_w_app");
				$windowapp.css("width", icon_count * 85);

				var lc1 = 0;
				var rc1 = icon_count - 4;

				$('.img_l_app').on('click', function() {
					if (lc1 < 1) {
						// alert("已经是第一张图片");
						return;
					}
					lc1 -= 4;
					rc1 += 4;
					$windowapp.animate({
						left : '+=340px'
					}, 600);// 左边移动动画
				});

				$('.img_r_app').on('click', function() {
					if (rc1 < 1) {
						// alert("已经是最后一张图片");
						return;
					}
					lc1 += 4;
					rc1 -= 4;
					$windowapp.animate({
						left : '-=340px'
					}, 600);// 右边移动动画
				});

				$('.pagebox1').on('click', function() {// 图标被选中事件
					var $a = $(this).children('a')
					var $img = $($a).children('img')
					img_src = $($img).attr('src')
					$('.pagebox1').each(function() {
						$(this).removeClass("iconCurrent");
					})
					$(this).addClass("iconCurrent")

				})
			}
		});
	}
	
	//返回部门类型
	function getDepartName(type){
		if(type == '0')
			return "默认";
		else if(type == '1')
			return "省级中心";
		else if(type == '2')
			return "市县级中心";
		else if(type == '4')
			return "台站管理";
		else if(type == '5')
			return "其它";
		else if(type == '省级中心')
			return 1;
		else if(type == '市县级中心')
			return 2;
		else if(type == '台站管理')
			return 4;
		else if(type == '其它')
			return 5;
		else if(type == '默认')
			return 0;
	}
});