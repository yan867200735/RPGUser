//从配置文件中加载
//文件配置 -> swordConfig -> config
//是：继承   有：组合    属性，英雄，装备，宝石
var Command = (function () {
    function Command() {
    }
    var d = __define,c=Command,p=c.prototype;
    //缺点：需要参数，或是单例,降低封装性
    //优点：串行，
    p.execute = function () {
    };
    return Command;
}());
egret.registerClass(Command,'Command');
var commandChain = (function () {
    function commandChain() {
    }
    var d = __define,c=commandChain,p=c.prototype;
    return commandChain;
}());
egret.registerClass(commandChain,'commandChain');
//# sourceMappingURL=test.js.map