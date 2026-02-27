document.addEventListener("DOMContentLoaded", () => {

    // 1) Зберігаємо systemInfo
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

    // 2) Виводимо localStorage у футер
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

    console.log("storageDump filled, length =", storageDiv.innerHTML.length);

    // 3) Коментарі з JSONPlaceholder
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
    // ===== ТЕМА =====
    const toggle = document.getElementById("themeToggle");

    // автоматичне визначення по часу
    function autoTheme() {
        const hour = new Date().getHours();
        if (hour >= 7 && hour < 21) {
            document.body.classList.remove("dark");
            toggle.checked = false;
        } else {
            document.body.classList.add("dark");
            toggle.checked = true;
        }
    }

    // якщо користувач вже вибрав тему раніше
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            toggle.checked = true;
        }
    } else {
        autoTheme();
    }

    // перемикання вручну
    toggle.addEventListener("change", () => {
        if (toggle.checked) {
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    });

});