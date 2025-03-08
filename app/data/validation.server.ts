

export function validatePasswordLength(password:string){
    if(password.length === 8){
        return true;
    }else{
        const msg = "Password lenth is more than 8"
        return msg;
    }
}