import { createTransport } from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();


const EMAIL = process.env.EMAIL_GUARDADO;
const PASSWORD= process.env.PASSWORD_GUARDADO;


const emailEnvio =['gabrielfranco4321@gmail.com']
const trasporter = createTransport({
    service: 'gmail',
    port: 587 ,
    auth:{
        user: EMAIL,
        pass: PASSWORD
    }
});
export function envioEmail  () {
const mailOptions ={
    from: 'proyecto Coder <noreply@example.com>',
    to: `mail de prueba <${emailEnvio}>`,
    subject :'cargaste un producto',
    text: 'gracias por realizar el pedido'
}

try {
    const info =  trasporter.sendMail(mailOptions)
  
} catch (error) {
    console.log(error)
    
}}

export default envioEmail;