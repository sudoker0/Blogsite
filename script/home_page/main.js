"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const getId = (id) => document.getElementById(id);
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
var search_title = getId("search_by_title");
var search_summary = getId("search_by_summary");
var search_date_start = getId("search_by_date_start");
var search_date_end = getId("search_by_date_end");
var search_max_display = getId("maxdisplay");
var page_num = getId("page_num");
var rage_count = 0;
var number_of_generated_item = 0;
var current_page = 0;
function reloadBlogList() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        dayjs.extend(dayjs_plugin_customParseFormat);
        var loaded = 0;
        var response = yield fetch("index.json");
        var data = yield response.json();
        var json_data = data;
        var entry = Object.keys(json_data);
        var current_time_stamp = "";
        entry = entry
            .sort((a, b) => {
            var a_time = dayjs(json_data[a].written_on, asia_time);
            var b_time = dayjs(json_data[b].written_on, asia_time);
            return b_time.diff(a_time);
        })
            .filter((e) => {
            var item = json_data[e];
            if (item.title.toLocaleLowerCase().indexOf(FILTER.title) == -1)
                return false;
            if (item.summary.toLocaleLowerCase().indexOf(FILTER.summary) == -1)
                return false;
            var from = dayjs(FILTER.start_date, us_time);
            var to = dayjs(FILTER.end_date, us_time);
            var check = dayjs(item.written_on, asia_time);
            if (check < from || check > to)
                return false;
            return true;
        });
        for (var i of entry.slice(current_page * FILTER.max_display, FILTER.max_display * (current_page + 1))) {
            var item = json_data[i];
            var date = item.written_on.split(" ")[0];
            var template = "";
            if (date != current_time_stamp) {
                current_time_stamp = date;
                template += `
            <div class="datestamp refreshing">
                <h2><time datetime="${date}">On ${date}</time></h2>
                <hr />
            </div>
            `;
            }
            template += `
        <a href="reader.html?file=${i}" class="blog_item refreshing">
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <small>${item.written_on.split(" ")[1]}</small>
        </a>
        `;
            number_of_generated_item++;
            getId("loading").style.display = "none";
            (_a = document.querySelector("main")) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML("beforeend", template);
            loaded++;
        }
        return {
            total: entry.length,
            loaded: loaded
        };
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    page_num.value = "0";
    const loaded = yield reloadBlogList();
    const total = Math.floor(loaded.total / FILTER.max_display).toString();
    document.getElementById("total_page").innerHTML = total;
    page_num.max = total;
}))();
getId("search_button").addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    if (IN_ACTION)
        return;
    IN_ACTION = true;
    FILTER.title = search_title.value.toLocaleLowerCase();
    FILTER.summary = search_summary.value.toLocaleLowerCase();
    FILTER.start_date = search_date_start.value + " 00:00:00";
    FILTER.end_date = search_date_end.value + " 23:59:59";
    FILTER.max_display = parseInt(search_max_display.value);
    var old_msg = getId("loading_msg").innerHTML;
    getId("loading_msg").innerHTML = "Please wait while we're filtering the posts...";
    getId("loading").style.display = "flex";
    getId("cannot_find").style.display = "none";
    document.querySelectorAll(".refreshing").forEach(e => e.remove());
    const loaded = yield reloadBlogList();
    if (loaded.loaded == 0) {
        getId("cannot_find").style.display = "block";
        rage_count++;
    }
    else {
        rage_count = 0;
    }
    if (rage_count > 10) {
        if (Math.random() < 0.3) {
            alert("OMFG! CAN'T YOU READ WHAT THE TEXT SAID??? IT SAID THAT WE CANNOT FIND WHAT YOU ASKED. Please don't be that dumb.");
        }
        rage_count = 0;
    }
    const total = Math.floor(loaded.total / FILTER.max_display).toString();
    document.getElementById("total_page").innerHTML = total;
    page_num.max = total;
    getId("loading").style.display = "none";
    getId("loading_msg").innerHTML = old_msg;
    IN_ACTION = false;
}));
page_num.addEventListener("change", () => __awaiter(void 0, void 0, void 0, function* () {
    if (IN_ACTION)
        return;
    IN_ACTION = true;
    getId("loading").style.display = "flex";
    current_page = parseInt(page_num.value);
    document.querySelectorAll(".refreshing").forEach(e => { e.remove(); });
    yield reloadBlogList();
    getId("loading").style.display = "none";
    IN_ACTION = false;
}));
//# sourceMappingURL=main.js.map