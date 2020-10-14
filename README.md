# mock3d

```
//mock3d is singleton

mock3d
.addFloor('')
.addEvent('ア',(mo)=>{
 //init
 var order=mo.order,SAVE=mo.SAVE,TEMP=mo.TEMP
 mo.addView('xyz',(ctx,o)=>{
 })
 mo.addMacro(``)

))
.load(jsonString,'json')

mock3d.save() //return {}
mock3d.save('json') //return jsonString


```

```
//gob.js
//goblin macro

gob
.add(text1)
.add(text2)
.add(text3)
.done('#start') //startaddr



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

```
