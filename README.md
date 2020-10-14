### mock3d.js

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

### gob.js
```
//gob.js
//goblin macro
//使い方はソースに。
//ジャンプバックの仕方

gob
.add(`
#start
w>100
{1}>>>#aaa
$wk=console.log('back')
k>
{1}>>>#start

#aaa
$00=1
$addr=gob.jumpback
#aaa.loop
$00+=1
$wk=console.log($00)
{$00===100}>>>{$addr}
w>10
{1}>>>#aaa.loop

`)
.done('#start') //startaddr

```
