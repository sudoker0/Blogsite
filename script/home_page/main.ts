const getId = (id: string) => document.getElementById(id);
const us_time = "YYYY-MM-DD HH:mm:ss";
const asia_time = "DD-MM-YYYY HH:mm:ss";

var IN_ACTION = false;

var FILTER = {
    title: "",
    summary: "",
    start_date: "",
    end_date: "",
    max_display: 10,
};

// ? Create variables for the elements
var search_title = getId("search_by_title") as HTMLInputElement
var search_summary = getId("search_by_summary") as HTMLInputElement
var search_date_start = getId("search_by_date_start") as HTMLInputElement
var search_date_end = getId("search_by_date_end") as HTMLInputElement
var search_max_display = getId("maxdisplay") as HTMLInputElement

// ? Variables that isn't contain in a function will be put here
// var max_display = getId("maxdisplay") as HTMLInputElement;
var page_num = getId("page_num") as HTMLInputElement;
var rage_count = 0;
var number_of_generated_item = 0;
var current_page = 0;

// ? Load in the posts with the filter.
async function reloadBlogList() {
    //@ts-ignore
    dayjs.extend(dayjs_plugin_customParseFormat);
    var loaded = 0;
    var response = await fetch("../../index.json");
    var data = await response.json();

    var json_data: {[name: string]: { title: string, summary: string, written_on: string, file: string }} = data;
    var entry: string[] = Object.keys(json_data);
    var current_time_stamp = ""

    entry = entry
    .sort((a, b) => { // ? Sort the array based on the day is was written on (from latest to oldest)
        //@ts-ignore
        var a_time = dayjs(json_data[a].written_on, asia_time);
        //@ts-ignore
        var b_time = dayjs(json_data[b].written_on, asia_time);
        return b_time.diff(a_time);
    })
    .filter((e) => { // ? Filter the array with the provided filter (title, summary and date)
        var item = json_data[e]
        if (item.title.toLocaleLowerCase().indexOf(FILTER.title) == -1) return false;
        if (item.summary.toLocaleLowerCase().indexOf(FILTER.summary) == -1) return false;
        //@ts-ignore
        var from = dayjs(FILTER.start_date, us_time);
        //@ts-ignore
        var to = dayjs(FILTER.end_date, us_time);
        //@ts-ignore
        var check = dayjs(item.written_on, asia_time);
        if (check < from || check > to) return false;
        return true;
    })
    // ? Start pos: selected page (default is 0) * maximum page for display (default is 10)
    // ? End pos: start pos + maximum page for display (default is 10)
    for (var i of entry.slice(current_page * FILTER.max_display, FILTER.max_display * (current_page + 1))) {
        var item = json_data[i];
        var date = item.written_on.split(" ")[0]
        var template = ""

        // ? If the date is different from the previous one, create a new date header
        if (date != current_time_stamp) {
            current_time_stamp = date
            // ? Template for the date
            template += `
            <div class="datestamp refreshing">
                <h2><time datetime="${date}">On ${date}</time></h2>
                <hr />
            </div>
            `
        }

        // ? Template for the posts
        template += `
        <a href="reader.html?file=${i}" class="blog_item refreshing">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <small>${item.written_on.split(" ")[1]}</small>
        </a>
        `

        number_of_generated_item++;
        getId("loading")!.style.display = "none"
        document.querySelector("main")?.insertAdjacentHTML("beforeend", template);
        loaded++;
    }
    return {
        total: entry.length,
        loaded: loaded
    }
}

// ? Startup function
(async () => {
    page_num.value = "0";
    const loaded = await reloadBlogList();
    const total = Math.floor(loaded.total / FILTER.max_display).toString();
    document.getElementById("total_page")!.innerHTML = total;
    page_num.max = total;
})();

getId("search_button")!.addEventListener("click", async () => {
    if (IN_ACTION) return;
    IN_ACTION = true;
    FILTER.title = search_title.value.toLocaleLowerCase();
    FILTER.summary = search_summary.value.toLocaleLowerCase();
    FILTER.start_date = search_date_start.value + " 00:00:00";
    FILTER.end_date = search_date_end.value + " 23:59:59";
    FILTER.max_display = parseInt(search_max_display.value);

    var old_msg = getId("loading_msg")!.innerHTML;
    getId("loading_msg")!.innerHTML = "Please wait while we're filtering the posts...";

    getId("loading")!.style.display = "flex"
    getId("cannot_find")!.style.display = "none"

    // ? Delete all the posts
    document.querySelectorAll(".refreshing").forEach(e => e.remove())

    const loaded = await reloadBlogList();

    if (loaded.loaded == 0) { // ? Display the "cannot_find" message if there's no post that match the filter
        getId("cannot_find")!.style.display = "block"
        rage_count++;
    } else {
        rage_count = 0;
    }

    if (rage_count > 10) {
        if (Math.random() < 0.3) {
            alert("OMFG! CAN'T YOU READ WHAT THE TEXT SAID??? IT SAID THAT WE CANNOT FIND WHAT YOU ASKED. Please don't be that dumb.")
        }
        rage_count = 0;
    }

    const total = Math.floor(loaded.total / FILTER.max_display).toString();
    document.getElementById("total_page")!.innerHTML = total;
    page_num.max = total;

    getId("loading")!.style.display = "none";
    getId("loading_msg")!.innerHTML = old_msg;
    IN_ACTION = false;
})

page_num.addEventListener("change", async () => {
    if (IN_ACTION) return;
    IN_ACTION = true;
    getId("loading")!.style.display = "flex"
    current_page = parseInt(page_num.value);
    document.querySelectorAll(".refreshing").forEach(e => {e.remove()})
    await reloadBlogList();
    getId("loading")!.style.display = "none"
    IN_ACTION = false;
})