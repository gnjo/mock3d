
/*history
v0.1 make
v0.2 keycall to inp.lib.js
v0.3 trim2 big space is not
v0.4 $$$ EVM only
v0.5 disable create variable
v0.9 speedup
v1.0 jumpback issue 
v1.1 PJS pure javascript {{{js ...}}}
v1.2 logger
v1.3 empty error
v1.4 gob.getkey() 
v2.0 polling
k>
w>
p>
//dev
https://codepen.io/gnjo/pen/JjKYxOa?editors=0010
*/
const CR="\n",HIDE=void 0
var vlib={}
/*
;(function(root){
 var fps=60,ms=50,count=0,callary=[],running=false,stopflg=false,cl=void 0
 ;
 function loop() {
  callary.map(f=>f(count))
  if(stopflg)return clearTimeout(cl)
  return cl=setTimeout(()=>{return ++count,requestAnimationFrame(loop)},ms)
 }
 function entry(_fps,_caller){
  if(_caller) callary.push(_caller)
  if(running)return console.log('already running')
  return fps=_fps||60,ms=1000/fps,loop()
 }
 function getcount(){return count}
 function fpsclear(debugmes){return stopflg=true,console.log(debugmes,'fpsclear')}
 ;
 root.fps=entry
 root.fpsclear=fpsclear
 root.getcount=getcount
})(this); 
*/
/////////////////////////////////////////
;(function(root){
  //MRK JMP FNC EVM EVL  
 let ma={
  group:/#.*|{.*}>>>(#.*|{.*}|\d.*)|([\w\d].*)>.*|{{{js([\s\S]*?)}}}|{{{([\s\S]*?)}}}|\$.*=.*/g
  ,trim:/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm
  ,types:'MRK,JMP,PJS,EVM,FNC,EVL,CMM'.split(',')
  ,MRK:/^#.*/
  ,JMP:/^{.*}>>>(#.*|{.*}|\d.*)/ //jump
  ,EVL:/^\$.*=.*/ //eval javascript
  ,PJS:/^{{{js([\s\S]*?)}}}/
  ,EVM:/^{{{([\s\S]*?)}}}/ //eval message
  ,FNC:/^([\w\d].*)>.*/
  ,CMM:/^.*/
 }
 function lexs(text,offset){
  let oi=offset||0,jumps={}
  let lists=text.replace(ma.trim,'')/*.replace(ma.trim2,'')*/.match(ma.group)  //v1.5 %{{{}}} cut
  .map((d,i)=>{
   let type='CMM';
   for(type of ma.types)
    if(ma[type].test(d))break;
   if(type==='MRK') jumps[d]=i+oi
   return {str:d,type:type,line:i+oi}
  })
  return {jumps:jumps,lists:lists}
 }
 ;
 root.lexs=lexs
})(this);
/////////////////////////////////////////
;(function(root){
 let lexs=root.lexs
 function entry(){
  let o={}
  o.lists=[], o.jumps={}, o.line=0, o.block=0, o.end=0, o.lexs=lexs
  ;
  o.add=(text)=>{
   let x=o.lexs(text,o.lists.length)
   o.lists=o.lists.concat(x.lists)
   o.jumps=Object.assign(o.jumps,x.jumps)
   return o;
  }
  ;
  o.get=()=>{
   let s=o.block?void 0:o.lists[o.line]
   if(s) o.block=1;
   return s;
  }
  o.next=(d)=>{
   ;(d!=null)?o.line=d:o.line++;
   o.end=(o.lists.length-1<o.line)?1:0;
   return o.block=0
  }
  o.reload=(_list)=>{
   return o.block=1,o.line=999999,o.lists=_list||[],o.line=0,o.block=0;
  }
  o.isend=()=>{return o.end}
  o.isEnd=o.isend
  return o;
 }
 root.reader=entry;
})(this);
;(function(root){
 
 String.prototype.trim2 = function () { //big space is not
   return this.replace(/^[ \r\n\t\uFEFF\xA0]+|[ \t\r\n\uFEFF\xA0]+$/g, '');
 }; 
 //comment trim 
 function _c(d){return d.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,'')}
 //eval
 //special
 function f(a){return a.replace(/\$[\$\w]+/g,d=>`gob.v["${d}"]`)}
 function _(obj){return Function(`return (${f(obj)}) `)()}
 function _e(obj){return eval(obj)}
 function _e2(obj){return eval(f(obj))}
 //message rep
 function _m(obj){return obj.replace(/{(.*?)}/g,(d,dd)=>{return _(dd)}) }
 //trim { and }
 function _t(obj){return obj.replace(/{|}/g,'')} 
 function _t2(obj){return obj.replace(/{{{|}}}/g,'').trim2()/*.trim()*/}
 function _t3(obj){return obj.replace(/{{{js|}}}/g,'').trim2()/*.trim()*/} //v1.1

 root._c=_c
 root._=_
 root._e=_e
 root._e2=_e2
 root._m=_m
 root._t=_t
 root._t2=_t2 
 root._t3=_t3
})(this);
//////////////////////////////////////////////
;(function(root){
  //MRK JMP FNC EVM EVL 
 let vlib=root.vlib 
 vlib.CMM=(str,o)=>{return o.next()}
 vlib.EVL=(str,o)=>{return /*o.v['$$$'] =*/ _(_t(str)),o.next()} //v0.4
 vlib.PJS=(str,o)=>{return /*o.v['$$$'] =*/ _e2(_t3(str)),o.next()} //v1.1 //v1.5 _e> _e2
 
 vlib.EVM=(str,o)=>{return o.v['$$$'] =_m(_t2(str)),o.next()}
 vlib.JMP=(str,o)=>{
  let a=str.split('>>>'),addr=_m(a[1]),i=/^\d+$/.test(addr)?parseInt(addr):o.search(addr) //v1.0 parseInt
  //console.log(a)
  if(o.v['$MRK']!=addr)o.setjumpback() //v0.9
  let flg = _(_t(a[0]));
  //console.log(flg,_t(a[0]),a[0])
  //$$$ =flg;
  //console.log('!jump!',i)
  if(!flg || i==void 0)return o.next()
  else return o.v['$JMP']=i,o.next(i)
 }
 vlib.MRK=(str,o)=>{
  //o.v['$$$'] = o.line//////// v0.4
  o.v['$MRK'] =str;//v0.9
  //console.log(o.v,str)
  let n=o.v['$$f'][str]
  if(n||n===0) o.v['$$f'][str]=n+1
  return o.next();
 }
 vlib.FNC=(str,o)=>{
  let a=str.split('>'),cmd=a[0],_str=a[1]
  if(!vlib[cmd])return vlib.CMM(str,o),console.log('vlib cmd not found',cmd)
  //
  //if(o.v['$'+cmd]===undefined) o.v['$'+cmd]=void 0 //create valiable
  return vlib[cmd](_str,o) //call next() is top function
 }
 root.vlib=vlib
})(this);
//////////////////////////////////  
;(function(root){
 let vlib=root.vlib,fps=root.fps
  ;
  let o=reader();
  o.keyset='w,a,s,d,j,k,i,l,u,o'
  o._fps=200 //speedup
  o.v={}
  o.caller
  o.cmds
  o.jumpback=0
  o.debug=''  //debug
  o.setjumpback=()=>{return o.jumpback=o.line+1}  //v0.9
  o.search=(d)=>{return (d==='###')?o.jumpback:o.jumps[d]}
  o.getkey=()=>{return o.v['$k']} //v1.4
  o.makefootstep=()=>{
   //v1.0 if footstep input like a save, $$f is exist.
   if(!o.v['$$f'])o.v['$$f']={},Object.keys(o.jumps).map(k=>o.v['$$f'][k]=0);
  }
  o.cmd=(list)=>{//{str,type,line}
   o.debug=list.str
   return (o.cmds[list.type]||o.cmds['CMM'])(list.str,o)
  }
  o.lop=()=>{
   if(o.isend())return console.log('endline') /////
   //$$l=o.line //v0.9
   let list=o.get();
   if(list) o.v['$$l']=o.line,o.cmd(list),o.lop() //speedup
   else setTimeout(o.lop,1000/o._fps) //sppedup
   //if(list&&debugflg)console.log(list)
  }
  /*
  o.run= function entry(text,userlib,caller,_fps){
   o.caller=caller||function(o,k,v){return}
   o.cmds=Object.assign(vlib,userlib)   
   let isstring = function(obj){return toString.call(obj) === '[object String]'}
   if(text) isstring(text)?o.add(text):text.map(d=>o.add(d))//v1.0 multi text //empty issue
   o.makefootstep()//v1.0
   //if(debugflg)console.log(o.lists)
   //console.log(o.v['$$f'])
   o.v=new Proxy(o.v,{ set:(oo,k,v)=>{return o.caller(oo,k,v),oo[k]=v } })   
   //fps(o._fps,o.lop) //speedup
   o._fps=_fps||o._fps
   o.lop()// speedup
   return o;
  }
  */
  o.addMacro=o.addr //meaning
  o.done=function entry(addr){
   o.cmds=vlib   
   o.line=o.search(addr||'')||0
   o.makefootstep()
   o.lop()
   return o;
  } 
  o.run=o.done
  ;
 root.gob=o;
})(this);


