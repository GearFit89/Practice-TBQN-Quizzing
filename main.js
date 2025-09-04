const quizApp = (function() {
    let selverses = true; 
    const resetclient = document.getElementById('resetclient');
        if (resetclient) {
             selverses = false;
            resetclient.addEventListener('click', () => {
                localStorage.removeItem('objOFWrongAnswers/Right');
                clientanswers = {};
                updateClientInfo(clientanswers, 'objOFWrongAnswers/Right', true);
                alert('Client Data has been reset');
            });
        }
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
    async function loadQuestions(){
        try{
            const questResponse = await fetch('QuestioniTBQN.txt')
            if(!questResponse.ok){
                throw new Error(`Questions failed fetch ${questResponse.status}`)

            }
            const questionsText = await  questResponse.text()
            console.log('data from questions has been loaded as text', questionsText)

            return processQuestions(questionsText)


        } catch (error) {
            console.error('Failed loading Questions', error)

        }
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
           //console.log('Fetched data:', data); // Debugging log
    
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
     const stripChar = (input) => {
        // Define the set of characters to be stripped
        const charToStrip = new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ']);
    
        // Helper function to process a single string
        const processString = (str) => {
            // Ensure the input is a string before proceeding
            if (typeof str !== 'string') {
                console.warn('stripChar received a non-string element in the array.');
                return ''; // Return an empty string for invalid elements
            }
            // Convert to lowercase, trim whitespace, and filter out unwanted characters
            return str.toLowerCase().trim().split('').filter(char => !charToStrip.has(char)).join('');
        };
    
        // Check if the input is an array
        if (Array.isArray(input)) {
            // If it's an array, use .map() to process each string element
            return input.map(str => processString(str));
        } else if (typeof input === 'string') {
            // If it's a single string, process it directly
            return processString(input);
        } else {
            // Handle cases where the input is neither a string nor an array
            console.warn('stripChar received an invalid input type. Expected a string or an array of strings.');
            return input;
        }
    };
    let notriggers =[];
     function findUniqueTriggerWord(ARRAY, obj, currentVerseNumber, len = 5) {
        if (!Array.isArray(ARRAY) || typeof obj !== 'object' || obj === null) {
            console.error('Invalid input: ARRAY must be an array and obj must be an object.');
            return [null, -1];
        }
    
        // CORRECTED: Use Object.entries() to access the key (verse number)
        const verses = Object.entries(obj)
            // Filter out the current verse and verse 60
            .filter(([key, value]) => key !== String(currentVerseNumber) && key !== '60')
            .map(([key, item]) => item.verse.split(' '));
    
        // Iterate through the ARRAY to find the first unique word
        for (let i = 0; i < len; i++) {
            const word = ARRAY.slice(0, i + 1) // Get the word at the current index
            let isUnique = true;
    
            // Check if the word exists in the same position in all verses
            for (const verseWords of verses) {
                if (stripChar(verseWords.slice(0, i+ 1)).join(' ') === stripChar(word).join(' ')) {
                    isUnique = false;
                   // If the word exists in the same position in any verse, it's not unique
                    break;
                }
            }
    
            // If the word is unique, return it along with its index
            if (isUnique) {
                return [word[i], i];
            }
        }
            
          notriggers.push(ARRAY.join(' '));

        // If no unique word is found, return [null, -1]
        return [null, ];
    }
    let currerentVerse;
    let startTimer = false;
    let counterToMax = 0;
    const questTypes = ['ftv', 'quote']
    const quizSettings = {};
    const quiMonths =  ['october', 'november', 'december', 'january', 'february', 'march'];
    let cnum = 0;
    let timerid;
    let globalquestype;
    let quest;
    const next = id('next');
    //let clientanswers = {}
    let clientanswers =  updateClientInfo(null, 'objOFWrongAnswers/Right', false) || {};
    console.log(clientanswers)
    let correctCount =0;
    const plsc = id('pleasebtn');
    let answers = [];
    let remainingText = '';
    let numverses = 1;
    let verse_dict;
    const ver = id('verse');
    const timerbtn = id('timer');
     // spilts by new lines
     // place to store all the data
    let c = 0;// counter
    let selVerses =[];
     

    function processQuestions(data) {
    const dataSplit = data.trim().split('\n');
    let questiondict = {};

    const regex = /^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ|According to (?:\w+ \d+:\d+\w*\-?\d*))) (.*)$/;
    
    for (let val of dataSplit){
        const match = val.match(regex);
        c+= 1;
        if(match){ // check if a match was found
            const monthIndex = Math.floor((c - 1) / 20);
            const monthName = quiMonths[monthIndex];
            const ref1 = match[1];
            const flight1 = match[2];
            
            const typeQuestion = match[3];
            let type1; // declare type1 with a broader scope
            if (typeof (typeQuestion) != 'string' ){
                type1 = 'question';
            }else{
                type1 = typeQuestion;
            };
            const questAns = match[4];

            questiondict[c] = {
                flight: flight1,
                verse: questAns,
                ref: ref1,
                month: monthName,
                type: type1
            };
        }
    }
    console.log('processed quotes', questiondict);
    return questiondict;
 }
    function processQuotes(quotesFTVs) {
        c = 0
        const data = quotesFTVs.trim().split("\n");
        let versedict = {};
        for (let val of data) {
   
        // simple macth method word, digit:digit , word, Quote/FTV word
            val = val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) Quote\/FTV (.*)$/);
        //example regex for questions
        // val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ|According to (?:\w+ \d+:\d+\w*\-?\d*))) (.*)$/)
        

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
        question_dict = await loadQuestions();
        verse_dict = await loadQuotes();
        if (!verse_dict || !question_dict) {
            console.error('Failed to load verse_dict. Exiting quiz initialization.');
            return;
        }
        console.log('Quiz initialized with verse_dict');
        console.log("Questins are good")
        // Call dependent functions here
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
          const versetype = `${globalquestype}@${verseRef}@${selVerses[cnum].numVerses}`; // 
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


    function write_text(par, elm, str, txtContent1, txtContent2 = null, txtContent3 = null, delay_in = 1000, id1=true) {
        let text_data = ''
        const parent = id(par)
        let text;
        if (typeof(id1) != 'string'){
         text = document.createElement(elm);}else{
        text = id('id') }
        
        text.textContent = `${str} ${txtContent1}`
        parent.appendChild(text)



    }


    function delay_text(txt, elm = 'p', par = 'quizHeader', delay = 0, COLOR = 0, id1 = 'false') {
        return new Promise((resolve) => {
        const parent = id(par);

        const textElement = document.createElement(elm);
        textElement.innerHTML = '';
        if (typeof(COLOR) === 'string') {
            textElement.style.color = COLOR;
        }
        parent.appendChild(textElement);
    
        const timeouts = [];
        let isStopped = false;
        let totalDelay = 0;
    
        const words = txt.split(' ');
        let wordIndex = 0;
        let charIndex = 0;
        let currentHTML = '';
        let isHighlighted = false;
    
        // Helper function to stop the animation
        const stopAnimation = (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                if (isStopped) {
                    resolve()
                    return;
                }
                isStopped = true;
                for (const timeoutId of timeouts) {
                    clearTimeout(timeoutId);
                }
                const remainingWords = words.slice(wordIndex);

                console.log('Remaining words:', remainingWords); // Debugging log
                const remainingText = remainingWords.join(' ');
                const tx = currentHTML + remainingText;
                startTimer = true;
                quest = remainingText + ' ' + quest;
                
                document.getElementById('pleasefinish').style.display = 'block'; 
                ver.placeholder = "Don't forget to enter the last word on the screen";
                
                window.removeEventListener('keydown', stopAnimation);
            }
        };
        window.addEventListener('keydown', stopAnimation);
    
        // This is the core logic
        function typeWriter() {
            if (isStopped || wordIndex >= words.length) {
                window.removeEventListener('keydown', stopAnimation);
                startTimer = true;
                resolve()
                return
                

            }
    
            const word = words[wordIndex] + (wordIndex === words.length - 1 ? '' : ' ');
            const char = word[charIndex];
    
            // Check if the current word should be highlighted
            if (wordIndex === id1) {
                if (!isHighlighted) {
                    currentHTML += '<span class="highlight-word">';
                    isHighlighted = true;
                }
            } else {
                if (isHighlighted) {
                    currentHTML += '</span>';
                    isHighlighted = false;
                }
            }
    
            currentHTML += char;
            console.log('Current HTML:', currentHTML, 'char', char); // Debugging log
            textElement.innerHTML = currentHTML;
    
            charIndex++;
            if (charIndex >= word.length) {
                charIndex = 0;
                wordIndex++;
            }
    
            setTimeout(typeWriter, delay);
        }
    
        typeWriter();
    })
};


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
        ver.placeholder = 'Eneter Answer'
        id('pleasefinish').style.display = 'none';
        id('pleasebtn').style.display = 'none';
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

    


    
    let currentVerseIndex = 0;
    const progressBar = id('progressBar'); // Get a reference to the progress bar element

    const updateProgressBar = () => {
        const totalQuestions = quizSettings.numQuestions;
        // counterToMax is incremented before this function is called, so it represents the current question number.
        const progressPercentage = ((counterToMax  + 1 )/ totalQuestions) * 100;
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

     const new_quote = async (_ftv ='quote', maxnum = 20, rand = 'random', speed= 0) => {
        next.style.display = 'none';
    if (counterToMax === maxnum) {
            showQuizSummary();
            return;} // Stop the function here
        let phars = '';
        let ftv = _ftv;
         
         
    if('ftv' in quizSettings.quizMode){
        ftv = 'ftv';
        let isftv = true;
    }
     if('quote' in quizSettings.quizMode){
        ftv = 'quote';
        let isquote = true;
    }
    if(isquote && isftv){
        ftv = 'both';
    }

        
         //not needed
        if (ftv === 'both') {
            const randtype = Math.floor(Math.random() * questTypes.length);
            ftv = questTypes[randtype];
            globalquestype = questTypes[randtype];
        }
        /* still used  */

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
        currerentVerse = selVerses[cnum];
       let ftvTriggerI;
        if (ftv === 'ftv') {
            globalquestype = 'ftv';
            const verseText = selVerses[cnum].verse;
            const words = verseText.split(' ');
            const first_5 = words.slice(0, 5);
            ftvTriggerI = findUniqueTriggerWord(words, selVerses, cnum , 5)[1];
            phars = first_5.join(' ')
            quest = words.slice(5).join(' ');
              
            await delay_text(`Finish the Verse:`,'h4','quizHeader',0, 'purple', 5);
        } else if (ftv === 'quote') {
            globalquestype = 'quote';
            const verseData = selVerses[cnum];
            phars = verseData.ref;
            quest = verseData.verse;
            
            await delay_text(`${selVerses[cnum].numVerses} Verse Quote:`,'h4','quizHeader',0,'purple');
        }
         startTimer = false;
        await delay_text(`${phars}`, 'p', 'quizHeader', speed, 'black', ftvTriggerI);
        
        // Update the progress bar after a new question is loaded
        return quest, phars;
    };


    function setupDropZone(containerId) {
        const container = document.getElementById(containerId);

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        container.addEventListener('dragenter', (e) => {
            container.classList.add('drop-valid');
        });

        container.addEventListener('dragleave', (e) => {
            container.classList.remove('drop-valid');
        });
        
        container.addEventListener('drop', (eB) => {
            eB.preventDefault();
            container.classList.remove('drop-valid');
            
            const dataVBlock= eB.dataTransfer.getData('text/plain');
            const draggedElementVBlock = document.getElementById(dataVBlock);
            if (draggedElementVBlock) {
                container.appendChild(draggedElementVBlock);
            }
        });
    }

    // The corrected function with all fixes applied.
    function dragElements(){
        const draggableContainer = document.getElementById('draggableContainer');

        let blocks = selVerses[cnum].verse.split(' ');
        let idIndex = 0;
        blocks.forEach(block => {
            const button = document.createElement('button');
            button.textContent = block + ' '; // Add a space after each word for separation
            button.draggable = true; // Make the span draggable
            
            //button.className = 'bg-blue-500 text-white rounded-md px-4 py-2 m-2 cursor-grab transition-colors duration-200 hover:bg-blue-600';
            
            button.id = `${idIndex}-${block}`;
            idIndex++;
            draggableContainer.appendChild(button);
            
            button.addEventListener('dragstart', (eventdragB) => {
                eventdragB.dataTransfer.setData('text/plain', eventdragB.target.id);
            });
        });
        
        // Set up both containers as drop zones
        setupDropZone('draggableContainer');
        setupDropZone('versedrop');

        // Add listener to the new button to log IDs
        //document.getElementById('getIDsButton').addEventListener('click', getDraggedElementIds);
    }

    
    return {
        start: function() {
            let checker = false;
            const submitButton = id('submit');
            submitButton.addEventListener("click", checkAns);

            ver.addEventListener('input', () => {
                // Check if the input value ends with a space and is not empty.
                if (ver.value.endsWith(' ') && ver.value.trim().length > 0) {
                    // If it does, run the handleSpaceEvent logic.
                    handleSpaceEvent();
                }
            });

function handleSpaceEvent() {
    let Answer2;
    plsc.style.display = 'none';
    id('pleasefinish').style.display = 'none';
    id('correctbtn').style.display = "none";
    id('incorrectbtn').style.display = "none";
 id('puralbtn').style.display = 'none';

    let inpuT = ver.value;
    inpuT = inpuT.trim().split(' ');
    const user_word = inpuT[inpuT.length - 1];
    const Answer = quest.trim().split(' ');
    Answer2 = Answer[inpuT.length - 1];
    //special comparsion to be added
    if(Answer2[Answer2.length -1] === 's' && user_word[ user_word.length -1] != 's'){
        //add dom for hint
        id('puralbtn').style.display = 'block';

    }else
    if(Answer2[Answer2.length -1] != 's' && user_word[ user_word.length -1] === 's'){
        //add dom for
        id('puralbtn').style.display = 'block';
    }
    
     //normal comparsion
    if (Answer2 && levenshtein(stripChar(user_word), stripChar(Answer2), 53)) {
        inpuT.pop();
        inpuT.push(Answer2);
        ver.value = inpuT.join(' ') + ' ';
    } else {
        plsc.style.display = 'block';
    }

    if (stripChar(inpuT) === stripChar(quest)) {
        id('correctbtn').style.display = "block";
        if (!answers[cnum]) {
            answers[cnum] = { correct: 0 };
        }
        answers[cnum].correct += 1;
        correctCount++;
        correct('right');
        clearInterval(timerid);
    }
}

            const startButton = id('startQuizButton');
            startButton.addEventListener('click',  (event) => {
                event.preventDefault();
                const clientAnswersLength = Object.keys(clientanswers).length;
                answers = [];
                correctCount = 0;
                
                //for now
                // Add if statements to check if the elements exist before accessing their values
                const verseSelectionElement = document.querySelector('input[name="verseSelection"]:checked');
                if (verseSelectionElement) {
                    quizSettings.verseSelection = verseSelectionElement.value;
                }
                const selquizMode = [];
                const quizModeElement = document.querySelectorAll('input[name="quizMode"]:checked');
                if (quizModeElement) {
                    quizModeElement.forEach((checkboxqm) => {
                        selquizMode.push(checkboxqm.value);
                    });
                }
               quizSettings.quizMode = selquizMode;

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
                const speed_tOf_text = document.getElementById('speed');
                if (speed_tOf_text) {
                    if(typeof(parseFloat(speed_tOf_text.value)) != 'number')  { quizSettings.speed_tOf_text = 0}else{
                    quizSettings.speed_tOf_text = parseFloat(speed_tOf_text.value) * 1000;}
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
                    //quizSettings.numQuestions = length(clientanswers);
                 }
         
            if (quizSettings.flights.length === 0){
                quizSettings.flights = ['A','B','C','T']
             }
             if (quizSettings.months.length === 0){
                quizSettings.months = quiMonths;
             }
             if(quizSettings.quizMode === 'ftv' || quizSettings.quizMode === 'quote'){
                quizSettings.quizMode.push('ftv/quote')
             }
                console.log('Quiz Settings Saved:', quizSettings);
                next.style.display = 'none';

                
                if (quizSettings.numQuestions > 100 || quizSettings.numQuestions === 0)
                { quizSettings.numQuestions = 20}
                if(typeof(quizSettings.numQuestions) != 'number')  { quizSettings.numQuestions = 100}
                if(typeof(quizSettings.lenOfTimer) != 'number')  { quizSettings.lenOfTimer = 0}
                
                if (selverses){
                    selVerses = Object.values(verse_dict).filter(Verse =>
                        
                        quizSettings.months.includes(Verse.month) && quizSettings.flights.includes(Verse.flight) && quizSettings.quizMode.includes(Verse.type))
                     }else{
                        quizSettings.numQuestions = clientAnswersLength;
                        selVerses = [];
                        Object.keys(clientanswers).forEach(key => {
    if (typeof key === 'string') {
        const typeref = key.split('@');
        if (typeref.length === 3) {
            const type3 = typeref[0];
            const ref3 = typeref[1];
            const numv3 = typeref[2];
            const verseObj = Object.values(verse_dict).find(Verse => Verse.ref === ref3);
            const verse3 = verseObj ? verseObj.verse : '';
            selVerses.push({
                verse: verse3,
                ref: ref3,
                type: type3,
                numVerses: numv3,
            });
        } else {
            console.warn('Key split did not result in 3 parts:', key, typeref);
        }
    } else {
        console.warn('Key is not a string:', key);
    }
});

                    };
        async function WaitForLoad(){

        
    
    if (typeof(verse_dict) != 'object'){
     
        
        alert('Content may be loading Please wait \n If you keep seeing this than there is connection error \n Please restart') }
         await new_quote(
        quizSettings.quizMode,
        quizSettings.numQuestions,
        quizSettings.verseSelection, quizSettings.speed_tOf_text)
        progressBar.style.width = '0%';
            dragElements();
        
        if (quizSettings.lenOfTimer === 0){ timerbtn.style.display = 'none'} else{
                quiztimer(quizSettings.lenOfTimer)} 
        }
        
                
             
                Start();
                WaitForLoad();
            });

            
            next.addEventListener("click", async () => {
                submitButton.style.display = 'block';
                updateProgressBar();
                counterToMax += 1;

                await new_quote('ftv', quizSettings.numQuestions , quizSettings.verseSelection, quizSettings.speed_tOf_text); 
                if (quizSettings.lenOfTimer === 0){ timerbtn.style.display = 'none'}else {
                    quiztimer(quizSettings.lenOfTimer)}
            });

            
        }
    };


})();
quizApp.start(); 
