let themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "caramellatte",
    "abyss",
    "silk"
]

const THEME_DROPDOWN = document.getElementById("List_Theme")
const CURRENT_THEME = localStorage.getItem("theme")
if (CURRENT_THEME) {
    document.getElementsByTagName("html")[0].setAttribute("data-theme", CURRENT_THEME)
    THEME_DROPDOWN.querySelector('button').innerText = CURRENT_THEME
}

export function setupThemeButton() {
    // Custom Theme
    for (let i in themes) {
        let k = document.createElement("li")
        let a = document.createElement("a")
        a.innerText = themes[i]
        a.addEventListener("click", () => {
            localStorage.setItem("theme", a.innerText);
            document.getElementsByTagName("html")[0].setAttribute("data-theme", a.innerText)
            THEME_DROPDOWN.querySelector('button').innerText = a.innerText
        })
        k.appendChild(a)
        THEME_DROPDOWN.querySelector('ul').appendChild(k)
    }
}