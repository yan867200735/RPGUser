var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {

    const method = desc.value;

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

    }
    return desc;
}


var HpCache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {

    const method = desc.value;

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

    }
    return desc;
}


var attackCache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {

    const method = desc.value;

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

    }
    return desc;
}



class User{

    gold = 0;

    undealGold = 0;

    currentExp = 0;

    level = 0;

    fightPowerCache = null;

    dirtyFlag = false;

    //User与Hero为聚合关系的表现
    heroes : Hero[] = [];

    constructor(){

        this.gold = 0;
        this.undealGold = 0;
        this.currentExp = 0;
        this.level = 0;

    }

    //基础数值写法
    //heroesInTeam : Hero[] = [];

    //高阶数值写法
    get heroesInTeam(){

        return this.heroes.filter(hero => hero.isInteam);
    }


    //@Cache
    get fightPower(){

        var result = 0;
        
        //forEach : 将数组中每个元素都执行
        this.heroesInTeam.forEach(hero => result += hero.fightPower);
        return result;
    }


    public addHero(hero : Hero){

        this.heroes.push(hero);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("User:");
        console.log("level:" + this.level);
        console.log("currentExp：" + this.currentExp);
        console.log("undealGold:" + this.undealGold);
        console.log("gold:" + this.gold);
        console.log("fightPower:" + this.fightPower)
    }

}

class Hero{

    public isInteam : boolean = false;

    private baseHp = 0;

    private baseAttack = 0;

    private  level = 0;

    private  value = 0;

    private equipments : Equipment[] = [];

    private dirtyFlag = false;

    private fightPowerCache = null;

    private hpCache = null;

    private attackPowerCache = null;

    constructor(baseHp : number, baseAttack : number, value : number){

        this.level = 1;
        this.isInteam = true;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
        this.value = value;

    }

    //@HpCache
    get hp(){

        var result = 0;
        this.equipments.forEach(e => result += e.hpBoost);
        return result + this.baseHp + (1 + 0.2 * this.value) * this.level;
    }

    //@attackCache
    get attack(){

        var result = 0;

        //将所有装备的攻击力累加
        this.equipments.forEach(e => result += e.attackBoost);
        return result + this.baseAttack + (1 + 0.3 * this.value) * this.level;
    }

    //@Cache
    get fightPower(){

        var result = 0;
        this.equipments.forEach(e => result += e.fightPower);
        return result + (this.hp * 300 + this.attack * 500) * 0.5;

    }

    public addEquipment(equipment : Equipment){

        this.equipments.push(equipment);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("Hero:");
        console.log("level:" + this.level);
        console.log("value:" + this.value);
        console.log("attack:" + this.attack);
        console.log("hp:" + this.hp);
        console.log("fightPower:" + this.fightPower);
    }


    public getLevel(){

        return this.level;
    }

    public getAttack(){

        return this.attack;
    }

    public getHp(){

        return this.hp;
    }

    public getValue(){

        return this.value;
    }

}


class Equipment{

    private jewels : Jewel[] = [];

    private quality : equipmentQuality;

    private baseAttack = 0;

    private baseHp = 0;

    private fightPowerCache = null;

    private dirtyFlag = false;

    private hpCache = null;

    private attackPowerCache = null;

    constructor(quality : equipmentQuality, baseAttack : number, baseHp : number){

        this.quality = quality;
        this.baseAttack = baseAttack;
        this.baseHp = baseHp;
    }


    //@attackCache
    get attackBoost(){

        var result = 0;
        this.jewels.forEach(e => result += e.attackBoost);
        return result + (this.quality * 20) + this.baseAttack;
    }

    //@HpCache
    get hpBoost(){

        var result = 0;
        this.jewels.forEach(e => result += e.hpBoost);
        return result + (this.quality * 10) + this.baseHp;
    }

    //@Cache
    get fightPower(){

        var result = 0;
        this.jewels.forEach(e => result += e.fightPower);       
        return result + (this.hpBoost * 300 + this.attackBoost * 500) * 0.8;

    }

    public addJewel(jewel : Jewel){

        this.jewels.push(jewel);
        this.dirtyFlag = true;

    }

    public show(){

        console.log("Equipment:");
        console.log("level:" + this.quality);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    }

}


class Jewel{
  
    private level : jewelLevel;

    private hpBoostCoefficient = 0;

    private attackBoostCoefficient = 0;

    constructor(level : jewelLevel, hpBoostCoefficient : number, attackBoostCoefficient : number){

        this.level = level;
        this.hpBoostCoefficient = hpBoostCoefficient;
        this.attackBoostCoefficient = attackBoostCoefficient;

    }

    get hpBoost(){

        return this.hpBoostCoefficient * this.level;
    }

    get attackBoost(){

        return this.attackBoostCoefficient * this.level;
    }

    
    get fightPower(){

        return this.hpBoost * 300 + this.attackBoost * 500;
    }

    public show(){

        console.log("Jewel:");
        console.log("level:" + this.level);
        console.log("hpBoost:" + this.hpBoost);
        console.log("attackBoost:" + this.attackBoost);
        console.log("fightPower:" + this.fightPower);
    }
}

//一级，二级，三级宝石
enum jewelLevel{

    one = 1,
    two = 2,
    three = 3
}

//装备品质分为绿装，蓝装，紫装，金装
enum equipmentQuality{

    green = 1,
    blue = 2,
    purple = 3,
    gold = 4
}

//英雄稀有度
enum heroValue{

    r = 1,
    sr = 2,
    ssr = 3
}


