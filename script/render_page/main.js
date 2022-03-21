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
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cannot_load = () => {
        document.getElementById("cannot_load_url").innerHTML = filename;
        document.getElementById("cannot_load").style.display = "block";
        document.getElementById("loading").style.display = "none";
    };
    var filename = (_a = getParameterByName("file")) !== null && _a !== void 0 ? _a : "";
    var response = yield fetch("../../index.json");
    var data = yield response.json();
    var json_data = data;
    if (!json_data[filename]) {
        cannot_load();
        return;
    }
    try {
        var blogdata = yield fetch(`../../blogs/${json_data[filename].file}`);
        var text = yield blogdata.text();
        var converter = new showdown.Converter();
        var html = converter.makeHtml(text);
        document.getElementById("loading").style.display = "none";
        (_b = document.querySelector("main")) === null || _b === void 0 ? void 0 : _b.insertAdjacentHTML("beforeend", html);
    }
    catch (e) {
        cannot_load();
    }
}))();
//# sourceMappingURL=main.js.map