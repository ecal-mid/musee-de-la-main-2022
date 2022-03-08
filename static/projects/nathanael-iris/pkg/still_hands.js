
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}
/**
* @param {string} name
*/
export function greet(name) {
    var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.greet(ptr0, len0);
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}
/**
*/
export class App {

    static __wrap(ptr) {
        const obj = Object.create(App.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_app_free(ptr);
    }
    /**
    */
    get ready() {
        var ret = wasm.__wbg_get_app_ready(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set ready(arg0) {
        wasm.__wbg_set_app_ready(this.ptr, arg0);
    }
    /**
    * @param {number} number
    * @param {number} goal_count
    * @returns {App}
    */
    static new(number, goal_count) {
        var ret = wasm.app_new(number, goal_count);
        return App.__wrap(ret);
    }
    /**
    */
    step_boids() {
        wasm.app_step_boids(this.ptr);
    }
    /**
    * @returns {Float32Array}
    */
    get positions() {
        var ret = wasm.app_positions(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Float32Array}
    */
    get rotations() {
        var ret = wasm.app_rotations(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {Float32Array}
    */
    get accelerations() {
        var ret = wasm.app_accelerations(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {number} index
    * @param {number} x
    * @param {number} y
    * @param {number} z
    */
    set_goal(index, x, y, z) {
        wasm.app_set_goal(this.ptr, index, x, y, z);
    }
    /**
    * @param {number} val
    */
    set_neighbour_thresh(val) {
        wasm.app_set_neighbour_thresh(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_neighbour_max(val) {
        wasm.app_set_neighbour_max(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_drag(val) {
        wasm.app_set_boid_drag(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_repulsion(val) {
        wasm.app_set_boid_repulsion(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_cohesion(val) {
        wasm.app_set_boid_cohesion(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_noise(val) {
        wasm.app_set_boid_noise(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_goal_weight(val) {
        wasm.app_set_boid_goal_weight(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_min_vel(val) {
        wasm.app_set_boid_min_vel(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_max_vel(val) {
        wasm.app_set_boid_max_vel(this.ptr, val);
    }
    /**
    * @param {number} val
    */
    set_boid_acceleration_matching(val) {
        wasm.app_set_boid_acceleration_matching(this.ptr, val);
    }
}
/**
*/
export class Vector3 {

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_vector3_free(ptr);
    }
    /**
    */
    get x() {
        var ret = wasm.__wbg_get_vector3_x(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set x(arg0) {
        wasm.__wbg_set_vector3_x(this.ptr, arg0);
    }
    /**
    */
    get y() {
        var ret = wasm.__wbg_get_vector3_y(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set y(arg0) {
        wasm.__wbg_set_vector3_y(this.ptr, arg0);
    }
    /**
    */
    get z() {
        var ret = wasm.__wbg_get_vector3_z(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set z(arg0) {
        wasm.__wbg_set_vector3_z(this.ptr, arg0);
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('still_hands_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_log_8b93411ae3c71504 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_random_d31b2470743bce6b = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_buffer_397eaa4d72ee94dd = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_8bd669b4092b7244 = function(arg0, arg1, arg2) {
        var ret = new Float32Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_8b45a9becdb89691 = function(arg0) {
        var ret = new Float32Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

