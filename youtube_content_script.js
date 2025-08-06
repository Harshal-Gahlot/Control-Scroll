function core() {
    // Check if the current page is a yt shorts video.
    if (location.pathname.startsWith('/shorts/')) {
        console.log('YouTube Shorts detected\n\n');
        chrome.storage.local.get(
            ['total_shorts_of_day', 'yesterday_total_shorts_of_day', 'shorts_spree', 'total_shorts_watch_time', 'yesterday_total_shorts_watch_time', 'SHORTS_LIM', 'TIME_LIM', 'reset_in', 'daily_reset_in'],
            ({ total_shorts_of_day = 0, yesterday_total_shorts_of_day = '-', yesterday_total_shorts_watch_time = '-', shorts_spree = 0, total_shorts_watch_time = 0, SHORTS_LIM = 3, TIME_LIM = 60, reset_in = 0, daily_reset_in = 0 }) => {

                console.log("TOP FIRST PRINTING ALL VALUES::::::::", 'total_shorts_of_day', total_shorts_of_day, 'shorts_spree', shorts_spree, 'total_shorts_watch_time', total_shorts_watch_time, 'SHORTS_LIM', SHORTS_LIM, 'TIME_LIM', TIME_LIM, 'reset_in', reset_in, "Current time: ", Date.now());

                // If the user has reached the shorts spree limit.
                if (reset_in > Date.now() && shorts_spree === 0) {
                    console.log('--------------------waiting for reset in:', (reset_in - Date.now()) / 1000, 'seconds or ', (reset_in - Date.now()) / 1000 / 60, 'minutes');
                    displayMessage("NO MORE SCROLLING BABY, GO BACK TO WORK BITCH!");
                    return;
                }

                const storage = new Set();
                let stopwatch = 0;
                let reset_in_flag = false;

                const timerId = setInterval(() => {
                    stopwatch++;
                    total_shorts_watch_time++; // Increment watch time

                    const id = location.pathname.slice(8);
                    storage.add(id);

                    if (stopwatch >= TIME_LIM * SHORTS_LIM || storage.size > SHORTS_LIM) {
                        displayMessage("ENOUGH !");
                        shorts_spree = 0;
                        chrome.storage.local.set({
                            shorts_spree
                        });
                        console.log('Time limit or spree limit reached, clearing interval');
                        clearInterval(timerId);
                        setTimeout(core, 1000);
                        return;
                    }

                    if (storage.size > shorts_spree) {
                        console.log('New short detected, increasing spree AND total shorts count to:', shorts_spree);
                        shorts_spree++;
                        total_shorts_of_day++;
                    }

                    if (shorts_spree === 1 && !reset_in_flag) {
                        reset_in_flag = true;
                        chrome.storage.local.set({
                            reset_in: Date.now() + 1000 * 60 * 60, // 60 min
                            SHORTS_LIM,
                            TIME_LIM
                        });
                        console.log('First short watched, setting reset timer:', Date.now() + 1000 * 60 * 60);

                        if (daily_reset_in < Date.now()) {
                            const date = new Date();
                            const hours_passed = date.getHours();
                            const min_passed = date.getMinutes();
                            const seconds_passed = date.getSeconds();

                            const seconds_left = (60 - seconds_passed) * 1000;
                            const min_left = (59 - min_passed) * 60000;
                            let hours_left;
                            if (hours_passed < 4) {
                                hours_left = (3 - hours_passed) * 3600000;
                            } else {
                                hours_left = (23 - hours_passed + 4) * 3600000;
                            }
                            const daily_reset = Date.now() + seconds_left + min_left + hours_left;

                            chrome.storage.local.set({
                                daily_reset_in: daily_reset,
                                yesterday_total_shorts_of_day: total_shorts_of_day,
                                yesterday_total_shorts_watch_time: total_shorts_watch_time,
                            });

                            chrome.storage.local.set({
                                total_shorts_of_day: 0,
                                total_shorts_watch_time: 0
                            });

                            console.log("DAILY_RESET_IN:", new Date(daily_reset).toString());

                        }

                    }

                    chrome.storage.local.set({
                        total_shorts_of_day,
                        shorts_spree,
                        total_shorts_watch_time
                    });

                    // console.log("-----------last msg", 'total_shorts_of_day:', total_shorts_of_day, 'shorts_spree:', shorts_spree, 'SHORTS_LIM:', SHORTS_LIM, 'TIME_LIM:', TIME_LIM, 'total_shorts_watch_time:', total_shorts_watch_time);
                    // console.log('reset_in:', reset_in, 'currentTime:', Date.now(), "able to watch:", reset_in > Date.now(), "\n\n\n\n");
                }, 1000);
            });
    } else {
        setTimeout(core, 1000);
    }
}

function displayMessage(msg) {
    document.documentElement.innerHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Shorts Limit Reached</title>
</head>
<body style="margin:0; padding:0; height:100vh; width:100vw; display:grid; place-items:center; background-color:black;">
    <h1 style="background-color:#f00; padding:20px; margin:0;">${msg}</h1>
</body>
</html>`;
}

core();