async function core() {

    const feedContainer = document.querySelector('[data-finite-scroll-hotkey-context]');
    const isFeedContainer = feedContainer?.getAttribute("data-finite-scroll-hotkey-context")
    console.log("querySelector.getAttribute is FEED? check", feedContainer, isFeedContainer);
    if (isFeedContainer !== "FEED") { // /tscp-serving/dtag
        console.log("linkedin but not /feed/");
        setTimeout(core, 1000);
        return;
    }

    const data = await getFromStorage();

    console.log('time lim reached? :', Date.now() < data.IN_TIME_LIMIT);

    if (Date.now() < data.IN_TIME_LIMIT) {
        console.log("TIME OVER");
        displayMessage('Enough posts read for now!');
        setTimeout(core, 1000);
        return;
    }

    console.log("linkedin feed encountered");

    let timer = 0;
    let lim_reached = false;
    const timerID = setInterval(() => {
        console.log(timer, "timer going on...", location.pathname);
        timer++;
        // let in_total_time_spend_today = data.in_total_time_spend_today;
        console.log("in_total_time_spend_today",data.in_total_time_spend_today)
        chrome.storage.local.set({
            'in_total_time_spend_today': data.in_total_time_spend_today + timer
        });

        let lastPostIdx = feedContainer.lastElementChild.firstElementChild.getAttribute("data-finite-scroll-hotkey-item")
        
        console.log(data.IN_POSTS_LIMIT, ': max post lim ?><><><><><><><? last post on feed :', lastPostIdx);
        
        if (lim_reached) {
            console.log("lim reached... waiting inside timer");
            chrome.storage.local.set({
                IN_TIME_LIMIT: Date.now() + 1000 * 60 * 60
            });
        }
        if (timer >= data.IN_TIME_LIMIT) {
            console.log("timer over");
            displayMessage("Enough");
            clearInterval(timerID);
            return;
        }
        else if (parseInt(lastPostIdx) >= data.IN_POSTS_LIMIT) {
            // clearInterval(timerID);
            // can use posts_urn.nextElementSibling.remove() but this one supports older (IE11) as well
            console.log(feedContainer.nextElementSibling)
            feedContainer.parentElement.removeChild(feedContainer.nextElementSibling);
            console.log("URN IS FULL");
            lim_reached = true;
            chrome.storage.local.set({
                IN_TIME_LIMIT: Date.now() + 1000 * 60 * 60
            });

            let i = 0;

            while (parseInt(lastPostIdx) >= data.IN_POSTS_LIMIT) {
                console.log("removing overflowed from last:", lastPostIdx);

                feedContainer.lastElementChild.remove(); // removes the post div
                feedContainer.lastElementChild.remove(); // remove the hidden <h1> tag 
                
                lastPostIdx = feedContainer.lastElementChild.firstElementChild.getAttribute("data-finite-scroll-hotkey-item")
            }


        }
    }, 1000);
}

async function getFromStorage() {
    console.log("chrome:", chrome);
    console.log("chrome.storage:", chrome?.storage);
    console.log("chrome.storage.local:", chrome?.storage?.local);
    console.log("in getFromStorage");

    const res = await new Promise((resolve) => {
        chrome.storage.local.get({
            in_total_posts_of_today : 0, 
            in_total_posts_of_yesterday : 0, 
            in_posts_speer_counter : 0, 
            in_total_time_spend_today : 0, 
            in_total_time_spend_yesterday : 0, 
            IN_POSTS_LIMIT : 10, 
            IN_TIME_LIMIT : 1000, 
            in_hourly_reset : 0, 
            in_daily_reset : 0} ,
            resolve);
    });

    chrome.storage.local.set({
        in_total_posts_of_today: res.in_total_posts_of_today,
        in_total_posts_of_yesterday: res.in_total_posts_of_yesterday,
        in_posts_speer_counter: res.in_posts_speer_counter,
        in_total_time_spend_today: res.in_total_time_spend_today,
        in_total_time_spend_yesterday: res.in_total_time_spend_yesterday,
        IN_POSTS_LIMIT: res.IN_POSTS_LIMIT,
        IN_TIME_LIMIT: res.IN_TIME_LIMIT,
        in_hourly_reset: res.in_hourly_reset,
        in_daily_reset: res.in_daily_reset
    });

    return {
        in_total_posts_of_today: res.in_total_posts_of_today,
        in_total_time_spend_today: res.in_total_time_spend_today,
        in_posts_speer_counter: res.in_posts_speer_counter,
        IN_TIME_LIMIT: res.IN_TIME_LIMIT,
        IN_POSTS_LIMIT: res.IN_POSTS_LIMIT,
        in_hourly_reset: res.in_hourly_reset,
        in_daily_reset: res.in_daily_reset
    };

}

function displayMessage(msg) {
    console.log("in displayMessage");
    const removeUrn = setInterval(() => {
        let urn = document.querySelector(".scaffold-finite-scroll");
        console.log(urn);
        if (urn) {
            urn.textContent = msg;
            clearInterval(removeUrn);
            return;
        }
    }, 100);
}

console.log("chrome:", chrome);
console.log("chrome.storage:", chrome?.storage);
console.log("chrome.storage.local:", chrome?.storage?.local);

core();