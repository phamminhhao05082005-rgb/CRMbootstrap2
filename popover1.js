document.addEventListener('DOMContentLoaded', () => {
    
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.getElementById('searchBoxTrigger');
    const searchPopover = document.getElementById('searchPopover');

    searchInput.addEventListener('focus', () => {
        searchPopover.classList.add('show');
        searchBox.classList.add('active');
    });

    document.addEventListener('click', (e) => {
        const isClickInside = searchBox.contains(e.target) || searchPopover.contains(e.target);
        
        if (!isClickInside) {
            searchPopover.classList.remove('show');
            searchBox.classList.remove('active');
        }
    });

});