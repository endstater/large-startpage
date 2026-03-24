let data = localStorage.getItem('data');
let iterator = 0;
if (!data){
    data = {last:[], links:{},"maxid":0};
    updateData();
} else {
    data = JSON.parse(data);
}

const addButton = document.getElementById('addButton');
const addMarkUrl = document.getElementById('addMarkUrl');
const addMarkText = document.getElementById('addMarkText');
const searchMarks = document.getElementById('searchMarks');
const content = document.getElementById('content');

addButton.addEventListener('click',addMark);
searchMarks.addEventListener('input',e=>{draw(e.target.value);});
document.body.addEventListener('keydown',e=>{input(e);});

function input(e){
    const cards = document.getElementsByClassName('mcard');
    switch(e.keyCode){
        case 13:
            const id = cards[iterator].getAttribute('element');
            data['last'] = data['last'].filter(item => item !== id);
            data['last'].unshift(id);
            updateData();
            cards[iterator].childNodes[1].click();
        break;
        case 38:
            if (iterator===0)break;
            cards[iterator].classList.remove('selected');
            iterator--;
            cards[iterator].classList.add('selected');
            cards[iterator].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
                });
        break;
        case 40:
            if (iterator === cards.length-1)break;
            cards[iterator].classList.remove('selected');
            iterator++;
            cards[iterator].classList.add('selected');
            cards[iterator].scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        break;
    }
}

function comparable(text){
    return text.split(' ').join('').toLowerCase();
}

function deleteElement(e){
    const id = e.target.parentNode.getAttribute('element');
    delete data['links'][id];
    updateData();
    e.target.parentNode.remove();
}

function addDiv(key, value){
    const div = document.createElement('div');
    const icon = document.createElement('div');
    let url = value.url;
    if (url.slice(0,4) !== 'http') url = 'https://'+value.url;
    const domain = url.split('/')[2];
    icon.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" class="size-[1.4rem]">`;
    icon.setAttribute('class',`
size-[2.4rem]
bg-[#43464f]
rounded-4xl
flex
items-center
justify-center
        `)
    div.setAttribute('class',`
bg-[#23262f]
p-2
mcard
my-8
w-1/2
rounded-xl
mx-auto
my-3
flex
items-center
justify-between
row
        `);
    div.setAttribute('element', key);
    div.appendChild(icon);
    div.innerHTML += `<a href="${url}">${value.text}</a>`;
    const close = document.createElement('button');
    close.innerHTML = '⨯';
    close.setAttribute('class',`
bg-[#334]
size-[1.4rem]
float-right
rounded-xl
        `);
    close.addEventListener('click',e=>{deleteElement(e);});
    div.appendChild(close);
    content.appendChild(div);
}

function addPreviewDiv(key, value, content){
    const div = document.createElement('div');
    const icon = document.createElement('div');
    let url = value.url;
    if (url.slice(0,4) !== 'http') url = 'https://'+value.url;
    const domain = url.split('/')[2];
    icon.innerHTML = `<img src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" class="size-[1.4rem]">`;
    icon.setAttribute('class',`
size-[2.4rem]
bg-[#43464f]
rounded-4xl
flex
items-center
justify-center
        `)
    div.setAttribute('class',`
bg-[#23262f]
p-2
mcard
h-[4rem]
w-[10rem]
my-8
rounded-xl
mx-auto
my-3
flex
items-center
justify-between
row
        `);
    div.setAttribute('element', key);
    div.appendChild(icon);
    div.innerHTML += `<a href="${url}">${value.text}</a>`;
    const close = document.createElement('button');
    close.innerHTML = '⨯';
    close.setAttribute('class',`
bg-[#334]
size-[1.4rem]
float-right
rounded-xl
        `);
    close.addEventListener('click',e=>{deleteElement(e);});
    div.appendChild(close);
    content.appendChild(div);
}

function draw(exp=''){
    iterator = 0;
    if(!exp) exp = '';
    content.innerHTML = '';
    if (exp == ''){
        const previewContainer = document.createElement('div');
        previewContainer.setAttribute('class',`
w-full
h-full
grid
lg:grid-cols-5 sm:grid-cols-2
p-2
auto-rows-[5rem] gap-5 
            `);
        content.appendChild(previewContainer);
        for(let [key,value] of Object.entries(data['links'])){
            if(comparable(value['text']).indexOf(comparable(exp)) !== -1){
                addPreviewDiv(key, value,previewContainer);
            }
        }
    return;
    }
    for(let [key,value] of Object.entries(data['links'])){
        if(comparable(value['text']).indexOf(comparable(exp)) !== -1){
        addDiv(key, value);
        }
    }
    document.getElementsByClassName('mcard')[iterator].classList.add('selected');
}

function updateData(){
    localStorage.setItem('data', JSON.stringify(data))
}

function addMark(){
    data['maxid']++;
    const id = data['maxid'];
    data['links'][id] = {url:addMarkUrl.value, text:addMarkText.value};
    addMarkUrl.value = '';
    addMarkText.value = '';
    updateData();
    draw();
}

draw();