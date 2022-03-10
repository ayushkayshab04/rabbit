const amqp = require("amqplib")


var email , password , Uaddress;
let channel , connection ;



async function connect(){
    try{
        connection = await amqp.connect("amqp://localhost")
        channel =  await connection.createChannel();
        await channel.assertQueue("queue")

       
        channel.consume("queue" , data=>{
            const eventData = JSON.parse(Buffer.from(data.content))
            console.log(eventData)
            HandleEvent(eventData);

           }, {
            noAck:true,
        })

    } catch (err){
        console.log(err)
    }
}

function HandleEvent(eventMetaData){
    const {eventName , eventData } = eventMetaData
    switch (eventName) {
        case "SIGNUP": 
            signup(eventData)
            break;
        case "ADD_ADDRESS":
            address(eventData)
            break;
        default:
            break;
    }
}

async function signup(signUpData){
    email =  signUpData.email;
    password = signUpData.password;
    console.log("signup event received", signUpData)


}

async function address(addressData){
    Uaddress = addressData.address
    console.log("Address received", addressData )

}







module.exports={
    connect
}
