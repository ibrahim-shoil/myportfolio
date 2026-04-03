//@target aftereffects
// ╔═══════════════════════════════════════╗
//   CaptionFlow  v2.0  by ishoil
//   After Effects SRT Caption Tool
// ╚═══════════════════════════════════════╝
{
    function buildUI(thisObj) {
        var panel = (thisObj instanceof Panel)
            ? thisObj
            : new Window("palette", "CaptionFlow  ·  by ishoil", undefined, {resizeable: true});

        panel.orientation   = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing       = 8;
        panel.margins       = 14;

        // ── HEADER BANNER ──────────────────────────────────────
        var headerGrp = panel.add("group");
        headerGrp.orientation   = "column";
        headerGrp.alignChildren = ["center", "center"];
        headerGrp.spacing       = 2;
        headerGrp.margins       = [0, 4, 0, 4];

        var titleLabel = headerGrp.add("statictext", undefined, "CAPTIONFLOW");
        titleLabel.alignment = ["center", "center"];

        var subtitleLabel = headerGrp.add("statictext", undefined, "SRT  ›  After Effects  |  by ishoil");
        subtitleLabel.alignment = ["center", "center"];

        // ── DIVIDER ────────────────────────────────────────────
        var div1 = panel.add("panel", undefined, undefined);
        div1.alignment = "fill";
        div1.height    = 1;

        // ── SECTION: IMPORT ────────────────────────────────────
        var importSection = panel.add("panel", undefined, "  ▸  Import");
        importSection.orientation   = "column";
        importSection.alignChildren = ["fill", "top"];
        importSection.spacing       = 6;
        importSection.margins       = [10, 16, 10, 10];

        // Mode radio buttons
        var modeLabel = importSection.add("statictext", undefined, "SRT Type:");
        modeLabel.alignment = ["left", "center"];

        var modeGrp = importSection.add("group");
        modeGrp.orientation   = "row";
        modeGrp.spacing       = 14;
        modeGrp.alignChildren = ["left", "center"];

        var radioSentence = modeGrp.add("radiobutton", undefined, "Sentence / Phrase");
        var radioWord     = modeGrp.add("radiobutton", undefined, "Word by Word");
        radioSentence.value = true; // default

        var importDesc = importSection.add("statictext", undefined,
            "Each subtitle block \u2192 one layer.", {multiline: true});
        importDesc.alignment = ["fill", "top"];

        // Update hint when mode changes
        radioSentence.onClick = function() {
            importDesc.text = "Each subtitle block \u2192 one layer.";
        };
        radioWord.onClick = function() {
            importDesc.text = "Each word/block \u2192 one layer (word-by-word SRT).";
        };

        // Punctuation removal option
        var chkPunctuation = importSection.add("checkbox", undefined, "Remove punctuation  ( . , ? ! : ; \u2019 \u201c \u201d )");
        chkPunctuation.value     = false;
        chkPunctuation.alignment = ["fill", "center"];

        var importBtn = importSection.add("button", undefined, "\u2b07  Import SRT File");
        importBtn.alignment         = ["fill", "center"];
        importBtn.preferredSize.height = 28;

        // ── SECTION: EDITOR ────────────────────────────────────
        var editorSection = panel.add("panel", undefined, "  ▸  Edit");
        editorSection.orientation   = "column";
        editorSection.alignChildren = ["fill", "top"];
        editorSection.spacing       = 6;
        editorSection.margins       = [10, 16, 10, 10];

        var editorDesc = editorSection.add("statictext", undefined,
            "Browse, edit text and timing of\nexisting caption layers.", {multiline: true});
        editorDesc.alignment = ["fill", "top"];

        var editorBtn = editorSection.add("button", undefined, "✏  Open Caption Editor");
        editorBtn.alignment         = ["fill", "center"];
        editorBtn.preferredSize.height = 28;

        // ── DIVIDER ────────────────────────────────────────────
        var div2 = panel.add("panel", undefined, undefined);
        div2.alignment = "fill";
        div2.height    = 1;

        // ── FOOTER: CREDITS ────────────────────────────────────
        var footerGrp = panel.add("group");
        footerGrp.orientation   = "row";
        footerGrp.alignChildren = ["center", "center"];
        footerGrp.spacing       = 6;
        footerGrp.alignment     = ["fill", "bottom"];

        var creditLabel = footerGrp.add("statictext", undefined, "instagram: @ishoil");
        creditLabel.alignment = ["fill", "center"];

        var igBtn = footerGrp.add("button", undefined, "↗ Follow");
        igBtn.preferredSize.width  = 70;
        igBtn.preferredSize.height = 22;

        // ══════════════════════════════════════════════════════
        //  UTILITY FUNCTIONS
        // ══════════════════════════════════════════════════════

        function TimeToFrames(time, comp) {
            return time * (1.0 / comp.frameDuration);
        }

        function FramesToTime(frames, comp) {
            return frames / (1.0 / comp.frameDuration);
        }

        function Time(timeInString) {
            var t = timeInString.split(":");
            return parseInt(t[0]) * 3600 + parseInt(t[1]) * 60 + parseFloat(t[2].replace(",", "."));
        }

        function formatTime(seconds) {
            var h  = Math.floor(seconds / 3600);
            var m  = Math.floor((seconds % 3600) / 60);
            var s  = Math.floor(seconds % 60);
            var ms = Math.round((seconds % 1) * 1000);
            return padZero(h) + ":" + padZero(m) + ":" + padZero(s) + "," + padZero(ms, 3);
        }

        function formatTimeSimple(seconds) {
            var h = Math.floor(seconds / 3600);
            var m = Math.floor((seconds % 3600) / 60);
            var s = Math.floor(seconds % 60);
            return padZero(h) + ":" + padZero(m) + ":" + padZero(s);
        }

        function padZero(num, size) {
            size  = size || 2;
            var s = "000" + num;
            return s.substr(s.length - size);
        }

        // ══════════════════════════════════════════════════════
        //  HELPERS
        // ══════════════════════════════════════════════════════

        // Truncate a string to maxLen chars for use as a layer name
        function truncateName(str, maxLen) {
            maxLen = maxLen || 60;
            str = str.replace(/\r\n|\r|\n/g, " ").replace(/\s+/g, " ");
            return (str.length > maxLen) ? str.substr(0, maxLen - 1) + "…" : str;
        }

        // Does this word/phrase end a sentence? (ends with . ? ! …)
        function isSentenceEnd(word) {
            return /[.?!\u2026]$/.test(word.replace(/["\u201d\u2019\)\]]+$/, ""));
        }

        // Read all SRT entries from an open file into an array [{f, l, text}]
        function readAllEntries(srtFile) {
            var entries = [];
            while (!srtFile.eof) {
                var line = srtFile.readln();
                while (line === "" && !srtFile.eof) { line = srtFile.readln(); }
                if (srtFile.eof) break;
                var tsLine = srtFile.readln();
                if (tsLine.indexOf("-->") === -1) continue;
                var parts = tsLine.split("-->");
                var f = Time(parts[0]);
                var l = Time(parts[1]);
                var text = "";
                while (!srtFile.eof && (line = srtFile.readln()) !== "") {
                    text += line.replace(/<(.*?)>/g, "") + " ";
                }
                text = text.replace(/\s+$/, "");
                if (text !== "") entries.push({ f: f, l: l, text: text });
            }
            return entries;
        }

        // Create one text layer in the comp
        function addCaptionLayer(comp, text, inSec, outSec) {
            // Strip punctuation if the option is checked
            var displayText = text;
            if (chkPunctuation.value) {
                displayText = displayText.replace(/[.,!?;:\u2019\u201c\u201d\u2026\"'\-]+/g, "");
                displayText = displayText.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
            }
            if (displayText === "") return null; // skip if nothing left after strip
            var layer      = comp.layers.addText(displayText);
            layer.name     = truncateName(displayText);
            var sourceText = layer.property("Source Text");
            sourceText.setValue(displayText);
            layer.inPoint  = FramesToTime(Math.round(TimeToFrames(inSec, comp)), comp);
            layer.outPoint = FramesToTime(Math.round(TimeToFrames(outSec, comp)), comp);
            return layer;
        }

        // ══════════════════════════════════════════════════════
        //  PROGRESS / CANCEL WINDOW
        // ══════════════════════════════════════════════════════
        function makeProgressWin(total) {
            var pw = new Window("palette", "CaptionFlow  ·  Importing…");
            pw.orientation   = "column";
            pw.alignChildren = ["fill", "center"];
            pw.spacing       = 8;
            pw.margins       = 14;

            var statusTxt = pw.add("statictext", undefined, "Preparing…");
            statusTxt.alignment = ["fill", "center"];

            var bar = pw.add("progressbar", undefined, 0, Math.max(total, 1));
            bar.preferredSize.width = 260;

            var cancelBtn = pw.add("button", undefined, "✖  Cancel Import");
            cancelBtn.alignment         = ["fill", "center"];
            cancelBtn.preferredSize.height = 26;

            pw._status = statusTxt;
            pw._bar    = bar;

            // Cancel writes to the global state — works even between scheduled tasks
            cancelBtn.onClick = function() {
                if ($.global.CF_importState) $.global.CF_importState.cancelled = true;
            };

            pw.center();
            pw.show();
            pw.update();
            return pw;
        }

        // ══════════════════════════════════════════════════════
        //  IMPORT SRT  (non-blocking via app.scheduleTask)
        // ══════════════════════════════════════════════════════
        function ImportSRT() {
            app.beginUndoGroup("CaptionFlow_ImportSRT");
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("CaptionFlow: Please select a composition first.");
                app.endUndoGroup();
                return;
            }

            var isWordMode = radioWord.value;
            var srt = File.openDialog(
                "CaptionFlow — Select SRT file (" + (isWordMode ? "Word-by-Word" : "Sentence") + " mode)",
                "SRT subtitles:*.srt"
            );
            if (srt === null) { app.endUndoGroup(); return; }

            srt.open("r");
            var entries = readAllEntries(srt);
            srt.close();

            // ── Pre-expand all items into one flat array {text, f, l} ──
            // This lets both modes share the same simple chunk loop.
            var flatItems = [];
            if (!isWordMode) {
                flatItems = entries;
            } else {
                for (var i = 0; i < entries.length; i++) {
                    var e          = entries[i];
                    var blockDur   = e.l - e.f;
                    var blockStart = e.f;

                    var words = e.text.replace(/\r\n|\r|\n/g, " ").split(/\s+/);
                    var cw    = [];
                    for (var w = 0; w < words.length; w++) {
                        if (words[w].length > 0) cw.push(words[w]);
                    }
                    if (cw.length === 0) continue;

                    var totalCh = 0;
                    for (var w = 0; w < cw.length; w++) totalCh += cw[w].length;

                    var cursor = blockStart;
                    for (var w = 0; w < cw.length; w++) {
                        var wDur = (cw[w].length / totalCh) * blockDur;
                        flatItems.push({ text: cw[w], f: cursor, l: cursor + wDur });
                        cursor += wDur;
                    }
                }
            }

            // ── Store import state globally so scheduleTask closure can reach it ──
            $.global.CF_importState = {
                comp:          comp,
                flatItems:     flatItems,
                itemIndex:     0,
                createdLayers: [],
                count:         0,
                cancelled:     false,
                pw:            null,
                isWordMode:    isWordMode
            };

            var pw = makeProgressWin(flatItems.length);
            $.global.CF_importState.pw = pw;

            // ── Chunk processor stored as a global closure ──
            // Being a closure lets it call addCaptionLayer / Time / etc. freely.
            // app.scheduleTask runs it as a string, hence the $.global reference.
            var BATCH = 5; // layers per scheduled chunk (tune if needed)

            $.global.CF_processChunk = function() {
                var s = $.global.CF_importState;
                if (!s) return;

                // ── CANCELLED ─────────────────────────────────────────
                if (s.cancelled) {
                    try { s.pw.close(); } catch(e2) {}
                    for (var r = 0; r < s.createdLayers.length; r++) {
                        try { s.createdLayers[r].remove(); } catch(e2) {}
                    }
                    app.endUndoGroup();
                    alert("CaptionFlow: Import cancelled — " + s.count + " layer(s) removed.");
                    $.global.CF_importState = null;
                    return;
                }

                // ── PROCESS ONE BATCH ─────────────────────────────────
                var end = Math.min(s.itemIndex + BATCH, s.flatItems.length);
                for (var i = s.itemIndex; i < end; i++) {
                    var item = s.flatItems[i];
                    var lyr  = addCaptionLayer(s.comp, item.text, item.f, item.l);
                    if (lyr) { s.createdLayers.push(lyr); s.count++; }
                }
                s.itemIndex = end;

                // Update progress bar
                s.pw._status.text = "Layer " + s.itemIndex + " of " + s.flatItems.length;
                s.pw._bar.value   = s.itemIndex;
                s.pw.update();

                // ── DONE or SCHEDULE NEXT CHUNK ───────────────────────
                if (s.itemIndex >= s.flatItems.length) {
                    try { s.pw.close(); } catch(e2) {}
                    alert("CaptionFlow: Imported " + s.count + " layer(s) successfully!");
                    app.endUndoGroup();
                    $.global.CF_importState = null;
                } else {
                    // Yield to OS event loop, then continue
                    app.scheduleTask("$.global.CF_processChunk()", 0, false);
                }
            };

            // Kick off the first chunk
            app.scheduleTask("$.global.CF_processChunk()", 0, false);
        }

        // ══════════════════════════════════════════════════════
        //  CAPTION EDITOR WINDOW
        // ══════════════════════════════════════════════════════
        function showEditor() {
            var comp = app.project.activeItem;
            if (!(comp instanceof CompItem)) {
                alert("CaptionFlow: Please select a composition first.");
                return;
            }

            var win = new Window("palette", "CaptionFlow  ·  Caption Editor", undefined, {resizeable: true});
            win.orientation   = "column";
            win.alignChildren = ["fill", "top"];
            win.spacing       = 8;
            win.margins       = 14;

            // ── Editor header
            var eHeader = win.add("statictext", undefined, "CAPTION EDITOR  — Ishoil");
            eHeader.alignment = ["fill", "top"];

            var eDivider = win.add("panel", undefined, undefined);
            eDivider.alignment = "fill";
            eDivider.height    = 1;

            // ── List section
            var listSection = win.add("panel", undefined, "  Caption Layers");
            listSection.orientation   = "column";
            listSection.alignChildren = ["fill", "top"];
            listSection.margins       = [10, 16, 10, 10];

            var listBox = listSection.add("listbox", undefined, [], {multiselect: false});
            listBox.preferredSize.height = 140;
            listBox.preferredSize.width  = 340;

            var refreshBtn = listSection.add("button", undefined, "↺  Refresh List");
            refreshBtn.alignment         = ["right", "center"];
            refreshBtn.preferredSize.width  = 120;
            refreshBtn.preferredSize.height = 22;

            // ── Edit section
            var editSection = win.add("panel", undefined, "  Edit Selected");
            editSection.orientation   = "column";
            editSection.alignChildren = ["fill", "top"];
            editSection.spacing       = 8;
            editSection.margins       = [10, 16, 10, 10];

            var textLabel = editSection.add("statictext", undefined, "Caption Text:");
            var textArea  = editSection.add("edittext", undefined, "", {multiline: true});
            textArea.preferredSize.height = 55;

            // timing row
            var timingGrp = editSection.add("group");
            timingGrp.orientation = "row";
            timingGrp.spacing     = 8;
            timingGrp.alignChildren = ["left", "center"];

            timingGrp.add("statictext", undefined, "In:");
            var inTimeField = timingGrp.add("edittext", undefined, "00:00:00,000");
            inTimeField.characters = 13;

            timingGrp.add("statictext", undefined, "Out:");
            var outTimeField = timingGrp.add("edittext", undefined, "00:00:00,000");
            outTimeField.characters = 13;

            var updateBtn = editSection.add("button", undefined, "✔  Apply Changes");
            updateBtn.alignment         = ["fill", "center"];
            updateBtn.preferredSize.height = 26;

            // ── Close button
            var eDivider2 = win.add("panel", undefined, undefined);
            eDivider2.alignment = "fill";
            eDivider2.height    = 1;

            var closeBtn = win.add("button", undefined, "✖  Close Editor");
            closeBtn.alignment         = ["fill", "center"];
            closeBtn.preferredSize.height = 24;

            // ── Helper: collect text layers sorted by inPoint
            function getTextLayers() {
                var arr = [];
                for (var i = 1; i <= comp.numLayers; i++) {
                    var lyr = comp.layer(i);
                    if (lyr instanceof TextLayer) arr.push(lyr);
                }
                arr.sort(function(a, b) { return a.inPoint - b.inPoint; });
                return arr;
            }

            function refreshList() {
                listBox.removeAll();
                var layers = getTextLayers();
                for (var j = 0; j < layers.length; j++) {
                    var lyr     = layers[j];
                    var preview = lyr.property("Source Text").value.text.split("\r\n")[0];
                    if (preview.length > 38) preview = preview.substr(0, 38) + "…";
                    var label = formatTimeSimple(lyr.inPoint) + " › " + formatTimeSimple(lyr.outPoint) + "  |  " + preview;
                    listBox.add("item", label);
                }
            }

            listBox.onChange = function() {
                if (listBox.selection === null) return;
                var layers = getTextLayers();
                var lyr    = layers[listBox.selection.index];
                if (!lyr) return;
                textArea.text     = lyr.property("Source Text").value.text;
                inTimeField.text  = formatTime(lyr.inPoint);
                outTimeField.text = formatTime(lyr.outPoint);
            };

            updateBtn.onClick = function() {
                if (listBox.selection === null) {
                    alert("CaptionFlow: Select a caption first.");
                    return;
                }
                app.beginUndoGroup("CaptionFlow_UpdateCaption");
                var layers = getTextLayers();
                var lyr    = layers[listBox.selection.index];
                if (lyr) {
                    try {
                        var prop    = lyr.property("Source Text");
                        var doc     = prop.value;
                        doc.text    = textArea.text;
                        prop.setValue(doc);
                        lyr.inPoint  = Time(inTimeField.text);
                        lyr.outPoint = Time(outTimeField.text);
                        refreshList();
                    } catch (e) {
                        alert("CaptionFlow Error: " + e.toString());
                    }
                }
                app.endUndoGroup();
            };

            refreshBtn.onClick = refreshList;
            closeBtn.onClick   = function() { win.close(); };

            refreshList();
            win.center();
            win.show();
        }

        // ══════════════════════════════════════════════════════
        //  BUTTON HANDLERS
        // ══════════════════════════════════════════════════════
        importBtn.onClick = ImportSRT;
        editorBtn.onClick = showEditor;
        igBtn.onClick     = function() {
            system.callSystem('explorer "https://www.instagram.com/ishoil"');
        };

        // ── layout hooks
        panel.onResizing = panel.onResize = function() { this.layout.resize(); };
        panel.layout.layout(true);
        return panel;
    }

    var toolsPanel = buildUI(this);
    if (toolsPanel !== null) {
        if (toolsPanel instanceof Window) {
            toolsPanel.center();
            toolsPanel.show();
        } else {
            toolsPanel.layout.layout(true);
        }
    }
}