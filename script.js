// SUBSTITUA A URL ABAIXO PELA SUA URL DO APPS SCRIPT
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyqAWuSjYmUIhoBJ8LA01UoAGf7kPaRuGFNL2qMj0qGFY5hDhRGhQe3tt2ESGlAPrY/exec';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const scheduleList = document.getElementById('schedule-list');
    const message = document.getElementById('message');

    async function fetchSchedules() {
        const response = await fetch(`${SCRIPT_URL}?action=get`);
        const schedules = await response.json();
        renderSchedules(schedules);
    }

    function renderSchedules(schedules) {
        scheduleList.innerHTML = '';
        if (schedules.length === 0) {
            scheduleList.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
            return;
        }

        schedules.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA - dateB !== 0) return dateA - dateB;
            return a.startTime.localeCompare(b.startTime);
        });

        schedules.forEach(schedule => {
            const div = document.createElement('div');
            div.className = 'schedule-item';
            div.innerHTML = `
                <p><strong>Nome:</strong> ${schedule.name}</p>
                <p><strong>Data:</strong> ${schedule.date}</p>
                <p><strong>Horário:</strong> ${schedule.startTime} - ${schedule.endTime}</p>
                <p><strong>Assunto:</strong> ${schedule.subject}</p>
            `;
            scheduleList.appendChild(div);
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const date = document.getElementById('date').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const subject = document.getElementById('subject').value;

        const data = { name, date, startTime, endTime, subject };

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();

        if (result.status === 'success') {
            message.textContent = result.message;
            message.style.color = 'green';
            form.reset();
            fetchSchedules(); // Atualiza a lista após o agendamento
        } else {
            message.textContent = result.message;
            message.style.color = 'red';
        }
    });

    fetchSchedules(); // Carrega a agenda ao iniciar a página

});
