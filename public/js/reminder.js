let form = document.getElementById('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();

    let name = document.getElementById('reminder_name').value;
    let time = document.getElementById('reminder_time').value;
    let text = document.getElementById('reminder_text').value;

    console.log(name);
    console.log(time);
    console.log(text);
});