
    
const quizApp = (function() {
    function Start() {
        let main = document.getElementsByTagName('main')[0];
        let startScene = document.getElementById('startScene');

        if (main && startScene) {
            main.style.display = 'block';
            startScene.style.display = 'none';
        }
    }
    const id = (word) => {
        let word1 = document.getElementById(word);
        return word1

    }
    async function loadQuotes() {
        try {
            // Fetch the quotes_ftvs.txt file
            const response = await fetch('./quotes_ftvs.txt'); // Adjust the path if necessary
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Get the text content of the file
            const data = await response.text();
            console.log('Fetched data:', data); // Debugging log
    
            // Process the fetched data
           return processQuotes(data);
        } catch (error) {
            console.error('Error loading quotes:', error);
        }
    }
    
    
    const updateClientInfo = (info, name, setItem = true) => {
        // Check if the user wants to set an item
        if (setItem) {
            // Correctly stringify the info object
            const stringifiedInfo = JSON.stringify(info);
    
            // Correctly use localStorage.setItem with both a key (name) and a value
            try {
                localStorage.setItem(name, stringifiedInfo);
                console.log(`Successfully saved data with key: "${name}"`);
            } catch (e) {
                console.error('Error saving to localStorage:', e);
                return false;
            }
        } else {
            // If not setting, get the item
            try {
                const storedInfo = localStorage.getItem(name);
    
                // Check if the item exists before parsing
                if (storedInfo === null) {
                    console.warn(`No data found for key: "${name}"`);
                    return null; // Return null if nothing is found
                }
    
                // Correctly parse the JSON string back into an object
                const parsedInfo = JSON.parse(storedInfo);
                console.log(`Successfully retrieved and parsed data with key: "${name}"`);
                
                return parsedInfo;
    
            } catch (e) {
                console.error('Error retrieving or parsing data from localStorage:', e);
                return null;
            }
        }
        return true; // Return a success indicator for the 'set' operation
    };
    
    const questTypes = ['ftv', 'quote']
    const quizSettings = {};
    const quiMonths =  ['october', 'november', 'december', 'january', 'february', 'march'];
    let cnum = 0;
    let timerid;
    let globalquestype;
    let quest;
    const next = id('next');
    //let clientanswers = {}
    let clientanswers =  updateClientInfo(null, 'objOFWrongAnswers/Right', false);
    console.log(clientanswers)
    let correctCount =0;
    const plsc = id('pleasebtn');
    let answers = [];
    let remainingText = '';
    let numverses = 1;
    const ver = id('verse');
    const timerbtn = id('timer');
     // spilts by new lines
    const versedict = {}; // place to store all the data
    let c = 0;// counter
    let selVerses =[];
    function processQuotes(quotesFTVs) {
    const data = quotesFTVs.trim().split("\n");
    for (let val of data) {

        // simple macth method word, digit:digit , word, Quote/FTV word
        val = val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) Quote\/FTV (.*)$/);

        c += 1;
        if (val) {

         // Now, we correctly assign the month based on the verse number
            const monthIndex = Math.floor((c - 1) / 20);
            const monthName = quiMonths[monthIndex];
            const ref1 = val[1];
            const flight1 = val[2];
            const verse1 = val[3];
            
            if (ref1.includes('-')) {
                const verseParts = ref1.split(':');
                if (verseParts.length > 1) {
                    const rangeParts = verseParts[1].split('-');
                    if (rangeParts.length === 2) {
                        numverses = parseInt(rangeParts[1]) - parseInt(rangeParts[0]) + 1;
                    }
                }
            } else {
                numverses = 1;
            }

            versedict[c] = {
                flight: flight1,
                verse: verse1,
                ref: ref1,
                month: monthName,
                type: 'ftv/quote',
                numVerses: numverses
            };



        }
    }
    console.log('Processed verse_dict:', versedict); // Debugging log
    return versedict;


    }
    async function initializeQuiz() {
        const verse_dict = await loadQuotes(); // Wait for the data to load
        if (!verse_dict) {
            console.error('Failed to load verse_dict. Exiting quiz initialization.');
            return;
        }
        console.log('Quiz initialized with verse_dict:', verse_dict);
    

        console.log(verse_dict[1]?.ref);
        console.log(verse_dict);
        console.log(verse_dict[2]?.numVerses);
    }
    initializeQuiz();
        if (!clientanswers) {
            clientanswers = {};
            console.log("clientanswers initialized as an empty object.");
        }
        function p(parhams,j,k,l,o,p,t) {
            console.log(parhams,j,k,l,o,p,t)

        }
        function correct(result) {
            timerbtn.textContent = 'Timer';
            const verseRef = selVerses[cnum].ref; // Get the verse referencec
            console.log(globalquestype)
          const versetype = `${globalquestype}:${verseRef}`; // 
            // If the verse is not yet in the clientanswers object, initialize it.
            if (!clientanswers[versetype]) {
                clientanswers[versetype] = {
                    'correct': 0,
                    'wrong': 0,
                    
                };
            }
        
            // Increment the appropriate counter based on the result.
            if (result === 'right') {
                clientanswers[versetype].correct += 1;
            } else if (result === 'wrong') {
                clientanswers[versetype].wrong += 1;
            }
        
            console.log(clientanswers); // Log the object to see the updated data.
            ver.ariaDisabled = 'true';
        }
        p(verse_dict[100].month)
        p(verse_dict[1].month)


        
    function levenshtein(a, b, Percent=75) {
        const matrix = [];

        // Ensure both strings are lowercase for comparison
        a = a.toLowerCase();
        b = b.toLowerCase();
        const bLen = b.length;
        // Initialize the first row and column
        for (let i = 0; i <= a.length; i++) {
          matrix[i] = [i];
        }
        for (let j = 0; j <= b.length; j++) {
          matrix[0][j] = j;
        }

        // Fill in the rest of the matrix
        for (let i = 1; i <= a.length; i++) {
          for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
              matrix[i][j] = matrix[i - 1][j - 1];
            } else {
              matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,    // deletion
                matrix[i][j - 1] + 1,    // insertion
                matrix[i - 1][j - 1] + 1 // substitution
              );
            }
          }
        }
      const  matrixValue = matrix[a.length][b.length];
      if (typeof(Percent) === 'number'){
        const per = (1 - matrixValue / bLen) * 100;
        if (per >= Percent){
            return true;
        }else {
            return false;
        }

      }
      else
      {
        return matrixValue;


      };
      };


    // makes the document method easier


    function write_text(par, elm, str, txtContent1, txtContent2 = null, txtContent3 = null, delay_in = 1000) {
        let text_data = ''
        const parent = id(par)
        let text = document.createElement(elm);
        text.textContent = `${str} ${txtContent1}`
        parent.appendChild(text)



    }


    function delay_text(txt, elm='p', par='quizHeader', delay = 0,COLOR=0) {
        const parent = id(par);
        const textElement = document.createElement(elm);
        textElement.textContent = '';
        if (typeof(COLOR) === 'string'){textElement.style.color = COLOR;}
        parent.appendChild(textElement);

        const timeouts = [];
        let isStopped = false;

        const stopAnimation = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                if (isStopped) { return;}
                isStopped = true;
                const displayedText = textElement.textContent;
                remainingText = txt.substring(displayedText.length);
                console.log("Remaining Text:", remainingText);
                quest = remainingText + quest; console.log(quest);
                for (const timeoutId of timeouts) {
                    clearTimeout(timeoutId);
                }

                window.removeEventListener('keydown', stopAnimation);
            }
        };

        window.addEventListener('keydown', stopAnimation);

        for (let i = 0; i < txt.length; i++) {
            const char = txt[i];
            const timeoutId = setTimeout(() => {
                textElement.textContent += char;

                if (i === txt.length - 1) {
                    window.removeEventListener('keydown', stopAnimation);
                }
            }, (i + 1) * delay);
            timeouts.push(timeoutId);
        }
    }

