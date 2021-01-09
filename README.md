# Plotly Custom Visualization for Splunk

This is a custom visualization for Splunk which uses the plotly js library together with the Splunk custom visualization API.

This Repo currently contains the following visualizations:
- heatmap

![Alt text](heatmap.png?raw=true "example of the visualization")

## Installation

- Download and install Splunk
- Download this repository and unpack it
- copy the folder to your apps directory `$SPLUNK_HOME/etc/apps/` of your splunk installation
- Restart splunk to apply changes either with `$SPLUNK_HOME/bin/splunk restart` or from the UI

## Usage

### Heatmap
* Type your search
* The search should contain the following fields `xValues`, and additionals fields that will make up the `yValues` axis names of the heatmap
* The `zValues` array will be taken from all fields except the `xValues` field 
* Click on tab `Visualization` and then `Heatmap`
* Format the visualization as needed
* The field name of xValues can be changed in the formatting menu

### Style Menu

The app allows for some custom modifications. Currently the following settings are implemented:
![Alt text](menu.001.png?raw=true "the style menu")
