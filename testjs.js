// ==========================================================================
// CRM Components Library - JavaScript Engine (testjs.js)
// ==========================================================================

// 1. Hàm hiển thị Toast thông báo copy thành công
function showToast(message = "Đã copy mã nguồn thành công!") {
    let toast = document.getElementById('copyToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copyToast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${message}`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2200);
}

// 2. Hàm hỗ trợ copy code kèm hiệu ứng trên nút bấm
function copyCode(elementId, btnElement) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const codeContent = el.innerText;

    const onCopySuccess = () => {
        showToast("Đã copy mã nguồn vào bộ nhớ tạm!");
        if (btnElement) {
            const originalHtml = btnElement.innerHTML;
            btnElement.classList.add('btn-copied');
            btnElement.innerHTML = '<i class="bi bi-check2 me-1"></i> Đã copy!';
            setTimeout(() => {
                btnElement.classList.remove('btn-copied');
                btnElement.innerHTML = originalHtml;
            }, 2000);
        }
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(codeContent)
            .then(onCopySuccess)
            .catch(() => fallbackCopy(codeContent, onCopySuccess));
    } else {
        fallbackCopy(codeContent, onCopySuccess);
    }
}

// 3. Fallback copy cho trình duyệt không hỗ trợ Clipboard API hoặc trên giao thức file:///
function fallbackCopy(text, callback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful && callback) callback();
    } catch (err) {
        console.error('Không thể copy', err);
    }
    document.body.removeChild(textArea);
}

// 4. Quản lý chuyển đổi Tab trên thanh navigation bên trái (Sidebar)
function setupTabNavigation() {
    const navButtons = document.querySelectorAll('#componentTabs button[data-bs-toggle="pill"], #componentTabs .nav-link');
    const tabPanes = document.querySelectorAll('#componentTabsContent > .tab-pane');

    if (!navButtons.length) return;

    function activateTabByTarget(targetSelector, updateHash = true, scrollToTop = true) {
        if (!targetSelector) return;
        const targetPane = document.querySelector(targetSelector);
        if (!targetPane) return;

        // 1. Cập nhật trạng thái active cho tất cả các nút trên sidebar nav
        navButtons.forEach(btn => {
            const btnTarget = btn.getAttribute('data-bs-target') || btn.getAttribute('href');
            if (btnTarget === targetSelector) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });

        // 2. Chuyển đổi hiển thị các tab-pane (độc lập 100%, không bị ảnh hưởng nếu Bootstrap JS lỗi/offline)
        tabPanes.forEach(pane => {
            if ('#' + pane.id === targetSelector) {
                pane.classList.add('active');
                requestAnimationFrame(() => {
                    pane.classList.add('show');
                });
            } else {
                pane.classList.remove('active', 'show');
            }
        });

        // 3. Cập nhật URL Hash an toàn (try-catch ngăn chặn lỗi security trên giao thức file:///)
        if (updateHash) {
            try {
                if (window.location.hash !== targetSelector) {
                    history.replaceState(null, null, targetSelector);
                }
            } catch (e) {
                // An toàn trên file:///
            }
        }

        // 4. Cuộn trang lên đầu mượt mà
        if (scrollToTop) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            if (document.documentElement) document.documentElement.scrollTop = 0;
            if (document.body) document.body.scrollTop = 0;
        }
    }

    // Gắn sự kiện click cho từng nút nav trên sidebar
    navButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const targetSelector = this.getAttribute('data-bs-target') || this.getAttribute('href');
            activateTabByTarget(targetSelector, true, true);
        });
    });

    // Hàm đồng bộ tab từ URL hash hiện tại
    function syncFromHash() {
        const hash = window.location.hash;
        if (!hash) return;

        // Trường hợp hash là ID của tab-pane
        const matchingBtn = document.querySelector(`#componentTabs button[data-bs-target="${hash}"]`) ||
                            document.querySelector(`#componentTabs button[data-bs-target="#tab-${hash.replace('#', '')}"]`);
        if (matchingBtn) {
            const target = matchingBtn.getAttribute('data-bs-target');
            activateTabByTarget(target, false, false);
            return;
        }

        // Trường hợp hash là ID của một mục con bên trong tab-pane (ví dụ #sidebar-mau-1)
        try {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                const parentPane = targetElement.closest('.tab-pane');
                if (parentPane) {
                    activateTabByTarget('#' + parentPane.id, false, false);
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                }
            }
        } catch (err) {}
    }

    // Đồng bộ khi tải trang
    syncFromHash();

    // Lắng nghe khi bấm Back/Forward trên trình duyệt
    window.addEventListener('hashchange', () => {
        syncFromHash();
    });

    // Lắng nghe các liên kết nhảy nhanh (Quick jump links) bên trong nội dung
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link || link.closest('#componentTabs')) return;
        const hash = link.getAttribute('href');
        if (!hash || hash === '#') return;

        try {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                const parentPane = targetElement.closest('.tab-pane');
                if (parentPane && !parentPane.classList.contains('active')) {
                    activateTabByTarget('#' + parentPane.id, true, false);
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 80);
                }
            }
        } catch (err) {}
    });
}

// Khởi chạy khi tài liệu sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTabNavigation);
} else {
    setupTabNavigation();
}
