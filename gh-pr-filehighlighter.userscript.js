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
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=666427
// ==/UserScript==
(() => {
    "use strict";

    let busy = false,
        dangerHighlightClass = 'ghp_danger_file',
        dangerHighlightColor = '#f8d2d6',
        dangerHighlightFile = GM_getValue("dangerHighlightFile", /vulcanConfig\.yml/),
        warningHighlightClass = 'ghp_warning_file',
        warningHighlightColor = '#ddfcdd',
        warningHighlightFile = GM_getValue("warningHighlightFile", /\/test\//i),
        buildFileHighlightClass = 'ghp_buildFile_file',
        buildFileHighlightColor = '#fefbd5',
        buildFileHighlightFile = GM_getValue("buildFileHighlightFile", /\/biuld|dist\//i);

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

                if (title.match(dangerHighlightFile)) {
                    let fileHeader = getClosest(el,'.file-header');
                    if (fileHeader.classList.contains(dangerHighlightClass) === false) {
                        fileHeader.classList.add(dangerHighlightClass);
                    }
                    console.log(`${title} matches danger file`);
                } else {
                    console.log(`${title} does not match danger file`);
                }

                if (title.match(warningHighlightFile)) {
                    let fileHeader = getClosest(el,'.file-header');
                    if (fileHeader.classList.contains(warningHighlightClass) === false) {
                        fileHeader.classList.add(warningHighlightClass);
                    }
                    console.log(`${title} matches warning file`);
                } else {
                    console.log(`${title} does not match warning file`);
                }

                if (title.match(buildFileHighlightFile)) {
                    let fileHeader = getClosest(el,'.file-header');
                    if (fileHeader.classList.contains(buildFileHighlightClass) === false) {
                        fileHeader.classList.add(buildFileHighlightClass);
                    }
                    console.log(`${title} matches build file`);
                } else {
                    console.log(`${title} does not match build file`);
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

    // function addPanel() {
    //     const div = document.createElement("div");
    //     GM_addStyle(`
    // 		#ghst-settings { opacity:0; visibility:hidden; }
    // 		#ghst-settings.ghst-open { position:fixed; z-index:65535; top:0; bottom:0;
    // 			left:0; right:0; opacity:1; visibility:visible;
    // 			background:rgba(0, 0, 0, .5); }
    // 		#ghst-settings-inner { position:fixed; left:50%; top:50%; width:25rem;
    // 			transform:translate(-50%,-50%); box-shadow:0 .5rem 1rem #111;
    // 			color:#c0c0c0 }
    // 		#ghst-settings-inner .boxed-group-inner { height: 205px; }
    // 		#ghst-footer { clear:both; border-top:1px solid rgba(68, 68, 68, .3);
    // 			padding-top:5px; }
    // 	`);
    //     div.id = "ghst-settings";
    //     let options = "";
    //     locales.forEach(loc => {
    //         let sel = loc.abbr === locale ? " selected" : "";
    //         options += `<option value="${loc.abbr}"${sel}>${loc.name}</option>`;
    //     });
    //     div.innerHTML = `
    // 		<div id="ghst-settings-inner" class="boxed-group">
    // 			<h3>GitHub Static Time Settings</h3>
    // 			<div class="boxed-group-inner">
    // 				<dl class="form-group flattened">
    // 					<dt>
    // 						<label for="ghst-locale">Select a locale</label>
    // 					</dt>
    // 					<dd>
    // 						<select id="ghst-locale" class="form-select float-right" value="${locale}">
    // 							${options}
    // 						</select>
    // 						<br>
    // 					</dd>
    // 				</dl>
    // 				<dl class="form-group flattened">
    // 					<dt>
    // 						<label for="ghst-format">
    // 							<p>Set <a href="https://momentjs.com/docs/#/displaying/format/">
    // 								MomentJS
    // 							</a> format (e.g. "MMMM Do YYYY, h:mm A"):
    // 							</p>
    // 						</label>
    // 					</dt>
    // 					<dd>
    // 						<input id="ghst-format" type="text" class="form-control" value="${timeFormat}"/>
    // 					</dd>
    // 				</dl>
    // 				<div id="ghst-footer">
    // 					<button type="button" id="ghst-cancel" class="btn btn-sm float-right">Cancel</button>
    // 					<button type="button" id="ghst-save" class="btn btn-sm float-right">Save</button>
    // 				</div>
    // 			</div>
    // 		</div>`;
    //     $("body").appendChild(div);
    //     on("#ghst-settings", "click", closePanel);
    //     on("body", "keyup", event => {
    //         if (
    //             event.key === "Escape" &&
    //             $("#ghst-settings").classList.contains("ghst-open")
    //         ) {
    //             closePanel(event);
    //             return false;
    //         } else if (event.key === "Enter" && event.shiftKey) {
    //             closePanel();
    //             update("save");
    //         }
    //     });
    //     on("#ghst-settings-inner", "click", event => {
    //         event.stopPropagation();
    //         event.preventDefault();
    //     });
    //     on("#ghst-save", "click", () => {
    //         closePanel();
    //         update("save");
    //     });
    //     on("#ghst-locale", "change", update);
    //     on("#ghst-format", "change", update);
    //     on("#ghst-cancel", "click", closePanel);
    // }
    //
    // function closePanel(event) {
    //     $("#ghst-settings").classList.remove("ghst-open");
    //     if (event) {
    //         return update("revert");
    //     }
    // }
    //
    // function update(mode) {
    //     if (mode === "revert") {
    //         $("#ghst-locale").value = locale;
    //         $("#ghst-format").value = timeFormat;
    //     }
    //     let loc = $("#ghst-locale").value || "en",
    //         time = $("#ghst-format").value || "LLL";
    //     if (mode === "save") {
    //         timeFormat = time;
    //         locale = loc;
    //         GM_setValue("ghst-format", timeFormat);
    //         GM_setValue("ghst-locale", locale);
    //     }
    //     moment.locale(loc);
    //     highlightFiles(time);
    //     return false;
    // }

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

    // function on(el, name, handler) {
    //     $(el).addEventListener(name, handler);
    // }

    function init() {
        GM_addStyle(`
                .${dangerHighlightClass} { background-color: ${dangerHighlightColor}; }
                .${warningHighlightClass} { background-color: ${warningHighlightColor}; }
                .${buildFileHighlightClass} { background-color: ${buildFileHighlightColor}; }
            `);
        // addPanel();

        highlightFiles();
    }

    // Add GM options
    // GM_registerMenuCommand("Set GitHub static time format", () => {
    //     $("#ghst-settings").classList.add("ghst-open");
    // });

    // repo file list needs additional time to render
    document.addEventListener("ghmo:container", () => {
        setTimeout(() => {
            highlightFiles();
        }, 100);
    });
    document.addEventListener("ghmo:diff", () => {
        console.log('Doing Diff')
        highlightFiles()
    });
    init();
})();
