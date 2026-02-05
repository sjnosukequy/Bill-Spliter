export class baseClass{
    constructor(id){
        this.id = id;
    }

    getData(){
        const object = {};
        for (let key in this){
            object[key] = this[key];
        }
        return object;
    }
}