;(function(root){ 
  var keys={}
function keyconfig(str){
 //$keyconf={37:'<',39:'>',38:'^',40:'v',70:'A',68:'B',65:'X',83:'Y',82:'R',69:'L'}
 let t="^,<,v,>,A,B,X,Y,L,R".split(',')
 ,k=str.split(',').map(d=>(d.length>1)?d:d.toUpperCase().charCodeAt(0))
  k.map((d,i)=>{ keys[d]=t[i] })
 return keys
}
function keycall(caller){
 let el=document.documentElement,del=()=>{el.onkeydown=void 0}
 //caller(k,del) //if use end, need the del()
 el.onkeydown=function(ev){ if(keys[ev.which])caller(keys[ev.which],del) }
}
/*keycall((k,del)=>{
 fn.q('pre').textContent=k
 if(k==='X')del();
})*/
 keyconfig('w,a,s,d,j,k,i,l,u,o');//initialize
 root.keyconfig=keyconfig
 root.keycall=keycall
})(this); 

;(function(root){
  let vlib=root.vlib||{}
  vlib.k=(str,o)=>{
  o.v['$k']=void 0  //easy picking
  keycall((k,del)=>{ 
   if(k) o.v['$k']=k,del(),o.next(); 
   //if(k) root.$k=o.v['$k']=k,del(),o.next(); //easy picking
  })
  return;
 }
 vlib.wait=(str,o)=>{ 
 setTimeout(()=>{o.next()},o.v['$wait']=parseInt(str))
 }  
 vlib.w=vlib.wait//
 
 vlib.p=function pooling(str,o){
  //p//
  let caller=_e('()=>'+_t(str))
  ,time=3
  ;
  console.log(caller)
  lop()
  function lop(){ 
   setTimeout(()=>caller()?o.next():lop(),time) 
  }
}
 
 root.vlib=vlib
})(this);

