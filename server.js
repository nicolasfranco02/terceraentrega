/* modulos*/
import express from 'express';
import path from 'path'
import exphbs from 'express-handlebars';
import session from 'express-session';  
import dotenv from 'dotenv';
import connectMOngo from 'connect-mongo';
import bcrypt from 'bcrypt';
import cluster from 'cluster';
import { faker } from '@faker-js/faker';
import routercarrito from './src/routes/carrito.routes.js';
dotenv.config();

const UsuarioBD = []


/*----------------- passport / bbcrypt------------*/
import passport from 'passport';
import {Strategy} from "passport-local";
import minimist from 'minimist';
import {createTransport} from 'nodemailer';
import envioEmail from './enviodemail.js';
import ContenedorArchivo from './src/container/contenedor.js';
import twilio from 'twilio';
import mongoose from 'mongoose';




const  LocalStrategy = Strategy;

passport.use (new LocalStrategy(
    async function(username , password, done){
        const usuarioCreado = await UsuarioBD.find(usuario => usuario.nombre = username  );
        if (!usuarioCreado){
            return done(null, false);
        }else {
            const match = await verifyPass(usuarioCreado, password);
            if(!match){
                return done(null, false);
            }
            return done (null ,  usuarioCreado);
        }
    }
))

passport.serializeUser((usuario , done) => {
    done( null, usuario.nombre)
})
passport.deserializeUser((nombre, done) => {
    const usuarioCreado = UsuarioBD.find(usuario => usuario.nombre == nombre);
    done (null ,usuarioCreado);
});

async function generateHashPassword(password){
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
}
async function verifyPass(usuario, password) {
    const match = await bcrypt.compare(password, usuario.password);
    return match;
}


/* instancia server*/
const app= express();


/*base de datos 
const DB_PRODUCTOS = ProductosDAo
const DB_MENSAJES= CarritoDAO*/

/*------mongoatlas------*/
const MongoSTore= connectMOngo.create({
    mongoUrl: process.env.MONGOATLAS,
    ttl:600000,
    mongoOptions: {

    }
})



app.use(session({
    store: MongoSTore,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    Cookie:{
        maxAge:500
    }
})) 

/*------------ mongo-----------*/
/*const strConn = process.env.MONGOATLAS
async function MongoBaseDatos (){
    try{
        
        const conn = await mongoose.connect(strConn, config.db.options);
        console.log( `conectados en mongo`)


    }
    catch(error){
        console.log(error)
    }
}
 MongoBaseDatos() */

function aut (req, res, next) {
    if (req.isAuthenticated()) {
        next ()
}else {
    res.redirect( '/login')
}
}
app.use(passport.initialize());
app.use(passport.session());


/* middlewares*/

app.use(express.static('./public'));
app.use(express.json())
app.use(express.urlencoded({ extended : true }));

/*motor de plantilla*/
app.engine('hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir:path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname:'hbs'
}));
app.set('views', './views');
app.set('view engine','hbs');
/*-------- envioWhatsapp---------*/
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


const numeros = ['+540111530637045']

 async function envioWhatsapp (){ 
    try {

    let mensaje= '';

    for ( const numero of numeros) {
        mensaje = await client.messages.create({
         from: 'whatsapp:+14155238886',
         body: 'agregaste un nuevo producto',
         to: `whatsapp:${numero}`,
       });
       
    }
}
catch(err){
    console.log(err)
}
}


/*-------------- enviomail----------*/

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

const mailOptions ={
    from: 'proyecto Coder <noreply@example.com>',
    to: `mail de prueba <${emailEnvio}>`,
    subject :'cargaste un producto',
    text: 'gracias por realizar el pedido'
}

/*try {
    const info = await trasporter.sendMail(mailOptions)
    console.log(info)
} catch (error) {
    console.log(error)
    
}*/

faker.locale = 'es'

/*rutas */
//const PORT = parseInt(process.argv[2]) || 8080;
const PORT = process.env.PORT || 8080;
const modo = process.argv[3] == 'CLUSTER';

