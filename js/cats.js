
class Cats {
    constructor() {
       
    }
    async getCats(){
            const res = await api.getAllCats()
            if(!res.ok){
                throw Error(res.message)
            }
            const cats = await res.json()
            return cats
    }
    async getCat(id){
        const res = await api.getCat(id)
        if(!res.ok){
            throw Error(res.statusText)
        }
        const cat = await res.json()
        return cat
    }
    async editCat(id,cat) {
        const res = await api.putCat(id,cat)
        const mes = await res.json()
        if(!res.ok){
            throw Error(mes.message)
        }
        return mes.message
       
    }
    async addCat(cat){
        const res =  await api.postCat(cat)
        const mes = await res.json()
        if(!res.ok){
             throw Error(mes.message)
        }
        return mes.message
    }
    async deleteCat(id){
        const res = await api.deleteCat(id)
        const mes = await res.json()
        if(!res.ok){
            throw Error(mes.message)
        }
        return mes.message
    }

}

const cats = new Cats()

