Heatmap.ControlPanel = function(args) {

	var self = this;

	self.selected = {};
	self.callback = args.callback;

	self.getFields = function() {
		var fields = {};
		$.ajax({
			url: '/solr/heatmap/admin/luke',
			data: {
				wt: 'json',
				show: 'schema',
			},
			dataType: 'json',
			type: 'get',
			async: false,   
			success: function(results) {

				var ignore = {
					mouse_x_y: 1,
					timestamp: 1,
					uid: 1,
					_version_: 1,   
				};
				if (results && results.schema && results.schema.fields) {
					for (var field in results.schema.fields) {
						if (ignore[field]) {
							continue;
						}

						fields[field] = self.getFacets({field: field});
					}
				}
			}
		});
		return fields;
	},

	self.getFacets = function(args) {
		var field = args.field;
		var list = [];

		$.ajax({
			url: '/solr/heatmap/select',
			data: {
				'wt': 'json',
				'q':  "*:*",
				'facet': 'true',
				'facet.field': field,
				'facet.mincount': 1,
			},
			dataType: 'json',
			type: 'get',
			async: false,
			success: function(results) {
				if (results && results.facet_counts && results.facet_counts.facet_fields && results.facet_counts.facet_fields[field]) {
					var pair = [];
					for (i in results.facet_counts.facet_fields[field]) {
						pair.push(results.facet_counts.facet_fields[field][i]);
						if (pair.length == 2) {
							list.push(pair);
							pair = [];
						}
					}
				}
			}
		});
		return list;
	}

	self.drawControlPanel = function(args) {
		$.ajax({
			url: 'control_panel.html',
			type: 'get',
			success: function(html) {
				$('#control-panel').html(html);
				var fields = self.getFields();

				for (var field in fields) {
					if (!fields[field].length) {
						continue;
					}
					var nav = [];

					nav.push('<li class="dropdown">');
					nav.push('<a class="dropdown-label" href="#" class="dropdown-toggle" data-toggle="dropdown">');
					nav.push('<span>'+field+'</span>');
					nav.push('<b class="caret"></b>');
					nav.push('</a>');
					nav.push('<ul class="dropdown-menu" data-field="'+field+'">');

					for (var i in fields[field]) {
						var pair = fields[field][i];

						nav.push('<li><a href="#" data-value="'+pair[0]+'">'+pair[0]+' ('+pair[1]+')</a></li>');
					}
					nav.push('</ul>');
					nav.push('</li>');
					$('#heatmap-nav').append( nav.join('') );
				}

				if (args.callback) {
					args.callback();
				}
			}
		});
	}

	self.eventListeners = function() {

		$('#heatmap-nav').on('click','.dropdown-menu li a',function(evt) {
			var elmt = $(evt.currentTarget);
			var value = elmt.attr('data-value');
			var field = elmt.parents('.dropdown-menu').attr('data-field');

			elmt.parents('.dropdown-menu').children('li').removeClass('active');

			if (self.selected[field] == value) {
				delete self.selected[field];
				elmt.parents('.dropdown').children('.dropdown-label').removeClass('selected');

			} else {
				self.selected[field] = value;
				elmt.parents('li').addClass('active');
				elmt.parents('.dropdown').children('.dropdown-label').addClass('selected');
			}

			// send selected params to callback
			if (self.callback) {
				self.callback(self.selected);
			}
		});
	}
}
