export function safeAccess(object: any, keyArray: string[], defaultValue: any) {
    let aux = object;
    for (const key of keyArray) {
        if (typeof aux !== 'object') {
            return defaultValue;
        }
        aux = aux[key];
    }
    if (aux === undefined) {
        return defaultValue;
    }
    return aux;
}