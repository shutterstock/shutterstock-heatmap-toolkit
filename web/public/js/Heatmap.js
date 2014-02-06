//Heatmap = window.Heatmap || {};

Heatmap = function(args) {
	var self = this;

	self.init = function() {
		var cp = new Heatmap.ControlPanel({
			callback: function(selected) {
				self.generateHeatMap({selected: selected});
			}
		});
		cp.getFields();
		cp.drawControlPanel({
			callback: function() {
			   cp.eventListeners();
		   }
		});

		self.generateHeatMap();
	}

	self.getHeatMapData = function(args) {
		var filters = [];
		if (args.selected) {
			for (var field in args.selected) {
				filters.push('fq='+field+':"'+args.selected[field]+'"');
			}
		}

		var params = {
			"wt": 'json',
			"q": '*:*',
			"rows": 0,
			"facet": 'true',
			"facet.field": 'mouse_x_y',
			"facet.mincount": 1,
	 		"facet.limit": 5000,
		};

		var qstring = filters.join('&');

		$.ajax({
			url: '/solr/heatmap/select?'+qstring,
			data: params,
			dataType: 'json',
			type: 'get',
			crossDomain: true,
			success: function(results) {
				args.callback(results);
			}
		});
	}

	self.generateHeatMap = function(args) {
		var selected = args ? args.selected : null;
		self.clearHeatMap();

		self.getHeatMapData({
			selected: selected,
			callback: self.drawHeatMap
		});
	}

	self.getSolrFacets = function(results,field) {

		var facets = results.facet_counts.facet_fields[field];
		// wrangle solr facet results into key value pairs
		var data = [];
		var key;
		var count;
		var max = 0;
		var counts = [];
		facets.forEach(function(value,i) {
			if (key != null) {
				data.push([key,value]);
				key = null;
			} else {
				key = value || '-';
			}
		});

		return data;
	}

	self.clearHeatMap = function() {
		$('#heatmap-overlay').html('');
	}

	self.drawHeatMap = function(results) {
		var facets = self.getSolrFacets(results,'mouse_x_y');

		var data = [];
		var x_y;
		var count;
		var max = 0;
		var counts = [];
		for (var i in facets) {
			var pair = facets[i];

			var points = pair[0].split('-');
			var count  = pair[1];


			if (count > max) {
				max = count;
			}

			data.push({
				"x": parseInt(points[0]),
				"y": parseInt(points[1]),
				"count": count,
			});

		}

		var config = {
			element: document.getElementById("heatmap-overlay"),
			radius: 10,
			opacity: 50,
			legend: {
				position: 'tr',
				title: 'Click Distribution'
			}
		};

		var data = {
			max: max / 4,
			data: data,
		};


		//creates and initializes the heatmap
		var heatmap = h337.create(config);

		heatmap.store.setDataSet(data);
	}


	self.init();
	return self;
}
