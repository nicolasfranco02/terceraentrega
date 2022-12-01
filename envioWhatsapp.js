import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);




const numeros = ['+540111530637045']


try {
    let mensaje= '';

    for ( const numero of numeros) {
        mensaje = await client.messages.create({
         from: 'whatsapp:+14155238886',
         body: 'agregaste un nuevo producto',
         to: `whatsapp:${numero}`,
       });
       console.log(mensaje)
    }
}
catch(err){
    console.log(err)
}


