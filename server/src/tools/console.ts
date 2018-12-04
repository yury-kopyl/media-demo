import {log} from 'console';

class ToolConsole {
    protected message: any | Date | Promise<any> | Map<any, any> | WeakMap<object, any> | WeakSet<object> | Set<any>;
    protected typeName: string;
    protected typeTemplate: string;

    constructor(private print) {}

    private init(msg: any) {
        this.message = msg;

        // todo : https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects
        switch (typeof this.message) {
            case 'string':
                this.typeName = 'string';
                this.typeTemplate = '%s';
                break;
            case 'number':
                this.typeName = 'number';
                this.typeTemplate = '%o';
                break;
            case 'boolean':
                this.typeName = 'boolean';
                this.typeTemplate = '%o';
                break;
            case 'undefined':
                this.typeName = 'undefined';
                this.typeTemplate = '%o';
                break;
            case 'symbol':
                this.typeName = 'symbol';
                this.typeTemplate = '%o';
                break;
            case 'function':
                this.typeName = 'function';
                this.typeTemplate = '%s';
                break;
            case 'object':
                if (Array.isArray(this.message)) {
                    this.typeName = 'object => array';
                } else if (this.message === null)  {
                    this.typeName = 'object => null';
                } else if (this.message instanceof Date) {
                    this.typeName = 'object => Date';
                } else if (this.message instanceof global.Promise) {
                    this.typeName = 'object => Promise';
                } else if (this.message instanceof global.Map) {
                    this.typeName = 'object => Map';
                } else if (this.message instanceof global.Set) {
                    this.typeName = 'object => Set';
                } else if (this.message instanceof global.WeakMap) {
                    this.typeName = 'object => WeakMap';
                } else if (this.message instanceof global.WeakSet) {
                    this.typeName = 'object => WeakSet';
                } else {
                    this.typeName = 'object';
                }
                this.typeTemplate = '%o';
                break;
        }
    }

    public type() {
        this.print('\x1b[1;36m🔺 %s\x1b[0m', this.typeName);
    }

    public log(msg: any) {
        this.init(msg);
        this.print(`🗯️ ${this.typeTemplate}`, this.message);

        return this;
    }

    public success(msg: any) {
        this.init(msg);
        this.print(`\x1b[92m✅ ${this.typeTemplate}\x1b[0m`, this.message);
    }

    public warn(msg: any) {
        this.init(msg);
        this.print(`\x1b[93m ❗  \x1b[4;93m${this.typeTemplate}\x1b[0m`, this.message);
    }

    public error(msg: any) {
        this.init(msg);
        this.print(`\x1b[31m❎ ${this.typeTemplate}\x1b[0m`, this.message);
    }
}

export const console = new ToolConsole(log);

// todo : Remove after test
/*console.success('success');
console.warn('warning');
console.error('error');

console.log('log').type();
console.log(1).type();
console.log(true).type();
console.log([1, 2, 3]).type();
console.log({test: 'test', array: [1, 2, 3]}).type();
console.log(null).type();
console.log(undefined).type();
console.log(Symbol('n')).type();
console.log(function() {}).type();
console.log(new Date()).type();
console.log(new Promise(() => {})).type();
console.log(new Map([['key1', 'value1'], ['key2', 'value2']])).type();
console.log(new Set([1, 2, 3])).type();
console.log(new WeakMap([[{name: 'user1'}, 1], [{name: 'user2'}, 2]])).type();
console.log(new WeakSet([{name: 'user1'}, {name: 'user2'}])).type();*/
