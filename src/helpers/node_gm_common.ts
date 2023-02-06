import _, { uniq, sortBy } from "lodash";

export function objectEach(obj: { [key: string]: unknown }, f: (el: unknown) => unknown) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj[key] = f(obj[key]);
        }
    }
}

export function objectMap(obj: { [key: string]: any }, f: (el: any, key: string) => any, level?: number) {
    if (level && level > 1) {
        const newObj = { ...obj };
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = objectMap(obj[key], f, level - 1);
            }
        }
        return newObj;
    } else {
        const newObj = { ...obj };
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = f(obj[key], key);
            }
        }
        return newObj;
    }
}

export function transpose(matrix: any[][]) {
    return matrix[0].map((x, i) => matrix.map(x => x[i]));
}

export function last(arr: any[]) {
    return arr[arr.length - 1];
}

export function shrinkRight(matrix: any[][]) {
    const len = Math.min(...matrix.map(el => el.length));
    return matrix.map(el => el.slice(0, len));
}

export function shrinkLeft(matrix: any[][]) {
    const len = Math.min(...matrix.map(el => el.length));
    return matrix.map(el => el.slice(el.length - len));
}

export interface TallySortItem {
    value: any;
    count: number;
}
export interface TallySortRelativeItem {
    value: any;
    percent: number;
}

export function tallySort(arr: any[], f?: (el: any) => any, fInv?: (el: any) => any): TallySortItem[] {
    return Object.entries(_.countBy(arr, f))
        .map(el => { return { value: fInv ? fInv(el[0]) : el[0], count: el[1] as number }; })
        .sort((a, b) => +b.count - +a.count);
}

export const tallySortJSON = (arr: any[]) => tallySort(arr, JSON.stringify, JSON.parse);

// export function tallySortRelative(ts: TallySortItem[], totalValue?: number): TallySortRelativeItem[] {
//     const _total = totalValue || total(ts, "count")
//     return ts.map(({value, count}) => ({value, percent: count / _total}))
// }

// export const total = function (arr: (number[] | any[]), key?: string): number {
//     let _arr = arr
//     if (key) {
//         _arr = arr.map((el) => el[key])
//     }
//     return _arr.reduce((a, b) => a + b, 0)
// }

export const splitBy = function(arr: any[], f: (el: any, local: any[]) => boolean, g?: (local: any[]) => any) {
    const res = [];
    let local = [] as any[];
    g = g || ((el) => el);
    arr.forEach(el => {
        local.push(el);
        if (f(el, local)) {
            res.push(g?.(local));
            local = [];
        }
    });
    if (local.length) {
        res.push(g(local));
    }
    return res;
};

export const split = function(arr: any[], f: (el: any, local: any[]) => any, g?: (local: any[]) => any) {
    const res = [];
    let local = [] as any[];
    g = g || ((el) => el);
    let testValue = null as any;
    arr.forEach((el, i) => {
        if (i && testValue !== f(el, local)) {
            res.push(g?.(local));
            local = [];
        }
        local.push(el);
        testValue = f(el, local);
    });
    if (local.length) {
        res.push(g(local));
    }
    return res;
};

export const accamulateByKey = function(arr: any[], key: string) {
    const res = [] as any;
    arr.forEach(o => {
        res.push({ date: o.date, [key]: last(res) ? last(res)[key] + o[key] : o[key] });
    });
    return res;
};

export const partition = function (arr: any[], n: number) {
    let i = 0;
    const res = [];
    let locale = [];
    for (const el of arr) {
        locale.push(el);
        i++;
        if (!(i % n)) {
            res.push(locale);
            locale = [];
        }
    }
    locale.length && res.push(locale);
    return res;
};

export const partitionShift = function (arr: any[], n: number, shift = 1) {
    // now works only for shift == 1
    const res = [];
    let locale = [];
    for (let i = 0; i < arr.length; i++) {
        const el = arr[i];
        locale.push(el);
        if (!((i + 1) % (n + res.length))) {
            res.push(locale);
            locale = [];
            i = i - n + shift;
        }
    }
    locale.length && res.push(locale);
    return res;
};

export function sortByReverse(arr: any[], f: (el: any) => any): any[] {
    return sortBy(arr, f).reverse();
}

export function permutations(collection: any[], n: any) {
    const array = _.values(collection);
    if (array.length < n) {
        return [];
    }
    const recur = (array: any[], n: any) => {
        if (--n < 0) {
            return [[]];
        }
        const p = [] as any[];
        array.forEach((value, index, array) => {
            array = array.slice();
            array.splice(index, 1);
            recur(array, n).forEach(permutation => {
                permutation.unshift(value);
                p.push(permutation);
            });
        });
        return p;
    };
    return recur(array, n);
}

export function localeCompare(str1: string, str2: string) {
    return (str1.toLocaleLowerCase && str1.toLocaleLowerCase()) === (str2.toLocaleLowerCase && str2.toLocaleLowerCase());
}

export function localeIncludes(str1: string, str2: string) {
    return (str1.toLocaleLowerCase && str1.toLocaleLowerCase()).includes(str2.toLocaleLowerCase && str2.toLocaleLowerCase());
}

export function localeIncludesOr(str1: string, str2: string[]) {
    return str2.some((el) => localeIncludes(str1, el));
}

export function localeStart(str1: string, str2: string) {
    return !(str1.toLocaleLowerCase && str1.toLocaleLowerCase()).indexOf(str2.toLocaleLowerCase && str2.toLocaleLowerCase());
}
