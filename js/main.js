const $catsCard = document.querySelector('[data-cards]') 
const $modal = document.querySelector('[data-modal]')
const $btnAddCat = document.querySelector('[data-btn="add"]')
const $spinner = document.querySelector('[data-spinner]')

const modal = new Modal($modal)

const generateHtmlRatingCat = (rating,color) =>{
    const stars = [
        '<i class="fa-regular fa-star"></i>',
        '<i class="fa-regular fa-star"></i>',
        '<i class="fa-regular fa-star"></i>',
        '<i class="fa-regular fa-star"></i>',
        '<i class="fa-regular fa-star"></i>',
    ]
    const result = stars.map((star,i)=>{
        if(rating>i){
            return `<i style="color:${color}" class="fa-solid fa-star" data-star="${i+1}"></i>`
        }
        return `<i style="color:${color}" class="fa-regular fa-star" data-star="${i+1}"></i>`
    })
    return result.join('')
}

const generateHtmlCatCard = ({id,favorite,image,name,rate}) =>{
        return (
            ` <div class="cat-container" data-cat_id="${id}">
                <div class="container-cat-img">
                    <div class="cat-heart">
                        ${favorite ?'<i class="fa-solid fa-heart"></i>':'<i class="fa-regular  fa-heart"></i>'}
                    </div> 
                    <img src="${image}" width="100%"  alt="cat_${id}">
                </div>
                <div class="cat-name">${name}</div>
                <div class="rating-cat">
                    ${generateHtmlRatingCat(rate,'yellow')}
                </div>
                <div class="control-cat">
                    <button class="btn look-cat" data-btn="show"> Посмотреть</button>
                    <button class="btn delete-cat" data-btn="delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            `
        )
}

const generateHtmlFormCardCat = ({id,name,age,rate,favorite,image,description}, isDisabled=false, isSave=false) => {
        return (`
        <button class="modal__close" data-btn="close"><i class="fa-solid fa-xmark"></i></button>
                <form data-form_cat=${isSave ? "save" : 'change'} name='currentCat' class="modal__form">
                    <div class="form_group">
                        <p>ID</p>
                         <input type="text" name="id"  value="${id ? id : generateId(6)}"  disabled>
                    </div>
                    <div class="form_group" >
                        <p>Имя</p>
                        <input type="text" data-form name="name" ${isDisabled ? 'disabled' : ''} value="${name ? name : ''}">
                    </div>
                    <div class="form_group">
                        <p>Возраст</p>
                        <input type="number" data-form name="age" ${isDisabled ? 'disabled' : ''} value="${age ? age : ''}">
                    </div>
                    <div class="form_group">
                        <p>Рейтинг</p>
                        ${isDisabled ? `<div data-form="${rate}">${rate ? generateHtmlRatingCat(rate,'yellow') : ''}</div>` : `<input type="number" min=1 max=5 data-form name="rate" value="${rate}">`}
                    </div>
                    <div class="form_group">
                        <p>Нравится</p>
                        <label class="checkbox-like" for="like">
                            <input data-form type="checkbox" name="favorite" name="like" id="like" ${isDisabled ? 'disabled' : ''} ${favorite ? 'checked' : ''} >
                            <i class="fa-solid fa-heart"></i>
                        </label>
                    </div>  
                    <div class="form_group">
                        <p>URL картинки</p>
                        <textarea data-form name="image" ${isDisabled ? 'disabled' : ''} >${image ? image : ''}</textarea>
                    </div>   
                    <div class="form_group">
                        <p>Описание</p>
                        <textarea data-form name="description" ${isDisabled ? 'disabled' : ''}>${description ? description : ''}</textarea>
                    </div> 
                    <div data-form ${isDisabled ? 'class="form_group navigation"' : 'class="hidden"' }>
                        <button  class="btn form_btn" data-btn="edit">Редактировать</button>
                    </div>             
                    <div  data-form ${isDisabled ? 'class="hidden"' : 'class="form_group navigation"' }>
                        <button class="btn form_btn" data-btn="close">Отмена</button>
                        <button name="save"  class="btn form_btn" data-btn=${isSave ? "save" : "change"}>${isSave ? "Сохранить" : "Изменить"}</button>
                    </div>
                </form>
                
        `
        )
}


