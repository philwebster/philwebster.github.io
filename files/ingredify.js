var tooltipText;
var isFirstOccurrence = true;

function filterMark(textNode, foundTerm, totalCounter, counter) {
	if (textNode.parentNode.className == "tooltip" || textNode.parentNode.className == "tooltiptext" || isFirstOccurrence == true) {
		isFirstOccurrence = false;
		return false;
	}
	return true;
}

function insertTooltip(node) {
	var tooltip = document.createElement("span");
	tooltip.className = "tooltiptext";
	tooltip.innerHTML = tooltiptext;
	node.appendChild(tooltip);
}

function ingredify() {

	var lines = getSelectedLines();
	
	if (!lines) {
		return;
	}

    // Determine selected options

	for (var line in lines) {
		var strippedline = lines[line].replace(/\([^\)]*\)$/, "");
		var tokenizedLine = strippedline.split(" ");

		if (tokenizedLine.length == 1) {
			continue;
		}
		var foundWordWithMultipleMatches = false;

		while (foundWordWithMultipleMatches != true && tokenizedLine.length > 0) {
			lastWord = tokenizedLine.pop();
			lastWord = lastWord.replace(/^[,]|[,]$/g, "");
		    var options = {
		    	"filter": filterMark, 
	       	   	"element": "div", 
			   	"className": "tooltip",
			   	"accuracy": "exactly", 
			   	"each": function(node){
	        		var tooltip = document.createElement("span");
					tooltip.className = "tooltiptext";
					tooltip.innerHTML = lines[line];
					node.appendChild(tooltip);
	    		},
	    		"done": function(total) {
	    			if (total > 0) {
	    				foundWordWithMultipleMatches = true;
	    			}
	    		}
			};
			var context = document.querySelectorAll("P");
			var instance = new Mark(context);
			tooltipText = lines[line];
			instance.mark(lastWord, options);
		}
	}

	clearSelection();
}

(function(){

	// check prior inclusion and version
	var done = false;
	var script = document.createElement("script");
	script.src = "https://cdn.jsdelivr.net/mark.js/8.4.2/mark.min.js";
	script.onload = script.onreadystatechange = function(){
		if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
			done = true;
			initMyBookmarklet();
		}
	};

	document.getElementsByTagName("head")[0].appendChild(script);


	var tooltipCSS = document.createElement("style");
	tooltipCSS.type = "text/css";
	tooltipCSS.innerHTML = " \
	/* Tooltip container */ \
.tooltip { \
    position: relative; \
    display: inline-block; \
    border-bottom: 1px dotted black; /* If you want dots under the hoverable text */ \
} \
 \
/* Tooltip text */ \
.tooltip .tooltiptext { \
    visibility: hidden; \
    width: 120px; \
    background-color: #555; \
    color: #fff; \
    text-align: center; \
    padding: 5px 0; \
    border-radius: 6px; \
 \
    /* Position the tooltip text */ \
    position: absolute; \
    z-index: 1; \
    bottom: 125%; \
    left: 50%; \
    margin-left: -60px; \
} \
 \
/* Tooltip arrow */ \
.tooltip .tooltiptext::after { \
    content: \"\"; \
    position: absolute; \
    top: 100%; \
    left: 50%; \
    margin-left: -5px; \
    border-width: 5px; \
    border-style: solid; \
    border-color: #555 transparent transparent transparent; \
} \
 \
/* Show the tooltip text when you mouse over the tooltip container */ \
.tooltip:hover .tooltiptext { \
    visibility: visible; \
    opacity: 1; \
}"
	document.getElementsByTagName("head")[0].appendChild(tooltipCSS);
	
	function initMyBookmarklet() {
		(window.myBookmarklet = function() {
			// your JavaScript code goes here!
			ingredify()
		})();
	}

})();

function getSelectedLines() {
	var text = getSelectedText();
	if (!text) {
		alert("select ingredients");
		return;
	}
	var lines = text.split("\n").filter(function(s){
		return s.length > 0;
	});
	return lines;
}

function getSelectedText() {
    var text = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            text = container.textContent;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            text = document.selection.createRange().text;
        }
    }
    if(text === ""){
        return false;
    }
    else{
        return text;
    }
}

function clearSelection() {
    var sel;
    if ( (sel = document.selection) && sel.empty ) {
        sel.empty();
    } else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        var activeEl = document.activeElement;
        if (activeEl) {
            var tagName = activeEl.nodeName.toLowerCase();
            if ( tagName == "textarea" ||
                    (tagName == "input" && activeEl.type == "text") ) {
                // Collapse the selection to the end
                activeEl.selectionStart = activeEl.selectionEnd;
            }
        }
    }
}
