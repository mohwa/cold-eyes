
/**
 * ColdEyes 클래스
 */

/*

 일단 가능한 기능들을 모두 구현한 후, 마무리 시점에서 코드 정리에 들어가자.

 먼저 어느선까지 기능들(지원 타입등)을 지원할지, 스펙을 만들어봐야겠다.

 생각보다 가능한 기능들이 많은듯하다.


 */
class ColdEyes{

    constructor(target = null){

        this.target = target;
    }

    watch(key = '', listener = function(){}){

        const target = this.target;

        if (target === null) return;

        this._addWatches(key, listener);
    }
    _addWatches(k = '', listener = function(){}){

        const target = this.target;

        // 식별자에 할당된 초기값
        const defaultValue = target[k];

        if (defaultValue && defaultValue.constructor === Array){
            this._addWatchArrayMethods(defaultValue, listener);
        }
        else{
            this._addWatch(target, k, listener);
        }

    }
    _addWatchArrayMethods(target = null, listener = function(){}){

        const _this = this;

        this._addWatchArrayItems(target, listener);

        Object.getOwnPropertyNames(Array.prototype).forEach((k, v) => {

            v = Array.prototype[k];

            if ((v && typeof v === 'function') &&
                (
                    k === 'push' ||
                    k === 'unshift' ||
                    k === 'pop' ||
                    k === 'shift' ||
                    k === 'slice' ||
                    k === 'splice' ||
                    k === 'fill')
                ){

                const desc = {
                    value: function(){

                        const args = Array.prototype.slice.call(arguments);

                        return _this._addWatchArrayMethod.apply(_this, [target, v, listener].concat(args));
                    }
                };

                Object.defineProperty(target, k, desc);
            }
        });
    }
    _addWatchArrayMethod(target = null, method = '', listener = function(){}){

        const _t = (() => {

            const ret = [];
            target.forEach(v => { ret.push(v); });

            return ret;
        })();

        const ret = method.apply(target, [].slice.call(arguments, 3));

        this._addWatchArrayItems(target, listener);

        listener.apply(this.target, [target, _t]);

        return ret;
    }
    _addWatchArrayItems(target = null, listener = function(){}){

        Object.getOwnPropertyNames(target).forEach((k, v) => {

            if (isNaN(k)) return;

            this._addWatch(target, k, listener);
        });
    }
    _addWatch(target = null, k = '', listener = function(){}){

        const defaultValue = target[k];
        const _k = this._replaceInternalAccessorKeyName(k);

        target[_k] = defaultValue;

        const desc = {
            get: () => {
                return target[_k] || defaultValue;
            },
            set: (v) => {

                const oldValue = target[_k] || defaultValue;

                if (oldValue !== v){
                    listener.apply(target, [v, oldValue]);
                }

                target[_k] = v;
            }
        };

        Object.defineProperty(target, k, desc);
    }

    /**
     *
     * 접근자(get/set)를 위한, key 이름을 반환한다.
     *
     * @param k
     * @returns {*}
     * @private
     */
    _replaceInternalAccessorKeyName(k = ''){
        return `__${k}__`;
    }
}

module.exports = ColdEyes;


