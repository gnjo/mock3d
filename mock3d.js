//exportにはしない。
/*history
r010 pack
r011 order.islightSmall

*/

//;(function (root){

////////////////////////////////////
var scene,renderer,camera,light,loader,grid,mover,boxsize=10,abort=0
,ww=16*40,hh=9*40
,V3=THREE.Vector3,mover=new Mover(boxsize,new V3(0)),mm=new Mesher(boxsize)
,npc,floors=[]
,pm
,mock3d
;
mover.wait=100;
mover.split=32;
//,smokes=new Smokes()
/*
var url="https://gnjo.github.io/fatema/smoke.png"
,color='#00ddff',widesize=window.innerWidth,mass=160
,smokes =new Smokes(url,color,widesize,mass)
//scene.add(smokes.smokes)
//... requestAnimationFrame(animate),smokes.update()///
*/
///////////////////////////////////
scene = new THREE.Scene();
//scene.fog = new THREE.Fog(0x00ff00, 100,100*2);//
renderer = new THREE.WebGLRenderer({antialias: true,canvas:gameCanvas(ww,hh)});
renderer.setClearColor(0x000000,1)
//renderer.setSize(ww,hh)
renderer.setPixelRatio(1);
pm=planes2d(renderer) //2d canvas
//45ぐらいが人間だが、背後から見ている方が酔いにくい。よって75。
camera = new THREE.PerspectiveCamera( 75,ww/hh, 1, boxsize*4 );
//0xddeeff //暗闇において、生体視野は、赤の減衰が多い、緑は中間、青は減衰しにくい。
light = new THREE.SpotLight( 0xddeeff,2.0,boxsize*3,4);
//light.near=0.1
scene.add( light );

npc=new THREE.Mesh(
 new THREE.PlaneBufferGeometry(boxsize*0.7,boxsize*0.7,16,16)
 ,new THREE.MeshPhongMaterial({map: void 0,visible:true,transparent:true,side:THREE.DoubleSide
                              }) )//Lambert
npc.visible=false
scene.add(npc)


///////////////////////////////////
mover.mover.visible=false;
mover.add(camera,new V3(0,-0.1,-boxsize*0.49))
//mover.add(light,new V3(0,boxsize*0.1,-boxsize*0.49))
//天井にライトを当てることはない。上から床に。
mover.add(light,new V3(0,boxsize*0.3,-boxsize*0.49))
mover.add(npc,new V3(0,-boxsize*(0.3/2),boxsize*0.2 )) //npc
;
scene.add(mover.mover)
scene.add(mover.grid)
mover.grid.visible=false

mover.movecheck=function(ch,o){
 // console.log(o.getp())
 return true;//move ok// if dont move, return false
}


function animate(){
 if(abort)return;
 requestAnimationFrame(animate)
  ,renderer.clear(),renderer.render(scene, camera),update()
}
//function update(){}
function update(){try{
 //scene.fog.near=count2*100
 //role the icon
 roleicon()
 mover.chase()
 pm.update2d()
 //smokes.update()

}catch(e){abort=1,console.error(e)}
                 }
function roleicon(){
 let a=scene.children.filter(d=>/^F/.test(d.name)).map(d=>d.children)
 if(a.length===0)return 
 a.pop().filter(d=>d.name==='icon').map(d=>d.rotation.y+=0.075) 
}

//loader=new THREE.TextureLoader()
///////////////////////////////////
//order control target over the 100
var order={}
order.lightOn=order.lighton=()=>{light.intensity=2.0;light.visible=true}
order.lightSmall=order.lightsmall=()=>{light.intensity=0.5;light.visible=true}
order.lightOff=order.lightoff=()=>{light.visible=false}
order.islightSmall=order.islightsmall=()=>{return light.intensity===0.5}
order.iconOn=order.iconon=()=>{ 
 let a=scene.children.filter(d=>/^F/.test(d.name)).map(d=>d.children)
 if(a.length===0)return 
 let children=a.pop()
 children.filter(d=>d.name==='icon').map(d=>d.visible=true)
}
order.iconOff=order.iconoff=()=>{
 let a=scene.children.filter(d=>/^F/.test(d.name)).map(d=>d.children)
 if(a.length===0)return 
 let children=a.pop()
 children.filter(d=>d.name==='icon').map(d=>d.visible=false)
}
order.npcOn=order.npcon=(url,n,size)=>{
 order.lightsmall();
 if(!url)return npc.visible=true
 npc.material.map =tex(url,n,size),npc.material.needsUpdate=true
 npc.visible=true;
}
order.npcOff=order.npcoff=()=>{
 npc.visible=false;
 order.lighton();
}
order.enterFloor=order.enterfloor=(num)=>{
 num=num||'F00'
 let floors=mock3d.floors
 let s=(/^F/.test(num))?num: 'F'+('00'+num).slice(-2)
 ;
 if(scene.children.filter(d=>d.name===s).length)return;
 console.log(s);
 floors.map(d=>{
  return (d.name===s)?d:scene.remove(d),d  
 }).map(d=>{if(d.name===s)scene.add(d) })
}

/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
/////////////////////////////////////
mock3d={}
mock3d.SAVE={}
mock3d.TEMP={}
mock3d.UI={}
mock3d.floors=[]
mock3d.addFloor=(str)=>{
 let mo=mock3d,time=performance.now()
 let xx=new FloorMaker(str,boxsize)
 mo.floors.push(xx.build())
 let maketime=(performance.now() - time)
 console.log( maketime.toFixed(1)+'ms' )
 //order.enterfloor(0)
 //console.log(xx)
 return mock3d
}
mock3d.addEvent=(key,caller)=>{
 console.log(key)
 caller(mock3d);
}
mock3d.order=order
mock3d.addView=pm.add
mock3d.addMacro=gob.add
mock3d.mode=pm.mode
mock3d.run=(debug)=>{
 pm.mode('default')
 if(debug) mover.grid.visible=true
 animate()
}

//  root.mock3d=mock3d
//})(this);

