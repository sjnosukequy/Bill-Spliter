export class responseController {
    static createResponse(errorBoolean, message) {
        return {
            error: errorBoolean,
            message: message
        };
    }

    static createResponse(obj){
        obj.error = false;
        obj.message = "Success";
        return obj;
    }

}