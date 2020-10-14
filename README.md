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
//使い方はソースに。

gob
.add(text1)
.add(text2)
.add(text3)
.done('#start') //startaddr

//ジャンプとジャンプラベル
#aaaa //ジャンプラベル
k>
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

```
