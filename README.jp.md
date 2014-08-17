#syncton-node
syncton-nodeは、callbackが多様されるnode.jsプログラムを、
できるだけ簡単に同期化するためのモジュールです。

##Quick Start
###使い方1
次のような状況を考えます。

- B()はA()の後に実行しなければならない
- C()はB()の後に実行しなければならない

この条件を満たすコードを以下に示します。

```javascript
var syncton = require('syncton-node').create();

syncton.todo(A);
syncton.todo(B);
tyncton.todo(C);
```

非常に簡単です。但し、各関数の終了時にsyncton.finish()を呼びだす必要があります。
各関数の例を下に示します。

```javascript
function A() {
  var syncton = this;
  console.log('A started.');
  setTimeout(function() {
    console.log('A finished.');
    syncton.finish();
  },1000)
}
function B() {
  var syncton = this;
  console.log('B started.');
  setTimeout(function() {
    console.log('B finished.');
    syncton.finish();
  },500)
}
function C() {
var syncton = this;
  console.log('C started.');
  setTimeout(function() {
    console.log('C finished.');
    syncton.finish();
  },100)
}
```

実行結果
```bash
A started.
B started.
B finished.
A finished.
C started.
C finished.
```


###使い方２
- C()はA()の後に実行しなければならない
- C()はB()の後に実行しなければならない
- A(),B()は、非同期に実行したい

この条件を満たすコードを以下に示します。

```javascript
var syncton = require('syncton-node').create();

syncton.todoAsync(A);
syncton.todoAsync(B);
syncton.todo(C);
```

##Synctonオブジェクトのメンバ関数
外部から使用する関数は次の２個だけです。

- todo()
- todoAsync()

### todo()

### todoAsync()
