// 
/** 
 * 高阶函数的概念
 * 1.一个函数返回一个函数，这个函数就是高阶函数
 * 2.一个函数的参数也是一个函数，也是高阶函数
 * 满足以上两个条件之一均可
 */

function core(...args) {
    console.log('核心代码', ...args); 
    
}

// 如何扩展core函数？使用高阶函数
core.before = function(cb) { // 参数是一个函数
    // this === core
    return (...args) => { // 返回的是新函数,使用...剩余运算符可以把多个参数转化成数组
        cb && cb();
        this(...args); // 拓展运算符
    }
}

let newCore = core.before(function() {
    console.log('before');
})

newCore('a', 'b');

// 1. 想给函数进行扩展，可以使用高阶函数
// 什么是闭包？
// 函数的定义有作用域的概念，一个函数定义的作用域和执行的作用不在同一个，肯定会出现闭包

function a() {
    let testNum = 1;
    return function () {
        return testNum;
    }
}

let b = a();
console.log(b());