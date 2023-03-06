class Modal {
    constructor($el){
        this.$el = $el
        this.handles = []  
    }

    open(actionClass=false, modalClass=false, modalHTML){
        this.$modal = document.createElement('div')
        modalClass ? this.$modal.classList.add(modalClass) : null
        if(!this.$el.classList.contains('hidden')){
            this.$el.innerHTML = ''
            this.$modal.insertAdjacentHTML('afterbegin',modalHTML)
            this.$el.append(this.$modal)
            this.$modal.classList.add()
            return
        }
       
        if(this.handles.length != 0){
            this.handles.forEach((handle)=>{
                const {type,func} = handle
                this.$el.addEventListener(type,func)
            })
        }
        this.$el.classList.toggle('hidden')
        this.$modal.insertAdjacentHTML('afterbegin',modalHTML)
        this.$el.append(this.$modal)
        setTimeout(()=>this.$modal.classList.add(actionClass))
       
    }

    close(){
        this.handles.forEach(handle=>{
            const {type,func} = handle
            this.$el.removeEventListener(type,func)
        })
        this.$modal.remove()
        this.$el.classList.toggle('hidden')
        
    }

    addHandle(option){
        this.handles.push(option)
    }

    deleteHandle(option){
        const indexHandle = this.handles.findIndex(item => item.type === option.type && item.func === option.func)
        if(indexHandle >= 0){
            this.handles.splice(indexHandle,1)
        }
    }

    
}

