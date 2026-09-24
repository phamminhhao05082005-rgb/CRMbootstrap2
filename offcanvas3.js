document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('tableSearchInput');
    const tableRows = document.querySelectorAll('.table-row');
    const checkboxes = document.querySelectorAll('.custom-checkbox');
    const pillsArea = document.getElementById('selectedPillsArea');

    let selectedItems = [];

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        tableRows.forEach(row => {
            const rowName = row.querySelector('.row-name').textContent.toLowerCase();
            const rowDesc = row.querySelector('.row-desc').textContent.toLowerCase();
            
            if (rowName.includes(searchTerm) || rowDesc.includes(searchTerm)) {
                row.style.display = ''; 
            } else {
                row.style.display = 'none'; 
            }
        });
    });

    const renderPills = () => {
        pillsArea.innerHTML = '';
        
        selectedItems.forEach((item) => {
            const colorClass = item.type === 'T' ? 'blue' : 'gray';
            
            const pillHtml = `
                <div class="filter-pill" data-value="${item.value}">
                    <div class="pill-icon ${colorClass}">${item.type}</div>
                    <span>${item.value}</span>
                    <i class="bi bi-x pill-close ms-2"></i>
                </div>
            `;
            pillsArea.insertAdjacentHTML('beforeend', pillHtml);
        });

        const closeBtns = pillsArea.querySelectorAll('.pill-close');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const pillElement = e.target.closest('.filter-pill');
                const valToRem = pillElement.getAttribute('data-value');
                
                checkboxes.forEach(cb => {
                    if (cb.value === valToRem) {
                        cb.checked = false;
                        cb.closest('.table-row').classList.remove('selected');
                    }
                });

                selectedItems = selectedItems.filter(i => i.value !== valToRem);
                renderPills();
            });
        });
    };

    checkboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            const val = e.target.value;
            const type = e.target.getAttribute('data-type');
            const row = e.target.closest('.table-row');

            if (e.target.checked) {
                
                selectedItems.push({ value: val, type: type });
                row.classList.add('selected');
            } else {
                
                selectedItems = selectedItems.filter(i => i.value !== val);
                row.classList.remove('selected');
            }

            renderPills();
        });
    });

    checkboxes[0].checked = true;
    checkboxes[1].checked = true;
    checkboxes[5].checked = true;
    
    checkboxes[0].dispatchEvent(new Event('change'));
    checkboxes[1].dispatchEvent(new Event('change'));
    checkboxes[5].dispatchEvent(new Event('change'));

});