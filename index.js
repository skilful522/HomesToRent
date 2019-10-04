const search = document.querySelector('#searchInput');
const adsContainer = document.querySelector('#ads-container');
const checker = {};
const modalWindow = document.querySelector('#modalWindow');
const closeBtn = document.querySelector('.closeButton');
const flats = [];

showDefaultFlats();

search.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {

        let searchInput = search.value;
        console.log(searchInput);
        if (searchInput === '') {
            searchInput = undefined;
        }
        createScript(searchInput);
        delContainers();
        addContainer();
    }
});

document.addEventListener('click', event => {
    const floatFullInfo = document.querySelector('#flat-full-info');
    const flatMoreDescription = document.querySelector('.flat-more-description');
    const favoritesListButton = document.querySelector('#favoritesListButton');

    if (flatMoreDescription) {
        if (event.target.innerText === flatMoreDescription.innerText) {
            const infoContainer = event.target.parentNode;

            hideInscription();
            floatFullInfo.innerHTML = infoContainer.parentNode.innerHTML;
            modalWindow.style.display = 'block';
        } else if (event.target === favoritesListButton) {
            modalWindow.style.display = 'block';
        }
    }
});

closeBtn.addEventListener('click', () => {
    const floatFullInfo = document.querySelector('#flat-full-info');
    floatFullInfo.innerHTML = null;
    modalWindow.style.display = 'none';
    showInscription();
});

document.addEventListener('click', (event) => {
    const floatFullInfo = document.querySelector('#flat-full-info');

    if (event.target === modalWindow) {
        floatFullInfo.innerHTML = null;
        modalWindow.style.display = 'none';
        showInscription();
    }
});

function showInscription() {
    const flatMoreDescription = document.querySelectorAll('.hidden-flat-more-description');
    for (let i = 0; i < flatMoreDescription.length; i++) {
        flatMoreDescription[i].classList = 'flat-more-description';
    }
}

function hideInscription() {
    const flatMoreDescription = document.querySelectorAll('.flat-more-description');
    for (let i = 0; i < flatMoreDescription.length; i++) {
        flatMoreDescription[i].classList = 'hidden-flat-more-description';
    }

}

function delContainers() {
    adsContainer.innerHTML = null;
}

function showDefaultFlats() {
    createScript();
    addContainer();
}

function getData(data) {
    checker.location = data.response['application_response_text'];
    if (checker.location !== 'unknown location') {
        const flatsArr = data.response.listings;
        const flatsPhotos = [];
        const flatsTitles = [];
        const flatsSummaries = [];
        const flatsProperties = makeFlatProperty(data);
        const flatsPrices = makePriceType(flatsArr);
        const flat = {
            photo: '',
            title: '',
            summary: '',
            properties: '',
            price: ''
        };

        for (let i = 0; i < flatsArr.length; i++) {
            flatsPhotos.push(flatsArr[i]['img_url']);
            flatsTitles.push(flatsArr[i].title);
            flatsSummaries.push(flatsArr[i].summary);
            flatsPrices.push(flatsArr[i]['price_formatted']);

            flat.photo = flatsArr[i]['img_url'];
            flat.title = flatsArr[i].title;
            flat.summary = flatsArr[i].summary;
            flat.price = flatsArr[i]['price_formatted'];
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
    const url = 'https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=rent&place_name=';

    script.type = 'text/javascript';
    script.src = url + searchInput + '&callback=getData';
    document.body.appendChild(script);
    script.parentNode.removeChild(script);
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
