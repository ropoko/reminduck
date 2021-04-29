let form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let name = document.getElementById('alarm_name').value;
    let time = document.getElementById('alarm_time').value;

    console.log(name);
    console.log(time);
})