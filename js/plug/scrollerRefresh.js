/*将查询结果添加到页面*/
function fenyeAddData(data,param,divId,pageable){
	var ul="#"+divId+"List ul";
	var li="";
	var showFields=param.Showfields.split(",");
    $.each(data.list,function(i,ele){
        //wangsir  2015-12-23  周二 添加点击选择产品名称 、规格、钢号、来料单位等回调函数
        if(param.options){
            ele.dataTkey=param.options.dataTkey;
            ele.filedName=param.options.filedName;
        }
        //end of wangsir
        li= document.createElement("li");
        li.setAttribute("data",JSON.stringify(ele));
        for(var x=0;x<showFields.length;x++){
            li.innerHTML+=translateFieldValue(x,ele,showFields[x]);
        }
        $(ul).append(li);
        $(li).bind("tap",function(){
//              setTimeout(function(){$.ui.loadContent(param.parentpage,false,true,'slide');},50); 
            $.ui.loadContent(param.parentpage,false,true,'slide');
            eval(param.callback).call(this,this);
        });
        if((!pageable&&i==data.list.length-1)||(pageable&&i==data.list.length-1&&data.list.length<20)){
            if($("#"+divId+"List ul").length>0){
                $("#"+divId+"List ul").append("<li class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</li>");
            }else{
                $("#"+divId+"List").prepend("<p class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</p>");
            }
        }
    });
}
//panel第一次加载数据时
function fenye(divId,url){
	$("#"+divId).scroller().addInfinite();
    $("#"+divId).scroller().addPullToRefresh();
    $("#"+divId).scroller().runCB=true;
//  /*下拉触发的事件*/
//  $.bind($("#"+divId).scroller(), "refresh-release", function () {
//  	var that = this;
//      setTimeout(function () {
//          that.hideRefresh();
//      }, 500);
//      return false;
//  });
    $("#"+divId).scroller().enable();
    var flagScroller=true;//解决同一页可能多次请求数据的问题
    $.bind($("#"+divId).scroller(), "infinite-scroll", function () {
        var self = this;
//      if($("#"+divId+"List ul").find("#infinite").length==0){//解决出现多次“加载更多...”的问题
//      	$("#"+divId+"List ul").append("<li id='infinite' style='height: 60px; text-align: center; line-height: 60px;'>继续拖，加载更多...</li>");
//      }
        /*上拉触发的事件*/
        $.bind($("#"+divId).scroller(), "infinite-scroll-end", function () {
            $.unbind($("#"+divId).scroller(), "infinite-scroll-end");
//          $("#"+divId+"List ul").find("#infinite").remove();
            if(!flagScroller) return;
            flagScroller=false;
            /*请求服务器数据*/			
			var param = $.parseJSON($("#"+divId+"Param").val());/*每次触发都请求一次param*/
			param.filter.page=parseInt($("#"+divId+"Page").val());
			//先判断是否是最后一条数据
			var lastText = $("#"+divId+"List .lastPageText").text();
			if(lastText!="后面没有数据了"){
	            $.post(webContent.rootUrl+url,$.param(param.filter),function(data){
	                $.ui.hideMask();
	                if(data.hasOwnProperty("failed")){
	                    $.ui.popup(data.failed.message);
	                }else{
	                    if($("#"+divId+"List ul").find("li").length!=0 && param.filter.page==1){
                            
                        }else{
                            if(data.list.length>0){
                                if(param.addFunctionName){
                                    eval(param.addFunctionName).call(this,data,param,divId,true);
                                }else{
                                    fenyeAddData(data,param,divId,true);
                                }
                                $("#"+divId+"Page").val( parseInt($("#"+divId+"Page").val())+1 );
                            }else if(data.list.length==0){
                                if($("#"+divId+"List ul").length>0){
                                    $("#"+divId+"List ul").append("<li class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</li>");
                                }else{
                                    $("#"+divId+"List").prepend("<p class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</p>");
                                }
                            }
                        }
	                }
					flagScroller=true;
					self.clearInfinite();
				},"json");
			}else{
				flagScroller=true;
				self.clearInfinite();
			}
        });
    });
}
function loadselectFenye(param,divId,url){
    //判断是否分页
    var key=divId.substring(6,divId.length);
    var pageable=(webContent[key]?(webContent[key].hasOwnProperty("basedatapageable")?webContent[key].basedatapageable:false):true);
    if(!pageable){//不分页
        $.post(webContent.rootUrl+url, $.param(param.filter), function(data){
            $.ui.hideMask();
            if(data.hasOwnProperty("failed")){
                $.ui.popup(data.failed.message);
            }else{
                if(data.list.length>0){
                    if(param.addFunctionName){
                        eval(param.addFunctionName).call(this,data,param,divId,pageable);
                    }else{
                        fenyeAddData(data,param,divId,pageable);
                    }
                }else{
                    if($("#"+divId+"List ul").length>0){
                        $("#"+divId+"List ul").empty();
                        $("#"+divId+"List ul").prepend("<li class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</li>");
                    }else{
                        $("#"+divId+"List").empty();
                        $("#"+divId+"List").prepend("<p class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</p>");
                    }
                    if(divId=="productinventory"){
                        $("#productinventory #productinventorySum").html("");
                    }
                }
            }
        },"json");
    }else{//分页
        if(!$("#"+divId).scroller().infinite){//$("#"+divId).scroller()还未绑定事件，即第一次绑定数据
            fenye(divId,url);
        }
        $.post(webContent.rootUrl+url,$.param(param.filter),function(data){
            $.ui.hideMask();
            if(data.hasOwnProperty("failed")){
                $.ui.popup(data.failed.message);
            }else{
                if(data.list.length>0){
                    if(param.addFunctionName){
//                      functionName(data,param,divId,true);
                        eval(param.addFunctionName).call(this,data,param,divId,pageable);
                    }else{
                        fenyeAddData(data,param,divId,pageable);
                    }
                    $("#"+divId+"Page").val( parseInt($("#"+divId+"Page").val())+1 );
                }else{
                    if($("#"+divId+"List ul").length>0){
                        $("#"+divId+"List ul").empty();
                        $("#"+divId+"List ul").prepend("<li class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</li>");
                    }else{
                        $("#"+divId+"List").empty();
                        $("#"+divId+"List").prepend("<p class='lastPageText' style='font-weight:bold; text-align:center;'>后面没有数据了</p>");
                    }
                    
                    if(divId=="productinventory"){
                        $("#productinventory #productinventorySum").html("");
                    }
                }
            }
        },"json");
    }//end of else分页
}
