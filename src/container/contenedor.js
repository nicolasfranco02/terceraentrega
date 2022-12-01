import { promises as fs } from 'fs'


export class ContenedorJSON {
    constructor(ruta){
        this.ruta= ruta
    }

    async getAll(){
        try {
         const objs=  await fs.readFile(this.ruta, `utf-8`);

           return JSON.parse(objs)
        } catch (error) {
            console.log(error)
        }
    }

   async save(obj) {
    try {
        const objs = await this.getAll();

        let nuevoId;
    if (objs.length == 0) {
        nuevoId = 1    
    }else{
         nuevoId= objs[objs.length -1].id + 1
    }

    const nuevoObj = { id: nuevoId, ...obj}
    objs.push(nuevoObj);

   await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));

        return nuevoId;
    } catch (error) {
        console.log("error", error)
        
    }
   }
   async actualizar(id, newObj){
    try {
        const objs = await this.listarAll();
        const indexObj = objs.findIndex((o)=> o.id == id);

        if (indexObj == -1) {
            return 'Objeto no encontrado'
        } else {
            objs[indexObj] = {id, ...newObj};
            await fs.writeFile(this.ruta, JSON.stringify(objs, null, 2));
        }
        return {id, ...newObj};
    } catch (error) {
        console.log('error al actualziar')
    }
}

     
   async getById(id){
        try {
            const objs = await this.getAll();
            const indexObjs = objs.find((o)=> o.id== id)

            return indexObjs

        } catch (error) {
            console.log(error)
        }
    }

   async deleteByid(id){
      try {
        const objs = await this.getAll();
        const indexObj= objs.findIndex((o)=>o.id == id);
        
        if (indexObj == -1) {
            return "no se encuentra ese elemento"            
        } else {
            objs.splice(indexObj, 1 );
            await fs.writeFile(this.ruta, JSON.stringify(objs, null,2));
        }
      } catch (error) {
        console.log(error)
      }
    }
async deleteAll(){
  try {
    const objs = await this.getAll();
    objs.length=0
    await fs.writeFile(this.ruta, JSON.stringify(objs, null,2));
  } catch (error) {
    console.log(error)
  }
}

}


export default ContenedorJSON;