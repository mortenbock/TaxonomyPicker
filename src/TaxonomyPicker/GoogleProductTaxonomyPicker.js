/// <reference path="jquery-1.7.1-vsdoc.js"/>

(function($) {
	$.fn.GoogleProductTaxonomyPicker = function (taxFileUrl) {

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
			$ddlContainer.find("select").each(function() {
				var selVal = $(this).val();
				if (selVal.length > 0) {
					val.push(selVal);
				}
			});

			$valueTxt.val(val.join(" > "));
			$valueTxt.get(0).scrollLeft = $valueTxt.get(0).scrollWidth;
		};

		var preselect = function(category) {
			var existingValue = category ? category : $valueTxt.val();
			var parts = existingValue.split(" > ");
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
				hasContent = true;
				break;
			}

			if (hasContent) {
				var lvl = level ? level : 1;
				var $sel = $("<select class='category_tax_" + lvl + "'></select>");

				$sel.append("<option></option>");
				for (var key in opts) {
					var opt = $("<option></option>");
					opt.attr("val", key);
					opt.append(key);
					$sel.append(opt);
				}

				$ddlContainer.append($sel);

				$sel.change(function () {
					$(this).nextAll("select").remove();
					var selected = $(this).children("option:selected").val();

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
							results += "<div class='gptp-resultItem'><button type='button'>Select</button><span class='gptp-category'>" + this + "</span></div>";
						}
					});
					$searchResults.append(results);
					$searchResults.show();
				}
			}
		});

		$picker.on("click", ".gptp-resultItem button", function() {
			var $item = $(this).parent();
			var category = $item.find(".gptp-category").text();
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
					var line = lines[i];
					if (line.indexOf("#") == 0) continue;

					searchable.push(line);
					var parts = line.split(">");
					var parent = categories;
					for (var j = 0; j < parts.length; j++) {
						var part = parts[j].trim();
						if (part.length == 0) continue;
						var partObj = parent[part];
						if (partObj === undefined)
							parent[part] = partObj = {};

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