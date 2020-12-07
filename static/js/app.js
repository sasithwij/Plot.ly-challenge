//Create dashboard function 

var dashboard = function(otuids, samplevalues, newArrayotuids, newsamplevalues, hoverText, metadata) {

    var demo_info = d3.select("#sample-metadata");
    demo_info.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        demo_info.append("p").text(`${key}: ${value}`);
    });
  
    var trace = {
        x: newsamplevalues,
        y: newArrayotuids,
        text: hoverText,
        type: 'bar',
        orientation: 'h'
    };
  
    var data = [trace];

    console.log(trace)
  
    Plotly.newPlot('bar', data);
  
    var trace2 = {
        x: otuids,
        y: samplevalues,
        text: hoverText,
        mode: 'markers',
        marker: {
            size: samplevalues,
            color: otuids
        }
    };
  
    var data2 = [trace2];
  
    Plotly.newPlot('bubble', data2);
  
  };
  
  // Create function to populate the drop list of names

  var populateDropdown = function(names) {
  
    var selectTag = d3.select("#selDataset");
    var options = selectTag.selectAll('option').data(names);
  
    options.enter()
        .append('option')
        .attr('value', function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });
    };
  
    // Function to get new name from drop down list and re run dashboard function 

  var optionChanged = function(newValue) {
  
    d3.json("data/samples.json").then(function(data) {
  
    sample_new = data["samples"].filter(function(sample) {
  
        return sample.id == newValue;
  
    });
    
    metadata_new = data["metadata"].filter(function(metadata) {
  
        return metadata.id == newValue;
  
    });
    
    
    otuids = sample_new[0]["otu_ids"].map(String);
    samplevalues = sample_new[0]["sample_values"];
    hoverText = sample_new[0]["otu_labels"];

    // Create new sorted and sliced array for bar chart 
    
    arrayOfObj = otuids.map(function(d, i) {
        return {
          label: d,
          data: samplevalues[i] || 0
        };
      });

      sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
        return b.data>a.data;
      });
      
      slicedArrayOfObj = sortedArrayOfObj.slice(0, 10).reverse();

      newArrayotuids = [];
      newsamplevalues = [];
      slicedArrayOfObj.forEach(function(d){
        newArrayotuids.push(d.label);
        newsamplevalues.push(d.data);
      });

      newArrayotuids = newArrayotuids.map(i => 'OTU ' + i);
    
    console.log(newArrayotuids);
    console.log(newsamplevalues);
    
    dashboard(otuids, samplevalues, newArrayotuids, newsamplevalues, hoverText, metadata_new[0]);
    });
  };
  
  d3.json("data/samples.json").then(function(data) {
  
    //Populate dropdown with names
    populateDropdown(data["names"]);
  
    //Populate the page with the first value
    otuids = data["samples"][0]["otu_ids"].map(String);
    samplevalues = data["samples"][0]["sample_values"];
    hoverText = data["samples"][0]["otu_labels"];
    metadata = data["metadata"][0];

    //Convert otuids into string 


    arrayOfObj = otuids.map(function(d, i) {
        return {
          label: d,
          data: samplevalues[i] || 0
        };
      });

      sortedArrayOfObj = arrayOfObj.sort(function(a, b) {
        return b.data>a.data;
      });
      
      slicedArrayOfObj = sortedArrayOfObj.slice(0, 10).reverse();

      newArrayotuids = [];
      newsamplevalues = [];
      slicedArrayOfObj.forEach(function(d){
        newArrayotuids.push(d.label);
        newsamplevalues.push(d.data);
      });

      newArrayotuids = newArrayotuids.map(i => 'OTU ' + i);
  
    //Draw the chart on load
    dashboard(otuids, samplevalues, newArrayotuids, newsamplevalues, hoverText, metadata);
  
  
  });
  

