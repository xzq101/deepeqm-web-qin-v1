// 过滤html标签
export const filterHtmlTag = (str) => {
    if (!str) return '';
    return str.replace(/<[^>]+>/g, '');
}