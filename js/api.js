const URL = 'https://cats.petiteweb.dev/api/single/'
class ApiCats{
    constructor(name){
        this.url = `${URL}${name}`
    }
    getAllCats(){
        return fetch(`${this.url}/show`)
    }
    getCat(id){
        return fetch(`${this.url}/show/${id}`)
    }
    postCat(cat){
        return fetch(`${this.url}/add`,{
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            'body': cat,
            
        })
    }
    deleteCat(id){
       return fetch(`${this.url}/delete/${id}`,{
            method: 'delete'
        })  
    }
    putCat(id,cat){
        return fetch(`${this.url}/update/${id}`,{
            method: 'put',
            headers: {
                "Content-Type": "application/json",
            },
            'body': cat,
        })
    }
}

const api = new ApiCats('Nikoo90')