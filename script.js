const API_URL = "https://countries.dev/countries";

const form = document.getElementById("search-form");
const input = document.getElementById("country-input");
const resultado = document.getElementById("resultado");
const status = document.getElementById("status");
const themeToggle = document.getElementById("theme-toggle");

function escapeHTML(valor) {
    const div = document.createElement("div");
    div.textContent = String(valor ?? "");
    return div.innerHTML;
}

function formatPopulation(population) {
    if (population === undefined || population === null) return "Não informado";
    return new Intl.NumberFormat("pt-BR").format(population);
}

function getLanguages(languages) {
    if (!Array.isArray(languages) || languages.length === 0) return "Não informado";
    return languages.map(language => language.name).join(", ");
}

function getCurrencies(currencies) {
    if (!Array.isArray(currencies) || currencies.length === 0) return "Não informado";

    return currencies
        .map(currency => `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ""}`)
        .join(", ");
}

function showLoading() {
    status.style.display = "block";
    status.innerHTML = `
        <div class="empty-icon">⏳</div>
        <h2>Consultando a API...</h2>
        <p>Buscando informações do país.</p>
    `;
    resultado.innerHTML = "";
}

function showError(message) {
    status.style.display = "none";
    resultado.innerHTML = `
        <div class="error-box">
            <div class="empty-icon">⚠️</div>
            <h2>Não foi possível encontrar o país</h2>
            <p>${escapeHTML(message)}</p>
            <p>Experimente: <strong>Brasil</strong>, <strong>Japan</strong>, <strong>Portugal</strong> ou <strong>Estados Unidos</strong>.</p>
        </div>
    `;
}

function renderCountry(country) {
    const capital = country.capital ?? "Não informado";
    const region = country.region ?? "Não informado";
    const subregion = country.subregion ?? "Não informado";
    const languages = getLanguages(country.languages);
    const currencies = getCurrencies(country.currencies);
    const code = country.alpha3Code ?? country.alpha2Code ?? "—";
    const mapUrl = country.maps?.googleMaps;
    const flagUrl = country.flags?.png || country.flags?.svg || country.flag;

    status.style.display = "none";

    resultado.innerHTML = `
        <article class="country-card">
            <div class="flag-wrap">
                <img
                    class="flag"
                    src="${escapeHTML(flagUrl || "")}"
                    alt="Bandeira de ${escapeHTML(country.name)}"
                >
            </div>

            <div class="country-info">
                <div class="country-title">
                    <h2>${escapeHTML(country.name)}</h2>
                    <span class="country-code">${escapeHTML(code)}</span>
                </div>

                <p class="official-name">${escapeHTML(country.nativeName || country.name || "País")}</p>

                <div class="data-grid">
                    <div class="data-item">
                        <span class="data-label">Capital</span>
                        <span class="data-value">${escapeHTML(capital)}</span>
                    </div>

                    <div class="data-item">
                        <span class="data-label">População</span>
                        <span class="data-value">${formatPopulation(country.population)}</span>
                    </div>

                    <div class="data-item">
                        <span class="data-label">Região</span>
                        <span class="data-value">${escapeHTML(region)}</span>
                    </div>

                    <div class="data-item">
                        <span class="data-label">Sub-região</span>
                        <span class="data-value">${escapeHTML(subregion)}</span>
                    </div>

                    <div class="data-item">
                        <span class="data-label">Idiomas</span>
                        <span class="data-value">${escapeHTML(languages)}</span>
                    </div>

                    <div class="data-item">
                        <span class="data-label">Moeda</span>
                        <span class="data-value">${escapeHTML(currencies)}</span>
                    </div>
                </div>

                ${mapUrl ? `<a class="map-link" href="${escapeHTML(mapUrl)}" target="_blank" rel="noopener noreferrer">Ver localização no mapa ↗</a>` : ""}
            </div>
        </article>
    `;
}

function normalize(texto) {
    return String(texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function countryMatches(country, termo) {
    const busca = normalize(termo);

    const campos = [
        country.name,
        country.nativeName,
        country.alpha2Code,
        country.alpha3Code,
        country.capital
    ];

    return campos.some(campo => normalize(campo).includes(busca));
}

async function buscarPais(nome) {
    const termo = nome.trim();

    if (!termo) {
        showError("Digite o nome de um país para iniciar a pesquisa.");
        return;
    }

    showLoading();

    try {
        /*
         * O endpoint /name/{nome} da countries.dev retorna uma LISTA e
         * trabalha com o nome oficial do país. Para permitir buscas em
         * português (ex.: "Brasil"), usamos /countries e filtramos os
         * resultados pelo nome, nome nativo, código ou capital.
         */
        const campos = [
            "name",
            "nativeName",
            "alpha2Code",
            "alpha3Code",
            "capital",
            "population",
            "region",
            "subregion",
            "languages",
            "currencies",
            "flags",
            "maps"
        ].join(",");

        const resposta = await fetch(`${API_URL}?fields=${encodeURIComponent(campos)}`);

        if (!resposta.ok) {
            throw new Error(`A API respondeu com o status ${resposta.status}.`);
        }

        const dados = await resposta.json();

        if (!Array.isArray(dados)) {
            throw new Error("A API retornou um formato inesperado.");
        }

        const encontrados = dados.filter(country => countryMatches(country, termo));

        if (encontrados.length === 0) {
            throw new Error("Nenhum país foi encontrado com esse nome.");
        }

        renderCountry(encontrados[0]);
    } catch (erro) {
        console.error("Erro na consulta à API:", erro);

        if (erro instanceof TypeError) {
            showError(
                "Não foi possível conectar à API. Verifique sua internet e confirme que o projeto está sendo executado pelo Live Server."
            );
            return;
        }

        showError(erro.message || "Ocorreu um erro inesperado. Tente novamente.");
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    buscarPais(input.value);
});

document.querySelectorAll(".quick-btn").forEach(button => {
    button.addEventListener("click", () => {
        const country = button.dataset.country;
        input.value = country;
        buscarPais(country);
    });
});

function updateThemeButton() {
    const dark = document.body.classList.contains("dark");
    themeToggle.textContent = dark ? "☀" : "☾";
    themeToggle.setAttribute(
        "aria-label",
        dark ? "Ativar tema claro" : "Ativar tema escuro"
    );
}

const savedTheme = localStorage.getItem("world-explorer-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const dark = document.body.classList.contains("dark");
    localStorage.setItem("world-explorer-theme", dark ? "dark" : "light");

    updateThemeButton();
});

// Carrega o Brasil automaticamente ao abrir a aplicação.
buscarPais("Brasil");
