const { ipcRenderer } = require('electron');

const Store = require('electron-store');
const store = new Store();

// let Alarm = (title, time) => {
//     let newElement = `
//         <section class="rectangle alarms_created">
//             <span onclick="location.href='/create_alarm'">
//                 <h4>${title}</h4>
//                     <div class="weekdays">
//                         <a href="#">S</a>
//                         <a href="#">M</a>
//                         <a href="#">T</a>
//                         <a href="#">W</a>
//                         <a href="#">T</a>
//                         <a href="#">F</a>
//                         <a href="#">S</a>
//                     </div>
//                 <h4>${time}</h4>
//             </span>
//         </section>
//     `;

//     return newElement;
// }

// function getAlarm() {
//     let column_alarms = document.getElementsByClassName('column alarms')[0];
//     let alarms = column_alarms.getElementsByTagName('main')[0];
    
//     for (let i = 0; i <= store.get('LAST_ID'); i++) {

//         let element = Alarm(store.get(`alarm_${i}.alarm_name`), store.get(`alarm_${i}.alarm_time`));

//         let range = document.createRange();
//         range.selectNode(alarms);

//         var documentFragment = range.createContextualFragment(element);
//         alarms.appendChild(documentFragment);
//     }
// }

function createAlarm() {
    let alarm = {
        id: store.get('LAST_ID') == undefined ? 0 : store.get('LAST_ID') + 1,
        name: document.getElementById('alarm_name').value,
        time: document.getElementById('alarm_time').value,
        weekdays: 0
    };

    ipcRenderer.send('submitForm', alarm);    
}

let form = document.getElementById('create_alarm');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    createAlarm();
});

ipcRenderer.on('get_last_id', (event, id) => {
    console.log('last_id: ', id);
    store.set('LAST_ID', id);
});

