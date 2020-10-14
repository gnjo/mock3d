### history
```
r001 coded labで簡易にランダム生成する。
r010 coded mock3d.addFloor('')で構築するまで
r011 coded 壁は抜けてもいい。マクロで動かす。
r012 coding Bボタンで背景を暗くする。切り替える。

r020 coding mock3d.addEvent('')で2dと連携する。
r021 coding タイトルを作る
r022 coding 拠点をつくり、タイトルと拠点の移動
r023 coding 簡単な画面をつくり、迷宮侵入と拠点へ戻るを行う。

r030 coding 2dマップの表示。
r040 coding 壁や移動禁止の整理
r041 coding フロアを二つ作る。
r042 coding 移動の整理、鍵の持ち方。

```

### build image
```
script(src="https://gnjo.github.io/mock3d/gob.js")
script(src="https://gnjo.github.io/mock3d/mock3d.js")
script(src=".../F00.js")
script(src=".../F01.js")
//main.js

var mo=mock3d
gob.add(`
#start
$wk=mock3d.run()
{1}>>>#title
`)
```

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
