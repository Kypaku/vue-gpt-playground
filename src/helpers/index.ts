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
