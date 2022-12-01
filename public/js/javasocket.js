

const socket = io();

const formularioProductos = document.getElementById(' formprod')
formularioProductos.addEventListener('submit',e =>{
    e.preventDefault();
    const productos= {
        nombre:formularioProductos[0].value,
        precio:formularioProductos[1].value,
        imagen: formularioProductos[2].value
    }
    socket.emit('update', productos);
    formularioProductos.reset()
})

socket.on('productos', productos=>{
    listaProductosRandom(productos).then(html =>{
        document.getElementById('productossocket').innerHTML = html
    })
})

function listaProductosRandom(productos){
    return fetch ('../../views/partials/historico.hbs')
        .then(respuesta=>respuesta.text())
        .then(plantilla =>{
            const template = Handlebars.compile(plantilla)
            const html = template({productos})
            return html
        })}



/*----------------chat-------------------- */


  const botonenviar= document.querySelector('#envioDemensaje');
  const form= document.querySelector('#form');
const usuario= document.querySelector('#user');
    const usuarioMensaje= document.querySelector('#contenidoMensaje');
 
    

//------------desnormalizar------------
const schemaAutor = new normalizr.schema.Entity('autor', {}, {idatributos : 'id'})
const schemaMensaje = new normalizr.schema.Entity('post',{autor : schemaAutor }, {idatributos : '_id'});
const schemaMensajes = new normalizr.schema.Entity('posts', {mensajes : [schemaMensaje]}, {idatributos : '_id'});

const formulariomensaje = form
formulariomensaje.addEventListener('submit',e => {
e.preventDefault()
const mensaje ={
    autor:{
        email:document.getElementById('email').value,
        nombre:document.getElementById('nombre').value,
        apellido:document.getElementById('apellido').value,
        edad:document.getElementById('edad').value,
        alias:document.getElementById('alias').value,
        imagen:document.getElementById('imagen').value
    },
    texto: usuarioMensaje.value
}
socket.emit('mensajeNuevo', mensaje );
//formulariomensaje.reset()


})

socket.on('mensaje', mensajesN=>{

let mensajesnorm = JSON.stringify(mensajesN).length
cocnsole.log(mensajesN , mensajesnorm)

let mensajesD = normalizr.denormalize(mensajesN.result, schemaMensajes, mensajesN.entities)

let mensajesdesnormalizados = JSON.stringify(mensajesD).length
console.log(mensajesdesnormalizados, mensajesD)

let porcentaje= parseInt((mensajesnorm * 100)/ mensajesdesnormalizados)
console.log(`porcentaje ${porcentaje}`)

console.log(mensajesD.mensaje)
const html = chatLista(mensajesD.mensaje)
document.getElementById('mensaje').innerHTML = html

})

function chatLista(mensaje) {
    return mensaje.map((msj)=>{ 
    return `<span><b style="color: blue">${msj.email}:
     </b></span> <span style="color: brown">${msj.usuarioMensaje}:  </span>
     <span><b style="color: green; font-style: italic;">${msj.fecha}</b></span> `
}).join('<br >')}
document.querySelector('#chathistorial').innerHTML = msj


/*----------------- login-----------------------*/

/*const usuarioLogin =  document.querySelector('#usuarioLOGIN').value;
const formulario = document.getElementById('forprod').value;
const inputUser = document.querySelector('#ingresar').value
const loginUsuarios = document.querySelector('#loginUsuarios')
console.log (usuarioLogin)



 /*socket.on("renderUsuario", dataUsuario =>{
    console.log( `usuario`, dataUsuario.MongoSTore)
    render(dataUsuario.MongoSTore);
  });
const envioUsuario = ()=>{
    const envionombre =usuarioLogin
    loginUsuarios.innerHTML = envioUsuario

}


function render(usuarioLogin) {
    let html = usuarioLogin.map( (elem)=> {
        return `<div> <h2>${elem.usuario}</h2> </div>`;         
      }).join('<br>')
      console.log(html);
      console.log(renderUsuario);
  
    document.getElementById("loginUsuarios").innerHTML = html;
  }
  console.log(render())
 

   inputUser.addEventListener('submit', e =>{
    e.preventDefault()
   console.log('hola mundo ')

    const usuarioLog = document.querySelector('#usuarioLOGIN').value;
    return usuarioLog
     })*/

