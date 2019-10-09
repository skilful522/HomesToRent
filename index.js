const search = document.querySelector('#searchInput');
const adsContainer = document.querySelector('#ads-container');
const checker = {};
const modalWindow = document.querySelector('#modalWindow');
const closeBtn = document.querySelector('.closeButton');
const loaderContainer = document.querySelector("#loader-container");
const flats = [];
const favoriteFlats = [];
const pagination = document.querySelector("#pagination");

showDefaultFlats();

window.addEventListener('load', () => {
    loaderContainer.style.display = 'none';
    adsContainer.style.display = 'block';
});

search.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        let searchInput = search.value;

        if (searchInput === '') {
            searchInput = null;
        }
        createScript(searchInput);
        delContainers();
        addContainer();
    }
});

document.addEventListener('click', event => {
    const flatFullInfo = document.querySelector('#flat-full-info');
    const flatMoreDescription = document.querySelector('.flat-more-description');
    const favoritesListButton = document.querySelector('#favoritesListButton');
    const favoritesButton = document.querySelectorAll('.favoritesButton');

    if (flatMoreDescription) {
        if (event.target.innerText === flatMoreDescription.innerText) {
            const infoContainer = event.target.parentNode;
            const flatContainer = infoContainer.parentNode;
            const duplicateFlatContainer = flatContainer.cloneNode(flatContainer);
            const duplicateInfoContainer = duplicateFlatContainer.childNodes[1];
            const duplicateRentContainer = duplicateFlatContainer.childNodes[2];
            const duplicateFavoriteButton = duplicateRentContainer.childNodes[1];
            const duplicateFlatMoreDescription = duplicateInfoContainer.childNodes[3];

            duplicateInfoContainer.removeChild(duplicateFlatMoreDescription);
            duplicateRentContainer.removeChild(duplicateFavoriteButton);
            flatFullInfo.appendChild(duplicateFlatContainer);
            flatFullInfo.style.display = 'flex';
            modalWindow.style.display = 'block';
        } else if (event.target === favoritesListButton) {
            flatFullInfo.style.display = 'block';
            for (let i = 0; i < favoriteFlats.length; i++) {
                const favoriteFlatContainer = createContainer('favorite-flat-container', 'div');
                const removeButtonContainer = createContainer('remove-button-container', 'div');
                const removeButton = createButton('removeButton','✖');
                const favoriteFlat = createContainer('favorite-flat', 'div');

                favoriteFlat.innerHTML = favoriteFlats[i].innerHTML;

                const rentContainer = favoriteFlat.children[2];
                const favoriteButton = rentContainer.children[1];
                const infoContainer = favoriteFlat.children[1];
                const flatMoreDescription = infoContainer.children[3];

                favoriteButton.style.display = 'none';
                flatMoreDescription.style.display = 'none';
                removeButtonContainer.appendChild(removeButton);
                favoriteFlatContainer.appendChild(favoriteFlat);
                favoriteFlatContainer.appendChild(removeButtonContainer);
                flatFullInfo.appendChild(favoriteFlatContainer);
            }
            modalWindow.style.display = 'block';
        }
    }

    for (let i = 0; i < favoritesButton.length; i++) {
        if (event.target === favoritesButton[i]) {
            const rentContainer = favoritesButton[i].parentNode;
            const flatContainer = rentContainer.parentNode;

            favoritesButton[i].disabled = true;
            favoritesButton[i].innerText = '\u2606AddedToFav\u2606';
            flatContainer.style.border = '3px solid gold';
            favoriteFlats.push(flatContainer);
        }
    }

});

closeBtn.addEventListener('click', () => {
    const flatFullInfo = document.querySelector('#flat-full-info');

    flatFullInfo.innerHTML = null;
    modalWindow.style.display = 'none';
});

document.addEventListener('click', (event) => {
    const floatFullInfo = document.querySelector('#flat-full-info');

    if (event.target === modalWindow) {
        floatFullInfo.innerHTML = null;
        modalWindow.style.display = 'none';
    }
});

