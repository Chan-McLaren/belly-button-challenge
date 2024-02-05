// Establish URL for JSON  
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to initialize the page 
async function init() {
    try {
        let data = await d3.json(url);
        populateDropdown(data.names, data);
        let firstSample = data.names[0];
        displayMetadata(data.metadata.find(metadata => metadata.id === parseInt(firstSample)));
        optionChanged(firstSample, data);
    } catch (error) {
        console.error("Error initializing:", error);
    }
}

// Function to populate the dropdown menu
function populateDropdown(names, data) {
    let dropdownMenu = d3.select("#selDataset");
    dropdownMenu.selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
    dropdownMenu.on("change", function() {
        let selectedName = d3.select(this).property("value");
        optionChanged(selectedName, data);
    });
}

// Function for changes in the dropdown menu
async function optionChanged(selectedName, data) {
    try {
        let selectedSample = data.samples.find(sample => sample.id === selectedName);
        let sortedValues = selectedSample.sample_values.slice().sort((a, b) => b - a);
        let top10Values = sortedValues.slice(0, 10).reverse();
        let top10Labels = selectedSample.otu_ids
            .slice(0, 10)
            .map(otu_id => `OTU ${otu_id}`)
            .reverse();
        let labelBubble = selectedSample.otu_ids;

        let trace1 = [{
            y: top10Labels,
            x: top10Values,
            type: 'bar',
            orientation: 'h'
        }];

        let trace2 = {
            x: labelBubble,
            y: sortedValues,
            mode: 'markers',
            marker: {
                size: sortedValues,
                color: labelBubble
            }
        };

        Plotly.newPlot('bar', trace1);
        Plotly.newPlot('bubble', [trace2]);

        displayMetadata(data.metadata.find(metadata => metadata.id === parseInt(selectedName)));
    } catch (error) {
        console.error("Error handling option change:", error);
    }
}

// Function to display sample metadata 
function displayMetadata(metadata) {
    let metadataContainer = d3.select("#sample-metadata");
    metadataContainer.html("");

    Object.entries(metadata).forEach(([key, value]) => {
        metadataContainer.append("p").text(`${key}: ${value}`);
    });
}

// Initialize the page
init();