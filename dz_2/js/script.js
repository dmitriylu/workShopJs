
const formSerch = document.querySelector('.form-search'),
inputCitiesFrom = document.querySelector('.input__cities-from'),
dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
inputCitiesTo = document.querySelector('.input__cities-to'),
dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
// inputCitiesFrom = document.querySelector('.input__cities-from'),
inputDateDepart = document.querySelector('.input__date-depart');

// данные
const citiesApi = 'data.json',
// const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    API_KEY = 'dde16fa7a1491af575c5a1bc53a87865',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    proxy = 'https://cors-anywhere.herokuapp.com/';

// const city = ['Москва', 'Санкт-петербург','Нью-Йорк', 'Барселона', 'Дубай', 'Токио', 'Париж', 'Лондон', 'Харьков', 'Киев', 'Днепро', 'Орёл', 'Лисабон', 'Стамбул', 'Ворскла', 'Полтава', 'Нижний Новгород', 'Одесса', 'Каир'];
let city = [];

// функии
const getData = (url, callback) => {
    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) return;

        if(request.status === 200) {
            callback(request.response);
        }else {
            console.error(request.status)
        }
        
    });

    request.send();
}

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
    
        const filterCity = city.filter((item) => {
            // if(item.name) {
                const fixItem = item.name.toLowerCase();
                return fixItem.includes(input.value.toLowerCase());      
            // }
        });
        filterCity.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('dropdown__city');
            li.textContent = item.name;
            list.append(li);
            // console.log(li);
            
        })
    }      
};
const selectrCity = (event,input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = ''; 
    }    

};

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});
inputCitiesTo.addEventListener('input', () => {
    showCity(inputCitiesTo, dropdownCitiesTo)
});

dropdownCitiesFrom.addEventListener('click', (event) => {
    selectrCity(event, inputCitiesFrom, dropdownCitiesFrom)
});
dropdownCitiesTo.addEventListener('click', (event) => {
    selectrCity(event, inputCitiesTo, dropdownCitiesTo) 
});

// вызовы ф-кий
getData(citiesApi, (data) => {
    city = JSON.parse(data).filter(item =>  item.name);
    console.log(city);
});