modalWindow.addEventListener('click', (event) => {
    const removeButton = document.querySelectorAll('.removeButton');

    for (let i = 0; i < removeButton.length; i++) {
        if (event.target === removeButton[i]) {
            const removeButtonContainer = removeButton[i].parentNode;
            const favoriteFlatContainer = removeButtonContainer.parentNode;

            favoriteFlatContainer.parentNode.removeChild(favoriteFlatContainer);
        }
    }

});

function delContainers() {
    adsContainer.innerHTML = null;
}

function showDefaultFlats() {
    createScript();
    createPage();
    addContainer();
}

function getData(data) {
    console.log(data);
    checker.location = data.response['application_response_text'];
    if (checker.location !== 'unknown location') {
        const flatsArr = data.response.listings;
        const flatsPhotos = [];
        const flatsTitles = [];
        const flatsSummaries = [];
        const flatsProperties = makeFlatProperty(data);
        const flatsPrices = makePriceType(flatsArr);

        for (let i = 0; i < flatsArr.length; i++) {
            const flat = {
                photo: '',
                title: '',
                summary: '',
                properties: '',
                price: '',
                id: ''
            };

            flatsPhotos.push(flatsArr[i]['img_url']);
            flatsTitles.push(flatsArr[i].title);
            flatsSummaries.push(flatsArr[i].summary);
            flatsPrices.push(flatsArr[i]['price_formatted']);

            flat.photo = flatsArr[i]['img_url'];
            flat.title = flatsArr[i].title;
            flat.summary = flatsArr[i].summary;
            flat.properties = flatsProperties[i];
            flat.price = flatsArr[i]['price_formatted'];
            flat.id = i;
            flats.push(flat);
        }

        setInfo(flatsTitles, flatsProperties, flatsSummaries, flatsPrices, flatsPhotos);
    } else {
        delContainers();
        createSearchWarning();
    }
}

function setInfo(flatTitles, flatProperties, flatSummary, flatsPrices, flatsPhotos) {
    const flatTitleContainers = document.querySelectorAll('.flat-title-container');
    const flatPropertyContainers = document.querySelectorAll('.flat-property-container');
    const flatSummaryContainers = document.querySelectorAll('.flat-summary-container');
    const flatMoreDescription = document.querySelectorAll('.flat-more-description');
    const flatPriceContainer = document.querySelectorAll('.flat-price-container');
    const img = document.querySelectorAll('.flatImg');

    if (img.length !== 0) {
        for (let i = 0; i < 5; i++) {
            img[0].addEventListener('load', () => {
                loaderContainer.style.display = 'none';
                adsContainer.style.display = 'block';
            });
            img[i].src = flatsPhotos[i];
            flatTitleContainers[i].innerText = flatTitles[i];
            flatPropertyContainers[i].innerHTML = flatProperties[i];
            flatSummaryContainers[i].innerText = flatSummary[i];
            flatMoreDescription[i].innerText = 'Click here for more description';
            flatPriceContainer[i].innerText = flatsPrices[i];
        }
    }
}

function makePriceType(flats) {
    const flatsFormattedPrices = [];
    const flatsPrices = [];
    const flatsRentDuration = [];

    for (let i = 0; i < flats.length; i++) {
        flatsPrices.push(flats[i]['price_formatted']);
        if (flats[i]['price_type']) {
            flatsRentDuration.push('p' + flats[i]['price_type'][0]);
        }
        flatsFormattedPrices.push(flatsPrices[i] + flatsRentDuration[i]);
    }

    return flatsFormattedPrices;
}

