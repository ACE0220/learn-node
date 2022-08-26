const fs = require('fs');

/**
 * 采用高阶函数处理并发问题，但是只知道最终要做什么
 */
let arr = [];
function after(times, callback, index) {
    let arr = []; 
    return (data, index) => {
        arr[index] = data; // 保证顺序 采用索引
        if(--times === 0) { // 多个请求并发 需要靠计数器
            callback(arr);
        }
    }
}

let out = after(2, (arr) => {
    console.log(arr)
})


fs.readFile('./a.txt', 'utf-8', function(err, data) {
    out(data, 0);
})

fs.readFile('./b.txt', 'utf-8', function(err, data) {
    out(data, 1);
})

/**
 * 采用发布订阅模式能更简单，先订阅 -> 再发布，还有流程控制
 * 发布订阅模式可以高效的解耦合
 */

// 事件中心
let events = { 
    _events: [], // 发布订阅模式，核心就是多个方法存储起来，顺序调用
    on(fn) {
        this._events.push(fn);
    },
    emit(data) {
        this._events.forEach(ev => {
            ev(data);
        })
    },
}

// 订阅有顺序,采用数组
events.on((data) => {
    console.log('on1');
})

let arr1 = [];
events.on((data) => {
    arr1.push(data);
})

events.on(() => {
    if(arr1.length === 2) {
        console.log('读取完毕', arr1);
    }
})

fs.readFile('./a.txt', 'utf-8', function(err, data) {
    events.emit(data)
})

fs.readFile('./b.txt', 'utf-8', function(err, data) {
    events.emit(data)
})


/**
 * 观察者模式，vue2里面用的比较多
 * 观察者模式基于发布订阅模式，观察者模式需要有两个状态，观察者，被观察者
 * 观察者模式基于类
 */

class Subject { // 被观察者需要将观察者收集起来
    
    constructor(name) {
        this.name = name;
        this.state = 'happy';
        this.sublist = [];
    }
    attach(subject) {
        this.sublist.push(subject);
    }
    setState(newState) {
        this.state = newState;
        this.sublist.forEach(sub => {
            sub.update(this.name, newState);
        })
    }
    
}

class Observer { // 观察者
    constructor(name) {
        this.name = name;
    }
    update(s, state) {
        console.log(this.name + ':' + s + state);
    }
}

let s = new Subject('bb');
let o1 = new Observer('baba');
let o2 = new Observer('mama');

s.attach(o1);
s.attach(o2);

s.setState('开心了')


