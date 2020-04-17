//========================================
init();
//========================================
function init(){
	layui.use('form', function() {
		form = layui.form;
		layer = layui.layer;
		load();
	});
}

function load(){
	var userInfo = JSON.parse(localStorage.getItem("adminInfo"));
	const LOCAL_ADDRESS = config.elevatorBackUrl;
	
	// 表格对应列
	var col = [[
		//{type: 'checkbox', fixed: 'left'},
		{field: 'id', title: '序号', type:"numbers", width:80},
		{field: 'record', title: '培训记录'},
		{field: 'participantNumber', title: '参与人数'},
		{field: 'trainingDate', title: '培训时间'},
		{fixed: 'right', title: '操作', width: 140, align: 'center', toolbar: '#barDemo'}
	]];
	
	//JavaScript代码区域
	layui.use(['layer', 'table'], function() {
		var layer = layui.layer, 
			table = layui.table;
			
		// 执行一个 table 实例
		var tableIns = table.render({
			elem: '#demo',
			height: 'full-125',
			url: LOCAL_ADDRESS+'safetyTraining/getSafetyTrainingListByCompanyId?companyId='+userInfo.company.id, 
			title: '培训记录表',
			totalRow: true, 
			cols: col,
			page: true, 
			limits: [10,15,20,30,60],
			limit: 15,
			request: {pageName: 'page',} 
		});
		
		//【添加】
		$('#btn-add').on('click', function () {
            add();
        });
		
		//【重载】
		$('#btn-refresh').on('click', function () {
            tableIns.reload({page: {curr: 1} });
        });
		
		//监听行工具事件
		table.on('tool(test)', function(obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
			var data = obj.data, //获得当前行数据
				layEvent = obj.event; //获得 lay-event 对应的值
			if(layEvent === 'del') {
				remove(tableIns, obj.data);
			} else if(layEvent === 'edit') {
				edit(obj.data);
			}
		});
	});
	
	// 【添加】
	function add(data){
		layer.open({
            type: 2,
            title: '添加安全培训',
            maxmin: true,
            area: [780 + 'px', 500 + 'px'],
            shadeClose: false, //点击遮罩关闭
            content: 'safetytraining-add.html',
        });
	}
	// 【编辑】
	function edit(data){
		layer.open({
			title: '编辑安全培训信息',
			type: 2,
			closeBtn: 1, 
			shade: 0.2,
			anim: 0,
			content: 'safetytraining-mod.html?id=' + data.id,
			area: [750 + 'px', 500 + 'px']
		});
	}
	// 【删除】
	function remove(tableIns, data){
		var url = config.elevatorBackUrl + 'safetyTraining/removeSafetyTraining?id='+data.id;
		layer.confirm('真的删除所选内容么？', function(index) {
			$.get(url,{},function(result){
				//console.log(result)
				if(result.code == 0){
					layer.alert("删除成功！", {title: '提示信息：'}, function(index){
						layer.close(index);
						tableIns.reload();
					})
				}else{
					layer.alert(result.errMsg, {
						title: '提示信息：'
					})	
				}
			});
										
		});
	}
	
	
}