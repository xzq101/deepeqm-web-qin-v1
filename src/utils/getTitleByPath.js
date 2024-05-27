export default function getTitleByPath(pathname) {
    const routeTitleMap = {
        // ...自定义配置
    };
    return routeTitleMap[pathname] || 'onphysics';
}