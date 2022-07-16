var form = document.getElementById('form');
var search = document.getElementById('search');
var innerDiv = document.querySelector('.innerDiv');


form.addEventListener('submit', (event) =>{
    getapi(search.value);
    event.preventDefault();
})


const showtext = (data) =>{
    if (data.gender == "male") {
    innerDiv.innerHTML = `
    <div>
        <h1>Your gender is ${data.gender} 👦🏻</h1>
    </div>`
    } else {
        innerDiv.innerHTML = `
    <div>
        <h1>Your gender is ${data.gender} 👩🏻</h1>
    </div>
    `;
    }

}

var api = fetch("https://api.publicapis.org/entries");



const getapi = async (name) =>{
    innerDiv.innerHTML = '<h1>Loading...</h1>';
    const url = `https://api.genderize.io/?name=${name}`;
    const response =  await fetch(url);
    const data  = await response.json();
    return showtext(data);
}