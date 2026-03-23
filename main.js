let data = localStorage.getItem('data');
if (!data){
    data = {links:{},"maxid":0};
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
searchMarks.addEventListener('input',e=>{draw(e.target.value)});

function comparable(text){
    return text.split(' ').join('').toLowerCase();
}

function addDiv(value){
    const div = document.createElement('div');
    div.innerHTML = `<a href="${value.url}">${value.text}</a>`;
    content.appendChild(div);
}

function draw(exp){
    if(!exp) exp = '';
    content.innerHTML = '';
    for(let [key,value] of Object.entries(data['links'])){
        if(comparable(value['text']).indexOf(comparable(exp)) !== -1){
            addDiv(value);
        }
    }
}

function updateData(){
    localStorage.setItem('data', JSON.stringify(data))
}

function addMark(){
    data['maxid']++;
    const id = data['maxid'];
    data['links'][id] = {url:addMarkUrl.value, text:addMarkText.value};
    updateData();
}