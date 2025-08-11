
chrome.storage.local.get(['total_shorts_of_day', 'SHORTS_LIM', 'TIME_LIM', 'total_shorts_watch_time', 'yesterday_total_shorts_of_day', 'yesterday_total_shorts_watch_time'], (data) => {
    const total_shorts_of_day = data.total_shorts_of_day || '-';
    const total_shorts_watch_time = data.total_shorts_watch_time || '-';
    const yesterday_total_shorts_of_day = data.yesterday_total_shorts_of_day || '-';
    const yesterday_total_shorts_watch_time = data.yesterday_total_shorts_watch_time || '-';

    document.getElementById('shorts_count').textContent = total_shorts_of_day;
    document.getElementById('total_shorts_watch_time').textContent = total_shorts_watch_time;
    document.getElementById('shorts_count_yesterday').textContent = yesterday_total_shorts_of_day;
    document.getElementById('total_shorts_watch_time_yesterday').textContent = yesterday_total_shorts_watch_time;

    const shorts_lim_choose_select = document.getElementById("shorts_lim_choose");
    if (data.SHORTS_LIM) shorts_lim_choose_select.value = data.SHORTS_LIM;

    shorts_lim_choose_select.addEventListener("change", () => {
        const shorts_lim_choosen_value = shorts_lim_choose_select.value;
        chrome.storage.local.set({ SHORTS_LIM: shorts_lim_choosen_value });
    });

    const time_lim_choose_select = document.getElementById("time_lim_choose");
    if (data.TIME_LIM) time_lim_choose_select.value = data.TIME_LIM;

    time_lim_choose_select.addEventListener("change", () => {
        const time_lim_choosen_value = time_lim_choose_select.value;
        chrome.storage.local.set({ TIME_LIM: time_lim_choosen_value });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('#tab-content > div');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = document.querySelector(button.dataset.tabTarget);

            // Hide all content panels
            tabContents.forEach(content => {
                content.classList.add('hidden');
            });

            // Deactivate all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('tab-active');
            });

            // Show the target content and activate the clicked button
            target.classList.remove('hidden');
            button.classList.add('tab-active');
        });
    });
});