const LANG_KEY = 'curr-lang';

var gTrans = {
    title: {
        en: 'My book shop',
        he: 'חנות הספרים שלי'
    },
    'add-new-book': {
        en: 'Create a new book',
        he: 'הוספת ספר חדש',
    },
    'update-book': {
        en: 'Update book',
        he: 'עדכון ספר'
    },
    'id-label': {
        en: 'ID',
        he: 'מזהה',
    },
    'title-label': {
        en: 'Title',
        he: 'כותרת'
    },
    'price-label': {
        en: 'Price',
        he: 'מחיר',
    },
    'actions-label': {
        en: 'Actions',
        he: 'פעולות',
    },
    'read-btn': {
        en: 'Read',
        he: 'קריאה',
    },
    'update-btn': {
        en: 'Update',
        he: 'עדכון',
    },
    'delete-btn': {
        en: 'Delete',
        he: 'מחיקה',
    },
    rating: {
        en: 'Rating',
        he: 'דירוג'
    },
    'rate-this-book': {
        en: 'Rate this book',
        he: 'דרגו ספר זה'
    },
    'save-book': {
        en: 'Save',
        he: 'שמירה'
    }
}

var gCurrLang;
var gDefaultLang = 'en';

initLang();

function initLang() {
    gCurrLang = loadCurrLangFromStorage();
    if (!gCurrLang) gCurrLang = gDefaultLang;
}

function getTrans(transKey) {
    var keyTrans = gTrans[transKey]
        // console.log(keyTrans);

    // TODO: if key is unknown return 'UNKNOWN'
    if (!keyTrans) return 'UNKNOWN'
        // TODO: get from gTrans

    var txt = keyTrans[gCurrLang];
    // TODO: If translation not found - use english
    if (!txt) return keyTrans[gDefaultLang];

    return txt
}

function doTrans() {
    // TODO: 
    var els = document.querySelectorAll('[data-trans]')
        // console.log(els);

    // for each el:
    //    get the data-trans and use getTrans to replace the innerText 
    els.forEach(function(el) {
        // console.dir(el)
        var txt = getTrans(el.dataset.trans)
        if (el.nodeName === 'INPUT') el.placeholder = txt;
        else el.innerText = txt
            //    ITP: support placeholder  

        // console.log('el.dataset', el.dataset.trans);       
    })
}

function setLang(lang) {
    gCurrLang = lang;
    saveCurrLangToStorage();
}

function getLang() {
    return gCurrLang;
}

// function formatNumOlder(num) {
//     return num.toLocaleString('es')
// }

// function formatNum(num) {
//     return new Intl.NumberFormat(gCurrLang).format(num);
// }

function formatCurrency(num) {
    var curr = 'USD';
    switch (gCurrLang) {
        case 'en':
            // num = convertNisToUsd(num);
            break;
        case 'he':
            num = convertUsdToNis(num);
            curr = 'ils'
        default:
            break;
    }
    return new Intl.NumberFormat(gCurrLang, { style: 'currency', currency: curr }).format(num);
}



function convertUsdToNis(num) {
    return num * 3.24;
}

function convertNisToUsd(num) {
    return num / 3.24;
}

function saveCurrLangToStorage() {
    saveToStorage(LANG_KEY, gCurrLang);
}

function loadCurrLangFromStorage() {
    return loadFromStorage(LANG_KEY);
}