module.exports = {
    success: () => {
        return { responseMessage: "Signup success",responseCode: 200}},
           
    Internal_server_error: () => {
        return {responseMessage: "Internal server error",responseCode: 500 }},

    conflict:()=>{
        return{responseMessage: "email   is already exists", responseCode: 409}},

    Something_went_wrong:()=>{
        return{responseMessage: "Something went wrong", responseCode: 501,}},

    Not_found:()=>{
       return{ responseMessage: "Email is not in database..!!", responseCode: 404}},
    
    accepted:()=>{
        return{responseMessage: "OTP Verifyed...!!", responseCode: 202}},

    requestTimeout:()=>{
        return{responseMessage: "OTP Time Out.. Resnr it..!!", responseCode: 408}},

    unauthorized:()=>{
        return{responseMessage: "OTP not Valid.!!", responseCode: 401}},
    
    
    
   



}