export function baseAnswer(status: number, value: any, paging: Object) {
    return {
        status: status,
        data: value,
        paging: paging,
    };
}
