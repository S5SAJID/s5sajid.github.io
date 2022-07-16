var form = document.getElementById('form');
var search = document.getElementById('search');
var key = 'fe8f260a768386c5a447fbbc9bfb26cf';
var weatherDiv = document.querySelector('.wheather');


form.addEventListener('submit', (event) =>{
    getWheather(search.value);
    event.preventDefault();
})

const getWheather = async (city) =>{
    weatherDiv.innerHTML = `<h1>Loading...</h1>`;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    const response =  await fetch(url);
    const data  = await response.json();
    console.log(data);
    return showWheather(data);
}

const showWheather = (data) =>{
    if(data.cod == "404"){
        weatherDiv.innerHTML = "<h1>City not found !</h1>"
        return;
    }
    weatherDiv.innerHTML = `
    <style>
    h4{
        font-size: 20px; 
        margin-top: -10px; 
        font-weight: normal;
    }
    img{
        height: 150px;
    }
    .temp{
        padding-top: 10px;
        height: 100px;
    }
</style>
    <div>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="">
    </div>
    <div>
        <h1>${data.main.temp} C°</h1>
        <h4>${data.weather[0].main}</h4>
    </div>
    `;
    console.log(data.weather[0].main);

}
