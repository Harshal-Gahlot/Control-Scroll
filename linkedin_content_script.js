async function core() {

    console.log("location parthname:",location.pathname);
    if (!location.pathname.startsWith("/feed/")) { // /tscp-serving/dtag
        console.log("linkedin but not /feed/");
        setTimeout(core, 1000);
        return;
    }

    const data = await getFromStorage();

    console.log('DAAATAAA', Date.now() < data.IN_TIME_LIM)

    if (Date.now() < data.IN_TIME_LIM) {
        console.log("TIME OVER")
        displayMessage('Enough posts read for now!')
        return;
    }

    console.log("linkedin feed encountered");


    const posts_urn = document.getElementsByClassName("scaffold-finite-scroll__content")[0];
    let timer = 0;
    let lim_reached = false;
    const timerID = setInterval(() => {
        // console.log(timer, "timer going on...", location.pathname);
        timer++;

        
        // if (timer >= data.IN_TIME_LIM) {
            
        //     console.log("time over");
        //     displayMessage();
        //     clearInterval(timerID);
        //     return;
        
        // }
        // console.log(posts_urn.getElementsByClassName("fie-impression-container").length);
        
        if (lim_reached) {
            // document.getElementsByClassName("scaffold-layout__sticky-content")[0].style.setProperty('background-color', 'red', 'important')
            console.log("lim reached... waiting inside timer")
        } 
        // console.log(posts_urn.querySelectorAll("h2.feed-skip-link__container").length);
        else if (posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIM - 1}"]`)) {
            // clearInterval(timerID);
            // can use posts_urn.nextElementSibling.remove() but this one supports older (IE11) as well
            posts_urn.parentNode.removeChild(posts_urn.nextElementSibling);
            console.log("URN IS FULL")
            lim_reached = true;
            chrome.storage.local.set({
                IN_TIME_LIM: Date.now() + 1000 * 60 * 60
            })

            let i = 0;
            let overflowed = posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIM + i}"]`);
            while (overflowed) {
                console.log("remoing overflowed:", data.IN_POSTS_LIM + i);
                overflowed.remove();
                i++;
                overflowed = posts_urn.querySelector(`[data-finite-scroll-hotkey-item="${data.IN_POSTS_LIM + i}"]`);
            }


        }
    }, 1000);
}

async function getFromStorage() {
    console.log("chrome:", chrome);
    console.log("chrome.storage:", chrome?.storage);
    console.log("chrome.storage.local:", chrome?.storage?.local);

    const res = await new Promise((resolve) => {
        chrome.storage.local.get(['in_posts_seen',
            'in_time_spend',
            'in_posts_speer',
            'IN_TIME_LIM',
            'IN_POSTS_LIM',
            'in_hourly_reset',
            'in_daily_reset'],
            resolve);
    });

    const in_posts_seen = res.in_posts_seen ?? 0;
    const in_time_spend = res.in_time_spend ?? 0;
    const in_posts_speer = res.in_posts_speer ?? 0;
    const IN_TIME_LIM = res.IN_TIME_LIM ?? 10;
    const IN_POSTS_LIM = res.IN_POSTS_LIM ?? 10;
    const in_hourly_reset = res.in_hourly_reset ?? 0;
    const in_daily_reset = res.in_daily_reset ?? 0;

    console.log("in getFromStorage");

    return { in_posts_seen, in_time_spend, in_posts_speer, IN_TIME_LIM, IN_POSTS_LIM, in_hourly_reset, in_daily_reset };

}

function displayMessage(msg) {
    console.log("in displayMessage");
    const urn = document.getElementsByClassName("scaffold-finite-scroll--finite")[0]
    console.log(urn)
    urn.innerHTML = msg;
}

console.log("chrome:", chrome);
console.log("chrome.storage:", chrome?.storage);
console.log("chrome.storage.local:", chrome?.storage?.local);

core();