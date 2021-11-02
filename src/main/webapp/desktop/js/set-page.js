var obj; // 保存父页面对象
var img_src = ''; // 保存选择图标的路径

$(function() {
	$('.Pagination').remove();// 清空分页栏
	$('.app-list').kkPages({
		PagesClass : 'li', // 需要分页的元素
		PagesMth : 6, // 每页显示个数
		PagesNavMth : 2
	// 显示导航个数
	});
	
	
	$(".tabItemContainer>ul>li").click(function() {
		$(".tabItemContainer>ul>li>a").removeClass("tabItemCurrent");
		$(".tabBodyItem").removeClass("tabBodyCurrent");
		$(this).find("a").addClass("tabItemCurrent");
		$($(".tabBodyItem")[$(this).index()]).addClass("tabBodyCurrent");
		$('.Pagination').remove();// 清空分页栏
		$('.app-list').kkPages({
			PagesClass : 'li', // 需要分页的元素
			PagesMth : 6, // 每页显示个数
			PagesNavMth : 2
		// 显示导航个数
		});

	});

	loadCofig(); // 加载用户配置

	productIcon();// 生成app图标
	newAppIcon();
	// 添加选项按钮
	$('.app-list').on('click','a[type="add"]',function() {
		
		var id = $(this).attr("id"); // 当前按钮ID
		var functionName = $(this).attr("id"); // 保存当期按钮ID
		var iconName = $(".app-list>li>a>span[id='" + id + "']")
				.text();// 当前按钮对应台站名称
		var type = $(".app-list>li>span[id='" + id + "']")
				.text(); // 当前按钮对应描述
		
		var timer = new Date().getTime();
		if (this.className == "btn-add-s") {
			// console.info(id)
			$.ajax({
				type : 'post',
				url : '/smartweb/destop/saveConfig?timer='+timer,
				data : {
					id : parseInt(id)
				},
				success : function(resp) {
					console.info(resp);
					if (resp == "0") {
						alert("你还没有登录！")
					} else {
						loadCofig();
						window.parent.frames.refresh();// 更新destop页面
					}
				}
			});
		} else if (this.className == "btn-del-s") {
			$.ajax({
				type : 'post',
				url : '/smartweb/destop/deleteConfig?timer='+timer,
				data : {
					id : parseInt(id)
				},
				success : function(resp) {
					loadCofig();
					window.parent.frames.refresh();// 更新destop页面
				}
			});

		}
		this.className = (this.className == "btn-add-s" ? "btn-del-s"
				: "btn-add-s"); // 实现按钮轮换
	});
	// 选项图标点击事件
	$('.app-list>li>a>img').on('click',function() {
		obj = this; // 保存父控件对象
		// 初始化控件值
		var id = $(this).attr('id')
		$("#destopMyPages option:first").prop("selected", 'selected');
		$.ajax({
			type : 'post',
			url : '/smartweb/destop/getConfig/',
			data : {
				id : id
			},
			dataType : 'JSON',
			success : function(resp) {
				if (resp == 0) {
					alert('提示：您还没有订阅该功能！')
				} else {
					var iconName = resp.config.iconName;
					var type = resp.config.type;
					var pagenumber = resp.config.pagenumber;
					var iconUrl = resp.config.iconUrl;

					$('.pagebox1').each(function() {
						var $a = $(this).children('a')
						var $img = $($a).children('img')
						if ($($img).attr('src') == iconUrl) {
							$(this).addClass("iconCurrent");
						}
					})
					$('.input_iconName').attr("value", iconName);
					$('.input_type').attr("value", type);
					$("#destopMyPages option[value='"+ pagenumber + "']").attr("selected", "selected");
					$("#setAttrDialog").dialog({
						modal : true,
						minWidth : 440,
						minHeight : 320,
						dialogClass : "modal-dialog",
						show : "fadeIn"
					});
					$(".ui-dialog-titlebar-close").on("click",function() {
						$('.pagebox1').each(function() {
							$(this).removeClass("iconCurrent");
						})
					});
				}
			}
		});
	});
	// 自定义添加按钮
	$('.actions').on('click', function() {
		obj = this;
		$("#addAppDialog").dialog({
			modal : true,
			minWidth : 440,
			minHeight : 320,
			dialogClass : "modal-dialog",
			show : "fadeIn"
		});
	})
	// 上传图片预览
	$('#myFile').on('change', function() {
		var file = this.files[0];
		var src = getObjectURL(file);
		$('#preview').attr('src', src); // 上传图片预览
	});
	$('#type_iconOpen').val(getCookie("iconOpen"));//获取cookie
	//存入用户习惯
	$('#type_iconOpen').on('change', function(){
		setCookie("iconOpen",$(this).val(),"d30");
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

	// 生成app图标对象
	function newAppIcon() {
		$.ajax({
			type : 'post',
			url : '/smartweb/destop/getimportFile' + '?timestamp='
					+ new Date().getTime(),
			dataType : 'text',
			success : function(resp) {
				var urlList = resp.split(',');
				var icon_count = urlList.length;
				for (var i = 0; i < urlList.length - 1; i++) {
					$("#newapp").append(
							"<div class='pagebox1'>"
									+ "<a  href='javascript:;'>"
									+ "<img src='/smartweb/destop/icon/appicon/"
									+ urlList[i] + "'>" + "</a>" + "</div>");
				}
				$window2 = $(".apply_w_newapp");
				$window2.css("width", icon_count * 85);

				var lc1 = 0;
				var rc1 = icon_count - 4;

				$('.turn_l').on('click', function() {
					if (lc1 < 1) {
						// alert("已经是第一张图片");
						return;
					}
					lc1 -= 4;
					rc1 += 4;
					$window2.animate({
						left : '+=340px'
					}, 600);// 左边移动动画
				});

				$('.turn_r').on('click', function() {
					if (rc1 < 1) {
						// alert("已经是最后一张图片");
						return;
					}
					lc1 += 4;
					rc1 -= 4;
					$window2.animate({
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
	
	
	// 侧边栏上传图片事件
	$('#uploadIcon').on('click',function() {
		// 上传图片初始化
		$("#appicon").empty();
		$.ajax({
			type : 'post',
			url : '/smartweb/destop/getimportFile'
					+ '?timestamp='
					+ new Date().getTime(),
			dataType : 'text',
			success : function(resp) {
				var urlList = resp.split(',');
				var icon_count = urlList.length;
				$("#appicon").append("<div class='pagebox1'>"
							+ "<a href='javascript:;'>"
							+ "<img id='preview' src='/smartweb/destop/images/add_icon.png'>"
							+ "</a>"
							+ "</div>");
				for (var i = 0; i < urlList.length - 1; i++) {
					$("#appicon").append(
						"<div class='pagebox1'>"
								+ "<a  href='javascript:;'>"
								+ "<img src='/smartweb/destop/icon/appicon/"
								+ urlList[i]
								+ "'>"
								+ "</a>"
								+ "</div>");
				}
				$window1 = $(".apply_w");
				$window1.css("width", icon_count * 85);

				var lc1 = 0;
				var rc1 = icon_count - 4;

				$('.img_l').on('click', function() {
					if (lc1 < 1) {
						// alert("已经是第一张图片");
						return;
					}
					lc1 -= 4;
					rc1 += 4;
					$window1.animate({
						left : '+=340px'
					}, 600);// 左边移动动画
				});

				$('.img_r').on('click', function() {
					if (rc1 < 1) {
						// alert("已经是最后一张图片");
						return;
					}
					lc1 += 4;
					rc1 -= 4;
					$window1.animate({
						left : '-=340px'
					}, 600);// 右边移动动画
				});
			}
		});

		$("#uploadIconDialog").dialog({
			modal : true,
			minWidth : 420,
			minHeight : 230,
			dialogClass : "modal-dialog",
			show : "fadeIn"
		});
		
		// 点击弹窗关闭按钮事件
		$(".ui-dialog-titlebar-close").on("click", function() {
			$(".apply_w").css({
				'position' : 'absolute',
				'margin-top' : '4px',
				'width' : '1600px',
				'float' : 'left',
				'left' : '0px'
			});// 样式重置
			$(".apply_w").off(); // 释放内容页监听
			$('.img_l').off(); // 释放左移按钮监听
			$('.img_r').off(); // 释放右移按钮监听
		});
	});
	


	// 自定义app添加
	$('.addAppBox>a>img').on('click', function() {
		$('#add_name').attr('text', '')
		$('#add_url').attr('text', '')
		$("#addAppDialog").dialog({
			modal : true,
			minWidth : 440,
			minHeight : 200,
			dialogClass : "modal-dialog",
			show : "fadeIn"
		});
	});
});

// 文件上传事件
function upload() {
	var formData = new FormData($("#ff")[0]);
	$.ajax({
		url : '/smartweb/destop/upload/',
		type : 'POST',
		data : formData,
		async : false,
		contentType : false,
		processData : false,
		dataType : "json",
		success : function(resp) {

			if (resp == "0") {
				alert("请选择图标");
			} else {
				alert("上传图标成功");
			}
		},
		error : function(resp) {
			alert("上传图标失败");
		}
	});
}

// 浏览器对获取url支持函数
function getObjectURL(file) {
	// 支持不同浏览器获取路径
	var url = null;
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

// 加载用户配置
function loadCofig() {
	$.ajax({
		type : 'post',
		url : '/smartweb/destop/getUserConfig',
		datatype : 'json',
		success : function(resp) {
			
			if('none' == resp) return;
			for (var j = 0; j < resp.max.max1; j++) {
				var p = resp.configList[j].pagenumber;
				var functionId = resp.configList[j].functionId;
				var iconName = resp.configList[j].iconName;
				var iconUrl = resp.configList[j].iconUrl;
				var type = resp.configList[j].type;

				$('a[type="add"]').each(function() {
					if ($(this).attr('id') == functionId) {
						$(this).attr('class', "btn-del-s"); // 修改初始页面添加按钮状态
					}
				});
				$('.app-list>li>a>img').each(function() {
					if ($(this).attr('id') == functionId) {
						$(this).attr('src', iconUrl); // 修改初始页面图标
					}
				});

				$('.tabBodyItem>ul>li>a>span').each(function() {
					if ($(this).attr('id') == functionId) {
						$(this).text(iconName); // 修改初始页面App名称
					}
				});

				$('.tabBodyItem>ul>li>span').each(function() {
					if ($(this).attr('id') == functionId) {
						$(this).text(type); // 修改初始页面App描述
					}
				});
			}
		}
	});
}

function addFunction() {
	var dataArray = $(obj).attr('id').split('_');
	var observerType = parseInt(dataArray[0]);
	var moduleNumber = parseInt(dataArray[1]);

	var iconName = $('#add_name').val();
	var url = $('#add_url').val();
	var type = $('#add_type').val();
	var iconUrl = img_src;

	$.ajax({
		type : 'post',
		url : '/smartweb/destop/addFunction',
		data : {
			observerType : observerType,
			moduleNumber : moduleNumber,
			iconName : iconName,
			url : url,
			iconUrl : iconUrl,
			type : type
		},
		dataType : 'text',
		success : function(resp) {
			console.info(resp);
			if (resp == "0") {
				alert("你还没有登录！")
			} else {
				alert("保存成功")
				loadCofig();
				window.parent.frames.refresh();// 更新destop页面

			}
		}
	});

}

// 自定义设置提交事件
function uploadAttr() {
	var functionId = parseInt($(obj).attr('id'));
	var iconName = $('.input_iconName').val();
	var type = $('.input_type').val();
	var pagenumber = parseInt($('#destopMyPages').val());
	var iconUrl = $('.iconCurrent>a>img').attr('src');
	if (iconName && type && pagenumber && iconUrl) {
		$.ajax({
			type : 'post',
			url : '/smartweb/destop/updateConfig',
			data : {
				functionId : functionId,
				iconName : iconName,
				type : type,
				pagenumber : pagenumber,
				iconUrl : iconUrl
			},
			success : function(resp) {
				if (resp == 0) {
					alert("修改失败！");
				} else {
					loadCofig();
					window.parent.frames.refresh();// 更新destop页面
				}
			}
		});
	} else {
		alert("请填写完整修改内容");
	}
}