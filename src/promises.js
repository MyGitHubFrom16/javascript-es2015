'use strict';

let movieList = document.getElementById('movies');

function addMovieToList(movie) {
    let img = document.createElement('img');
    img.src = movie.Poster;
    movieList.appendChild(img);
}

function getData(url) {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let json = JSON.parse(xhr.response);
                resolve(json.Search);
            } else {
                reject(xhr.statusText);
            }
        };
        
        xhr.onerror = function(error) {
            reject(error);
        };
        
        xhr.send();
    });
}

let batman = getData('http://www.omdbapi.com/?s=batman');
let superman = getData('http://www.omdbapi.com/?s=superman');

// batman
//     .then(movies =>
//         movies.forEach(movie =>
//             addMovieToList(movie)))
//     .catch(error => console.error(error));
    
// superman
//     .then(movies =>
//         movies.forEach(movie =>
//             addMovieToList(movie)))
//     .catch(error => console.error(error));

Promise.race([batman, superman])
    .then(movies =>
        movies.forEach(movie =>
            addMovieToList(movie)))
    .catch(error => console.error(error));

/*
Promise/Обещание
    состояния:
        - Panding           -- ожидание, пока обещание выполняеться
        - Resolved          -- сдержаное обещание
        - Rejected          -- не сдержаное обещание
    методы:
        then(resolve, reject)   -- then/далее
        catch(errorFunction)    -- функция, выполняемая при не выполнении обещания

Создание Обещаний
    new Promise(function(resolve, reject){...}

    Promise.all([p1, p2, p3]) .then().catch();
       ожидание, дожидаеться вып. всех ожиданий,
        при возникновении ошибки также дожидаеться вып. всех ожиданий,
        возврашает массив значений, возвращаемых ожиданиями 
        в порядке отправки ожиданий в метод all
        
    Promise.race([p1, p2, p3]) .then().catch();
       возврашает значение, возвращаемое только первым выполненым обещанием 

    моментальные перевод в состояние
        Promise.resolve();
        Promise.rejecte();

Обещание выполнояется или не выполняется только один раз, т.е.
    поменять состояние Resolved на Rejected нельзя

    для того, что бы использовать методы then по цепочке,
      необходимо каждый раз создавать и выполнять обещание
      [это делается автоматически]
      promis(x)
        .then(fn1) - после вып.fn1,созд.нов.обещание кот.передается дальше,
                     нов.обещанию присв.fn2 -если оно будет выполнено 
        .then(fn2)
        .catch(...)
        .then(fn3)
      параметры, передаваемые Обещанием, передаються в fn1, не доступны в fn2 
      для передачи параметра из fn1 в fn2, его нужно вернуть из fn1

*/

function applyForVisa(documents){
    console.info('Обработка заявления ...');
    // create Promise
    let promis = new Promise(function(resolve, reject){
            // имитация задержки AJAX запроса
            setTimeout(function(){
                if (Math.random() > 0) {
                    // Resolved
                    let visa = {};
                    resolve(visa);
                } else {
                    // Rejected
                    reject('В визе отказано');
                }
            }, 2000);
    });
    return promis;  // возвращаем из функции Promise
}

function getVisa(visa){
    console.info('Виза получена');
    return new Promise(function(resolve, reject){
        resolve('visa');
    });
}

function bookHotel(visa){
    console.info('Бронируем отель', visa);
    return Promise.resolve('Отель забронирован');
};
function buyTickets(booking){
    console.info('Покупаем билеты', booking)
};

applyForVisa({})
    .then(getVisa)
    .then(bookHotel)
    .then(buyTickets)
    .catch(reason => console.error(reason));


/* -------------------------------------------------------
   недостатки простого подхода
*/
/*
    function applyForVisa(documents, resolve, reject){
        console.info('Обработка заявления ...');
        setTimeout(function(){
            let visa = {'visa': true};
            Math.random() > .5 ? resolve(visa) : reject('В визе отказано: не достаточно документов!');
            // 1й недостаток: после выполнения основного/ожидаемого кода,
            // может быть выполнен, при наличии, следующий код
        }, 1000);
    };

    function bookHotel(visa, resolve, reject){
        console.info('Бронируем отель ...');
        setTimeout(function(){
            let reservation = {'reservation': true};
            Math.random() > .5 ? resolve(reservation) : reject('Отель не забронирован: нет мест!');
        }, 1000);
    };

    function buyTickets(reservation, resolve, reject){
        console.info('Покупаем билеты ...');
        setTimeout(function(){
            let isBuy = {'isBuy': true};
            Math.random() > .5 ? resolve(isBuy) : reject('Билет не куплены: то шо нехуй!');
        }, 1000);
    };

    // 2й недостаток: Callback Hell
    applyForVisa({}, function(visa){
                        console.info('Виза получена', visa);
                        bookHotel(visa, function(reservation){
                            console.info('Отель забронирован', reservation);
                            buyTickets(visa, function(isBuy){
                                console.info('Билеты куплены', isBuy);
                            }, function(error){
                                console.error(error);                        
                            });
                        }, function(error){
                            console.error(error);                        
                        });
                    },
                    function(error){
                        console.error(error);
                    }
                );
*/