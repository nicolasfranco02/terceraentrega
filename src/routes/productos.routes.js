import { Router } from 'express';
import ContenedorArchivo from '../container/Contenedor.js';

const routerProd = Router();
const produc = ContenedorArchivo;

/*------ base de datos -------*/


routerProd.get('/', async (req, res) => {
    const articulos= await produc.getAll();
    res.send(articulos).status(200);
});

routerProd.post('/',async (req, res) => {  
     const guardarProdutos= await produc.save(req.body)
    res.status(201).json(guardarProdutos);
});
routerProd.put('/:id',async (req, res) => {
    const id = req.params.id;
     const actualizarProdutos= await produc.actualizar(id , req.body)
    res.status(201).json(actualizarProdutos);

});

routerProd.get('/:id', async (req, res) => {
        const id = req.params.id;
        const productoId =await produc.getById(id);
        res.status(200).json(productoId);
});
routerProd.delete('/:id', async (req, res) => { 
    const id = req.params.id;
    const eliminarId =await produc.deleteByid(id);
    res.status(200).json(eliminarId);
});

export default routerProd;
