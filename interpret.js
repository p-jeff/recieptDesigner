$(document).ready(function () {
  // Function to parse CSV into arrays using papaparse
  function parseCSV(csv) {
    return new Promise((resolve, reject) => {
      Papa.parse(csv, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results.data);
        },
        error: (error) => {
          reject(error.message);
        },
      });
    });
  }

  // Parse CSV data
  $.ajax({
    url: "./1.csv",
    dataType: "text",
    success: async function (csv) {
      const parsedData = await parseCSV(csv);
      let questions = Object.keys(parsedData[0]);
      let answers = Object.values(parsedData[0]);
      const time = answers.shift();
      questions.shift();

      const citation = answers.pop();
      questions.pop();

      const container = $("#main");
      const containerTemplate = $(".container-template");

      questions.forEach((item, index) => {
        // Check if the answer is undefined
        if (answers[index] !== null) {
          const newContainer = containerTemplate
            .clone()
            .removeClass("container-template");

          const qString = `Q ${index + 1}`.padEnd(11, "\u00a0") + item;
          const aString =
            `A ${index + 1}`.padEnd(11, "\u00a0") + answers[index];

          newContainer.find(".Question").html(function () {
            return `<p>${qString}</p>`;
          });

          newContainer.find(".Answer").html(function () {
            return `<p>${aString}</p>`;
          });
          // Set numbers dynamically (replace 'Q (number)' and 'A (number)')
          newContainer.find(".qTag").text(`Q ${index + 1}`);
          newContainer.find(".aTag").text(`A ${index + 1}`);

          // Append the new container to the main container
          container.append(newContainer);
        }
        // If the answer is undefined, skip rendering the question and its container
      });

      // Set the citation
      $("#citation").text(citation);

      // set number of questions
      $("#number").text(questions.length);

      // set the time

      let timestamp = time;

      timestamp = timestamp.replace("MEZ", "+0100");
      const dateObject = new Date(timestamp);

      // Extract date components
      const year = dateObject.getFullYear();
      const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
      const day = dateObject.getDate();

      // Extract time components
      const hours = dateObject.getHours();
      const minutes = dateObject.getMinutes();
      const seconds = dateObject.getSeconds();

      // Output the results
      const date = `${day}.${month}.${year}`;
      const clockTime = `${hours}:${minutes}:${seconds}`;
      $("#time").text(clockTime);
      $("#date").text(date);

      //calculate ID
      const randomId = day * hours * minutes;

      // Combine time components and random ID
      const finalId = `${hours}${minutes}${day}${randomId}`;
      $("#id").text(finalId);
    },
    error: function (error) {
      console.error("Error loading CSV file:", error);
    },
  });
});
