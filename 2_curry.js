// 函数柯里化 多个参数传入 转换成n个函数
// 好处是 可以暂存变量
// 一般柯里化参数要求都是一个个传，不定参的我们成为偏函数

function fn(a) {
    console.log(a);
    return function (b) {
        console.log(b);
        return function (c) {
            console.log(c);
            return c;
        }
    }
}

fn(1)(2);


// 使用场景：判断一个变量的类型
// 常用的typeof缺陷，不能判断某些类型，数组和对象都显示object，所以一般用于判断基础类型
// instanceof 用于判断是谁的实例，能更加精确的判断类型
// Object.prototype.toString.call 判断具体类型，返回的是一个字符串
// constructor ，常用语深拷贝

// 柯里化可以让函数变得更加具体一些，反柯里化则让函数的范围更大
function isType(val, typing) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`
}

console.log(isType(null, 'Null'));
console.log(isType('abc', 'String'));

function isString(typing) {
    return function (val) {
        console.log(Object.prototype.toString.call(val));
        return Object.prototype.toString.call(val) === `[object ${typing}]`
    }
}

let myIsString = isString('String');
console.log(myIsString(11)); // false
console.log(myIsString('11')); // true


// 实现通用的柯里化函数，高阶函数
// 一般柯里化参数是固定，不定参数代价较高

// 要记录每次调用传入的参数，并且和函数的参数个数进行比较，
// 如果不满足总个数就返回新函数，如果传入个数和参数一直，则执行原来的函数

function curring(fn) {
    // 存储每次调用传入的变量
    const inner = (args = []) => {
        return args.length >= fn.length ? fn(...args) : (...userArgs) => {
            return inner([...args, ...userArgs]); // 递归返回函数
        }
    }
    return inner();
}

function sum(a, b, c, d) {
    return a + b + c + d;
}

let sumCurr = curring(sum);

console.log(sumCurr(1)(2)(3)(4));

// 复习函数柯里化

function curring1(fn) {
    const fnLen = fn.length;
    const inner = (args = []) => {
        return args.length >= fnLen ? fn(...args) : (...userArgs) => {
            return inner([...args, ...userArgs]);
        }
    }
    return inner();
}

function isType1(typing, val) {
    return Object.prototype.toString.call(val) === `[object ${typing}]`
}

let isString1 = curring1(isType1)('String');
console.log(isString1('abc'));


// 多种类型判断

let util = {};
['String', 'Number', "Boolean", 'Null', 'Undefined'].forEach(type => {
    util['is'+type] = curring(isType1)(type)
})

console.log(util.isString(123));
