
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
        const shorts_lim_chosen_value = shorts_lim_choose_select.value;
        chrome.storage.local.set({ SHORTS_LIM: shorts_lim_chosen_value });
    });

    const time_lim_choose_select = document.getElementById("time_lim_choose");
    if (data.TIME_LIM) time_lim_choose_select.value = data.TIME_LIM;

    time_lim_choose_select.addEventListener("change", () => {
        const time_lim_chosen_value = time_lim_choose_select.value;
        chrome.storage.local.set({ TIME_LIM: time_lim_chosen_value });
    });
});

chrome.storage.local.get([
    "in_total_posts_of_today",
    "in_total_posts_of_yesterday",
    "in_posts_speer_counter",
    "in_total_time_spend_today",
    "in_total_time_spend_yesterday",
    "IN_POSTS_LIMIT",
    "IN_TIME_LIMIT",
    "in_hourly_reset",
    "in_daily_reset"],
    (data) => {
        const total_posts_of_today = data.in_total_posts_of_today || '-';
        const total_posts_of_yesterday = data.in_total_posts_of_yesterday || '-';
        const total_time_spend_today = data.in_total_time_spend_today || '-';
        const total_time_spend_yesterday = data.in_total_time_spend_yesterday || '-';

        console.log(total_posts_of_today, total_posts_of_yesterday, total_time_spend_today, total_time_spend_yesterday)

        document.getElementById('posts_count').textContent = total_posts_of_today;
        document.getElementById('posts_count_yesterday').textContent = total_posts_of_yesterday;
        document.getElementById('total_posts_watch_time').textContent = total_time_spend_today;
        document.getElementById('total_posts_watch_time_yesterday').textContent = total_time_spend_yesterday;

        
    }
);

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    const tabContents = document.querySelectorAll('#tab-content > div');
    let prevBtn = tabButtons[0];
    let prevContent = tabContents[0];
    console.log('prevBtn, prevContent', prevBtn, prevContent);

    tabButtons.forEach(activeBtn => {
        activeBtn.addEventListener('click', () => {
            const activeContent = document.querySelector(activeBtn.dataset.tabTarget);

            if (activeContent.id != prevContent.id) {
                prevBtn.classList.remove('tab-active');
                prevContent.classList.add('hidden');
                activeBtn.classList.add('tab-active');
                activeContent.classList.remove('hidden');

                prevBtn = activeBtn;
                prevContent = activeContent;
            }
        });
    });
});