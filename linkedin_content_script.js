async function core() {

    console.log("location parthname:", location.pathname);
    if (!location.pathname.startsWith("/feed/")) { // /tscp-serving/dtag
        console.log("linkedin but not /feed/");
        setTimeout(core, 1000);
        return;
    }

    const data = await getFromStorage();

    console.log('DAAATAAA', Date.now() < data.IN_TIME_LIMIT);

    if (Date.now() < data.IN_TIME_LIMIT) {
        console.log("TIME OVER");
        displayMessage('Enough posts read for now!');
        return;
    }

    console.log("linkedin feed encountered");


    const posts_urn = document.getElementsByClassName("scaffold-finite-scroll__content")[0];
    let timer = 0;
    let lim_reached = false;
    const timerID = setInterval(() => {
        console.log(timer, "timer going on...", location.pathname);
        timer++;
        let in_per_session_time_spend = chrome.storage.local.get('in_per_session_time_spend');
        chrome.storage.local.set({
            in_per_session_time_spend: in_per_session_time_spend + 1
        });

        if (lim_reached) {
            console.log("lim reached... waiting inside timer");
            chrome.storage.local.set({
                IN_TIME_LIMIT: Date.now() + 1000 * 60 * 60
            });
        }

        else if (timer >= data.IN_TIME_LIMIT) {
            console.log("timer over");
            displayMessage("Enough");
            clearInterval(timerID);
            return;
        }

        // console.log(posts_urn.querySelectorAll("h2.feed-skip-link__container").length);
        else if (posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIMIT - 1}"]`)) {
            // clearInterval(timerID);
            // can use posts_urn.nextElementSibling.remove() but this one supports older (IE11) as well
            posts_urn.parentNode.removeChild(posts_urn.nextElementSibling);
            console.log("URN IS FULL");
            lim_reached = true;
            chrome.storage.local.set({
                IN_TIME_LIMIT: Date.now() + 1000 * 60 * 60
            });

            let i = 0;
            let overflowed = posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIMIT + i}"]`);
            while (overflowed) {
                console.log("removing overflowed:", data.IN_POSTS_LIMIT + i);
                overflowed.remove();
                i++;
                overflowed = posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIMIT + i}"]`);
            }


        }
    }, 1000);
}

async function getFromStorage() {
    console.log("chrome:", chrome);
    console.log("chrome.storage:", chrome?.storage);
    console.log("chrome.storage.local:", chrome?.storage?.local);

    const res = await new Promise((resolve) => {
        chrome.storage.local.get([
            'in_total_posts_seen_today',
            'in_per_session_time_spend',
            'in_posts_speer_counter',
            'IN_TIME_LIMIT',
            'IN_POSTS_LIMIT',
            'in_hourly_reset',
            'in_daily_reset'],
            resolve);
    });

    const in_total_posts_seen_today = res.in_total_posts_seen_today ?? 0;   // TODO
    const in_per_session_time_spend = res.in_per_session_time_spend ?? 0;   // done
    const in_posts_speer_counter = res.in_posts_speer_counter ?? 0;         // TODO
    const IN_TIME_LIMIT = res.IN_TIME_LIMIT ?? 1000;                        // done
    const IN_POSTS_LIMIT = res.IN_POSTS_LIMIT ?? 10;                        // done
    const in_hourly_reset = res.in_hourly_reset ?? 0;                       // TODO
    const in_daily_reset = res.in_daily_reset ?? 0;                         // TODO

    console.log("in getFromStorage");

    chrome.storage.local.set({
        IN_TIME_LIMIT,
        in_per_session_time_spend
    });

    return { in_total_posts_seen_today, in_per_session_time_spend, in_posts_speer_counter, IN_TIME_LIMIT, IN_POSTS_LIMIT, in_hourly_reset, in_daily_reset };

}

function displayMessage(msg) {
    console.log("in displayMessage");
    let urn = document.getElementsByClassName("scaffold-finite-scroll--finite");
    console.log(urn);
    urn = urn[0];
    console.log(urn);
    if (urn) urn.innerHTML = msg;
}

console.log("chrome:", chrome);
console.log("chrome.storage:", chrome?.storage);
console.log("chrome.storage.local:", chrome?.storage?.local);

core();