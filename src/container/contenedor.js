import { promises as fs } from 'fs'


export class ContenedorArchivo{
    constructor(){
        this.ruta= []
    }

     getAll(){ return [ ...this.ruta ]}

    save(elem) {
    
    let newId
    if (this.ruta.length == 0) {
        newId = 1
    } else {
        newId = this.ruta[ this.ruta.length - 1 ].id + 1
    }

    const newElem = { ...elem, id: newId }
    this.ruta.push(newElem)
    return newElem
}

actualizar(obj) {
    const index = this.ruta.findIndex(objs => objs.id == obj.id)
    if (index == -1) {
        throw new Error(`Error al actualizar: elemento no encontrado`)
    } else {
        this.ruta[ index ] = obj
        return obj
    }
}

  

    getById(id){
        try {
            const objs = this.ruta;
            const indexObjs = objs.find((o)=> o.id== id)

            return indexObjs

        } catch (error) {
            console.log(error)
        }
    }

    deleteByid(id){
        const index = this.ruta.findIndex(elem => elem.id == id)
        if (index == -1) {
            throw new Error(`Error al borrar: elemento no encontrado`)
        } else {
            return this.ruta.splice(index, 1)[ 0 ]
        }
    }
    
deleteAll(){
 this.ruta= []

}
}

export default ContenedorArchivo ;