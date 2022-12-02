import { Router } from "express";

import ContenedorArchivo from "../container/contenedor.js";


const routercarrito = Router();
const produc= ContenedorArchivo
const carrito = ContenedorArchivo

routercarrito.get('/:id/productos', async (req, res) => {    
    const id = req.params.id;
    const productoId =await produc.getById (id);
    res.status(200).json(productoId);
});

routercarrito.post('/agregar',async (req, res) => {
    res.status(201).json({id: await produc.save ({ productos:[] })});

});

routercarrito.delete('/:id', async (req, res) => { 
    const id = req.params.id;
    const eliminarId =await produc.deleteByid(id);
    res.status(200).json(eliminarId);
});

routercarrito.delete('/:id/productos/:id_prod', async (req, res) => { 
    const id = req.params.id;
    const idprod = req.params.id_prod;
   // const eliminarId =await produc.deleteByid(id);
    console.log(id , idprod);
    //res.status(200).json(eliminarId);
});

routercarrito.post('/:id/productos',async (req, res) => {
    const carrodecompras = await produc.getById(req.params.id);
    console.log( carrodecompras);
    const productoscarro= await carrito.getById(req.body.id)
    console.log(productoscarro)
    carrodecompras.productos.push(productoscarro)
    await produc.actualizar(carrodecompras)
    console.log(carrodecompras)
    res.end()
    

});

export default routercarrito;