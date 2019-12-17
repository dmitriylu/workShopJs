document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const customer = document.getElementById('customer'),
        freelancer = document.getElementById('freelancer'),
        blockCustomer = document.getElementById('block-customer'),
        blockFreelancer = document.getElementById('block-freelancer'),
        blockChoice = document.getElementById('block-choice'),
        blockExit = document.getElementById('btn-exit'),
        formCastomer = document.getElementById('form-customer');

    const orders = [];

    customer.addEventListener('click', () => {
        blockChoice.style.display= 'none';   
        blockCustomer.style.display= 'block';
        blockExit.style.display= 'block';   
    })  
    freelancer.addEventListener('click', () => {
        blockChoice.style.display= 'none';
        blockFreelancer.style.display= 'block';
        blockExit.style.display= 'block';
    }) 
    
    blockExit.addEventListener('click', () => {
        blockExit.style.display= 'none';
        blockFreelancer.style.display= 'none';
        blockCustomer.style.display= 'none';
        blockChoice.style.display= 'block';

    })


    formCastomer.addEventListener('submit', (e) => {
        e.preventDefault();
        const obj = {};
        [...formCastomer.elements].forEach(element => {
            if((element.tagName === 'INPUT' && element.type !== 'radio')||
              (element.type === 'radio' && element.checked) ||
              element.tagName === 'TEXTAREA') {
                obj[element.name] = element.value;
            }
        });
        formCastomer.reset();
        orders.push(obj);        
        console.log(orders);
        
    })
   
})

 
