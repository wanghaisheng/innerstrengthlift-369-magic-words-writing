  <script>
        // ---- Timeframe Constants and Functions ----
          const MORNING_START = 6;
          const MORNING_END = 11;
          const NOON_START = 11;
          const NOON_END = 16;
          const EVENING_START = 16;
          const EVENING_END = 23;


           function getCurrentTimeframe() {
                const now = new Date();
                const hour = now.getHours();
                if (hour >= MORNING_START && hour < MORNING_END) {
                    return "morning";
                } else if (hour >= NOON_START && hour < NOON_END) {
                    return "noon";
                } else if (hour >= EVENING_START && hour <= EVENING_END) {
                    return "evening";
                } else {
                    return null;
                }
            }

          function getRepetitionCounts(timeFrame){
                if(timeFrame === 'morning'){
                  return 3;
                }
                if(timeFrame === 'noon'){
                  return 6;
                }
                if(timeFrame === 'evening'){
                    return 9
                }
                 return 0; //Default number
           }


        // ---- Reminder Settings ----
       let currentOption = 1; // Default to option 1
      let sentences = {
           "The quick brown fox jumps over the lazy dog": "Sentence 1: The quick brown fox...",
           "A journey of a thousand miles begins with a single step": "Sentence 2: A journey of a thousand...",
            "To be or not to be that is the question": "Sentence 3: To be or not to be...",
            "The best is yet to come": "Sentence 4: The best is yet to come",
        };
         let currentSentence = "";
         let userAddedSentences = JSON.parse(localStorage.getItem('userAddedSentences')) || {};
         let reminderSettings = JSON.parse(localStorage.getItem('reminderSettings')) || {
               morning: false,
               noon: false,
                evening: false
               };

           function set369(){
                reminderSettings.morning = true;
                reminderSettings.noon = true;
                 reminderSettings.evening = true;
             updateReminderUI();
               saveReminderSettings();
           }
           function toggleReminder(reminder){
                reminderSettings[reminder] = !reminderSettings[reminder];
               updateReminderUI();
               saveReminderSettings();
         }

         function updateReminderUI() {
            const morningButton = document.getElementById("morningReminder");
           const noonButton = document.getElementById("noonReminder");
           const eveningButton = document.getElementById("eveningReminder");

         morningButton.classList.toggle('active', reminderSettings.morning);
          noonButton.classList.toggle('active', reminderSettings.noon);
         eveningButton.classList.toggle('active', reminderSettings.evening);
       }
        function saveReminderSettings(){
             localStorage.setItem('reminderSettings', JSON.stringify(reminderSettings));
        }



        // ---- Sentence and Input Management ----

         function populateSentenceSelect(){
               const selectElement = document.getElementById("sentenceSelect");
               selectElement.innerHTML = ""; // Clear options

           // Load default sentences
           for (const key in sentences) {
                let option = document.createElement("option");
              option.value = key;
              option.text = sentences[key];
             selectElement.add(option);
         }
           //Load user added sentences
            for (const key in userAddedSentences) {
              let option = document.createElement("option");
                 option.value = key;
              option.text = "User Added: " + key;
                selectElement.add(option);
          }

            if (currentSentence === ""){
               currentSentence = Object.keys(sentences)[0]
             }

              selectElement.value = currentSentence;  // Set the selected item after rendering list
           }

          function addSentence(){
            const addSentenceInput = document.getElementById("addSentenceInput");
           const newSentence = addSentenceInput.value.trim();
            if (newSentence && !userAddedSentences[newSentence]){
               userAddedSentences[newSentence] = newSentence;
             localStorage.setItem('userAddedSentences', JSON.stringify(userAddedSentences));
              currentSentence = newSentence;
              populateSentenceSelect();
                generateInputBoxes();
            }
          }
          function loadSelectedSentence(){
             const selectElement = document.getElementById("sentenceSelect");
             currentSentence = selectElement.value;
              generateInputBoxes();
           }

          function setOption(option) {
             currentOption = option;
             document.getElementById("optionDisplay").innerText = option;
              generateInputBoxes();
         }


        // --- Local Storage Management for Practice Status ---
        function getPracticeStatus(){
              return JSON.parse(localStorage.getItem('practiceStatus')) || {};
          }

         function setPracticeStatus(practiceData){
               localStorage.setItem('practiceStatus', JSON.stringify(practiceData));
          }
          function getTrackingData(){
              return JSON.parse(localStorage.getItem('trackingData')) || {
                   daily: {
                       morning: { attempts: 0, successes: 0 },
                      noon: { attempts: 0, successes: 0 },
                       evening: { attempts: 0, successes: 0 }
                   },
                   weekly: {
                       morning: { attempts: 0, successes: 0 },
                        noon: { attempts: 0, successes: 0 },
                       evening: { attempts: 0, successes: 0 }
                  }
                };
           }

            function setTrackingData(trackingData){
                 localStorage.setItem('trackingData', JSON.stringify(trackingData));
            }

        function generateInputBoxes() {
           const inputContainer = document.getElementById("inputContainer");
           inputContainer.innerHTML = "";  // Clear existing boxes
             updateUI();

            let words = currentSentence.split(" ");
            const progressBar = document.getElementById('progressBar');
                progressBar.style.width = '0%';
             for (let i = 0; i < words.length; i++) {
                  let input_box = document.createElement("input");
                    input_box.type = "text";
                  input_box.classList.add("input-box");
                     let indicator = document.createElement("span");
                    indicator.classList.add("input-box-indicator");
                    input_box.appendChild(indicator);
                   input_box.setAttribute("data-index", i);
                 input_box.setAttribute("data-expected-word", words[i]); //Store expected word
                 if(currentOption === 1){
                      input_box.placeholder = words[i];
                   }

                   input_box.addEventListener('input', function(){
                      handleInput(this); // Handle input validation
                    })
                   inputContainer.appendChild(input_box);

               }
               let timeFrame = getCurrentTimeframe();
            if(timeFrame == null) return;
            let practiceStatus = getPracticeStatus();
            let repetitions = 0;
         if(timeFrame && practiceStatus[timeFrame] && practiceStatus[timeFrame][currentSentence]){
              repetitions = getRepetitionCounts(timeFrame) - (practiceStatus[timeFrame][currentSentence].timesCompleted || 0) ;
            }
            if(repetitions === getRepetitionCounts(timeFrame)){
               showFeedback("Get Ready!");
             }
          }
         function startSentencePractice(){
                let timeFrame = getCurrentTimeframe();
                if(timeFrame == null) return; // Can only proceed with timeFrame
                let practiceStatus = getPracticeStatus();
               let repetitionCounts = getRepetitionCounts(timeFrame);
                 if(!practiceStatus[timeFrame]) {
                      practiceStatus[timeFrame] = {};
                  }
                if (!practiceStatus[timeFrame][currentSentence] || practiceStatus[timeFrame][currentSentence].completed === true) { // If sentence is not started for timeframe or was completed before, reset
                      practiceStatus[timeFrame][currentSentence] = { attempts: 0, successes: 0, timesCompleted: 0, completed: false}
                }
                practiceStatus[timeFrame][currentSentence].attempts++;
                  setPracticeStatus(practiceStatus) //Save to local storage
                 updateUI();
           }

         function completedSequence(){
            let timeFrame = getCurrentTimeframe();
           if(timeFrame == null) return;
             let practiceStatus = getPracticeStatus();
             let trackingData = getTrackingData();
                let repetitionCounts = getRepetitionCounts(timeFrame);
                if(!practiceStatus[timeFrame] || !practiceStatus[timeFrame][currentSentence]) return; // Should always exist
                 practiceStatus[timeFrame][currentSentence].timesCompleted++;


                 if(practiceStatus[timeFrame][currentSentence].timesCompleted >= repetitionCounts){ //If completed then set to true and increment success
                    practiceStatus[timeFrame][currentSentence].completed = true;
                   trackingData.daily[timeFrame].successes++
                   trackingData.weekly[timeFrame].successes++;
                     showFeedback("Success! You completed the sequence.");
                  }
                   else {
                     showFeedback("Completed a repetition, keep going!");
                  }

                setTrackingData(trackingData);
                  setPracticeStatus(practiceStatus)
                  updateUI(); //Update visual for current status.
             }

           function showFeedback(text){
                 const feedbackText = document.getElementById('feedbackText');
                 feedbackText.innerText = text;
                feedbackText.style.display = 'block';

                  setTimeout(function() {
                         feedbackText.style.display = 'none';
                     }, 2000);
             }
           let backgroundColorIndex = 0;
            const backgroundColors = ["#f0f0f0", "#e0e0e0", "#d0d0d0", "#c0c0c0"]; //Define subtle color shifts
           function changeBackgroundColor() {
                 const body = document.body;
                  body.style.backgroundColor = backgroundColors[backgroundColorIndex];
                     backgroundColorIndex = (backgroundColorIndex + 1) % backgroundColors.length;
              }

           const affirmations = [
               "I am capable.",
                "I am strong.",
             "I am confident.",
               "I am improving.",
               "I am focused.",
                "I am resilient."
            ];
        let affirmationIndex = 0; // Track which index of the array we are on.
        function showAffirmation() {
            const feedbackText = document.getElementById('feedbackText');
             feedbackText.innerText = affirmations[affirmationIndex];
              feedbackText.style.display = 'block';

              setTimeout(function() {
                   feedbackText.style.display = 'none';
                   }, 1500);
                 affirmationIndex = (affirmationIndex + 1) % affirmations.length;
         }

           function handleInput(box){
               let input_text = box.value;
               let indicator = box.querySelector('.input-box-indicator');
                if(currentOption === 1) return; // No need to validate
                let index = box.getAttribute("data-index");
                  let expected_word = box.getAttribute("data-expected-word");
                let attempts = box.getAttribute("data-attempts") || 0; //Get retry attemps

                if (attempts < 3){
                     if (input_text === expected_word) {
                        box.classList.add("input-box-success");
                          box.classList.remove("input-box-error");
                        box.disabled=true;
                       indicator.textContent = '✓';
                        indicator.style.display = "inline"


                    }else{
                        box.classList.add("input-box-error");
                         box.classList.remove("input-box-success");
                        attempts++;
                         box.setAttribute("data-attempts", attempts);
                        indicator.textContent = 'X'
                          indicator.style.display = "inline"
                        if(attempts >= 3){
                             box.classList.add("input-box-disabled");
                            box.disabled = true; //disable input
                      }
                    }
                }else{
                      box.classList.add("input-box-disabled");
                   }
              let completed = true;
                //Loop and check
                const inputBoxes = document.querySelectorAll('#inputContainer .input-box');
                inputBoxes.forEach((input) => {
                    if (!input.classList.contains("input-box-success")){
                        completed = false; // Break on first failed box
                    }
               })

               if(completed){
                     completedSequence();
                }


           }
         function updateUI(){
            const timeFrameDisplay = document.getElementById('timeFrameDisplay');
             const repetitionDisplay = document.getElementById("repetitionDisplay");
            const dailyMorningAttemptsDisplay = document.getElementById('dailyMorningAttempts');
             const dailyMorningSuccessesDisplay = document.getElementById('dailyMorningSuccesses');
           const dailyNoonAttemptsDisplay = document.getElementById('dailyNoonAttempts');
            const dailyNoonSuccessesDisplay = document.getElementById('dailyNoonSuccesses');
           const dailyEveningAttemptsDisplay = document.getElementById('dailyEveningAttempts');
            const dailyEveningSuccessesDisplay = document.getElementById('dailyEveningSuccesses');

          const weeklyMorningAttemptsDisplay = document.getElementById('weeklyMorningAttempts');
             const weeklyMorningSuccessesDisplay = document.getElementById('weeklyMorningSuccesses');
            const weeklyNoonAttemptsDisplay = document.getElementById('weeklyNoonAttempts');
            const weeklyNoonSuccessesDisplay = document.getElementById('weeklyNoonSuccesses');
           const weeklyEveningAttemptsDisplay = document.getElementById('weeklyEveningAttempts');
           const weeklyEveningSuccessesDisplay = document.getElementById('weeklyEveningSuccesses');
           const progressBar = document.getElementById('progressBar');

                let timeFrame = getCurrentTimeframe();
                timeFrameDisplay.innerText = timeFrame ?  timeFrame : 'Not within any timeframe';
               let practiceStatus = getPracticeStatus();
                let trackingData = getTrackingData();
                let repetitions = 0;
                 if(timeFrame && practiceStatus[timeFrame] && practiceStatus[timeFrame][currentSentence]){
                     repetitions = getRepetitionCounts(timeFrame) - (practiceStatus[timeFrame][currentSentence].timesCompleted || 0) ;
                    }
                 repetitionDisplay.innerText = repetitions < 0 ? 0: repetitions;
                if(timeFrame  && practiceStatus[timeFrame] && practiceStatus[timeFrame][currentSentence]){
                    let maxRepetitions =  getRepetitionCounts(timeFrame)
                    let timesCompleted  = practiceStatus[timeFrame][currentSentence].timesCompleted || 0;
                      let progress = (timesCompleted/maxRepetitions) * 100;
                    progressBar.style.width = progress + '%';
                  }else{
                       progressBar.style.width = '0%';
                  }

                  dailyMorningAttemptsDisplay.innerText = trackingData.daily.morning.attempts;
                   dailyMorningSuccessesDisplay.innerText = trackingData.daily.morning.successes;
                  dailyNoonAttemptsDisplay.innerText = trackingData.daily.noon.attempts;
                    dailyNoonSuccessesDisplay.innerText = trackingData.daily.noon.successes;
                 dailyEveningAttemptsDisplay.innerText = trackingData.daily.evening.attempts;
                  dailyEveningSuccessesDisplay.innerText = trackingData.daily.evening.successes;
                  weeklyMorningAttemptsDisplay.innerText = trackingData.weekly.morning.attempts;
                  weeklyMorningSuccessesDisplay.innerText = trackingData.weekly.morning.successes;
                 weeklyNoonAttemptsDisplay.innerText = trackingData.weekly.noon.attempts;
                  weeklyNoonSuccessesDisplay.innerText = trackingData.weekly.noon.successes;
                 weeklyEveningAttemptsDisplay.innerText = trackingData.weekly.evening.attempts;
                 weeklyEveningSuccessesDisplay.innerText = trackingData.weekly.evening.successes;

               changeBackgroundColor();
            showAffirmation();
          }


       // ---- Initialization ----
      populateSentenceSelect();
      generateInputBoxes();
      updateReminderUI();
      updateUI();
       startSentencePractice(); //Initial start of sequence
       setInterval(updateUI, 1000); //Update every second to show the correct time frame
    </script>
