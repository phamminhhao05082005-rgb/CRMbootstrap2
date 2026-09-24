document.addEventListener('DOMContentLoaded', () => {
    const offcanvasEl = document.getElementById('notesOffcanvas');
    const btnGoToCreate = document.getElementById('btnGoToCreate');
    const btnGoBack = document.getElementById('btnGoBack');
    const colorCircles = document.querySelectorAll('.color-circle');

    btnGoToCreate.addEventListener('click', () => {
        offcanvasEl.classList.add('show-create');
    });

    btnGoBack.addEventListener('click', () => {
        offcanvasEl.classList.remove('show-create');
    });

    offcanvasEl.addEventListener('hidden.bs.offcanvas', () => {
        offcanvasEl.classList.remove('show-create');
    });

    colorCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            colorCircles.forEach(c => c.classList.remove('active'));
            circle.classList.add('active');
        });
    });
});