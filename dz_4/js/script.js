
const formSerch = document.querySelector('.form-search'),
inputCitiesFrom = document.querySelector('.input__cities-from'),
dropdownCitiesFrom = document.querySelector('.dropdown__cities-from'),
inputCitiesTo = document.querySelector('.input__cities-to'),
dropdownCitiesTo = document.querySelector('.dropdown__cities-to'),
// inputCitiesFrom = document.querySelector('.input__cities-from'),
inputDateDepart = document.querySelector('.input__date-depart'),
cheapestTticket = document.getElementById('cheapest-ticket'),
otherCheapTickets = document.getElementById('other-cheap-tickets');


// данные
// const citiesApi = 'data.json',
const citiesApi = 'http://api.travelpayouts.com/data/ru/cities.json',
    API_KEY = 'dde16fa7a1491af575c5a1bc53a87865',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload',
    MAX_COUT = 10,
    proxy = 'https://cors-anywhere.herokuapp.com/';

// const city = ['Москва', 'Санкт-петербург','Нью-Йорк', 'Барселона', 'Дубай', 'Токио', 'Париж', 'Лондон', 'Харьков', 'Киев', 'Днепро', 'Орёл', 'Лисабон', 'Стамбул', 'Ворскла', 'Полтава', 'Нижний Новгород', 'Одесса', 'Каир'];
let city = [];

// функии

const getData = (url, callback, reject = console.error) => {

    const request = new XMLHttpRequest();

    request.open('GET', url);

    request.addEventListener('readystatechange', () => {
        if(request.readyState !== 4) return;

        if(request.status === 200) {
            callback(request.response);
        }else {
            reject(request.status)
        }
    });
        request.send();
};

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value !== '') {
        const filterCity = city.filter((item) => {
                const fixItem = item.name.toLowerCase();
                return fixItem.startsWith(input.value.toLowerCase());      
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

const getNameCity = (code) => {
    const objCity = city.find(item => item.code === code)
    return objCity.name;
    
}

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
       year: 'numeric',
       month: 'long',
       day: 'numeric',
       hour: '2-digit',
       minute: '2-digit', 
    })
}

// https://www.aviasales.ru/search/SVX2905KGD1

const getLinkAviasales = (data) => {
    let link = ' https://www.aviasales.ru/search/';
    link += data.origin;

    const date = new Date(data.depart_date);
    const day = date.getDate();
    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1;
    link += month < 10 ? '0' + month : month;
    link += data.destination;
    link += '1';

    console.log('link: ', link);
    


    return link;
}

const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'с одной пересадкой' : 'с несколькими пересадками'; 
    }else {
        return 'Без пересадок'
    }
};

const createCard = (data) => {
    const ticket = document.createElement('article');
    ticket.classList.add('ticket');

    let deep = '';
    if(data) {
        deep = `
            <h3 class="agent">${data.gate}</h3>
            <div class="ticket__wrapper">
                <div class="left-side">
                    <a href="${getLinkAviasales(data)}" target="_blank" class="button button__buy">Купить
                        за ${data.value}₽</a>
                </div>
                <div class="right-side">
                    <div class="block-left">
                        <div class="city__from">Вылет из города
                            <span class="city__name">${getNameCity(data.origin)}</span>
                        </div>
                        <div class="date">${getDate(data.depart_date)}</div>
                    </div>
            
                    <div class="block-right">
                        <div class="changes">${getChanges(data.number_of_changes)}</div>
                        <div class="city__to">Город назначения:
                            <span class="city__name">${getNameCity(data.destination)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }else {
        deep = '<h3>К сожелению нет билетов на эту дату!</h3>';
    }


    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
};

const renderCheapDay = (cheapTicket) => {
    cheapestTticket.style.display = 'block';
    cheapestTticket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    const ticket = createCard(cheapTicket[0]);
    cheapestTticket.append(ticket);    
}

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML =  '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTickets.sort((a, b) => a.value - b.value);
    for (let i = 0; i < cheapTickets.length && i < MAX_COUT; i++) {
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }

    console.log(cheapTickets);
}

const renderCheap = (data, date) => {
    const cheapTicketYear = JSON.parse(data).best_prices;
    
    const cheapTicketDay =  cheapTicketYear.filter((item) => {
        return item.depart_date === date;
    })

    renderCheapDay(cheapTicketDay);
    renderCheapYear(cheapTicketYear)
    
}
// обработчики событий

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
formSerch.addEventListener('submit', (event) => {
    event.preventDefault();


    const cityFrom = city.find((item) => inputCitiesFrom.value === item.name);
    const cityTo = city.find((item) => inputCitiesTo.value === item.name);
    const formData = {
        form: cityFrom,
        to: cityTo,
        when: inputDateDepart.value,
    }
    if (formData.form && formData.to) {
        const requestData = `?depart_date=${formData.when}&origin=${formData.form.code}&destination=${formData.to.code}&one_way=true`;
    // const requestData2 = '?depart_date=' + formData.when + '&origin=' + formData.form + '&destination=' + formData.to + '&one_way=true'; 

        getData(calendar + requestData, (response) => {
            renderCheap(response, formData.when);
        }, 
        (error) => {
            alert('В Этом направлении нет рейсов');
            console.error('Ошибка', error);
            
        });
    }else {
        alert('введите коректное название города');
    }

    

})


// вызовы ф-кий
getData(proxy + citiesApi, (data) => {
    city = JSON.parse(data).filter(item =>  item.name && item.destination && item.origin);

    city.sort( (a, b) => {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        return 0;
      });

    console.log(city);
});