function makeFlatProperty(data) {
    const location = data.response.locations[0]['long_title'];
    const flatsArr = data.response.listings;
    const bedroomNumber = [];
    const bathroomNumber = [];
    const propertyType = [];
    const keywords = [];
    const flatsFeatures = [];

    for (let i = 0; i < flatsArr.length; i++) {
        bedroomNumber.push(flatsArr[i]['bedroom_number']);
        if (flatsArr[i]['bathroom_number'] === '') {
            flatsArr[i]['bathroom_number'] = 0;
        }
        bathroomNumber.push(flatsArr[i]['bathroom_number']);
        propertyType.push(flatsArr[i]['property_type']);
        keywords.push(flatsArr[i]['keywords']);
        flatsFeatures.push(location.bold() + ' • ' + bedroomNumber[i] + ' Bedroom • ' + bathroomNumber[i] + ' Bath •' +
            ' ' + propertyType[i].bold() + ' • ' + keywords[i]);
    }

    return flatsFeatures;
}


function createScript(searchInput = 'London') {
    const script = document.createElement('script');
    const url = constructQueryParams(searchInput);
    console.log(url);
    script.type = 'text/javascript';
    script.src = url;
    loaderContainer.style.display = 'flex';
    adsContainer.style.display = 'none';
    document.body.appendChild(script);
    script.parentNode.removeChild(script);
}

function createPage(innerText) {
    const page = createContainer('page', 'div');
    page.innerText = innerText;
    return page;
}

function constructQueryParams(searchInput, page = 1) {
    const a = document.createElement('a');
    const url = 'https://api.nestoria.co.uk/api?';

    a.href = url;

    let params = new URLSearchParams(a.search);

    params.append('encoding', 'json');
    params.append('pretty', '1');
    params.append('action', 'search_listings');
    params.append('country', 'uk');
   // params.append('num_res', 5);
    params.append('listing_type', 'rent');
    params.append('page', `${page}`);
    if (searchInput === null) {
        searchInput = 'London';
    }
    params.append('place_name', searchInput);
    params.append('callback', 'getData');

    return url + params;
}

function createContainer(className, tagName) {
    const container = document.createElement(tagName);

    container.className = className;
    return container;
}

function createButton(className, innerText) {
    const button = document.createElement('button');

    button.className = className;
    button.innerText = innerText;
    return button;
}

function createSearchWarning() {
    const warning = createContainer('search-warning', 'div');

    warning.innerText = 'Sorry, this location doesn\'t exist. \nTry again';
    adsContainer.style.display = 'block';
    loaderContainer.style.display = 'none';
    adsContainer.appendChild(warning);
}

function addElementsIntoContainer() {
    const flatContainer = createContainer('flat-container', 'div');
    const photoContainer = createContainer('photo-container', 'div');
    const flatImg = createContainer('flatImg', 'img');
    const infoContainer = createContainer('info-container', 'div');
    const flatTitleContainer = createContainer('flat-title-container', 'div');
    const flatPropertyContainer = createContainer('flat-property-container', 'div');
    const flatSummaryContainer = createContainer('flat-summary-container', 'div');
    const flatMoreDescription = createContainer('flat-more-description', 'div');
    const rentContainer = createContainer('rent-container', 'div');
    const priceContainer = createContainer('flat-price-container', 'div');
    const favorites = createButton('favoritesButton', '\u2606Favorite\u2606');

    infoContainer.appendChild(flatTitleContainer);
    infoContainer.appendChild(flatPropertyContainer);
    infoContainer.appendChild(flatSummaryContainer);
    infoContainer.appendChild(flatMoreDescription);

    rentContainer.appendChild(priceContainer);
    rentContainer.appendChild(favorites);

    photoContainer.appendChild(flatImg);

    flatContainer.appendChild(photoContainer);
    flatContainer.appendChild(infoContainer);
    flatContainer.appendChild(rentContainer);
    return flatContainer;

}

function addContainer() {
    for (let i = 0; i < 5; i++) {
        const flatContainer = addElementsIntoContainer();

        flatContainer.id = i;
        adsContainer.appendChild(flatContainer);
    }
}