console.log(verse_dict[23].month)



function measure(item1, item2, split = false, splitValue = '') {
        let corchar = 0;
        let list2 = stripChar(item2)
        list2 = split ? list2.split(splitValue) : list2;

        let list1 = stripChar(item1);
        list1 = list1.split('');
        let setOfItem = new Set(list2);
        for (let thing of list1) {
            if (setOfItem.has(thing)) {
                corchar += 1; // correct characters
            } else {
                corchar -= 0.3;
            };
        };
            const percent = (corchar / list2.length) * 100;
            if (percent > 78 ) { //checks if percent is greater than 78%
                return true;
            } else {
                return false
            }

        };

    // this function checks user input

    function clear(par3) {
        ver.value = '';
        id(par3).innerHTML = '';
        id('correctbtn').style.display = "none";
        id('incorrectbtn').style.display = "none";
        plsc.style.display = 'none';
    };

    
    const checkAns = () => {
        next.style.display = 'block';
          let subm = id("submit");
          clearInterval(timerid)
         subm.style.display = 'none';
        console.log('quest b=v=valur at checkans', quest)
        let inVerse = ver.value
        id('correctbtn').style.display = "none";
        id('incorrectbtn').style.display = "none";

        plsc.style.display = 'none';
        console.log(quest);
        if (stripChar(inVerse) === stripChar(quest)) {
            id('correctbtn').style.display = "block";
            // Correctly add a record to the answers array
            answers.push({
                verse: selVerses[cnum],
                correct: true,
                
            });
            correctCount ++;
           correct('right')
            return true;
        } else {
            id('incorrectbtn').style.display = "block";
            ver.value =`${ver.value} \n \nCorrect Answer: ${selVerses[cnum].ref}\n${selVerses[cnum].verse} `;
            // Correctly add a record to the answers array
            answers.push({
                verse: selVerses[cnum],
                correct: false
            });
            

            correct('wrong')
            return false;
        }
    };


    const stripChar = (verse='sring.') => {
        console.log(typeof verse);
        console.log(verse, verse.values)
        if(typeof(verse)=== 'string'){
        verse = verse.toLowerCase().trim();;
        let stripedVerse = '';
        let charToStrip = new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' '])
        let split_ver = verse.split('');
        for (const char of split_ver) {
            if (!charToStrip.has(char)) {
                stripedVerse += char;

            };
        };
        return stripedVerse
    }
    };

