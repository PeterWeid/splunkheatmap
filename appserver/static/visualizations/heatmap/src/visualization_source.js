/*
 * Visualization source
 */
define([
    'jquery',
    'underscore',
    'plotly.js-dist',
    'api/SplunkVisualizationBase',
    'api/SplunkVisualizationUtils'
    // Add required assets to this list
],
    function (
        $,
        _,
        Plotly,
        SplunkVisualizationBase,
        SplunkVisualizationUtils
    ) {

        // Extend from SplunkVisualizationBase
        return SplunkVisualizationBase.extend({

            initialize: function () {
                SplunkVisualizationBase.prototype.initialize.apply(this, arguments);
                this.$el = $(this.el);

                // this.$el.append('<h3>This is a custom visualization stand in.</h3>');
                // this.$el.append('<p>Edit your custom visualization app to render something here.</p>');

                // Initialization logic goes here
                // Handle multiple Graphs
                this.__uniqueID = Math.floor(Math.random() * 100000);

                // Add a css selector class
                this.$el.attr('id', 'heatmapContainer_' + this.__uniqueID);
            },

            // Optionally implement to format data returned from search. 
            // The returned object will be passed to updateView as 'data'
            formatData: function (data) {

                // Format data 
                console.log("test");
                return data;
            },

            // Implement updateView to render a visualization.
            //  'data' will be the data object returned from formatData or from the search
            //  'config' will be the configuration property object
            updateView: function (data, config) {

                console.log(JSON.stringify(config));


                //get info from config
                var title = this._getEscapedProperty('plotTitle', config) || null;
                var scale = this._getEscapedProperty('autoScale', config) || 'auto';
                var xAxisLabel = this._getEscapedProperty('xAxisName', config) || "x";
                var yAxisLabel = this._getEscapedProperty('yAxisName', config) || '';
                var opacity = parseFloat(this._getEscapedProperty('opacity', config) || '1');
                var colorPalette = this._getEscapedProperty('colorPalette', config) || 'Portland';
                var reverse = Boolean(Number(this._getEscapedProperty('reverse', config)));
                var xgap = parseFloat(this._getEscapedProperty('xGap', config) || '0.05');
                var ygap = parseFloat(this._getEscapedProperty('yGap', config) || '0.1');
                var xPara = this._getEscapedProperty('xValue', config) || "timestamp";

                var zmin = parseFloat(this._getEscapedProperty('zMin', config) || '0');
                var zmax = parseFloat(this._getEscapedProperty('zMax', config) || '1');

                // get xValues, zValues and y Values for the heatmap plot

                var fieldnames = [];
                for (var i = 0; i < data['fields'].length; i++) {
                    fieldnames.push(data['fields'][i]['name']);

                }


                var yValuesIndex = fieldnames.findIndex((element) => element == xPara);

                var xValues = data['columns'][yValuesIndex];

                forDeletion = [xPara];
                var yValues = fieldnames.filter(item => !forDeletion.includes(item));

                // this code snippet does an alphanumeric sorting of the yValues
                // source : https://stackoverflow.com/questions/4340227/sort-mixed-alpha-numeric-array
                const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', { numeric: true });
                yValues = yValues.sort(sortAlphaNum);

                var index = 0;
                var zValues = [];
                for (var i = 0; i < yValues.length; i++) {

                    index = fieldnames.findIndex((element) => element == yValues[i]);
                    zValues.push(data['columns'][index]);
                }

                // reverse the zValues and y Values if reverse is set to true

                if (reverse) {
                    zValues = zValues.reverse();
                    yValues = yValues.reverse();

                }

                // these functions return the min an max values
                // if scale is set to "auto" this values are use of zmin and zmax in the heatmap plot

                function get_min(zValues) {
                    var minarr = [];
                    for (var i = 0; i < zValues.length; i++) {

                        minarr.push(Math.min.apply(null, zValues[i]));
                    }

                    return Math.min.apply(null, minarr);
                }

                function get_max(zValues) {
                    var maxarr = [];
                    for (var i = 0; i < zValues.length; i++) {

                        maxarr.push(Math.max.apply(null, zValues[i]));
                    }

                    return Math.max.apply(null, maxarr);
                }

                //window.alert(get_max(zValues=zValues));
                // checks if scale is auto or not
                if (scale == 'auto') {
                    var zminVal = get_min(zValues = zValues);
                    var zmaxVal = get_max(zValues = zValues);
                } else {
                    var zminVal = zmin;
                    var zmaxVal = zmax;
                }

                // Put everything together:

                var data = [{
                    x: xValues,
                    y: yValues,
                    z: zValues,
                    type: 'heatmap',
                    showscale: true,
                    colorscale: colorPalette,
                    zmin: zminVal,
                    zmax: zmaxVal,
                    opacity: opacity,
                    ygap: ygap,
                    xgap: xgap,
                    connectgaps: false,
                    colorbar: { len: 0.8, },
                }];

                var layout = {
                    title: title,
                    plot_bgcolor: "black",
                    paper_bgcolor: "#FFF3",
                    yaxis: { title: yAxisLabel },
                    xaxis: { title: xAxisLabel },
                    margin: {
                        t: 40
                    }
                };
                // Plotting

                Plotly.newPlot('heatmapContainer_' + this.__uniqueID, data, layout, { displaylogo: false, responsive: true });


            },


            _getEscapedProperty: function (name, config) {
                var propertyValue = config[this.getPropertyNamespaceInfo().propertyNamespace + name];
                if (propertyValue !== undefined) propertyValue = propertyValue.replace(/"/g, '');
                return SplunkVisualizationUtils.escapeHtml(propertyValue);
            },

            // Search data params
            getInitialDataParams: function () {
                return ({
                    outputMode: SplunkVisualizationBase.COLUMN_MAJOR_OUTPUT_MODE,
                    count: 100000
                });
            },

            // Override to respond to re-sizing events
            reflow: function () { }
        });
    });