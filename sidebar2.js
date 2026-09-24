document.addEventListener('DOMContentLoaded', () => {
    
    const sidebar = document.getElementById('gaSidebar');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        
        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.classList.remove('bi-chevron-left');
            toggleIcon.classList.add('bi-chevron-right');
        } else {
            toggleIcon.classList.remove('bi-chevron-right');
            toggleIcon.classList.add('bi-chevron-left');
        }
    });

    const allLinks = document.querySelectorAll('.nav-link-item:not(.w-100), .sub-link-item');
    
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            allLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

});