let running = true;
      function quiztimer(timeleft=30){
        if (!running){return}
          if(timerid){clearInterval(timerid);}
          timerid = setInterval(()=>{
          timerbtn.textContent = timeleft;
              timeleft --;
              

              if (timeleft <= 0){
                  clearInterval(timerid);
                  timerbtn.textContent = 'Timer is up'
                  checkAns()
              }
          }, 1000)
      }

    


    let counterToMax = 0;
    let currentVerseIndex = 0;
    const progressBar = id('progressBar'); // Get a reference to the progress bar element

    const updateProgressBar = () => {
        const totalQuestions = quizSettings.numQuestions;
        // counterToMax is incremented before this function is called, so it represents the current question number.
        const progressPercentage = (counterToMax / totalQuestions) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    };

    const showQuizSummary = () => {
        // Stop the timer

        clearInterval(timerid);
    
        // Hide quiz scene and show start scene
        document.getElementsByTagName('main')[1].style.display = 'none';
    
        timerbtn.style.display = 'none'
        // Clear the quiz header content
        const quizHeader = id('quizHeader');
        quizHeader.innerText= ''
        console.log(clientanswers)
        // Clear the verse input text area
        ver.value = '';
        progressBar.style.display ='none'
        id('progressBar2').style.display ='none'
        ver.style.display = 'none'
        // Hide the buttons and 'please wait' message
        id('next').style.display = 'none'
        id('submit').style.display = 'none';
        id('correctbtn').style.display = 'none';
        id('incorrectbtn').style.display = 'none';
        plsc.style.display = 'none';
        running = false
        updateClientInfo(clientanswers, 'objOFWrongAnswers/Right', true)
        // Display summary
        const totalQuestions = quizSettings.numQuestions;
        const correctAnswers = correctCount;
    
        delay_text(`Quiz Complete!`, 'h2', 'quizHeader', 0, 'green');
        delay_text(`Your score: ${correctAnswers} out of ${totalQuestions}`, 'p', 'quizHeader', 0);
         console.log(answers)
        if (answers.some(a => !a.correct)) {
            delay_text(`You missed the following verses:`, 'h3', 'quizHeader', 0);
            answers.forEach(answer => {
                if (!answer.correct) {
                delay_text(`${answer.verse.ref}`, 'h6','quizHeader',0,'purple');
                delay_text(`${answer.verse.verse}`, 'h6', 'quizHeader', 0); 
                }
            });
        }
    id('restart').style.display = 'block'
    
    };

    const new_quote = (_ftv ='quote', maxnum = 20, rand = 'random', speed= 0) => {
        next.style.display = 'none';
    if (counterToMax === maxnum) {
            showQuizSummary();
            return;} // Stop the function here
        let phars = '';
        let ftv = _ftv;
         if (quizSettings.flights.length === 0){
            quizSettings.flights = ['A','B','C','T']
         }
         if (quizSettings.months.length === 0){
            quizSettings.months = quiMonths;
         }
        selVerses = Object.values(verse_dict).filter(Verse =>
            quizSettings.months.includes(Verse.month) && quizSettings.flights.includes(Verse.flight)
        );

        if (ftv === 'both') {
            const randtype = Math.floor(Math.random() * questTypes.length);
            ftv = questTypes[randtype];
            globalquestype = questTypes[randtype];
        }

        if (rand === "random") {
            const randomIndex = Math.floor(Math.random() * selVerses.length);
            cnum = randomIndex;
        } else {
            if (currentVerseIndex >= selVerses.length) {
                currentVerseIndex = 1;
            }
            cnum = currentVerseIndex;
            currentVerseIndex++;
        }
        
        

        clear('quizHeader');
        const qh = 'quizHeader';

        if (ftv === 'ftv') {
            globalquestype = 'ftv';
            const verseText = selVerses[cnum].verse;
            const words = verseText.split(' ');
            const first_5 = words.slice(0, 5);
            phars = first_5.join(' ');
            quest = words.slice(5).join(' ');
            delay_text('Finish the Verse: ','h4','quizHeader',0,'purple');
        } else if (ftv === 'quote') {
            globalquestype = 'quote';
            const verseData = selVerses[cnum];
            phars = verseData.ref;
            quest = verseData.verse;
            delay_text(`${selVerses[cnum].numVerses} Verse Quote: `,'h4','quizHeader',0,'purple');
        }

        delay_text(`${phars}`, 'p', 'quizHeader', speed,);
        counterToMax += 1;
        updateProgressBar(); // Update the progress bar after a new question is loaded
    };
    return {
        start: function() {
            const submitButton = id('submit');
            submitButton.addEventListener("click", checkAns);

           ver.addEventListener('keydown', (event) => {
    if(event.code === 'Space'){
        let Answer2;
        plsc.style.display = 'none';
        id('correctbtn').style.display = "none";
        id('incorrectbtn').style.display = "none";

        let inpuT = ver.value;
        inpuT = inpuT.trim().split(' ');
        const user_word = inpuT[inpuT.length - 1];
        const  Answer = quest.trim().split(' ');
         Answer2 = Answer[inpuT.length - 1];

        if (Answer2 && levenshtein(stripChar(user_word), stripChar(Answer2), 53)){
            inpuT.pop()
            inpuT.push(Answer2)
            ver.value = inpuT.join(' ');
        }else{
            plsc.style.display = 'block';
        }


        if(stripChar(inpuT) === stripChar(quest)){
            id('correctbtn').style.display = "block";
            answers.push(selVerses.splice(cnum));
            if (answers[cnum].correct){

                answers[cnum].correct += 1;
            }else{
            answers[cnum].correct = 0
            }
            correctCount ++
            correct('right')
            clearInterval(timerid)
            
        }
    }
});

            const startButton = id('startQuizButton');
            startButton.addEventListener('click', (event) => {
                event.preventDefault();

                answers = [];
                correctCount = 0;
                counterToMax = 0;
                
                // Add if statements to check if the elements exist before accessing their values
                const verseSelectionElement = document.querySelector('input[name="verseSelection"]:checked');
                if (verseSelectionElement) {
                    quizSettings.verseSelection = verseSelectionElement.value;
                }

                const quizModeElement = document.querySelector('input[name="quizMode"]:checked');
                if (quizModeElement) {
                    quizSettings.quizMode = quizModeElement.value;
                }

                const selectedMonths = [];
                const monthCheckboxes = document.querySelectorAll('input[name="month"]:checked');
                if (monthCheckboxes) {
                    monthCheckboxes.forEach((checkbox) => {
                        selectedMonths.push(checkbox.value);
                    });
                }
                quizSettings.months = selectedMonths;

                const numQuestionsElement = document.getElementById('numQuestions');
                if (numQuestionsElement) {
                    quizSettings.numQuestions = parseInt(numQuestionsElement.value);
                }
                
                const lenOfTimerElement = document.getElementById('secs');
                if (lenOfTimerElement) {
                    quizSettings.lenOfTimer = parseInt(lenOfTimerElement.value);
                }
                
                const selectedFlights = [];
                const flightCheckboxes = document.querySelectorAll('input[name="flight"]:checked');
                if (flightCheckboxes) {
                    flightCheckboxes.forEach((checkbox) => {
                        selectedFlights.push(checkbox.value);
                    });
                }

                quizSettings.flights = selectedFlights;
                const title = document.getElementsByTagName('title')
                 if (title.value === 'Practice Hard Verses'){
                    quizSettings.numQuestions = length(clientanswers);
                 }
                console.log('Quiz Settings Saved:', quizSettings);
                next.style.display = 'none';
                if (quizSettings.numQuestions > 100 || quizSettings.numQuestions === 0)
                { quizSettings.numQuestions = 20}
                if(typeof(quizSettings.numQuestions) != 'number')  { quizSettings.numQuestions = 100}
                if(typeof(quizSettings.lenOfTimer) != 'number')  { quizSettings.lenOfTimer = 0}

                
                // Call new_quote to display the first question

          new_quote(
        quizSettings.quizMode,
        quizSettings.numQuestions,
        quizSettings.verseSelection, 100)
        progressBar.style.width = '0%';
        if (quizSettings.lenOfTimer === 0){ timerbtn.style.display = 'none'}else{
                quiztimer(quizSettings.lenOfTimer)}
             
                Start();
            });

            
            next.addEventListener("click", () => {
                submitButton.style.display = 'block';

                new_quote(quizSettings.quizMode, quizSettings.numQuestions , quizSettings.verseSelection, 100 );
                if (quizSettings.lenOfTimer === 0){ timerbtn.style.display = 'none'}else{
                    quiztimer(quizSettings.lenOfTimer)}
            });
        }
    };


})();
quizApp.start();