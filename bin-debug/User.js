var Cache = function (target, propertyName, desc) {
    var method = desc.value;
    desc.value = function () {
        //如果战斗力缓存存在并且flag不为脏，跳过获取战斗力的函数,直接使用缓存的战斗力
        if (this["fightPowerCache"] != null && this["dirtyFlag"] == false) {
            console.log("use cache");
            return target["fightPowerCache"];
        }
        else {
            this["dirtyFlag"] = false;
            //得到战斗力缓存的值
            this["fightPowerCache"] = method.apply(this);
            return method.apply(this);
        }
    };
    return desc;
};
var HpCache = function (target, propertyName, desc) {
    var method = desc.value;
    desc.value = function () {
        if (this["hpCache"] != null && this["dirtyFlag"] == false) {
            console.log("use HpCache");
            return target["hpCache"];
        }
        else {
            this["dirtyFlag"] = false;
            this["hpCache"] = method.apply(this);
            return method.apply(this);
        }
    };
    return desc;
};
var attackCache = function (target, propertyName, desc) {
    var method = desc.value;
    desc.value = function () {
        if (this["attackCache"] != null && this["dirtyFlag"] == false) {
            console.log("use attackCache");
            return target["attackCache"];
        }
        else {
            this["dirtyFlag"] = false;
            this["attackCache"] = method.apply(this);
            return method.apply(this);
        }
    };
    return desc;
};
var User = (function () {
    function User() {
        this.gold = 0;
        this.undealGold = 0;
        this.currentExp = 0;
        this.level = 0;
        this.fightPowerCache = null;
        this.dirtyFlag = false;
        //User与Hero为聚合关系的表现
        this.heroes = [];
        this.gold = 0;
        this.undealGold = 0;
        this.currentExp = 0;
        this.level = 0;
    }
    var d = __define,c=User,p=c.prototype;
    d(p, "heroesInTeam"
        //基础数值写法
        //heroesInTeam : Hero[] = [];
        //高阶数值写法
        ,function () {
            return this.heroes.filter(function (hero) { return hero.isInteam; });
        }
    );
    d(p, "fightPower"
        //@Cache
        ,function () {
            var result = 0;
            //forEach : 将数组中每个元素都执行
            this.heroesInTeam.forEach(function (hero) { return result += hero.fightPower; });
            return result;
        }
    );
    p.addHero = function (hero) {
        this.heroes.push(hero);
        this.dirtyFlag = true;
    };
    p.show = function () {
        console.log("User:");
        console.log("level:" + this.level);
        console.log("currentExp：" + this.currentExp);
        console.log("undealGold:" + this.undealGold);
        console.log("gold:" + this.gold);
        console.log("fightPower:" + this.fightPower);
    };
    return User;
}());
egret.registerClass(User,'User');
var Hero = (function () {
    function Hero(baseHp, baseAttack, value) {
        this.isInteam = false;
        this.baseHp = 0;
        this.baseAttack = 0;
        this.level = 0;
        this.value = 0;
        this.equipments = [];
        this.dirtyFlag = false;
        this.fightPowerCache = null;
        this.hpCache = null;
        this.attackPowerCache = null;
        this.level = 1;
        this.isInteam = true;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
        this.value = value;
    }
    var d = __define,c=Hero,p=c.prototype;
    d(p, "hp"
        //@HpCache
        ,function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.hpBoost; });
            return result + this.baseHp + (1 + 0.2 * this.value) * this.level;
        }
    );
    d(p, "attack"
        //@attackCache
        ,function () {
            var result = 0;
            //将所有装备的攻击力累加
            this.equipments.forEach(function (e) { return result += e.attackBoost; });
            return result + this.baseAttack + (1 + 0.3 * this.value) * this.level;
        }
    );
    d(p, "fightPower"
        //@Cache
        ,function () {
            var result = 0;
            this.equipments.forEach(function (e) { return result += e.fightPower; });
            return result + (this.hp * 300 + this.attack * 500) * 0.5;
        }
    );
    p.addEquipment = function (equipment) {
        this.equipments.push(equipment);
        this.dirtyFlag = true;
    };
    p.show = function () {
        console.log("Hero:");
        console.log("level:" + this.level);
        console.log("value:" + this.value);
        console.log("attack:" + this.attack);
        console.log("hp:" + this.hp);
        console.log("fightPower:" + this.fightPower);
    };
    p.getLevel = function () {
        return this.level;
    };
    p.getAttack = function () {
        return this.attack;
    };
    p.getHp = function () {
        return this.hp;
    };
    p.getValue = function () {
        return this.value;
    };
    return Hero;
}());
egret.registerClass(Hero,'Hero');
var Equipment = (function () {
    function Equipment(quality, baseAttack, baseHp) {
        this.jewels = [];
        this.baseAttack = 0;
        this.baseHp = 0;
        this.fightPowerCache = null;
        this.dirtyFlag = false;
        this.hpCache = null;
        this.attackPowerCache = null;
        this.quality = quality;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
    }
    var d = __define,c=Equipment,p=c.prototype;
    d(p, "attackBoost"
        //@attackCache
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.attackBoost; });
            return result + (this.quality * 20) + this.baseAttack;
        }
    );
    d(p, "hpBoost"
        //@HpCache
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.hpBoost; });
            return result + (this.quality * 10) + this.baseHp;
        }
    );
    d(p, "fightPower"
        //@Cache
        ,function () {
            var result = 0;
            this.jewels.forEach(function (e) { return result += e.fightPower; });
            return result + (this.hpBoost * 300 + this.attackBoost * 500) * 0.8;
        }
    );
    p.addJewel = function (jewel) {
        this.jewels.push(jewel);
        this.dirtyFlag = true;
    };
    p.show = function () {
        console.log("Equipment:");
        console.log("level:" + this.quality);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    };
    return Equipment;
}());
egret.registerClass(Equipment,'Equipment');
var Jewel = (function () {
    function Jewel(level, hpBoostCoefficient, attackBoostCoefficient) {
        this.hpBoostCoefficient = 0;
        this.attackBoostCoefficient = 0;
        this.level = level;
        this.hpBoostCoefficient = hpBoostCoefficient;
        this.attackBoostCoefficient = attackBoostCoefficient;
    }
    var d = __define,c=Jewel,p=c.prototype;
    d(p, "hpBoost"
        ,function () {
            return this.hpBoostCoefficient * this.level;
        }
    );
    d(p, "attackBoost"
        ,function () {
            return this.attackBoostCoefficient * this.level;
        }
    );
    d(p, "fightPower"
        ,function () {
            return this.hpBoost * 300 + this.attackBoost * 500;
        }
    );
    p.show = function () {
        console.log("Jewel:");
        console.log("level:" + this.level);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    };
    return Jewel;
}());
egret.registerClass(Jewel,'Jewel');
//一级，二级，三级宝石
var jewelLevel;
(function (jewelLevel) {
    jewelLevel[jewelLevel["one"] = 1] = "one";
    jewelLevel[jewelLevel["two"] = 2] = "two";
    jewelLevel[jewelLevel["three"] = 3] = "three";
})(jewelLevel || (jewelLevel = {}));
//装备品质分为绿装，蓝装，紫装，金装
var equipmentQuality;
(function (equipmentQuality) {
    equipmentQuality[equipmentQuality["green"] = 1] = "green";
    equipmentQuality[equipmentQuality["blue"] = 2] = "blue";
    equipmentQuality[equipmentQuality["purple"] = 3] = "purple";
    equipmentQuality[equipmentQuality["gold"] = 4] = "gold";
})(equipmentQuality || (equipmentQuality = {}));
//英雄稀有度
var heroValue;
(function (heroValue) {
    heroValue[heroValue["r"] = 1] = "r";
    heroValue[heroValue["sr"] = 2] = "sr";
    heroValue[heroValue["ssr"] = 3] = "ssr";
})(heroValue || (heroValue = {}));
//# sourceMappingURL=User.js.map