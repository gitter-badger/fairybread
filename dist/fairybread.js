function Fairybread(sheetType) {
    this.sheetType = sheetType;
    this.scopeClass = '';
    this.ensureList = {};
    // Create Id
    function makeId() {
        var text = "fairybread_";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var array = Array.apply(null, Array(20));
        array.map(function (data, key) { text += possible.charAt(Math.floor(Math.random() * possible.length)); });
        return text;
    };
    // Uniquish Id
    this.id = makeId();
    // Create Sheetsheet
    function createSheet(id) {
        var styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.id = id;
        styleNode.rel = 'stylesheet';
        // required for sheet attr to be created
        return styleNode;
    }
    this.bindSheet = function (node,location) {
        document[location].appendChild(node);
    }
    // Create Js Object from Css text
    this.cssToJs = function (css) {
        var rules = css.split(';');
        var ruleSet = {}
        rules.map(function (data, key) {
            var keyValue = data.split(':');
            if (keyValue.length === 2) {
                ruleSet[keyValue[0].trim().toString()] = keyValue[1].trim();
            }
        });
        return ruleSet;
    }

    this.sheet = createSheet(this.id);
    this.specialSheet = false;
    this.specialId = makeId() + "_special";
    this.rendered = false;
    this.rules = {};
    this.index = 0;
    this.specialIndex = 0;

}

Fairybread.prototype.getAll = function () { return this.rules; }
//Extend any rule to use in another css object
Fairybread.prototype.extend = function (selector) { return this.rules[selector]; }

Fairybread.prototype.add = function (selector, rules) {
    if (this.sheetType != 'global') {
            this.scopeClass = "." + this.id;
    }
    //Create Css Objects
    if (this.rules[selector.toString()] === undefined) {
        this.rules[selector.toString()] = {
            js: this.cssToJs(rules),
            css: rules,

        }
    } else {
        console.error(selector + " is ready in this style sheet");
    }
}
Fairybread.prototype.render = function (location) {
    var result;
    var sheetRules = this.rules;
    var thisSheet = this.sheet;
    var bindSheet = this.bindSheet;
    var scopeClass = this.scopeClass;
    var rulesRef = Object.keys(sheetRules);
    //Generate a plain text style sheet
    function renderFlat() {
            var echoSheet = "";
            rulesRef.map(function (key) {
                echoSheet += scopeClass+' '+key+'{'+sheetRules[key].css+'}';
            });
            echoSheet = echoSheet.replace(/(\r\n|\n|\r)/gm, "").trim();
            return echoSheet;
    }

    switch (location) {
        case 'raw':
            var flatSheet = renderFlat();
            this.sheet.innerHTML = flatSheet;
            result = {
                js: sheetRules,
                css: flatSheet
            };
            break;
        case 'body':
            bindSheet(thisSheet, 'body');
            thisSheet.innerHTML = renderFlat();
        break;
        case 'head':
        default:
            bindSheet(thisSheet, 'head');
            thisSheet.innerHTML = renderFlat();
            break;
    }
    this.rendered = true;
    return result;
}


Fairybread.prototype.addSpecial = function (rule) {
    var id = this.specialId;
    if (this.specialSheet === false) {
        var styleNode = document.createElement('style');
        styleNode.type = 'text/css';
        styleNode.id = id;
        styleNode.rel = 'stylesheet';
        document.body.appendChild(styleNode);
        this.specialSheet = document.getElementById(id);  //FIXME
        this.specialSheet.innerHTML = rule;
    } else {
        this.specialSheet.innerHTML += "\n" + rule;
    }
}



if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Fairybread;
} else {
    window.Fairybread = Fairybread;
}