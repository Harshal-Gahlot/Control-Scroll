chrome.storage.local.get(['total_shorts_of_day', 'SHORTS_LIM', 'TIME_LIM', 'total_shorts_watch_time'], (data) => {
    const total_shorts_of_day = data.total_shorts_of_day || '-';
    const total_shorts_watch_time = data.total_shorts_watch_time || '-';

    document.getElementById('shorts_count').textContent = total_shorts_of_day;
    document.getElementById('total_shorts_watch_time').textContent = total_shorts_watch_time;

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