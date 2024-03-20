$(document).ready(function () {
  let previousLength = 0; // Initialize previous length
  // Function to parse CSV into arrays using papaparse
  function parseCSV(csv) {
    return new Promise((resolve, reject) => {
      Papa.parse(
        // "https://docs.google.com/spreadsheets/d/1nPMSe2IX11KqpHOWUKEmWtwsZj_2ch3z523rmyErQU8/export?format=csv",
        "https://docs.google.com/spreadsheets/d/1pexddQLwlkUX8MzHu-fwgtY9fJD1vscUIkF-fEdDF_w/export?format=csv",
        {
          header: true,
          download: true,
          dynamicTyping: true,
          complete: (results) => {
            resolve(results.data);
            console.log(results.data);
          },
          error: (error) => {
            reject(error.message);
          },
        }
      );
    });
  }
  async function fetchData() {
    console.log("Fetching data...");
    $.ajax({
      url: "./14.csv",
      dataType: "text",
      success: async function (csv) {
        const parsedData = await parseCSV(csv);

        let whichOne = 1;
        let print = false;

        if (parsedData.length > previousLength) {
          print = true;
        }

        if (parsedData.length >= previousLength) {
          whichOne = parsedData.length - 1;
          previousLength = parsedData.length;
        }

        let questions = Object.keys(parsedData[whichOne]);
        let answers = Object.values(parsedData[whichOne]);

        const time = answers.shift();
        questions.shift();

        let citation = answers.pop();
        questions.pop();

        if (citation === null) {
          let another = answers.pop();
          questions.pop();
          citation = another;
        }

        const container = $("#main");
        const containerTemplateText = $(".container-template");
        const containerTemplateEmoji = $(".emoji-template");
        const containerTemplateNumber = $(".number-template");

        questions.forEach((item, index) => {
          // Check if the answer is undefined
          if (answers[index] !== null) {
            const emojis = ["💀", "🤕", "🙁", "😐", "🙂", "😊", "🤩"];

            const isEmoji =
              typeof answers[index] === "string" &&
              emojis.some((emojis) => answers[index].includes(emojis));
            const isNumber =
              typeof answers[index] === "number" &&
              answers[index] >= 0 &&
              answers[index] <= 7;

            const containerTemplate = isEmoji
              ? containerTemplateEmoji.clone()
              : isNumber
              ? containerTemplateNumber.clone()
              : containerTemplateText.clone();
            containerTemplate
              .removeClass("container-template")
              .removeClass("emoji-template")
              .removeClass("number-template");

            const newContainer = containerTemplate
              .clone()
              .removeClass("container-template");

            let numberString;
            if (isNumber) {
              function replaceWithSpecialCharacter(inputString) {
                const specialCharactersMap = {
                  1: "❶",
                  2: "❷",
                  3: "❸",
                  4: "❹",
                  5: "❺",
                  6: "❻",
                  7: "❼",
                  0: "⓿",
                };

                // Use a regular expression to match all digits in the input string
                return inputString.replace(
                  /\d/g,
                  (digit) => specialCharactersMap[digit] || digit
                );
              }
              const originalString = answers[index].toString();
              const newString = replaceWithSpecialCharacter(originalString);

              numberString = newString;
            }

            const qString = item;
            const aString = isEmoji
              ? answers[index]
              : isNumber
              ? numberString
              : answers[index];

            const isAlreadyInHTML = $("body").html().includes(qString) && $("body").html().includes(aString);

            if (!isAlreadyInHTML) {
              console.log(isAlreadyInHTML)
              newContainer.find(".Question").html(function () {
                return `<p>${qString}</p>`;
              });

              newContainer.find(".Answer").html(function () {
                return `<p>${aString}</p>`;
              });
              // Set numbers dynamically (replace 'Q (number)' and 'A (number)')
              newContainer.find(".qTag").text(`Q${index + 1}`);
              newContainer.find(".aTag").text(`A${index + 1}`);

              // Append the new container to the main container
              container.append(newContainer);
            }
          }
          // If the answer is undefined, skip rendering the question and its container
        });

        // Set the citation
        $("#citation").text(citation);

        // set number of questions
        $("#number").text(questions.length);

        // set the time

        let timestamp = "13.03.2024 14:33:12"; // Assuming this is the format you get from the CSV

        // First, split the date and time parts
        const parts = timestamp.split(" ");
        const dateParts = parts[0].split(".");
        const timeParts = parts[1].split(":");

        // Parse the date and time components
        const year = parseInt(dateParts[2], 10);
        const month = parseInt(dateParts[1], 10); // Adjust for zero-based indexing
        const day = parseInt(dateParts[0], 10);
        const hours = parseInt(timeParts[0], 10);
        const minutes = parseInt(timeParts[1], 10);
        const seconds = parseInt(timeParts[2], 10);

        const date = `${day}.${month}.${year}`;
        const clockTime = `${hours}:${minutes}:${seconds}`;
        $("#time").text(clockTime);
        $("#date").text(date);

        //calculate ID
        const randomId = day * hours * minutes;

        // Combine time components and random ID
        const finalId = `${hours}${minutes}${day}${randomId}`;
        $("#id").text(finalId);

        if (print) {
          window.print();
        }
      },

      error: function (error) {
        console.error("Error loading CSV file:", error);
      },
    });
  }

  async function fetchDataAndUpdate() {

    await fetchData(); // Fetch data initially
    setInterval(fetchData, 10000); // Set interval to fetch data every 30 seconds
  }

  fetchDataAndUpdate(); // Start fetching data and setting interval
});
