// Client-side i18n for the welcome and uninstall pages.
// Language is resolved from the ?lang= query param (set by the extension via
// chrome.i18n.getUILanguage()), falling back to navigator.language (Chrome's
// UI language), falling back to the built-in English markup.
//
// Translations live in i18n/<lang>.json. English is the source of truth and
// stays baked into the HTML — i18n/en.json exists only as a reference for
// translators, it is never fetched.
(function () {
    'use strict';

    var SUPPORTED = ['es', 'pt_BR', 'fr', 'de', 'it', 'ru', 'uk', 'pl', 'tr', 'ar', 'ja', 'ko', 'zh_CN', 'zh_TW', 'hi', 'id', 'fil', 'vi'];
    var RTL = ['ar'];

    // Entry format: [key, selector, mode]
    //   mode 't'  — replace the element's first non-empty text node (keeps inline SVGs)
    //   mode 'h'  — replace innerHTML (for strings containing markup)
    //   mode 'attr:NAME[,NAME2]' — set attribute(s)
    // Selectors missing on the current page are silently skipped, so one map
    // serves both index.html and uninstall.html.
    var MAP = [
        // ===== welcome page =====
        ['successBadge', '.success-badge', 't'],
        ['heroTitle', '.hero h1', 'h'],
        ['chromeTabTitle', '.chrome-tab-title', 't'],
        ['pin1Title', '.pin-cards .pin-card:first-child .pin-card-title', 't'],
        ['pin1Desc', '.pin-cards .pin-card:first-child .pin-card-desc', 't'],
        ['pin2Title', '.pin-cards .pin-card:last-child .pin-card-title', 't'],
        ['pin2Desc', '.pin-cards .pin-card:last-child .pin-card-desc', 'h'],
        ['mockupNote', '.mockup-note span', 't'],
        ['extPopupHead', '.ext-popup-head', 't'],
        ['heroSub', '.hero-sub', 't'],
        ['scrollHint', '.hero-scroll-hint', 't'],
        ['howTag', '#features .section-tag', 't'],
        ['howTitle', '#features .section-title', 't'],
        ['howSub', '#features .section-sub', 't'],
        ['step1Title', '.steps-row .step:nth-child(1) h3', 't'],
        ['step1Desc', '.steps-row .step:nth-child(1) p', 't'],
        ['step2Title', '.steps-row .step:nth-child(2) h3', 't'],
        ['step2Desc', '.steps-row .step:nth-child(2) p', 't'],
        ['step3Title', '.steps-row .step:nth-child(3) h3', 't'],
        ['step3Desc', '.steps-row .step:nth-child(3) p', 't'],
        ['wtTitle', '.features-inner h2.features-sub-title:nth-of-type(2)', 't'],
        ['inclTitle', '.features-inner h2.features-sub-title:nth-of-type(3)', 't'],
        ['wtScanTitle', '#wt-btn-scan', 't'],
        ['wtScanTitle', '.wt-item[data-target="wt-btn-scan"] .wt-item-header', 't'],
        ['wtScanBody', '.wt-item[data-target="wt-btn-scan"] .wt-item-body', 'h'],
        ['wtUploadTitle', '.wt-item[data-target="wt-btn-upload"] .wt-item-header', 't'],
        ['wtUploadBody', '.wt-item[data-target="wt-btn-upload"] .wt-item-body', 'h'],
        ['wtManualTitle', '.wt-item[data-target="wt-btn-manual"] .wt-item-header', 't'],
        ['wtManualBody', '.wt-item[data-target="wt-btn-manual"] .wt-item-body', 'h'],
        ['wtSettingsTitle', '.wt-item[data-target="wt-btn-settings"] .wt-item-header', 't'],
        ['wtSettingsBody', '.wt-item[data-target="wt-btn-settings"] .wt-item-body', 'h'],
        ['wtLockTitle', '.wt-item[data-target="wt-btn-lock"] .wt-item-header', 't'],
        ['wtLockBody', '.wt-item[data-target="wt-btn-lock"] .wt-item-body', 'h'],
        ['wtCopyTitle', '.wt-item[data-target="wt-btn-copy"] .wt-item-header', 't'],
        ['wtCopyBody', '.wt-item[data-target="wt-btn-copy"] .wt-item-body', 'h'],
        ['wtTimerTitle', '.wt-item[data-target="wt-btn-timer"] .wt-item-header', 't'],
        ['wtTimerBody', '.wt-item[data-target="wt-btn-timer"] .wt-item-body', 'h'],
        ['wtRemoveTitle', '.wt-item[data-target="wt-btn-remove"] .wt-item-header', 't'],
        ['wtRemoveBody', '.wt-item[data-target="wt-btn-remove"] .wt-item-body', 'h'],
        ['feat1Title', '.cards-grid .feat-card:nth-child(1) h3', 't'],
        ['feat1Desc', '.cards-grid .feat-card:nth-child(1) p', 't'],
        ['feat2Title', '.cards-grid .feat-card:nth-child(2) h3', 't'],
        ['feat2Desc', '.cards-grid .feat-card:nth-child(2) p', 't'],
        ['feat3Title', '.cards-grid .feat-card:nth-child(3) h3', 't'],
        ['feat3Desc', '.cards-grid .feat-card:nth-child(3) p', 't'],
        ['feat4Title', '.cards-grid .feat-card:nth-child(4) h3', 't'],
        ['feat4Desc', '.cards-grid .feat-card:nth-child(4) p', 't'],
        ['feat5Title', '.cards-grid .feat-card:nth-child(5) h3', 't'],
        ['feat5Desc', '.cards-grid .feat-card:nth-child(5) p', 't'],
        ['feat6Title', '.cards-grid .feat-card:nth-child(6) h3', 't'],
        ['feat6Desc', '.cards-grid .feat-card:nth-child(6) p', 't'],
        ['faqTag', '#faq .section-tag', 't'],
        ['faqTitle', '#faq .section-title', 't'],
        ['faqSub', '#faq .section-sub', 't'],
        ['footerLegal', '.footer-legal', 't'],

        // ===== uninstall page =====
        ['unPageTitle', '#page-title', 't'],
        ['unFeedbackTitle', '.feedback-title', 'h'],
        ['unFeedbackSub', '.feedback-sub', 't'],
        ['unPlaceholder', '.feedback-input', 'attr:placeholder,aria-label'],
        ['unSendBtn', '.feedback-btn', 't'],
        ['unBeforeTag', '#faq-block .section-tag', 't'],
        ['unFixTitle', '#faq-block .section-title', 't'],
        ['unFixSub', '#faq-block .section-sub', 't'],
        ['faqvQ', 'label[for="faqv"]', 't'],
        ['faqpwQ', 'label[for="faqpw"]', 't'],
        ['faqpwA', 'label[for="faqpw"] + .faq-body', 'h'],
        ['faqinvalidQ', 'label[for="faqinvalid"]', 't'],
        ['faqinvalidA', 'label[for="faqinvalid"] + .faq-body', 'h'],
        ['unReinstall', '.reinstall-title', 't'],
        ['webstoreAlt', '.webstore-banner img', 'attr:alt'],

        // ===== FAQ items shared by both pages =====
        ['faq1q', 'label[for="faq1"]', 't'],
        ['faq1a', 'label[for="faq1"] + .faq-body', 'h'],
        ['faq2q', 'label[for="faq2"]', 't'],
        ['faq2a', 'label[for="faq2"] + .faq-body', 'h'],
        ['faq3q', 'label[for="faq3"]', 't'],
        ['faq3a', 'label[for="faq3"] + .faq-body', 'h'],
        ['faq4q', 'label[for="faq4"]', 't'],
        ['faq4a', 'label[for="faq4"] + .faq-body', 'h'],
        ['faq5q', 'label[for="faq5"]', 't'],
        ['faq5a', 'label[for="faq5"] + .faq-body', 'h'],
        ['faq6q', 'label[for="faq6"]', 't'],
        ['faq6a', 'label[for="faq6"] + .faq-body', 'h'],
        ['faq7q', 'label[for="faq7"]', 't'],
        ['faq7a', 'label[for="faq7"] + .faq-body', 'h'],
        ['faq8q', 'label[for="faq8"]', 't'],
        ['faq8a', 'label[for="faq8"] + .faq-body', 'h'],
        ['faq9q', 'label[for="faq9"]', 't'],
        ['faq9a', 'label[for="faq9"] + .faq-body', 'h'],
        ['faq10q', 'label[for="faq10"]', 't'],
        ['faq10a', 'label[for="faq10"] + .faq-body', 'h']
    ];

    // "pt-BR" / "pt_BR" / "zh-TW" / "es-419" / plain "de" → supported code or null
    function resolve(raw) {
        if (!raw) return null;
        var norm = String(raw).replace('-', '_');
        if (SUPPORTED.indexOf(norm) !== -1) return norm;
        var base = norm.split('_')[0].toLowerCase();
        if (base === 'zh') return /tw|hk|mo|hant/i.test(norm) ? 'zh_TW' : 'zh_CN';
        if (base === 'pt') return 'pt_BR';
        if (base === 'tl') return 'fil'; // Tagalog reported by some browsers
        if (base === 'in') return 'id'; // legacy Indonesian code
        if (SUPPORTED.indexOf(base) !== -1) return base;
        return null;
    }

    // Replace the first non-empty text node so sibling SVG icons survive.
    function setText(el, str) {
        for (var i = 0; i < el.childNodes.length; i++) {
            var n = el.childNodes[i];
            if (n.nodeType === Node.TEXT_NODE && n.nodeValue.trim()) {
                n.nodeValue = str;
                return;
            }
        }
        if (!el.firstElementChild) el.textContent = str;
    }

    function apply(dict) {
        var isUninstall = !!document.getElementById('feedback-form');
        var docTitle = dict[isUninstall ? 'unDocTitle' : 'welcomeDocTitle'];
        if (docTitle) document.title = docTitle;

        MAP.forEach(function (entry) {
            var str = dict[entry[0]];
            if (str == null) return;
            var nodes = document.querySelectorAll(entry[1]);
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                var mode = entry[2];
                if (mode === 't') setText(el, str);
                else if (mode === 'h') el.innerHTML = str;
                else if (mode.indexOf('attr:') === 0) {
                    mode.slice(5).split(',').forEach(function (attr) {
                        el.setAttribute(attr, str);
                    });
                }
            }
        });
    }

    var lang = resolve(new URLSearchParams(location.search).get('lang')) || resolve(navigator.language);
    if (!lang || lang === 'en') return;

    fetch('i18n/' + lang + '.json')
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (dict) {
            document.documentElement.lang = lang.replace('_', '-');
            if (RTL.indexOf(lang) !== -1) {
                document.documentElement.dir = 'rtl';
                var style = document.createElement('style');
                style.textContent = '[dir="rtl"] .section-title, [dir="rtl"] .section-sub, [dir="rtl"] .faq-body p, [dir="rtl"] .faq-body { text-align: right; }';
                document.head.appendChild(style);
            }
            window.I18N = dict; // page scripts read dynamic strings (unSending, unThanks) from here
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function () { apply(dict); });
            } else {
                apply(dict);
            }
        })
        .catch(function () { /* stay English */ });
})();