const generateHtmlModalError = (err)=>{
    return `
        <div class="modal__close" data-btn="close">
            <i class="fa-solid fa-xmark"></i>
        </div>
        <p>${err}</p>
        `
}

const generateId = (idLength) => {
    let id = ''
    for(let i = 0; i < idLength; i++){
        id+= Math.floor(Math.random()*10)
    }
    return Number(id)
}
const collectDateFromFormCat = (form) => {
    const objForm = Object.fromEntries(new FormData(form).entries())
    const idCat = Number(form.id.value)
    objForm.id = idCat
    objForm.age = Number(objForm.age)
    objForm.rate = Number(objForm.rate)
    objForm.favorite = objForm.favorite == 'on' ? true : false
    return JSON.stringify(objForm)
}

const renderCat = async ($el) => {
    try{
        $spinner.classList.remove('hidden')
        const catsArr = await cats.getCats()
        $spinner.classList.add('hidden')
        catsArr.forEach(cat=>{
            $el.insertAdjacentHTML('beforeend',generateHtmlCatCard(cat))
        }) 
    }
    catch(err){
        modal.open('','error', generateHtmlModalError(err))
        $spinner.classList.add('hidden')
    }   
}

const handleInput = () => {
    const $form = document.forms.currentCat
    if( $form.dataset.form_cat == 'save'){
        const jsonFormData = collectDateFromFormCat($form)
        localStorage.setItem('saveCat',jsonFormData)
    }
}

const handleBtnClick = async (event) => {
    try{
        const $el = event.target
        if($el == $modal){
            modal.close()
            return
        }
        switch($el.dataset.btn){
            case 'close':
                event.preventDefault()
                modal.close()
                break

            case 'edit':
                event.preventDefault()
                const cat =  JSON.parse(localStorage.getItem('change-cat'))
                const catHtml =  generateHtmlFormCardCat(cat)
                modal.open(null,'modal',catHtml)
                break
            case 'change':
                const $form = document.forms.currentCat
                const idCat = Number($form.id.value)
                const jsonCat = collectDateFromFormCat($form)
                await cats.editCat(idCat,jsonCat)
                modal.close()
                $catsCard.innerHTML = ''
                await renderCat($catsCard)
              
            
            case 'save':
                event.preventDefault()
                const $formCat = document.forms.currentCat
                if($formCat.name.value.length === 0){
                    $formCat.name.placeholder = "Введите имя"
                    $formCat.name.style.backgroundColor = "red"
                    return
                }
                $formCat.save.disabled = true
                const catJson = collectDateFromFormCat($formCat)
                await cats.addCat(catJson)
                localStorage.removeItem('saveCat')
                modal.close()
                $catsCard.innerHTML =''
                await renderCat($catsCard)
                break
        }
    } 
    catch(err){
        console.log(err)
        modal.open('ee','error',generateHtmlModalError(err))
    }
}

modal.addHandle({type:'click',func:handleBtnClick})
modal.addHandle({type:'input',func:handleInput})


renderCat($catsCard)

$catsCard.addEventListener('click', async (e)=>{
    try{
        const $el = e.target
        if($el.tagName.toLowerCase() === 'button'){
            const $elData = $el.dataset
            const $parantEl = $el.closest('[data-cat_id]')
            const idCat = Number($parantEl.dataset.cat_id)
            if($elData.btn == 'show'){
                $spinner.classList.remove('hidden')
                const cat = await cats.getCat(idCat)
                $spinner.classList.add('hidden')
                localStorage.setItem('change-cat',JSON.stringify(cat))
                const html = generateHtmlFormCardCat(cat,true)
                modal.open('action-down','modal',html)
            }
            if($elData.btn == 'delete'){
                const cat = await cats.deleteCat(idCat)
                $parantEl.remove();
            }
        }

    }
    catch(err){
        const errorHTML = generateHtmlModalError(err)
        modal.open(false,'error',errorHTML)
        $spinner.classList.add('hidden')
        
    }
})

$btnAddCat.addEventListener('click',()=>{
    const formDataFromLS = localStorage.getItem('saveCat')
    if(formDataFromLS){
        const parseData = JSON.parse(formDataFromLS)
        modal.open('action-down','modal',generateHtmlFormCardCat(parseData,false,true))
    }
    else {
        modal.open('action-down','modal',generateHtmlFormCardCat({},false,true))
    }
})
