// ==UserScript==
// @name        GitHub Pull Request File Highlighter
// @version     0.1b
// @description A userscript that highlights files in a Pull Request's "Files Changed" screen to draw more attention to them.
// @license     MIT
// @author      John Jimenez
// @namespace   https://github.com/JohnAJimenez/userscripts
// @include     https://github.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=666427
// ==/UserScript==
(() => {
    "use strict";

    let busy = false,
        highlightClass = 'ghprfh',
        highlightColor = '#f598a3',
        highlightFile = "vulcanConfig.yml";

    function highlightFiles() {
        if (busy) {
            return;
        }
        busy = true;

        let selector = '.file-info a';

        if ($(selector)) {
            let indx = 0, title;
            const els = $$(selector),
                len = els.length;

            // loop with delay to allow user interaction
            const loop = () => {
                let el;
                el = els[indx];
                title = el.getAttribute("title") || "";

                if (title === highlightFile) {
                    let fileHeader = getClosest(el,'.file-header');
                    if (fileHeader.classList.contains(highlightClass) === false) {
                        fileHeader.classList.add(highlightClass);
                    }
                    console.log(`${title} matches`);
                } else {
                    console.log(`${title} does not match`);
                }

                indx++;
                if (indx < len) {
                    setTimeout(() => {
                        loop();
                    }, 200);
                }
            };
            loop();
        }
        busy = false;
    }

    function $(str, el) {
        return (el || document).querySelector(str);
    }

    function $$(str, el) {
        return Array.from((el || document).querySelectorAll(str));
    }

    // Shamelessly stolen from
    // https://gomakethings.com/how-to-get-all-parent-elements-with-vanilla-javascript/
    function getClosest(elem, selector) {

        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function(s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }

        // Get the closest matching element
        for ( ; elem && elem !== document; elem = elem.parentNode ) {
            if ( elem.matches( selector ) ) return elem;
        }
        return null;

    }

    function init() {
        GM_addStyle(`
            .${highlightClass} { background-color: ${highlightColor}; }
        `);
        highlightFiles();
    }

    // repo file list needs additional time to render
    document.addEventListener("ghmo:container", () => {
        setTimeout(() => {
            highlightFiles();
        }, 100);
    });
    document.addEventListener("ghmo:diff", () => {
        highlightFiles()
    });
    init();
})();