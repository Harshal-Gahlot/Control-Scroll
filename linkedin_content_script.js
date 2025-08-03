function core() {
    if (!location.pathname.startsWith("/feed/")) {
        console.log("linkedin but not core i.e. not /feed/");
        setTimeout(core, 1000);
        return;
    }
    console.log("linkedin feed encountered");

    const data = getFromStorage('aaaaaaaaaaaaaaa');

    const posts_urn = document.getElementsByClassName("scaffold-finite-scroll__content")[0];
    let timer = 0;
    const timerID = setInterval(() => {
        timer++;
        if (timer >= data.IN_TIME_LIM) {

            console.log("time over");
            displayMessage()
            clearInterval(timerID)
            return;

        }
        if (posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIM - 1}"]`)) {
            clearInterval(timerID);
            // can use posts_urn.nextElementSibling.remove() but this one supports older (IE11) as well
            posts_urn.parentNode.removeChild(posts_urn.nextElementSibling);

            let i = 0;
            const overflowed = posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIM + i}"]`);
            while (overflowed) {
                console.log("remoing overflowed:", data.IN_POSTS_LIM + i);
                overflowed.remove();
                i++;
                overflowed = posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIM + i}"]`);
            }

            return;
        }
    }, 1000);
}

async function getFromStorage() {
    const resolve = await new Promise((resolve) => {
        chrome.storage.local.get(['in_posts_seen',
            'in_time_spend',
            'in_posts_speer',
            'IN_TIME_LIM',
            'IN_POSTS_LIM',
            'in_hourly_reset',
            'in_daily_reset'],
            resolve);
    });

    const in_posts_seen = resolve.in_posts_seen ?? 0;
    const in_time_spend = resolve.in_time_spend ?? 0;
    const in_posts_speer = resolve.in_posts_speer ?? 0;
    const IN_TIME_LIM = resolve.IN_TIME_LIM ?? 10;
    const IN_POSTS_LIM = resolve.IN_POSTS_LIM ?? 10;
    const in_hourly_reset = resolve.in_hourly_reset ?? 0;
    const in_daily_reset = resolve.in_daily_reset ?? 0;

    return { in_posts_seen, in_time_spend, in_posts_speer, IN_TIME_LIM, IN_POSTS_LIM, in_hourly_reset, in_daily_reset };

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