const Store = require('electron-store');
const store = new Store();

module.exports = {
    splash_screen(req, res) {
        return res.render('splash_screen');
    },

    index(req, res) {
        let alarms = [];

        for (let i = 0; i <= store.get('LAST_ID'); i++) {
            alarm = {
                name: store.get(`alarm_${i}.alarm_name`),
                time: store.get(`alarm_${i}.alarm_time`),
                weekdays: store.get(`alarm_${i}.alarm_weekdays`)
            };   

            alarms.push(alarm);
        }

        return res.render('index', { alarms });
    },

    create_alarm(req, res) {
        return res.render('create_alarm');
    },

    create_reminder(req, res) {
        return res.render('create_reminder');
    }
}