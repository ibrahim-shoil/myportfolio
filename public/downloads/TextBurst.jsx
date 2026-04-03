function TextBurst(thisObj) {
    var tb = this;

    this.label    = "Text Burst";
    this.ver      = "1.1";
    this.segMode  = 1;
    this.exprMode = true;
    this.lang     = "en";
    this.scope    = { chars: 2, words: 3, lines: 4 };
    this.ui       = {};

    this.str = {
        en: {
            splitLabel:  "Split into:",
            items:       ["Characters", "Words", "Lines"],
            withExpr:    "Hides other {u}s \u2014 keeps full sentence shape & exact position",
            withoutExpr: "Each layer = its {u} only \u2014 tight bounds, approx. position",
            aboutTitle:  "About",
            aboutTpl:    "Splits a text layer into separate layers,\none per {u}.\r\rMode 1 (Expressions):\rHides other {u}s via expression \u2014 layer keeps the full sentence size and exact position.\r\rMode 2 (No Expressions):\rEach layer = its {u} only, bounds shrink to fit. Position is approximate.",
            units:       ["character", "word", "line"],
            goBtn:       "Burst",
            credit:      "instagram: @ishoil",
            follow:      "\u2197 Follow",
            langBtn:     "\u0639\u0631\u0628\u064a"
        },
        ar: {
            splitLabel:  "\u0642\u0633\u0651\u0645 \u0625\u0644\u0649:",
            items:       ["\u0623\u062d\u0631\u0641", "\u0643\u0644\u0645\u0627\u062a", "\u0623\u0633\u0637\u0631"],
            withExpr:    "\u064a\u062e\u0641\u064a \u0628\u0627\u0642\u064a \u0627\u0644{u} \u2014 \u064a\u062d\u0627\u0641\u0638 \u0639\u0644\u0649 \u0634\u0643\u0644 \u0627\u0644\u062c\u0645\u0644\u0629 \u0648\u0645\u0648\u0636\u0639\u0647\u0627 \u0627\u0644\u062f\u0642\u064a\u0642",
            withoutExpr: "\u062d\u062c\u0645 \u0643\u0644 \u0637\u0628\u0642\u0629 = \u0627\u0644{u} \u0641\u0642\u0637 \u2014 \u062d\u062f\u0648\u062f \u0636\u064a\u0642\u0629\u060c \u0645\u0648\u0636\u0639 \u062a\u0642\u0631\u064a\u0628\u064a",
            aboutTitle:  "\u062d\u0648\u0644",
            aboutTpl:    "\u064a\u0641\u0643\u0651\u0643 \u0637\u0628\u0642\u0629 \u0627\u0644\u0646\u0635 \u0625\u0644\u0649 \u0637\u0628\u0642\u0627\u062a \u0645\u0646\u0641\u0635\u0644\u0629 \u2014\r{u} \u0644\u0643\u0644 \u0637\u0628\u0642\u0629.\r\r\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0623\u0648\u0644 (\u062a\u0639\u0628\u064a\u0631\u0627\u062a):\r\u064a\u062e\u0641\u064a \u0628\u0627\u0642\u064a \u0627\u0644{u}\u0627\u062a \u0628\u062a\u0639\u0628\u064a\u0631\u060c \u0648\u0643\u0644 \u0637\u0628\u0642\u0629 \u062a\u062d\u062a\u0641\u0638 \u0628\u062d\u062c\u0645 \u0627\u0644\u062c\u0645\u0644\u0629 \u0643\u0627\u0645\u0644\u0629 \u0648\u0645\u0648\u0636\u0639\u0647\u0627 \u0627\u0644\u062f\u0642\u064a\u0642.\r\r\u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u062b\u0627\u0646\u064a (\u0628\u062f\u0648\u0646 \u062a\u0639\u0628\u064a\u0631\u0627\u062a):\r\u0643\u0644 \u0637\u0628\u0642\u0629 = \u0627\u0644{u} \u0641\u0642\u0637\u060c \u062d\u062f\u0648\u062f\u0647\u0627 \u0636\u064a\u0642\u0629 \u0639\u0644\u0649 \u0642\u062f\u0647\u0627\u060c \u0648\u0627\u0644\u0645\u0648\u0636\u0639 \u062a\u0642\u0631\u064a\u0628\u064a.",
            units:       ["\u062d\u0631\u0641", "\u0643\u0644\u0645\u0629", "\u0633\u0637\u0631"],
            goBtn:       "\u062a\u0641\u0643\u064a\u0643",
            credit:      "\u0625\u0646\u0633\u062a\u063a\u0631\u0627\u0645: @ishoil",
            follow:      "\u2197 \u062a\u0627\u0628\u0639",
            langBtn:     "English"
        },
        err: {
            noComp:   { en: "Please activate a composition first.",      ar: "\u064a\u0631\u062c\u0649 \u062a\u0641\u0639\u064a\u0644 \u062a\u0631\u0643\u064a\u0628\u0629 \u0623\u0648\u0644\u0627\u064b." },
            noLayer:  { en: "Please select a text layer.",               ar: "\u064a\u0631\u062c\u0649 \u0627\u062e\u062a\u064a\u0627\u0631 \u0637\u0628\u0642\u0629 \u0646\u0635." },
            badLayer: { en: "Selected layer must be a text layer.",      ar: "\u064a\u062c\u0628 \u0623\u0646 \u062a\u0643\u0648\u0646 \u0627\u0644\u0637\u0628\u0642\u0629 \u0637\u0628\u0642\u0629 \u0646\u0635." },
            boxText:  { en: "Paragraph (box) text is not supported.",    ar: "\u0646\u0635 \u0627\u0644\u0645\u0631\u0628\u0639 \u063a\u064a\u0631 \u0645\u062f\u0639\u0648\u0645." }
        }
    };

    this.fill = function (tpl, unit) {
        return tpl.replace(/\{u\}/g, unit);
    };

    this.getUnit = function () {
        return tb.str[tb.lang].units[tb.segMode];
    };

    this.refreshDynamic = function () {
        var s    = tb.str[tb.lang];
        var unit = tb.getUnit();
        tb.ui.withExpr.text    = tb.fill(s.withExpr,    unit);
        tb.ui.withoutExpr.text = tb.fill(s.withoutExpr, unit);
        tb.ui.aboutTxt.text    = tb.fill(s.aboutTpl,    unit);
        tb.ui.win.layout.layout(true);
    };

    this.launch = function (obj) {
        var win = (obj instanceof Panel) ? obj : new Window("palette", tb.label, undefined, {resizeable: false});
        var s   = tb.str.en;
        var u   = s.units[tb.segMode];

        var root = win.add("group");
        root.orientation   = "column";
        root.alignChildren = ["fill", "top"];
        root.alignment     = ["fill", "fill"];
        root.spacing       = 6;
        root.margins       = 8;

        var segRow = root.add("group");
        segRow.orientation   = "row";
        segRow.alignChildren = ["left", "center"];
        segRow.alignment     = ["fill", "top"];

        var segLabel = segRow.add("statictext", undefined, s.splitLabel);

        var segList = segRow.add("dropdownlist", undefined, s.items);
        segList.selection           = 1;
        segList.preferredSize.width = 110;

        var langBtn = segRow.add("button", undefined, s.langBtn);
        langBtn.preferredSize = [52, 20];

        var modeRow = root.add("group");
        modeRow.orientation   = "column";
        modeRow.alignChildren = ["left", "top"];
        modeRow.alignment     = ["fill", "top"];

        var withExpr    = modeRow.add("radiobutton", undefined, tb.fill(s.withExpr,    u));
        withExpr.value  = true;
        var withoutExpr = modeRow.add("radiobutton", undefined, tb.fill(s.withoutExpr, u));

        var aboutPnl = root.add("panel", undefined, s.aboutTitle);
        aboutPnl.orientation   = "column";
        aboutPnl.alignChildren = ["fill", "top"];
        aboutPnl.alignment     = ["fill", "top"];
        aboutPnl.margins       = [8, 14, 8, 8];

        var aboutTxt = aboutPnl.add("statictext", undefined, tb.fill(s.aboutTpl, u), {multiline: true});
        aboutTxt.alignment           = ["fill", "top"];
        aboutTxt.preferredSize.width = 210;

        var goRow = root.add("group");
        goRow.orientation = "row";
        goRow.alignment   = ["fill", "top"];

        var goBtn = goRow.add("button", undefined, s.goBtn);
        goBtn.alignment = ["right", "center"];

        var divider   = root.add("panel", undefined, undefined);
        divider.alignment = ["fill", "top"];
        divider.height    = 1;

        var footerRow = root.add("group");
        footerRow.orientation   = "row";
        footerRow.alignChildren = ["center", "center"];
        footerRow.alignment     = ["fill", "bottom"];
        footerRow.spacing       = 6;

        var creditTxt = footerRow.add("statictext", undefined, s.credit);
        creditTxt.alignment = ["fill", "center"];

        var igBtn = footerRow.add("button", undefined, s.follow);
        igBtn.preferredSize = [70, 22];

        tb.ui = {
            win: win, segLabel: segLabel, segList: segList, langBtn: langBtn,
            withExpr: withExpr, withoutExpr: withoutExpr,
            aboutPnl: aboutPnl, aboutTxt: aboutTxt,
            goBtn: goBtn, creditTxt: creditTxt, igBtn: igBtn
        };

        segList.onChange = function () {
            tb.segMode = this.selection.index;
            tb.refreshDynamic();
        };

        withExpr.onClick    = function () { tb.exprMode = true;  };
        withoutExpr.onClick = function () { tb.exprMode = false; };
        goBtn.onClick       = function () { tb.process(); };

        igBtn.onClick = function () {
            system.callSystem('explorer "https://www.instagram.com/ishoil"');
        };

        langBtn.onClick = function () {
            tb.lang = (tb.lang === "en") ? "ar" : "en";
            tb.applyLang();
        };

        if (win instanceof Window) {
            win.center();
            win.show();
        } else {
            win.layout.layout(true);
        }
    };

    this.applyLang = function () {
        var s      = tb.str[tb.lang];
        var u      = tb.getUnit();
        var curIdx = tb.ui.segList.selection ? tb.ui.segList.selection.index : 1;

        tb.ui.segLabel.text    = s.splitLabel;
        tb.ui.langBtn.text     = s.langBtn;
        tb.ui.aboutPnl.text    = s.aboutTitle;
        tb.ui.goBtn.text       = s.goBtn;
        tb.ui.creditTxt.text   = s.credit;
        tb.ui.igBtn.text       = s.follow;

        tb.ui.segList.removeAll();
        for (var i = 0; i < s.items.length; i++) {
            tb.ui.segList.add("item", s.items[i]);
        }
        tb.ui.segList.selection = curIdx;

        tb.refreshDynamic();
    };

    this.compReady  = function () { return (app.project.activeItem instanceof CompItem); };
    this.layerReady = function (lyr) { return (lyr instanceof TextLayer); };

    this.rtlCheck = function (str) {
        return (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0590-\u05FF]/).test(str);
    };

    this.bindAnimator = function (target, idx, scopeVal) {
        var anims  = target.property("ADBE Text Properties").property("ADBE Text Animators");
        var anim   = anims.addProperty("ADBE Text Animator");
        var props  = anim.property("ADBE Text Animator Properties");
        var sels   = anim.property("ADBE Text Selectors");
        var opProp = props.addProperty("ADBE Text Opacity");
        opProp.setValue(0);
        var exSel = sels.addProperty("ADBE Text Expressible Selector");
        exSel.property("ADBE Text Expressible Amount").expression =
            "selectorValue * (textIndex != " + idx + ");";
        sels.property("ADBE Text Expressible Selector")
            .property("ADBE Text Range Type2")
            .setValue(scopeVal);
    };

    this.process = function () {
        var e  = tb.str.err;
        var lg = tb.lang;
        try {
            if (!tb.compReady())       { alert(e.noComp[lg],   tb.label, true); return; }
            var comp  = app.project.activeItem;
            var layer = comp.selectedLayers[0];
            if (!layer)                { alert(e.noLayer[lg],  tb.label, true); return; }
            if (!tb.layerReady(layer)) { alert(e.badLayer[lg], tb.label, true); return; }

            var doc = layer.property("ADBE Text Properties")
                           .property("ADBE Text Document").value;
            if (doc.boxText) { alert(e.boxText[lg], tb.label, true); return; }

            var pos  = layer.position.value;
            var str  = layer.sourceText.value.toString();
            var rect = layer.sourceRectAtTime(comp.time, false);
            var rtl  = tb.rtlCheck(str);
            var L    = pos[0] + rect.left;
            var R    = pos[0] + rect.left + rect.width;
            var cur  = 0;

            app.beginUndoGroup(tb.label);

            if (tb.segMode === 0) {
                var vIdx = 0;
                for (var ci = 0; ci < str.length; ci++) {
                    var ch = str.charAt(ci);
                    if (/\s/.test(ch)) continue;
                    vIdx++;
                    var dup = layer.duplicate();
                    dup.name = ch;
                    if (tb.exprMode) {
                        tb.bindAnimator(dup, vIdx, tb.scope.chars);
                    } else {
                        dup.sourceText.setValue(ch);
                        var cr = dup.sourceRectAtTime(comp.time, false);
                        var nx = rtl ? (R - cur - cr.left - cr.width) : (L + cur - cr.left);
                        dup.position.setValue([nx, pos[1], pos[2]]);
                        cur += cr.width;
                    }
                }
            } else if (tb.segMode === 1) {
                var parts = str.split(/\s+/);
                for (var wi = 0; wi < parts.length; wi++) {
                    var wd = parts[wi];
                    if (!wd) continue;
                    var dup = layer.duplicate();
                    dup.name = wd;
                    if (tb.exprMode) {
                        tb.bindAnimator(dup, wi + 1, tb.scope.words);
                    } else {
                        if (wi > 0) cur += 25;
                        dup.sourceText.setValue(wd);
                        var wr = dup.sourceRectAtTime(comp.time, false);
                        var nx = rtl ? (R - cur - wr.left - wr.width) : (L + cur - wr.left);
                        dup.position.setValue([nx, pos[1], pos[2]]);
                        cur += wr.width;
                    }
                }
            } else if (tb.segMode === 2) {
                var rows = str.split(/\r+/);
                for (var li = 0; li < rows.length; li++) {
                    var ln  = rows[li];
                    var dup = layer.duplicate();
                    dup.name = ln || ("Line " + (li + 1));
                    if (tb.exprMode) {
                        tb.bindAnimator(dup, li + 1, tb.scope.lines);
                    } else {
                        dup.sourceText.setValue(ln);
                        var lr = dup.sourceRectAtTime(comp.time, false);
                        dup.position.setValue([pos[0], pos[1] + cur, pos[2]]);
                        cur += lr.height + 25;
                    }
                }
            }

            layer.enabled  = false;
            layer.selected = false;
            app.endUndoGroup();

        } catch (err) {
            alert("Error: " + (err.message || String(err)), tb.label, true);
        }
    };

    this.launch(thisObj);
}

new TextBurst(this);
