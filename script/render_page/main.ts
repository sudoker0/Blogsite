function getParameterByName(name: string, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
(async () => {
    const cannot_load = () => {
        document.getElementById("cannot_load_url")!.innerHTML = filename
        document.getElementById("cannot_load")!.style.display = "block"
        document.getElementById("loading")!.style.display = "none"
    }
    var filename = getParameterByName("file") ?? ""
    var response = await fetch("../../index.json");
    var data = await response.json();
    var json_data: {[name: string]: { title: string, summary: string, written_on: string, file: string }} = data;
    if (!json_data[filename]) {
        cannot_load();
        return;
    }
    try {
        var blogdata = await fetch(`../../blogs/${json_data[filename].file}`)
        var text = await blogdata.text()
        //@ts-ignore
        var converter = new showdown.Converter();
        var html = converter.makeHtml(text);
        document.getElementById("loading")!.style.display = "none"
        document.querySelector("main")?.insertAdjacentHTML("beforeend", html);
    }
    catch (e) {
        cannot_load();
    }
})()