document.addEventListener("DOMContentLoaded", () => {

    // ===== 1) systemInfo -> localStorage =====
    const systemInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: screen.width,
        screenHeight: screen.height,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        currentTime: new Date().toString(),
        cookiesEnabled: navigator.cookieEnabled
    };

    localStorage.setItem("systemInfo", JSON.stringify(systemInfo));
    console.log("System info saved:", systemInfo);

    // ===== 1b) показати localStorage у футері =====
    const storageDiv = document.getElementById("storageDump");
    if (!storageDiv) {
        console.error("НЕ знайдено елемент #storageDump у HTML");
        return;
    }

    let output = "<h3>LocalStorage:</h3><ul>";

    if (localStorage.length === 0) {
        output += "<li>(localStorage порожній)</li>";
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            output += `<li><strong>${key}</strong>: ${value}</li>`;
        }
    }

    output += "</ul>";
    storageDiv.innerHTML = output;

    // ===== 2) Коментарі з JSONPlaceholder =====
    fetch("https://jsonplaceholder.typicode.com/posts/16/comments")
        .then(res => res.json())
        .then(comments => {
            const list = document.getElementById("commentsList");
            if (!list) {
                console.error("НЕ знайдено елемент #commentsList у HTML");
                return;
            }

            list.innerHTML = "";

            comments.forEach(c => {
                const item = document.createElement("div");
                item.className = "comment";
                item.innerHTML = `
          <h4>${c.name}</h4>
          <p><strong>Email:</strong> ${c.email}</p>
          <p>${c.body}</p>
        `;
                list.appendChild(item);
            });
        })
        .catch(err => {
            console.error("Fetch error:", err);
            const list = document.getElementById("commentsList");
            if (list) list.textContent = "Помилка завантаження коментарів.";
        });

    // ===== 3) Модалка через 1 хв =====
    const modal = document.getElementById("feedbackModal");
    const closeBtn = document.getElementById("modalClose");

    if (modal && closeBtn) {
        setTimeout(() => {
            modal.classList.add("show");
        }, 60000); // 60 секунд

        closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("show");
        });
    } else {
        console.warn("Модалка не знайдена: перевір id feedbackModal або modalClose");
    }

    // ===== 4) Тумблер теми + авто 07:00-21:00 =====
    const toggle = document.getElementById("themeToggle");

    function applyTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark");
            if (toggle) toggle.checked = true;
        } else {
            document.body.classList.remove("dark");
            if (toggle) toggle.checked = false;
        }
    }

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const hour = new Date().getHours();
        const autoTheme = (hour >= 7 && hour < 21) ? "light" : "dark";
        applyTheme(autoTheme);
    }

    if (toggle) {
        toggle.addEventListener("change", () => {
            const newTheme = toggle.checked ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            applyTheme(newTheme);
        });
    }

});