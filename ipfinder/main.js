var form = document.getElementById('form');
var search = document.getElementById('search');
var innerDiv = document.querySelector('.innerDiv');
input = document.getElementById('search');
var btn = document.getElementById('btn');

form.addEventListener('submit', (event) => {
    getapi(search.value);
    event.preventDefault();
})

const showtext = (data) => {
    console.log(data);
    input.value = data.ip;
    innerDiv.innerHTML = `<h1>This is Your IP Address</h1>
    <p style="font-size: 12px; width: 400px;
        text-align: center; font-weight: 350;">You can now copy it.</p>`;
    
}



const getapi = async (name) => {
    innerDiv.innerHTML = '<h1>Loading...</h1>';
    const url = `https://api.ipify.org/?format=json`;
    const response = await fetch(url);
    const data = await response.json();
    return showtext(data);
}