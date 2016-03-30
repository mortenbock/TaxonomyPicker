/// <reference path="jquery-1.7.1-vsdoc.js"/>

(function($) {
	$.fn.GoogleProductTaxonomyPicker = function (taxFileUrl, publishIds) {
		var $picker = this;

		$picker.find(".gptp-selectBtn").hide();
		var $selectorArea = $picker.find(".gptp-selector-area");
		var $ddlContainer = $picker.find(".gptp-ddlcontainer");
		var $searchResults = $picker.find(".gptp-searchresults");
		var $searchTxt = $picker.find(".gptp-searchTxt");
		var $valueTxt = $picker.find(".gptp-valueTxt");

		var categories = {};
		var searchable = [];
		var initialized = false;

		var updateValue = function() {
		    var val = [];
		    var lastId = -1;
			$ddlContainer.find("select").each(function() {
			    var selVal = $(this).val();
				if (selVal.length > 0) {
				    val.push(selVal);
				    lastId = selVal;
				}
			});

            if (publishIds) {
                $valueTxt.val(lastId);
            } else {
                $valueTxt.val(val.join(" > "));
            }
			$valueTxt.get(0).scrollLeft = $valueTxt.get(0).scrollWidth;
		};

		var locateselection = function (cats, toFind) {
		    var currentCatId = -1;
            for (var cat in cats) {
                if (cat === "googleCategoryId") continue;
                currentCatId = cats[cat].googleCategoryId;
                if (currentCatId === toFind)
                    return [currentCatId];
                var childLocated = locateselection(cats[cat], toFind);
                if (childLocated.length) {
                    childLocated.push(currentCatId);
                    return childLocated;
                }
            }
		    return [];
		}

		var preselect = function(category) {
		    var existingValue = category ? category : $valueTxt.val();
		    var parts = [];
		    if (publishIds) {
                //use the id
		        var result = locateselection(categories, existingValue);
                if (result.length) {
                    result.reverse();
                    parts = result;
                }
		    } else {
                parts = existingValue.split(" > ");
		    }
		    for (var i = 0; i < parts.length; i++) {
		        var selector = $ddlContainer.find(".category_tax_" + (i + 1));
		        selector.val(parts[i]);
		        selector.change();
		    }
			initialized = true;
		};

		var buildSelector = function (opts, level) {
			var hasContent = false;
			for (var o in opts) {
			    if (o === "googleCategoryId") continue;
				hasContent = true;
				break;
			}

			if (hasContent) {
				var lvl = level ? level : 1;
				var $sel = $("<select class='category_tax_" + lvl + "'></select>");

				$sel.append("<option></option>");
				for (var key in opts) {
				    if (key === "googleCategoryId") continue;
				    var opt = $("<option></option>");
				    if (publishIds) {
				        opt.attr("value", opts[key].googleCategoryId);
				    } else {
				        opt.attr("value", key);
				    }
				    
					opt.append(key);
					$sel.append(opt);
				}

				$ddlContainer.append($sel);

				$sel.change(function () {
					$(this).nextAll("select").remove();
					var selected = $(this).children("option:selected").text();

					if (initialized) {
						updateValue();
					}

					var obj = opts[selected];
					if (obj) {
						buildSelector(obj, lvl + 1);
					}
				});
			}
		};

		$searchTxt.on("input", function () {
			var $input = $(this);
			var val = $input.val();
			$searchResults.hide();
			$searchResults.html("");
			if (val.length > 0) {
				var found = $.grep(searchable, function (l) {
					return l.toLowerCase().indexOf(val.toLowerCase()) >= 0;
				});

				if (found.length > 0) {
					var results = "";
					$.each(found, function(i) {
					    if (i <= 20) {
					        var lineText = this;
					        var lineId = -1;
					        var idRegEx = /^(([0-9]+)\s\-\s)(.*)/;
					        var idMatch = idRegEx.exec(this);
					        if (idMatch && idMatch.length === 4) {
					            lineId = idMatch[2];
					            lineText = idMatch[3];
					        }
					        results += "<div class='gptp-resultItem'><button type='button'>Select</button><span class='gptp-category' data-catId='" + lineId + "'>" + lineText + "</span></div>";
						}
					});
					$searchResults.append(results);
					$searchResults.show();
				}
			}
		});

		$picker.on("click", ".gptp-resultItem button", function() {
			var $item = $(this).parent();
		    let categoryElm = $item.find(".gptp-category");
		    var category = publishIds ? categoryElm.attr("data-catId") : categoryElm.text();
			$searchResults.hide();
			preselect(category);
		});

		$.ajax(taxFileUrl, {
			type: "GET",
			contentType: "text/plain",
			dataType: "text",
			cache: true,
			success: function(data) {

				console.log("GoogleProductTaxonomyPicker loaded data");

				var lines = data.split("\n");

				for (var i = 0; i < lines.length; i++) {
					var line = lines[i].trim();
					if (line.indexOf("#") === 0) continue;

					var lineText = line;
				    var lineId = -1;

					var idRegEx = /^(([0-9]+)\s\-\s)(.*)/;
				    var idMatch = idRegEx.exec(line);
				    if (idMatch && idMatch.length === 4) {
				        lineId = idMatch[2];
				        lineText = idMatch[3];
				    }

				    searchable.push(line);
					var parts = lineText.split(">");
					var parent = categories;
					for (var j = 0; j < parts.length; j++) {
						var part = parts[j].trim();
						if (part.length === 0) continue;

						var partObj = parent[part];
						if (partObj === undefined)
							parent[part] = partObj = {"googleCategoryId": lineId};

						parent = partObj;
					}
				}

				buildSelector(categories);
				preselect();
				$selectorArea.show();
			},
			error: function(xhr, status, errorThrown) {
				console.log("GoogleProductTaxonomyPicker error: " + status);
				console.log("GoogleProductTaxonomyPicker error: " + errorThrown);
				alert("GoogleProductTaxonomyPicker could not load file: " + taxFileUrl + ". Error: " + status);
			}
		});
	};
})(jQuery);