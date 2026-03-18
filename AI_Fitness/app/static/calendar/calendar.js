(function($){

$.scheduleCalendar=function(opt){
$("#mask").remove();   // 🔥 先销毁旧的弹框实例
$(".menu").remove();  // 🔥 清理右键菜单

let cfg=$.extend({
  data:{}, // 初始化数据 { '2025-12-01':'会议' }
  onSave:function(data){}
},opt);

let base=new Date(),view="month",data=$.extend({},cfg.data),dirty={},sel=[],drag=false;

$("body").append(`
<div id="mask"><div class="cal-box">
<div class="top">
 <div class="header">
  <div>
   <button class="prev">&lt;</button>
   <button class="today">今天</button>
   <button class="next">&gt;</button>
  </div>
  <span class="title"></span>
  <div>
   <button class="mview">月</button>
   <button class="wview">周</button>
  </div>
 </div>
 <div class="week"><div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div></div>
</div>
<div class="body"></div>
<div class="footer">
 <button class="save">确认保存</button>
 <button class="close">关闭</button>
</div>
</div></div>`);

function pad(n){return n<10?"0"+n:n}
function fmt(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}

function render(){
let html="",y=base.getFullYear(),m=base.getMonth();
$(".title").text(y+"年"+(m+1)+"月");

if(view=="month"){
 let first=new Date(y,m,1).getDay();
 let days=new Date(y,m+1,0).getDate();
 for(let i=0;i<first;i++)html+="<div></div>";
 for(let d=1;d<=days;d++){
  let k=y+"-"+pad(m+1)+"-"+pad(d);
  let v=dirty[k]??data[k]??"";
  html+=cell(k,d,v);
 }
}else{
 let start=new Date(base);start.setDate(start.getDate()-start.getDay());
 for(let i=0;i<7;i++){
  let d=new Date(start);d.setDate(start.getDate()+i);
  let k=fmt(d);
  let v=dirty[k]??data[k]??"";
  html+=cell(k,d.getDate(),v);
 }
}
$(".body").html(html);
}
function cell(k,d,v){
 return `<div class="day ${dirty[k]?'dirty':''}" data-date="${k}">
 <div class="date">${d}</div><div class="edit">✏</div><div class="content">${v}</div></div>`;
}

render();$("#mask").show();

/* 视图切换 */
$(".mview").click(()=>{view="month";render();});
$(".wview").click(()=>{view="week";render();});
$(".prev").click(()=>{base.setMonth(base.getMonth()-1);render();});
$(".next").click(()=>{base.setMonth(base.getMonth()+1);render();});

/* 编辑 */
$(".body").on("click",".edit",function(){
 let d=$(this).closest(".day"),k=d.data("date"),v=dirty[k]??data[k]??"";
 d.find(".content").html(`<textarea>${v}</textarea>`).find("textarea").focus().blur(function(){
  dirty[k]=$(this).val();d.addClass("dirty");d.find(".content").text($(this).val());
 });
});

/* 多选 */
$(".body").on("mousedown",".day",e=>{
 if(e.which!=1)return;
 drag=true;sel=[];$(".day").removeClass("selected");pick($(e.currentTarget));
}).on("mouseenter",".day",e=>{if(drag)pick($(e.currentTarget));});
$(document).mouseup(()=>drag=false);
function pick(d){let k=d.data("date");if(!sel.includes(k)){sel.push(k);d.addClass("selected");}}

/* 右键 */
$(".body").on("contextmenu",".day.selected",e=>{
 e.preventDefault();
 $(".menu").remove();
 $("body").append(`<div class="menu" style="left:${e.pageX}px;top:${e.pageY}px">
 <div class="batch">批量填写</div></div>`);
});
$("body").on("click",".batch",()=>{
 let v=prompt("输入内容");if(!v)return;
 sel.forEach(k=>dirty[k]=v);render();$(".menu").remove();
});

/* 保存 */
$(".save").click(()=>{
 if(!sel.length){alert("请先选择日期");return;}
 let name=prompt("请输入整体计划名称");if(!name)return;
 let list=sel.join(",");
 if(!confirm("计划："+name+"\n日期："+list+"\n确认保存？"))return;
 sel.forEach(k=>data[k]=dirty[k]);
 dirty={};sel=[];
 cfg.onSave({name,dates:list,data});
 render();
});

$(".close").click(()=>$("#mask").remove());
};

})(jQuery);