;(function(root){
let fn={}
 fn.toSmall=(str)=>{
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
   return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }) 
 }
 fn.toBig=(str)=>{
  return str.replace(/[A-Za-z0-9]/g, function(s) {
   return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
 }
 root.toSmall=fn.toSmall;
 root.toBig=fn.toBig
})(this);

;(function(root){
 function entry(){
  var o={}
  ;
  o.max=100,o.buf=[],o.log=[];
  o.add=(str)=>{if(str!=void 0)return str.split('\n').map(d=>o.buf.push(d))}
  o.push=o.add
  o.isempty=()=>{return o.buf.length===0}
  o.get=(line)=>{
   let a=o.buf.shift(),l=line||1
   if(a!=void 0) o.log.push(a)
   else o.log=o.log.slice(-1*o.max)
   return o.log.slice(-1*l).join('\n')
  }
  return o;
 }
 root.logger=entry
})(this);

/*
gob.add(`
#aaa
$wk=console.log('#aaa')
k>
{1}>>>#aaa
`).add(`
#bbb
$wk=console.log('#bbb')
k>
{1}>>>#aaa
`).done('#bbb')


//ジャンプとジャンプラベル
#aaaa //ジャンプラベル
k>
{$k==='A'}>>>#start //$kがAボタンなら。ここのAはコントローラで、実際はjを指す。
{1}>>>#aaaa //{条件式}がtrueならジャンプする。これはループ。

//行数を指定してジャンプ
#bbbb
k>
{1}>>>{100} //100行目へ。実質的にはジャンプバックで使う。

//格納してジャンプ
#cccc
$xx='#start'
k>
{1}>>>{$xx} //$xxは解釈される。#start

//一行スクリプト
$wk=console.log('aa') //先頭は$で始まらなければ有効にならない。

//複数行スクリプト
{{{js  //{{{js で始める。
 console.log('javascript world')
}}} //終わりを示さなければ、有効にならない。

//複数行の文字列
{{{
一行目
二行目
三行目
}}}
$wk=console.log($$$) //$$$に格納される。

//ジャンプバックの仕方
#start

k>
{1}>>>#aaa
$wk=console.log('back')
{1}>>>#start

#aaa
$00=0
$addr=gob.jumpback //ジャンプしたライン行を退避
#aaa.loop
$00+=1
{$00===100}>>>{$addr} //退避させたライン行へ
w>10
$wk=console.log($00)
{1}>>>#aaa.loop

//ポーリング
#start
p>val===1 //valが1になるまで待機。指定の値にならなければ、フリーズする。
$wk=console.log('polling end',val)
w>
{1}>>>#start

*/
