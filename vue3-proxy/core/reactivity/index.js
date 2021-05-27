// 响应式库
// 依赖：全局变量，连接Dep实例和effectWatch的桥梁
let currentEffect;
class Dep {
  constructor(val) {
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val;
  }
  set value(newVal) {
    this._val = newVal;
    this.notice();
  }

  // 1. 收集依赖
  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  // 2. 触发依赖
  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

// TODO: 只支持基本类型，不支持Object
export function ref(v) {
  const dep = new Dep(v)
  return dep
}

export function effectWatch(effect) {
  // 收集依赖
  currentEffect = effect;
  effect();
  currentEffect = null;
}

const targetMap = new Map();

function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = {};
    targetMap.set(target, depsMap);
  }

  let dep = depsMap[key];
  if (!dep) {
    dep = new Dep();
    depsMap[key] = dep;
  }
  return dep;
}

// 递归代理，比起Object.defindProperty的好处：
// 1. 天然支持数组下标和方法，无需hack
// 2. 无需遍历属性
export function reactive(raw) {
  if (typeof raw === 'object') {
		for (let key in raw) {
			if (typeof raw[key] === 'object') {
				raw[key] = reactive(raw[key]);
			}
		}
	}
  return new Proxy(raw, {
    get(target, key) {
      // 依赖收集
      const dep = getDep(target, key);
      if (dep instanceof Dep) {
        // 数组的constructor不是Dep
        dep.depend();
      }
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      // / 触发依赖
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value);
      dep.notice();
      return result;
    },
  });
}

