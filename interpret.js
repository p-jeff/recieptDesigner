$(document).ready(function () {
  const csvData = `Name,Age,Country
    John,25,USA
    Alice,30,Canada
    Bob,22,UK`;

  const myStrings = ["Hello", "World", "How", "Are", "You"];
  console.log(myStrings);

  $.each(myStrings, function (index, value) {
    // Create a new div element and set its text
    var newDiv = $("<div>").text(value);

    // Append the new div to the container
    $("#container").append(newDiv);
  });

  // Function to parse CSV into arrays using jquery-csv
  function parseCSV(csv) {
    const lines = $.csv.toArrays(csv, { separator: "," });
    return lines;
  }

  // Parse CSV data
  const parsedData = parseCSV(csvData);

  // Display parsed data
  console.log(parsedData);

  $("#myEntry").text("Hello World");
  $("#name").text(parsedData[1][0]);
  $("#age").text(parsedData[1][1]);
  $("#country").text(parsedData[1][2]);


});