if (modo && cluster.isPrimary){
    const CPUScantidad= cpus().length
    console.log(`Número de procesadores: ${CPUScantidad}`)
    console.log(`PID MASTER ${process.pid}`)


    for (let i = 0; i < CPUScantidad; i++) {
        cluster.fork()
    }

    cluster.on('exit', worker => {
        console.log('Worker', worker.process.pid, 'died', new Date().toLocaleString())
        cluster.fork()
    })

}else {
    app.get('/' , (req, res) =>{
        const {url , method} = req
    //logger.info(` direccion:${url} method: ${method}`)
        res.redirect('/login')
    })








app.get('/register', (req, res )=>{
    const {url , method} = req
    const usuario = req.body.nombre
  //  logger.info(` direccion:${url} method: ${method}`)
    res.render( 'formularioinicio.hbs', {usuario} )
})


app.post('/register',async (req, res )=>{
    const {url , method} = req
//logger.info(` direccion:${url} method: ${method}`)

  const {nombre , password} = req.body;
  const usuario = req.body.nombre


  const nuevoUsuario = UsuarioBD.find(usuario => usuario.nombre == nombre);
 // console.log(nuevoUsuario)
  if (nuevoUsuario){
    res.redirect('/register-error')
  }else {
    UsuarioBD.push({
        nombre,
        password: await generateHashPassword(password)
    })
    res.redirect('/login')
  }
})

app.get('/register-error', (req, res) => {
    const {url , method} = req
//logger.info(` direccion:${url} method: ${method}`)
res.render('errorsesion.hbs')
})


app.get('/login', (req, res )=>{
    const {url , method} = req
    //logger.info(` direccion:${url} method: ${method}`)
    res.render( 'login.hbs'  )
})
app.post('/login', passport.authenticate('local', {successRedirect:'/inicio', failureMessage:'/login'}))

app.get('/login-error', (req, res) => {
        res.render('errorsesion.hbs');
    })
    


app.get('/inicio',aut, async (req, res)=>{
    const {url , method} = req
//    logger.info(` direccion:${url} method: ${method}`)
   const cantidad = 5
   const productos =[]
   for (let i=1; i<=cantidad; i++) {    
    const produc ={
        id :1,
        nombre: faker.commerce.product(),
        precio: faker.commerce.price(),
        imagen: `${faker.image.imageUrl()}`,
        
    }
    productos.push(produc);}
      
    res.render('vistas' , {productos});
     
})

app.post('/personas', aut, async (req, res)=>{
    const {url , method} = req
//logger.info(` direccion:${url} method: ${method}`)
   await DB_MENSAJES.save(req.body);
    res.redirect('/api/productos-test');
});

app.get('/logout', (req, res)=> {
   
//logger.info(` direccion:${url} method: ${method}`)
req.logOut(err => {
    res.redirect('/');
});
})

/*--------------carrito---------------*/

const produc= ContenedorArchivo
/*app.use('/carrito', routercarrito, (req, res)=>{
    res.redirect( '/inicio')
});*/
app.get('/carrito/agregar',async (req, res)=>{
    try {
        res.redirect('/inicio')
        await trasporter.sendMail(mailOptions)
        envioWhatsapp()
    } catch (error) {
        console.log(error)
        
    }
    
    

})
app.post('/carrito/agregar', async (req, res)=>{
    const productos = req.body
   const agregado= await produc.save(productos)
   res.status(201).json({agregado})
})

/*app.post('/carrito/agregar',async (req, res) => {
    try {
        res.status(201).json({id: await produc.save({ productos:[] })}).redirect ('/inicio');
        const info = await trasporter.sendMail(mailOptions)
        console.log(info)
    } catch (error) {
        console.log(error)
        
    }
    

});*/
app.get( '*', (req, res) =>{
    const {url , method} = req
  //  logger.warn(` direccion:${url} method: ${method}`)
    res.send( 'ruta inexistente')
})
app.listen(PORT, err => {
    if (!err) console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
})
}
