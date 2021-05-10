// create the function that gets the data and creates the plots for the id
function plotTime(id) {

    // get the data from the json file
    d3.json("data/samples.json").then((data)=> {

        var wfreq = data.metadata.map(d => d.wfreq)
        var idWfreq = data.metadata.filter(s => s.id.toString() === id)[0];
        var idWash = idWfreq.wfreq ?? 0
        var samples = data.samples.filter(s => s.id.toString() === id);

        // 10 sample values
        var sampleVals = samples[0].sample_values.slice(0, 10).reverse();

        // top 10 id values
        var idVals = samples[0].otu_ids.slice(0, 10).reverse();

        // top 10 ids labels with OTU added
        var ids = idVals.map(x => "OTU " + x)

        // labels for top 10
        var labels = samples[0].otu_labels.slice(0, 10);

        // what we tracing at the bar
        var trace = {
            x: sampleVals,
            y: ids,
            text: labels,
            type:"bar",
            orientation: "h",
        };

        // bar data
        var data = [trace];

        // bar layout
        var layout = {
            title: "Top 10 Bacterial Cultures Found",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 30,
                b: 20
            }
        };

        // lets drink from the bar
        Plotly.newPlot("bar", data, layout, {displayModeBar: false});


        // trace chart bubble
        var trace1 = {
            x: samples[0].otu_ids,
            y: samples[0].sample_values,
            mode: "markers",
            marker: {
                size: samples[0].sample_values,
                color: samples[0].otu_ids
            },
            text: samples[0].otu_labels


        };

        // bubble layout?
        var layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1200,
            title: "Bacteria Cultures Per Sample"
        };

        // create the data variable
        var data1 = [trace1];

        // bubbly time
        Plotly.newPlot("bubble", data1, layout,{displayModeBar: false});



        // gaugey time
        var traceGauge = {
            labels: id,
            value: idWash,
            type:"indicator",
            mode: "gauge+number",
            title: { text: "Belly Button Washing Fequency", font: { size: 24 }, align: "center" },
            gauge: {
                axis: {range: [null, 9], tickmode: "linear"},
                steps: [
                    {range: [0,3], color: "#bfd8d9"},
                    {range: [3,4], color: "#afced0"},
                    {range: [4,5], color: "#9fc5c6"},
                   {range: [5,6], color: "#8fbbbc"},
                   {range: [6,7], color: "#7fb1b3"},
                   {range: [7,8], color: "#6fa8aa"},
                   {range: [8,9], color: "#5f9ea0"}
                    ]
                    ,
            threshold: {
                line: { color: "purple", width: 5 },
                thickness: 0.8,
                value: 2
                        }
                   }
        }


        var data = [traceGauge]

        Plotly.newPlot("gauge", data,{displayModeBar: false})

    });
}


function infoTime(id) {

    d3.json("data/samples.json").then((data)=> {

        // filter
        var result = data.metadata.filter(meta => meta.id.toString() === id)[0];

        // select data
        var demographicInfo = d3.select("#sample-metadata");

        // empty data
        demographicInfo.html("");

        // replace info
        Object.entries(result).forEach((info) => {
                demographicInfo.append("h5").text(info[0].toUpperCase() + ": " + info[1] + "\n");
        });
    });
}

// create change function when new id selected
function optionChanged(id) {
    plotTime(id);
    infoTime(id);
}

// initializing
function init() {
    // dropdown menu
    var dropdown = d3.select("#selDataset");

    // read the data
    d3.json("data/samples.json").then((data)=> {
        console.log(data)

        // id from dropdown
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // replace functions
        plotTime(data.names[0]);
        infoTime(data.names[0]);
    });
}

init();
