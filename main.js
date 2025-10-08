/**
 * Initializes and starts the Web Speech API (SpeechRecognition) for voice recording and transcription.
 * This function requires browser support for the SpeechRecognition interface (e.g., Chrome, Edge).
 * recognition is the instance of the class
 * @param {Function} onResultCallback - Function to call with the transcribed text when a result is ready.
 * @param {Function} onStartCallback - Function to call when recording successfully starts.
 * @param {Function} onEndCallback - Function to call when recording stops (either manually or automatically).
 * @param {Function} toStop -Use to add event listners and stop it with .stop()
 * @param {Function} onErrorCallback - Function to call if an error occurs.
 * @returns {Object|null} The SpeechRecognition instance if supported, otherwise null.
 */
function startVoiceRecognition(onResultCallback, onStartCallback, onEndCallback, onErrorCallback, toStop) {
    // Comment: Check for the presence of the SpeechRecognition object (with vendor prefix for compatibility).
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    // Comment: Check for browser support and return null if not available.
    if (!SpeechRecognition) {
        console.error("Speech Recognition is not supported in this browser."); // Comment: Log the lack of support.
        return null; // Comment: Return null to indicate failure.
    }

    // Comment: Create a new instance of the SpeechRecognition service.
    const recognition = new SpeechRecognition(); 
    
    // Comment: Configure the recognition settings.
    recognition.interimResults = false; // Comment: Only return the final, most confident transcription result.
    recognition.continuous = false; // Comment: Stop listening after a single utterance is detected.
    recognition.lang = 'en-US'; // Comment: Set the language to English (US) for transcription accuracy.

    // --- Event Handlers ---

    // Comment: Handler for when the service begins listening.
    recognition.onstart = () => {
        if (onStartCallback) onStartCallback(); // Comment: Call the user-provided start callback function.
    };

    // Comment: Handler for when a successful transcription result is available.
    recognition.onresult = (event) => {
        // Comment: Extract the most confident transcribed text from the results array.
        const transcript = event.results[0][0].transcript; 
        if (onResultCallback) onResultCallback(transcript); // Comment: Pass the text to the user-provided result callback.
    };

    // Comment: Handler for when the service stops (finished or manually stopped).
    recognition.onend = () => {
        if (onEndCallback) onEndCallback(); // Comment: Call the user-provided end callback function.
    };

    // Comment: Handler for errors during the recognition process.
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error); // Comment: Log the error to the console.
        if (onErrorCallback) onErrorCallback(event.error); // Comment: Pass the error to the user-provided error callback.
    };
if(toStop) toStop()
    // Comment: Start the recognition service.
    try {
        recognition.start(); // Comment: Initiate the browser's microphone listening.
        return recognition; // Comment: Return the instance so it can be stopped later if needed.
    } catch (e) {
        // Comment: Catch potential errors if the service is already running or permission is denied.
        console.error("Could not start recognition:", e); // Comment: Log the startup error.
        if (onErrorCallback) onErrorCallback("Startup failed."); // Comment: Notify the user of the startup failure.
        return null; // Comment: Return null on failure.
    }
}







class quizCompanion {
    constructor() {
        this.id = (word) => {
            let word1 = document.getElementById(word);
            return word1;
        };
        this.currentVerseIndex = 0;
        this.running = true;
        this.genQuiz = false;
        const testIsGenQuiz = this.id('isGenQuiz');
        if (testIsGenQuiz) {
            this.genQuiz = true;
        }
        const speedInput = this.id('speed'); // Gets the range input element.
        const speedValueSpan = this.id('speedValue'); // Gets the span element to display the value.
        
        // Listen for the 'input' event, which fires continuously as the slider is moved.
        if (speedInput && speedValueSpan) {
            speedInput.addEventListener('input', (event) => {
                // Update the text content of the span with the current value of the input.
                speedValueSpan.textContent = event.target.value;
            });
        }
        this.quizMonths = [
            ['october', [1, 2, 3, 4, 5]],
            ['november', [6, 7, 8, 9]], 
            ['december', [10, 11, 12]],
            ['january', [13, 14]],
            ['february', [15, 16]],
            ['march', ['Jonah']]
        ];
        
        this.selverses = true;
        const resetclient = document.getElementById('resetclient');
        if (resetclient) {
            this.selverses = false;
            resetclient.addEventListener('click', () => {
                localStorage.removeItem('objOFWrongAnswers/Right');
                this.selVerses= [];
                this.updateClientInfo(this.selVerses, 'objOFWrongAnswers/Right', true);
                alert('Client Data has been reset');
            });                
        }
        let  selectedMonths = [];
        let divChp = '';
        const questionSelectionDiv = this.id('monthDiv');
        const switchCToMonth = this.id('month');
        const switchMToChapter = this.id('chapter');
        if (switchCToMonth && questionSelectionDiv) {
            switchCToMonth.addEventListener('click', () => {
                questionSelectionDiv.innerHTML = `<h3 class="section-title">Select Months</h3>
                            <div class="checkbox-container">
                                <label class="toggle-label"><input type="checkbox" name="month" value="october"> October</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="november"> November</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="december"> December</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="january"> January</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="february"> February</label>
                                <label class="toggle-label"><input type="checkbox" name="month" value="march"> March</label>
                            </div>`;
            });
        }
        this.delog(switchMToChapter)
        if (switchMToChapter && questionSelectionDiv) {
            switchMToChapter.addEventListener('click', () => {
                //this.quizMonths.forEach
                this.delog('wroking')
                //selectedMonths = []
                const monthCheckboxes = document.querySelectorAll('input[name="month"]:checked');
                if (monthCheckboxes) {
                    monthCheckboxes.forEach((checkbox) => {
                        selectedMonths.push(checkbox.value);
                    });
                }
                divChp = `<h3 class="section-title">Select Chapters</h3> 
                <div class="checkbox-container">`;
                //sets deflault chapters 
                //selectedMonths = selectedMonths ? selectedMonths : ['october'];
                this.quizMonths.forEach(month=>{
                    if(selectedMonths.includes(month[0])){
                        month[1].forEach(chp=>{
            //this.delog(month[0], month[1], chp, month, 'mohr' )
                        
                            divChp += `<label class="toggle-label"><input type="checkbox" name="chp" value="${chp}"> ${chp}</label>`
                    })
                        }


                })
                divChp += `</div>`;
                //this.delog(divChp);
                divChp = `<h3 class="section-title">Select Chapters</h3> 
                <div class="checkbox-container">
              <label class="toggle-label"><input type="checkbox" name="chp" value="1"> 1</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="2"> 2</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="3"> 3</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="4"> 4</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="5"> 5</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="6"> 6</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="7"> 7</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="8"> 8</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="9"> 9</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="10"> 10</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="11"> 11</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="12"> 12</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="13"> 13</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="14"> 14</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="15"> 15</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="16"> 16</label>
    <label class="toggle-label"><input type="checkbox" name="chp" value="Jonah"> Jonah</label>
                </div>`
                questionSelectionDiv.innerHTML = divChp;
                
            });
        }
        this.progressBar = this.id('progressBar')
        this.currentQNum = 1
        this.question_dict2 = [];
        this.verse_dict2 = [];
        this.Time = null;
        this.exANs = []; 
        this.altans = [];
        this.cleanans = [];
        this.speeddetext = null;
        this.ftvTriggerI = null;
        this.trigChar = null;
        this.question_dict = [];
        this.QUEST = null;
        this.randwords = [];
        this.qs = [];
        this.micBtn = this.id('micBtn')
        this.currerentVerse = null;
        this.startTimer = false;
        this.counterToMax = 0;
        this.questTypes = ['ftv', 'quote'];
        this.quizSettings = {};
        this.quiMonths = ['october', 'november', 'december', 'january', 'february', 'march'];
        this.selVerses = [];
        this.quoteRefArr = [];
        this.isrendered = false;
        this.TimeLeft = 30;
        this.dragEnabled = true;
        this.deblog = true;
        this.cnum = 0;
        this.timerid = null;
        this.globalquestype = null;
        this.printDiv = this.id('print')
        this.quest = null;
        this.ftv = null;
        this.morebtn = this.id("More");
        this.next = this.id('next');
        this.btnTOModal = this.id('BTN');
        this.vD = this.id('versedrop');
        this.vC = this.id('verse-con');
        //move this line 
        this.clientanswers = this.updateClientInfo(null, 'objOFWrongAnswers/Right', false) || [];
        console.log(this.clientanswers);
        this.correctCount = 0;
        this.plsc = this.id('pleasebtn');
        this.answers = [];
        this.remainingText = '';
        this.numverses = 1;
        this.verse_dict = null;
        this.ANS = null;
        this.readyLoad = false;
        this.ANS2 = null;
        this.isquote = false;
        this.isftv = false; 
        this.ver = this.id('verse');
        this.timerbtn = this.id('timer');
        this.c = 0; // counter
        this.selVerses = [];
        this.allChps =  this.quizMonths.map(month=>month[1].join(' ')).join(' ').split(' ')
        this.corspondAns = []; // Added missing property
        this.notriggers = []; // Added missing property
    }

    Start() {
        let main = this.id('nextScene');
        let startScene = document.getElementById('startScene');
        
        if (main && startScene) {
            main.style.display = 'block';
            startScene.style.display = 'none';
        }
    }
    
    async loadQuestions() {
        try {
            const questResponse = await fetch('QuestioniTBQN.txt');
            if (!questResponse.ok) {
                throw new Error(`Questions failed fetch ${questResponse.status}`);
            }
            const questionsText = await questResponse.text();
            console.log('data from questions has been loaded as text', questionsText);
            const returnQ = await this.processQuestions(questionsText);
            this.delog(returnQ);
            return returnQ;
        } catch (error) {
            console.error('Failed loading Questions', error);
        }
    }
    
    async loadQuotes() {
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
            const returnq = await this.processQuotes(data);
            return returnq;
        } catch (error) {
            console.error('Error loading quotes:', error);
        }
    }
    
    updateClientInfo(info, name, setItem = true) {
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
    }
    
    
    
    delog(...args) {
        //checks for debug mode 
        if (this.deblog) {
            console.log(...args);
        }
    }
    
               
    
    stripChar(input, messaa = 'errorr!!!' ) {
        // Define the set of characters to be stripped
        const charToStrip = new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ']);
        
        // Helper function to process a single string
        const processString = (str) => {messaa='no message'
            // Ensure the input is a string before proceeding
            if (typeof str !== 'string') {
                console.warn('stripChar received a non-string element in the array.', messaa);
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
            console.warn('stripChar received an invalid input type. Expected a string or an array of strings.', messaa);
            return '';
        }
    }
    
 // NOTE: This file assumes the existence of 'this.stripChar' and 'this.delog' methods on the class instance.

async findUniqueTriggerWord(ARRAY, _obj, currentVerseNumber = '', len = 5, CHAR = false) {
    if (!Array.isArray(ARRAY) || typeof _obj !== 'object' || _obj === null) {
        console.error('Invalid input: ARRAY must be an array and _obj must be an object.');
        return { uniqueWordNum: -1, uniquecharNum: -1, absoluteCharIndex: -1 };
    }
let notquote = true;
if(currentVerseNumber === 'F') notquote = false
    const currentFullVerse = ARRAY.join(' ');
let obj;
let vOfV;

    if(notquote){
     obj = _obj.filter(v => {
       const Verse =  v.verse.includes('?') ? v.verse.split('?')[0] : v.verse;
        return this.stripChar(Verse) !== this.stripChar(currentFullVerse);
    });

}else{
     obj = _obj.filter(v => {
        //const Verse =  v.verse.includes('?') ? v.verse.split('?')[0] : v.verse;
         return v !== ARRAY.join(' ') ;
     });
     
}
if(obj.length === _obj.length) console.error('filter Error', obj)
    //console.log('Filtered obj:', obj);
    //console.log('Current full verse:', currentFullVerse);

    let uniqueWordNum = -1;
    let uniquecharNum = -1;
    let absoluteCharIndex = -1;
//console.log(obj)
    for (let k = 0; k < ARRAY.length; k++) {
        const currentPrefix = this.stripChar(ARRAY.slice(0, k + 1).join(' '));
        //console.log('Current prefix:', currentPrefix);

        const isSharedPrefix = obj.find(Verse => {
            let otherPrefix;
          if(!Verse.verse) {

                 otherPrefix = Verse.split(' ').slice(0, k + 1).join(' ') 
          }else{
             otherPrefix = Verse.verse.split(' ').slice(0, k + 1).join(' ') 
          }
            //console.log('Other prefix:', otherPrefix, 'current', currentPrefix);
            return this.stripChar(otherPrefix) === currentPrefix;
        });
//console.log(isSharedPrefix, 'sp')
        if (!isSharedPrefix) {
            
            uniqueWordNum = k;

            const uniqueWord = ARRAY[uniqueWordNum];
            //console.log('uq', uniqueWord)
            //const lentoWordtoit =  < 0 ? ARRAY.slice(0, 1): ARRAY.slice(0, uniqueWordNum - 2)
            const wordLengthToUWord = this.stripChar(ARRAY.slice(0, uniqueWordNum).join(' ')).length + 1;
            //console.log(lentoWordtoit)
            //console.log(wordLengthToUWord)


            for (let j = 0; j < uniqueWord.length + 1; j++) {
                const char = this.stripChar(ARRAY.join(' ')).slice(0, j + wordLengthToUWord);
                //console.log('Current char:', char);

                const isSharedChar = obj.find(Verse => {
                    let otherWordStripped;
                    if(Verse.verse) otherWordStripped = this.stripChar(Verse.verse); else otherWordStripped = this.stripChar(Verse)
                    //console.log('Other word stripped:', this.stripChar(otherWordStripped.slice(0, wordLengthToUWord + j)) , 'Current char:', char)
                    return this.stripChar(otherWordStripped.slice(0, wordLengthToUWord + j)) === char;
                });

                if (!isSharedChar) {

                    uniquecharNum = j;
                     let  offset = 0;
                      if (notquote && ARRAY[uniqueWordNum][0]) 
                        {offset = ARRAY[uniqueWordNum][0].includes('"') ? 1 :0;}
                    const spaceoffset = ARRAY.slice(0, uniqueWordNum).length === 0 ? 0 :1;  
                    //console.log( ARRAY.slice(0, uniqueWordNum).join(' '), 'test')
                    absoluteCharIndex =  ARRAY.slice(0, uniqueWordNum).join(' ').length + j + offset + spaceoffset;
                    //this.delog(ARRAY[absoluteCharIndex], 'op')
                    //ARRAY.join(' ')[absoluteCharIndex] === ' ' ? absoluteCharIndex++ : null;
                    uniquecharNum = absoluteCharIndex; 
                    break;
                }
            }
                    //console.log(uniqueWordNum, uniquecharNum, 'unique stuff')
                    return { uniqueWordNum, uniquecharNum, absoluteCharIndex };
                
            
        }
    }

    return { uniqueWordNum, uniquecharNum, absoluteCharIndex };
}
/*// Total Absolute Index (1-based, assuming string indices are 0-based):
                    // (Raw prefix length) + (Raw unique prefix length)
                    // Note: If rawPrefix is not empty, 'join(' ')' already includes the space. If it is empty, length is 0.
                    absoluteCharIndex = lengthOfRawPrefix + rawUniquePrefixLength; 
                    
                    // Update uniquecharNum to be the absolute index as requested by your previous logic.
                    uniquecharNum = absoluteCharIndex; 
                    
                    // --- END FIX --- */
    delog(...args) {
        //checks for debug mode 
        if (this.deblog) {
            console.log(...args);
        }
    }
hightestMonth(inMonths){
   const higestmoth =  this.quiMonths.indexOf(inMonths[inMonths.length -1]);
   const figureMonths = this.quiMonths.slice(0, higestmoth + 1);
   //this.delog(allMpnthsCurrent)
   const chps = this.quizMonths.map(Month=> {
    if(figureMonths.includes(Month[0])) return Month[1].join(' ')} ).join(' ').split(' ');
   
   return {figureMonths, chps};


}
    fliterOutQs(inquestions=this.selVerses, ob={}){
        const allmoths = this.quizMonths.map(month=>month[0])
        const allchps  = this.quizMonths.map(month=>month[1].join(' ')).join(' ').split(' ')
        const allflights = ['A', 'B', 'C', 'T']
        const alltypes = ['quote', 'ftv', 'SQ:', 'According to', 'question', 'ftv/quote']
        const months = ob.m ? ob.m : allmoths;
    
        const {chps} = this.hightestMonth(months)
        const flights = ob.f ? ob.f : allflights;
        const types = ob.t ? ob.t : alltypes;
        this.delog( 'next', months, chps, flights, types)
        const reslult = inquestions.filter(Verse=>{
            let Test = months.includes(Verse.month) && flights.includes(Verse.flight) && types.includes(Verse.type) && Verse.verse && chps.includes(Verse.chapter);
            
            return Test
        })
        this.delog(reslult, 'result')
        return reslult;


    }
    async processQuestions(data) {
        const dataSplit = data.trim().split('\n');
        let questiondict = {};
        
        const regex = /^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ:|According to) )?(.*)$/;
        
        for (let val of dataSplit) {
            const match = val.match(/^(\w+ \d+:\d+[\w\d-]*) (\w) (?:(SQ:|According to) )?(.*)$/);
            this.c += 1;
            // check if a match was found
            if (match) {
                
                //const monthIndex = Math.floor((c - 1) / 20);
                let monthName;
                const ref1 = match[1];
                let splitref = ref1.split(' ');
                let book = splitref[0];
                let chapter = splitref[1].split(':');
                
                chapter = chapter[0];
                //this prevents stuff like Jonah chapter 1 from getting mixed in with Mat chp 1
                chapter = ref1.includes('Jonah') ? 'Jonah': chapter;
                if (book === 'Matthew') {
                    // Find the month array that contains the chapter number
                    const foundMonthArray = this.quizMonths.find(month => {
                        // This is the corrected check: access the nested array (at index 1)
                        // and convert the chapter string to a number
                        return month[1].includes(Number(chapter));
                    });
                    // If a month was found, assign its name (at index 0)
                    if (foundMonthArray) {
                        monthName = foundMonthArray[0];
                    }
                } else {
                    monthName = 'march';
                }
                
                
                const flight1 = match[2];
                
                const typeQuestion = match[3];
                let type1; // declare type1 with a broader scope
                if (typeof (typeQuestion) != 'string') {
                    type1 = 'question';
                } else {
                    type1 = typeQuestion;
                }
                const questAns = match[4];
                let chp = ref1.split(' ')[1].split(':')[0];
                if(monthName === 'march') chp = 'Jonah';
                questiondict[this.c] = {
                    flight: flight1,
                    verse: questAns,
                    ref: ref1,
                    month: monthName,
                    type: type1,
                    chapter: chp
                };
            }
        }
        
        
        console.log('processed quotes', questiondict);
        return questiondict;
    }
    
    async processQuotes(quotesFTVs) {
        const data = quotesFTVs.trim().split("\n");
        let versedict = {};
        let c2 = 0;
        for (let val of data) {
            
            // simple macth method word, digit:digit , word, Quote/FTV word
            val = val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) Quote\/FTV (.*)$/);
            //example regex for questions
            // val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ|According to (?:\w+ \d+:\d+\w*\-?\d*))) (.*)$/)
            
            c2++;
            this.c += 1;
            if (val) {
                
                // Now, we correctly assign the month based on the verse number
                const monthIndex = Math.floor((c2 - 1) / 20);
                const monthName = this.quiMonths[monthIndex];
                const ref1 = val[1];
                const flight1 = val[2];
                const verse1 = val[3];
                let  chp = ref1.split(' ')[1].split(':')[0]
                //this prevents stuff like Jonah chapter 1 from getting mixed in with Mat chp 1
                chp = ref1.includes('Jonah') ? 'Jonah': chp;
                if (ref1.includes('-')) {
                    const verseParts = ref1.split(':');
                    if (verseParts.length > 1) {
                        const rangeParts = verseParts[1].split('-');
                        if (rangeParts.length === 2) {
                            this.numverses = parseInt(rangeParts[1]) - parseInt(rangeParts[0]) + 1;
                        }
                    }
                } else {
                    this.numverses = 1;
                }
                  if(monthName === 'march') chp = 'Jonah';
                versedict[this.c] = {
                    flight: flight1,
                    verse: verse1,
                    ref: ref1,
                    month: monthName,
                    type: 'ftv/quote',
                    numVerses: this.numverses,
                    chapter: chp
                };
            }
        }
        console.log('Processed verse_dict:', versedict); // Debugging log
        return versedict;
    }
    
    async initializeQuiz() {
        try {
            this.question_dict = await this.loadQuestions();
            this.verse_dict = await this.loadQuotes();
            console.log('Loaded question_dict:', this.question_dict);
            console.log('Loaded verse_dict:', this.verse_dict);
            if (!this.verse_dict || !this.question_dict) {
                console.error('Failed to load verse_dict. Exiting quiz initialization.');
                return;
            }
            this.readyLoad = true;
        } catch (error) {
            console.error('Error initializing quiz:', error);
        }
        const allQs = {...this.verse_dict, ...this.question_dict}
    return { allQs }
    }
    
    manageModal(mtxt = "hi", set = false, modalid = 'settings', mcon = "modaldiv", closebtn = 'closeModalBtn', btntxt='Ok', onModalClose='', onModalOpen='') {
        const modal = this.id(modalid);
        const modalContent = this.id(mcon);
        const closeBtn = this.id(closebtn);
        modalContent.innerHTML = mtxt;
        closeBtn.style.display = 'none';
        
        closeBtn.style.display = 'block';
        closeBtn.textContent = btntxt
        this.running = false;
        clearInterval(this.timerid);
        const secsInput2 = document.getElementById('secs1');
        const speedInput2 = document.getElementById('speed1');
        const sv = this.id('speedValue1');
        
        if (secsInput2 && this.Time) {
            secsInput2.value = this.Time;
        }
        if (speedInput2 && this.speeddetext && sv) {
            speedInput2.value = this.speeddetext;
            sv.textContent = this.speeddetext;
        }
        if(onModalOpen) onModalOpen()
        modal.showModal();
        
        closeBtn.addEventListener('click', () => {
            closeBtn.style.display = 'none';
            if(onModalClose) onModalClose()
            modal.close();
            if (set) {
                const lenOfTimerElement1 = document.getElementById('secs1');
                if (lenOfTimerElement1) {
                    this.Time = parseInt(lenOfTimerElement1.value);
                }
                const speed_tOf_text1 = document.getElementById('speed1');
                if (speed_tOf_text1) {
                    if (typeof (parseFloat(speed_tOf_text1.value)) != 'number') {
                        this.quizSettings.speed_tOf_text = 0;
                    } else {
                        this.speeddetext = parseFloat(speed_tOf_text1.value);
                    }
                }
                let textType;
                const MODE = document.querySelector('input[name="type"]:checked');
                if (MODE) {
                    textType = MODE.value;
                }
                
                this.running = true;
                if (this.isrendered) {
                    this.quiztimer(this.TimeLeft);
                }
                if (textType === 't') {
                    this.vD.style.display = 'none';
                    this.vC.style.display = 'none';
                    this.ver.style.display = 'block';
                    this.dragEnabled = false;
                } else {
                    this.vD.innerHTML = '';
                    this.vC.innerHTML = '';
                    this.ver.value = '';
                    this.vD.style.display = 'block';
                    this.vC.style.display = 'block';
                    this.ver.style.display = 'none';
                    
                    if (this.isrendered) {
                        this.dragElements();
                    }
                    this.dragEnabled = true;
                }
            }
        });
    }
    
    p(parhams, j, k, l, o, p, t) {
        console.log(parhams, j, k, l, o, p, t);
    }
    
    correct(result) {
        this.timerbtn.textContent = 'Timer';
        const verseRef = this.selVerses[this.cnum].ref; // Get the verse reference
        this.delog(this.ftv);
        //const versetype = `${this.ftv}@${verseRef}@${this.selVerses[this.cnum].numVerses}`; // 
        // If the verse is not yet in the clientanswers object, initialize it.
       
        
        
        // Increment the appropriate counter based on the result.
        if (result === 'right') {
            //this.selVerses[this.cnum].correct = this.selVerses[this.cnum].correct ?? 0;
            let versedata = this.selVerses[this.cnum];
            const foundVerse = this.clientanswers.find(Verse=>versedata.verse === Verse.verse);
            this.delog(...versedata, 'vs ', versedata)
            foundVerse ? foundVerse.correct += 1: this.clientanswers.push({versedata, correct: 1});
            this.vD.classList.add('correct');
            this.vD.classList.remove('incorrect');
            this.vD.classList.remove('blueborder');
            this.vC.classList.add('correct');
            this.vC.classList.remove('incorrect');
            this.vC.classList.remove('blueborder');
            this.ver.classList.add('correct');
            this.ver.classList.remove('incorrect');
            this.ver.classList.remove('blueborder');
        } else if (result === 'wrong') {
            //this.selVerses[this.cnum].incorrect = this.selVerses[this.cnum].incorrect ?? 0;
            //this.selVerses[this.cnum].incorrect += 1;
            let versedata = this.selVerses[this.cnum];
            const foundVerse = this.clientanswers.find(Verse=>versedata.verse === Verse.verse);
    const list = ['a', 'lpl', 'p', 'opop']
            //this.delog( 'vs ', versedata, list.slice(0, 2), list.slice(0, 1).join(' ')+'a2'+'a3', list.slice(0, 1).join(' ').length, list.slice(0, 2).join(' ')+'a2'+'a3')
            foundVerse ? foundVerse.incorrect += 1: this.clientanswers.push({versedata, incorrect: 1});
            //this.clientanswers[versetype].wrong += 1;
            this.vD.classList.add('incorrect');
            this.vD.classList.remove('correct');
            this.vD.classList.remove('blueborder');
            this.vC.classList.add('incorrect');
            this.vC.classList.remove('correct');
            this.vC.classList.remove('blueborder');
            this.ver.classList.add('incorrect');
            this.ver.classList.remove('correct');
            this.ver.classList.remove('blueborder');
        }
        
        //console.log(this.clientanswers); // Log the object to see the updated data.
        //this.ver.ariaDisabled = 'true';
    }
    
    mapTchar(originalString, strippedIndex) {
        // This function maps an index from a stripped string back to the original string.
        let charCount = 0; // Initializes a counter for characters that are not stripped.
        let originalIndex = -1; // Initializes the index in the original string.
        
        // Loop through the characters of the original string.
        for (let i = 0; i < originalString.length; i++) {
            const char = originalString[i]; // Gets the current character.
            
            // Check if the character is not one of the stripped characters.
            if (!new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ']).has(char)) {
                // If the counter matches the target stripped index, we found our original index.
                if (charCount === strippedIndex) {
                    originalIndex = i; // Set the original index.
                    break; // Exit the loop.
                }
                charCount++; // Increment the counter for non-stripped characters.
            }
        }
        
        return originalIndex; // Return the found original index.
    }
    
    findTrigChar(list, _verse, vn, lEn = 9000) {
        let unique = true;
        let og_v = _verse;
        let k = 1;
        let l = 1;
        let _q;
        let f = true;
        
        _q = this.stripChar(_verse);
        _q = _q.split('');
        
        for (let i = 0; i < lEn; i++) {
            //list.forEach(v =>{
            for (let v of list) {
                // = true;
                if (this.stripChar(v.verse) === this.stripChar(_verse)) {
                    ///// unique = false
                    //f = false
                    continue;
                }
                
                let Q = this.stripChar(v.verse);
                Q = Q.split('');
                
                //const charToStrip = new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ']);
                
                if (_q.slice(0, k).join('') === Q.slice(0, k).join('')) {
                    unique = false;
                    break;
                }
            }
            //})
            if (!unique) {
                unique = true;
                k++;
            } else {
                let m = 0;
                let n = 0;
                this.delog(k, 'num found');
                this.delog('this is map', this.mapTchar(og_v, k));
                this.delog('num word by l',_q[k], 'map',  this.mapTchar(og_v, k - 1) )
                return this.mapTchar(og_v, k - 1);
                
                for (let o of og_v) {
                    if (o === _q[m]) {
                        m++;
                    }
                    n++;
                    if (m === k) {
                        this.delog(n, 'n');
                        return [n, og_v[n]];
                    }
                }
                //return k
            }
        }
        
        return 'no';
    }
    
    levenshtein(a, b, Percent = 75) {
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
        const matrixValue = matrix[a.length][b.length];
        if (typeof (Percent) === 'number') {
            const per = (1 - matrixValue / bLen) * 100;
            if (per >= Percent) {
                return true;
            } else {
                return false;
            }
        } else {
            return matrixValue;
        }
    }
    
    // makes the document method easier
    
    write_text(par, elm, str, txtContent1, txtContent2 = null, txtContent3 = null, delay_in = 1000, id1 = true) {
        let text_data = '';
        const parent = this.id(par);
        let text;
        if (typeof (id1) != 'string') {
            text = document.createElement(elm);
        } else {
            text = this.id('id');
        }
        
        text.textContent = `${str} ${txtContent1}`;
        parent.appendChild(text);
    }
    
    delay_text(txt, elm = 'p', par = 'quizHeader', delay = 0, COLOR = 0, id1 = 'false', id2 = 'f') {
        return new Promise((resolve) => {
            const parent = this.id(par);
            this.isrendered = false;
            const textElement = document.createElement(elm);
            textElement.innerHTML = '';
            if (typeof (COLOR) === 'string') {
                textElement.style.color = COLOR;
            }
            parent.appendChild(textElement);
            
            const timeouts = [];
            let isStopped = false;
            let totalDelay = 0;
            this.ANS2 = false;
            const words = txt.split(' ');
            let wordIndex = 0;
            let charIndex = 0;
            let currentHTML = '';
            let isHighlighted = false;
            let isHighlighted2 = false;
            let CHArNUm = 0;
            // Helper function to stop the animation
            const stopAnimation = (event) => {
                if (event.code === 'Space') {
                    event.preventDefault();
                    if (isStopped) {
                        this.isrendered = true;
                        this.ver.disabled = false;
                        resolve();
                        return;
                    }
                    isStopped = true;
                    for (const timeoutId of timeouts) {
                        clearTimeout(timeoutId);
                    }
                    const remainingWords = words.slice(wordIndex);
                    if (this.selVerses[this.cnum].type != 'SQ:') {
                        console.log('Remaining words:', remainingWords); // Debugging log
                        const remainingText = remainingWords.join(' ');
                        const tx = currentHTML + remainingText;
                        
                        this.quest = remainingText + ' ' + this.quest;
                        this.ANS = remainingText + ' ' + this.ANS;
                        document.getElementById('pleasefinish').style.display = 'block';
                        this.ver.placeholder = "Don't forget to enter the last word on the screen";
                    }
                    this.startTimer = true;
                    window.removeEventListener('keydown', stopAnimation);
                }
            };
            window.addEventListener('keydown', stopAnimation);
            
            // This is the core logic of the whole code
            const typeWriter = () => {
                if (isStopped || wordIndex >= words.length) {
                    window.removeEventListener('keydown', stopAnimation);
                    this.isrendered = true;
                    this.ver.disabled = false;
                    this.startTimer = true;
                    resolve();
                    return;
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
                if (CHArNUm === id2) {
                    if (!isHighlighted2) {
                        currentHTML += `<span class="highlight-char">${char}</span>`;
                        isHighlighted2 = true;
                    }
                } else {
                    /*if (isHighlighted2) {
                        currentHTML += '</span>';
                        isHighlighted2 = false;
                    }
                }/*/
                currentHTML += char;
                }
                
                // currentHTML += char;
                //console.log('Current HTML:', currentHTML, 'char', char); // Debugging log
                textElement.innerHTML = currentHTML;
                CHArNUm++;
                charIndex++;
                if (charIndex >= word.length) {
                    charIndex = 0;
                    wordIndex++;
                }
                
                setTimeout(typeWriter, delay);
            };
            
            typeWriter();
        });
    }
    
    measure(item1, item2, split = false, splitValue = '') {
        let corchar = 0;
        let list2 = this.stripChar(item2);
        list2 = split ? list2.split(splitValue) : list2;
        
        let list1 = this.stripChar(item1);
        list1 = list1.split('');
        let setOfItem = new Set(list2);
        for (let thing of list1) {
            if (setOfItem.has(thing)) {
                corchar += 1; // correct characters
            } else {
                corchar -= 0.3;
            }
        }
        const percent = (corchar / list2.length) * 100;
        if (percent > 78) { //checks if percent is greater than 78%
            return true;
        } else {
            return false;
        }
    }
    
    // this function checks user input
    checkAlt(ogphars) {
        // This variable will hold the modified string.
        let switched = this.stripChar(ogphars);
        
        // A standard for loop is used to iterate through the alternative answers.
        for (let i = 0; i < this.altans.length; i++) {
            // Gets the current alternative phrase from the altans array.
            const altPhrase = this.stripChar(this.altans[i]);
            // Gets the corresponding correct answer.
            const correctPhrase = this.stripChar(this.corspondAns[i]);
            
            // Creates a regular expression to find the alternative phrase globally and case-insensitively.
            // The escape function ensures special characters in the phrase are handled correctly.
            const escapedAlt = altPhrase.replace(/[. *+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedAlt, 'gi');
            
            // Tests if the original phrase contains the alternative phrase.
            if (regex.test(switched)) {
                // Replaces the entire alternative phrase with the corresponding correct phrase.
                switched = switched.replace(regex, correctPhrase);
                // Returns the corrected string immediately after the first match is found.
            }
        }
        // Returns the original phrase if no match was found.
        return switched;
    }
    
    manageAnswer(ans, issplit = false, og = '') {
        //removes () and[] from answers
        let inAns;
        let lastWord;
        let altPhar = '';
        this.exANs = [];
        this.altans = [];
        this.cleanans = [];
        this.corspondAns = [];
        let isAlt = false;
        let isEx = false;
        
        //iterator 
        let ii = 0;
        //let exANs = null;
        if (!issplit) {
            inAns = ans.split(' ');
        } else {
            inAns = ans;
        }
        //if(inAns.includes('(') || inAns.includes('[')){
        for (let i of inAns) {
            if (i.includes('[') || isEx) {
                //maybe
                isEx = true;
                this.exANs.push(i);
                if (i.includes(']')) {
                    isEx = false;
                }
            } else if (i.includes('(') || isAlt) {
                //i.includes('(') || isAlt){
                //altans.pop()
                isAlt = true;
                
                altPhar += `${i} `;
                if (i.includes(')') || i.includes(',')) {
                    
                    this.corspondAns.push(lastWord);
                    this.altans.push(altPhar);
                    altPhar = '';
                }
                if (i.includes(')')) {
                    isAlt = false;
                    
                    //altans.push(altPhar.join(' '));
                }
                //
            } else {
                //altans.push(i)
                lastWord = i;
                this.cleanans.push(i);
            }
            ii++;
        }
        const switched = this.checkAlt(og);
        return [this.cleanans, this.altans, this.corspondAns, this.exANs, switched];
    }
    
    remover(pharse) {
    }
    
    ad(pr, ar, nu) {
        for (let i = 0; i < nu; i++) {
            ar.push(pr);
        }
    }
    
    async generateQuiz(quoteC = 3, ftvC = 2, lengthQuiz) {
        // quotes and ftvs
        let qf = [];
        //questions
        
        let atC = Math.floor(Math.random() * 4 + 1);
        let sqC = Math.floor(Math.random() * 4 + 1);
        const lenQ = lengthQuiz - quoteC + ftvC;
        const alrand = sqC + atC;
        let qC = lengthQuiz - alrand;
        //adds the stuff
        this.ad('question', this.qs, qC);
        this.ad('SQ:', this.qs, sqC);
        this.ad('According to', this.qs, atC);
        this.ad('quote', qf, quoteC);
        this.ad('ftv', qf, ftvC);
        qf = this.shuffleArray(qf);
        this.qs = this.shuffleArray(this.qs);
        let qfnum = 1;
        let ii = 0;
        let rAt = this.selVerses.filter(Verse => Verse.type === 'According to');
        let rSq = this.selVerses.filter(Verse => Verse.type === 'SQ:');
        let rQ = this.selVerses.filter(Verse => Verse.type === 'question');
        let rFQ = this.selVerses.filter(Verse => Verse.type === 'ftv/quote');
        this.selVerses = [];
        for (let i = 0; i < lengthQuiz; i++) {
            if (i === qfnum) {
                //declare ftv globally
                //ftv = qs[ii]
                
                const yV = this.shuffleArray(rFQ, true)[0];
                yV.type = qf[ii];
                this.selVerses.push(yV);
                qfnum += 4;
                ii++;
            } else {
                if (this.qs[i] === 'question') {
                    this.selVerses.push(this.shuffleArray(rQ, true)[0]);
                } else if (this.qs[i] === 'SQ:') {
                    this.selVerses.push(this.shuffleArray(rSq, true)[0]);
                } else {
                    this.selVerses.push(this.shuffleArray(rAt, true)[0]);
                }
            }
        }
        this.delog(this.selVerses, 'hope');
        return;
    }
    
    clear(par3) {
        this.morebtn.style.display = 'none';
        this.vD.classList.remove('correct', 'incorrect');
        this.vD.classList.add('blueborder');
        this.vC.classList.remove('correct', 'incorrect');
        this.vC.classList.add('blueborder');
        this.ver.classList.remove('correct', 'incorrect');
        this.ver.classList.add('blueborder');
        this.vC.innerHTML = '';
        this.vD.innerHTML = '';
        this.ver.placeholder = 'Enter Answer';
        this.id('pleasefinish').style.display = 'none';
        this.id('pleasebtn').style.display = 'none';
        this.ver.value = '';
        this.id(par3).innerHTML = '';
        this.id('correctbtn').style.display = "none";
        this.id('incorrectbtn').style.display = "none";
        this.plsc.style.display = 'none';
    }
    
    checkAns() {
        this.next.style.display = 'block';
        let subm = this.id("submit");
        clearInterval(this.timerid);
        subm.style.display = 'none';
        this.ANS &&=  this.manageAnswer(this.ANS, false)[0].join(' ');
        
        this.delog('quest valur at checkans:', this.quest, this.ANS);
        let inVerse = this.ver.value;
        this.id('correctbtn').style.display = "none";
        this.id('incorrectbtn').style.display = "none";
        
        this.plsc.style.display = 'none';
        if (this.selVerses[this.cnum].type === 'ftv/quote') {
            //console.log(quest);
            if (this.stripChar(inVerse) === this.stripChar(this.quest)) {
                this.id('correctbtn').style.display = "block";
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: true,
                });
                this.correctCount++;
                this.correct('right');
                return true;
            } else {
                this.id('incorrectbtn').style.display = "block";
                this.ver.value = `${this.ver.value} \n \nCorrect Answer: ${this.selVerses[this.cnum].ref}\n${this.selVerses[this.cnum].verse} `;
                
                //vC.innerHTML =`${ver.value} \n \nCorrect Answer: ${QUEST}?\n${ANS}`;
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: false
                });
                
                this.correct('wrong');
                return false;
            }
        } else if (!this.dragEnabled) {
            
            // This function compares a user's answer to the correct answer.
            // It returns 'Correct', 'Incorrect', or 'Needs More Info'.
            const checkAdvancedAnswer = (userAnswer, correctAnswer) => {
                // Step 1: Normalize both answers.
                // This removes leading/trailing whitespace, makes them lowercase, and removes common punctuation.
                const normalize = (str) => {
                    // Check if the input is a string before trying to normalize it.
                    if (typeof str !== 'string') {
                        return '';
                    }
                    // Convert to lowercase to ignore case differences.
                    // Remove leading/trailing spaces with trim().
                    // Use a regular expression to remove common punctuation and symbols.
                    // Replace multiple spaces with a single space.
                    return str.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=?\-_`~()'"]/g, '').replace(/\s{1,}/g, '');
                };
                
                const normalizedUser = normalize(userAnswer); // Normalize the user's answer.
                const normalizedCorrect = normalize(correctAnswer); // Normalize the correct answer.
                this.delog('norans', normalizedCorrect, normalizedUser);
                // Step 2: Check for an exact match.
                // This is the most straightforward check for correctness.
                if (normalizedUser === normalizedCorrect) {
                    // If the normalized answers are identical, the user is correct.
                    return 'Correct';
                }
                
                // Step 3: Check for a partial match.
                // This is where we determine if the user is close but needs more information.
                // We check if the user's answer contains a significant part of the correct answer.
                if (normalizedCorrect.includes(normalizedUser) && normalizedUser.length > 2) {
                    // The includes() method checks if a string contains another string.
                    // We also check that the user's answer is not just a single letter or number,
                    // to avoid false positives (e.g., 'a' is in 'apple').
                    return 'More';
                }
                
                // Step 4: If no match is found, the answer is incorrect.
                // This is the final and default case if the answer is neither correct nor close.
                return 'Incorrect';
            };
            
            
            //delog('quest valur at checkans after AI:', ANS)
            let result;
            inVerse = this.manageAnswer(this.ANS, false, inVerse)[4];
            this.delog('user in', inVerse, this.ANS);
            result = checkAdvancedAnswer(inVerse, this.ANS);
            this.delog('Result of advanced check:', result); // Log the result for debugging.
            if (result === 'Correct') {
                this.id('correctbtn').style.display = "block";
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: true,
                });
                this.correctCount++;
                this.correct('right');
                return true;
            } else if (result === 'Incorrect') {
                this.id('incorrectbtn').style.display = "block";
                this.ver.value = `${this.ver.value} \n \nCorrect Answer: ${this.QUEST}?\n${this.ANS}`;
                //vC.innerHTML =`${ver.value} \n \nCorrect Answer:${QUEST}?\n${ANS}`;
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: false
                });
                
                this.correct('wrong');
                return false;
            } else {
                this.morebtn.style.display = 'block';
            }
            
        } else {
            // drag and drop elements
            const Blocks = Array.from(this.vD.children);
            let entered_words = Blocks.map(Block => {
                return Block.textContent.trim();
            });
            if (this.stripChar(entered_words.join(' ')) === this.stripChar(this.ANS)) {
                this.id('correctbtn').style.display = "block";
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: true,
                });
                this.correctCount++;
                this.correct('right');
                return true;
            } else {
                this.id('incorrectbtn').style.display = "block";
                this.ver.value = `${this.ver.value} \n \nCorrect Answer: ${this.QUEST}?\n${this.ANS}`;
                this.vC.innerHTML = `Correct Answer: ${this.QUEST}?\n${this.ANS}`;
                // Correctly add a record to the answers array
                this.answers.push({
                    verse: this.selVerses[this.cnum],
                    correct: false,
                    //type: selVerses[cnum].type
                });
                
                this.correct('wrong');
                return false;
            }
        }
    }
    
    quiztimer(timeleft = 30) {
        if (!this.running) {
            clearInterval(this.timerid);
            this.TimeLeft = timeleft;
            return;
        }
        if (this.timerid) {
            clearInterval(this.timerid);
        }
        this.timerid = setInterval(() => {
            this.timerbtn.textContent = timeleft;
            timeleft--;
            this.TimeLeft = timeleft;
            
            if (timeleft <= 0) {
                clearInterval(this.timerid);
                this.timerbtn.textContent = 'Timer is up';
                this.checkAns();
            }
        }, 1000);
    }
    
    updateProgressBar() {
        const totalQuestions = this.quizSettings.numQuestions;
        // counterToMax is incremented before this function is called, so it represents the current question number.
        const progressPercentage = ((this.counterToMax + 1) / totalQuestions) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
    }
    
    showQuizSummary() {
        // Stop the timer
        this.vC.style.display = 'none';
        this.vD.style.display = 'none';
        
        clearInterval(this.timerid);
        this.clear('quizHeader');
        
        // Hide quiz scene and show start scene
        document.getElementsByTagName('main')[1].style.display = 'none';
        
        this.timerbtn.style.display = 'none';
        // Clear the quiz header content
        const quizHeader = this.id('quizHeader');
        quizHeader.innerText = '';
        this.delog(this.clientanswers);
        // Clear the verse input text area
        this.ver.value = '';
        this.id('questionNumber').style.display = 'none';
        this.progressBar.style.display = 'none';
        this.id('progressBar2').style.display = 'none';
        this.ver.style.display = 'none';
        // Hide the buttons and 'please wait' message
        this.id('next').style.display = 'none';
        this.id('pleasefinish').style.display = 'none';
        this.id('pleasebtn').style.display = 'none';
        this.id('More').style.display = 'none';
        this.ver.value = '';
        //id(par3).innerHTML = '';
        this.id('submit').style.display = 'none';
        this.id('BTN').style.display = 'none';
        this.id('correctbtn').style.display = "none";
        this.id('incorrectbtn').style.display = "none";
        this.plsc.style.display = 'none';
        this.running = false;
        this.updateClientInfo(this.clientanswers, 'objOFWrongAnswers/Right', true);
        // Display summary
        const totalQuestions = this.quizSettings.numQuestions;
        const correctAnswers = this.correctCount;
        
        this.delay_text(`Quiz Complete!`, 'h2', 'quizHeader', 0, 'green');
        this.delay_text(`Your score: ${correctAnswers} out of ${totalQuestions}`, 'p', 'quizHeader', 0);
        //console.log(answers)
        if (this.answers.some(a => !a.correct)) {
            this.delay_text(`You missed the following verses:`, 'h3', 'quizHeader', 0);
            this.answers.forEach(answer => {
                if (!answer.correct) {
                    this.delay_text(`${answer.verse.ref}`, 'h6', 'quizHeader', 0, 'purple');
                    if (answer.verse.type === 'ftv/quote' || answer.verse.type === 'quote' || answer.verse.type === 'ftv') {
                        this.delay_text(`${answer.verse.verse}`, 'h6', 'quizHeader', 0);
                    } else {
                        const aAQ = answer.verse.aq.split('?');
                        this.delay_text(`${aAQ[0]}?`, 'h6', 'quizHeader', 0);
                        this.delay_text(`${aAQ[1]}`, 'h6', 'quizHeader', 0);
                    }
                }
            });
        }
        this.id('restart').style.display = 'block';
    }
    
    shuffleArray(array, itemOfArray = false) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        if (itemOfArray) {
            const r = Math.floor(Math.random() * array.length);
            const rand_itemOfarray = array[r];
            return [rand_itemOfarray, array];
        }
        return array;
    }
   

    upNumQ(params = this.currentQNum) {
        this.currentQNum += 1;
        this.id('questionNumber').textContent = this.currentQNum;
       
    }
    
    async new_quote(_ftv = 'quote', maxnum = 20, rand = 'random', speed = 0) {
        this.next.style.display = 'none';
       // Stop the quiz if all questions are completed.
       if (this.currentVerseIndex >= this.selVerses.length && this.currentVerseIndex != maxnum) {
        this.currentVerseIndex = 1;
        //this.showQuizSummary();
        //return;
    }
       if (this.currentVerseIndex >= maxnum) {
        this.showQuizSummary();
        return;
    }
    // Stop the quiz if all questions are completed.
   
        // Get the current verse data using the currentVerseIndex.
        const currentVerseData = this.selVerses[this.currentVerseIndex];
        
        // Check if the verse data is valid before continuing.
        if (!currentVerseData) {
            console.error('Error: current verse data is undefined.', this.currentVerseIndex);
            //this.showQuizSummary(); 
            // // Or handle the error differently

            return;
        }

        this.ftv = currentVerseData.type;
        let phars = '';
        
       
        this.cnum = this.currentVerseIndex;
        //this.currentVerseIndex++;
        
        this.ftv = this.selVerses[this.cnum].type;
        
        let vtype;
        if (this.quizSettings.quizMode.includes('ftv')) {
            vtype = 'ftv';
            this.isftv = true;
        }
        
        if (this.quizSettings.quizMode.includes('quote')) {
            vtype = 'quote';
            this.isquote = true;
        }
        
        if (this.isquote && this.isftv && this.ftv === 'ftv/quote') {
            vtype = 'both';
        }
        
        if (this.ftv === 'ftv/quote') {
            this.ftv = vtype;
        }
        
        if (this.ftv === 'both') {
            const randtype = Math.floor(Math.random() * this.questTypes.length);
            this.ftv = this.questTypes[randtype];
            this.globalquestype = this.questTypes[randtype];
        }
        /* still used  */
        
        
        //let question_dict2 = question_dict;
        this.clear('quizHeader');
        const qh = 'quizHeader';
        this.currerentVerse = this.selVerses[this.cnum];
        let ftvTriggerI;
        let uniqueWordNum;
        let uniquecharNum;
        this.QUEST = '';
        let tChar = 'no';
        //if(selVerses[cnum].type === 'ftv/quote'){
        if (true) {
            if (this.ftv === 'ftv') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'ftv';
                const verseText = this.selVerses[this.cnum].verse;
                const words = verseText.split(' ');
                const first_5 = words.slice(0, 5);
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(words, this.verse_dict2, this.cnum, 5));
                
                phars = first_5.join(' ');
                this.quest = words.slice(5).join(' ');
                this.delog(this.quest);
                 //tChar = this.findTrigChar(this.verse_dict2, phars, 0, phars.split('').length);
                //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
                
                await this.delay_text(`Finish the Verse:`, 'h4', 'quizHeader', 0, 'purple', 5);
            } else if (this.ftv === 'quote') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'ftv';
                const verseData = this.selVerses[this.cnum];
                phars = verseData.ref;
                this.quest = verseData.verse;
                //tChar = findTrigChar(verse_dict2, quest, 0)
                ({uniquecharNum} =  await this.findUniqueTriggerWord(phars.split(' '), this.quoteRefArr, "F"));
                uniquecharNum ++;
                await this.delay_text(`${this.selVerses[this.cnum].numVerses} Verse Quote:`, 'h4', 'quizHeader', 0, 'purple');
            } else if (this.ftv === 'SQ:') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = this.ftv;
                const getaq = this.selVerses[this.cnum].verse.split('?');
                this.QUEST = getaq[0];
                this.ANS = getaq[1];
                phars = `${this.QUEST}?`;
                this.selVerses[this.cnum].verse = this.QUEST;
                this.QUEST = this.QUEST.split(' ');
                tChar = this.findTrigChar(this.question_dict2, this.QUEST.join(' '), 0, this.QUEST.join(' ').split('').length);
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(this.QUEST, this.question_dict2, this.cnum, this.QUEST.length));
                this.QUEST = this.QUEST.join(' ');
                if (!this.ANS) {
                    this.manageModal('Opps a error happen please reset error code(ANS404)');
                }
                `if(ANS.includes('(')){
                    const sA =  ANS.split('(');
                    ANS2 = sA[1];
                    ANS = sA[0];
                }
                if(ANS.includes('[')){
                    ANS =  ANS.split('[')[0]
                }`;
                //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
                await this.delay_text(`Situation Question:`, 'h4', 'quizHeader', 0, 'purple');
                
            } else if (this.ftv === 'According to') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'at';
                const getaq = this.selVerses[this.cnum].verse.split('?');
                this.QUEST = getaq[0];
                this.ANS = getaq[1];
                phars = `According To: ${this.QUEST}?`;
                this.selVerses[this.cnum].verse = this.QUEST;
                this.QUEST = this.QUEST.split(' ');
                //tChar = this.findTrigChar(this.question_dict2, this.QUEST.join(' '), 0, this.QUEST.join(' ').split('').length) + 14;
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(this.QUEST, this.question_dict2, this.cnum, this.QUEST.length)) ;
               uniqueWordNum += 2;
               uniquecharNum += 14
                this.QUEST = this.QUEST.join(' ');
                
                if (!this.ANS) {
                    this.manageModal('Opps a error happen please reset; error code(ANS404)');
                }
                
                //trigChar = findUniqueTriggerWord(QUEST.split(''), question_dict2, cnum , QUEST.length)[1];
                await this.delay_text(`Question`, 'h4', 'quizHeader', 0, 'purple');
            } else if (this.ftv === 'question') {
                const aq = this.selVerses[this.cnum].verse;
                this.selVerses[this.cnum].aq = aq;
                this.globalquestype = 'q';
                const getaq = this.selVerses[this.cnum].verse.split('?');
                this.QUEST = getaq[0];
                this.ANS = getaq[1];
                phars = `${this.QUEST}?`;
                this.selVerses[this.cnum].verse = this.QUEST;
                this.QUEST = this.QUEST.split(' ');
                tChar = this.findTrigChar(this.question_dict2, this.QUEST.join(' '), 0, this.QUEST.join(' ').split('').length);
                ({uniqueWordNum, uniquecharNum} = await this.findUniqueTriggerWord(this.QUEST, this.question_dict2, this.cnum, this.QUEST.length));
                this.QUEST = this.QUEST.join(' ');
                if (!this.ANS) {
                    this.manageModal('Opps a error happen please reset error code(ANS404)');
                }
                
                
                //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
                await this.delay_text(`Question`, 'h4', 'quizHeader', 0, 'purple');
            } else {
                console.log('failed at new', this.ftv);
            }
        }
        this.startTimer = false;
        this.delog(tChar, 'tc', this.ftvTriggerI, 'ftv1');
        await this.delay_text(`${phars}`, 'p', 'quizHeader', speed, 'black', uniqueWordNum, uniquecharNum);
         this.currentVerseIndex++;
        // Update the progress bar after a new question is loaded
        return this.quest, phars;
    }
    
    setupDropZone(containerId) {
        const container = document.getElementById(containerId);
        //clear all child blocks
        if (this.dragEnabled === false) {
            container.style.display = 'none';
            return;
        }
        
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
            
            const dataVBlock = eB.dataTransfer.getData('text/plain');
            const draggedElementVBlock = document.getElementById(dataVBlock);
            if (draggedElementVBlock) {
                container.appendChild(draggedElementVBlock);
            }
        });
        return container;
    }
    
    // This function initializes the clickable and draggable word blocks for the quiz.
    dragElements() {
        if (this.dragEnabled === false) {
            this.setupDropZone('verse-con');
            this.setupDropZone('versedrop');
            return;
        }
        
        // Get the container for the draggable words.
        const draggableContainer = document.getElementById('verse-con');
        const dropContainer = document.getElementById('versedrop');
        
        // Split the verse into individual words to create separate buttons.
        const rnum = Math.floor(Math.random() * 3 + 1);
        let blocks;
        if (this.selVerses[this.cnum].type != 'ftv/quote') {
            blocks = this.ANS.split(' ');
            blocks = this.manageAnswer(blocks, true)[0];
            this.selVerses.forEach(itemSelected => {
                const randWord = this.shuffleArray(itemSelected.verse.split(' '), true)[0];
                this.randwords.push(randWord);
            });
            this.delog('random words', this.randwords);
            for (let i = 0; i < rnum; i++) {
                
                let randWORD = this.shuffleArray(this.randwords, true)[0];
                blocks.push(randWORD);
                this.delog('random word added', randWORD);
                
            }
        } else {
            blocks = this.quest.split(' ');
        }
        
        blocks = this.shuffleArray(blocks);
        let idIndex = 0;
        this.delog('block', blocks);
        // Iterate over each word block to create a new button element.
        blocks.forEach(block => {
            // Create a new button for each word.
            const button = document.createElement('button');
            // Set the text content of the button, adding a space for separation.
            if (block != '') {
                button.textContent = block + ' ';
                // Re-enable the draggable attribute for the button.
                button.draggable = true;
                
                // Add the base class for all draggable elements.
                button.className = 'draggable-block';
                
                // Assign a unique ID to each button to identify it later.
                button.id = `${idIndex}-${block}`;
                // Increment the ID index for the next button.
                idIndex++;
                // Append the newly created button to the draggable container in the HTML.
                if (button.textContent != '  ') {
                    draggableContainer.appendChild(button);
                }
            }
            
            
            // Add a 'dragstart' event listener to handle the beginning of a drag operation.
            button.addEventListener('dragstart', (eventdragB) => {
                // Set the data to be transferred during the drag, using the button's ID.
                eventdragB.dataTransfer.setData('text/plain', eventdragB.target.id);
                // Add a class to the button to visually indicate that it is being dragged.
                eventdragB.target.classList.add('is-dragging');
            });
            
            // Add a 'dragend' event listener to handle the end of a drag operation.
            button.addEventListener('dragend', (event) => {
                // Remove the dragging class to reset the element's appearance.
                event.target.classList.remove('is-dragging');
            });
            
            // Add a 'click' event listener to handle click-based movement.
            button.addEventListener('click', (event) => {
                // Check the current parent of the clicked button.
                const parentContainer = event.target.parentNode;
                // If the button is in the source container, move it to the drop container.
                if (parentContainer.id === 'verse-con') {
                    dropContainer.appendChild(event.target);
                }
                // Otherwise, if it's in the drop container, move it back to the source.
                else if (parentContainer.id === 'versedrop') {
                    draggableContainer.appendChild(event.target);
                }
            });
        });
        
        // Set up both the source and the drop zone containers as valid drop targets.
        this.setupDropZone('verse-con');
        this.setupDropZone('versedrop');
        
        // Add a listener to the new button to log IDs.
        //document.getElementById('getIDsButton').addEventListener('click', getDraggedElementIds);
    }
    
    handleSpaceEvent() {
        if (this.selVerses[this.cnum].type === 'ftv/quote') {
            let Answer2;
            this.plsc.style.display = 'none';
            this.id('pleasefinish').style.display = 'none';
            this.id('correctbtn').style.display = "none";
            this.id('incorrectbtn').style.display = "none";
            this.id('puralbtn').style.display = 'none';
            
            let inpuT = this.ver.value;
            inpuT = inpuT.trim().split(' ');
            const user_word = inpuT[inpuT.length - 1];
            const Answer = this.quest.trim().split(' ');
            Answer2 = Answer[inpuT.length - 1];
            //special comparsion to be added
            if (Answer2[Answer2.length - 1] === 's' && user_word[user_word.length - 1] != 's') {
                //add dom for hint
                this.id('puralbtn').style.display = 'block';
                
            } else if (Answer2[Answer2.length - 1] != 's' && user_word[user_word.length - 1] === 's') {
                //add dom for
                this.id('puralbtn').style.display = 'block';
            } else
            
            //normal comparsion
            if (Answer2 && this.levenshtein(this.stripChar(user_word), this.stripChar(Answer2), 53)) {
                inpuT.pop();
                inpuT.push(Answer2);
                this.ver.value = inpuT.join(' ') + ' ';
            } else {
                this.plsc.style.display = 'block';
            }
            
            if (this.stripChar(inpuT) === this.stripChar(this.quest)) {
                this.id('correctbtn').style.display = "block";
                if (!this.answers[this.cnum]) {
                    this.answers[this.cnum] = { correct: 0 };
                }
                this.answers[this.cnum].correct += 1;
                this.correctCount++;
                this.correct('right');
                clearInterval(this.timerid);
            }
        }
    }
    
    startApp() {
        let checker = false;
        const submitButton = this.id('submit');
        if (submitButton) {
            submitButton.addEventListener("click", () => this.checkAns());
        }
        
        if (this.ver) {
            this.ver.addEventListener('input', () => {
                // Check if the input value ends with a space and is not empty.
                if (this.ver.value.endsWith(' ') && this.ver.value.trim().length > 0) {
                    // If it does, run the handleSpaceEvent logic.
                    this.handleSpaceEvent();
                }
            });
        }
        
        const startButton = this.id('startQuizButton');
        if (startButton) {
            startButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const clientAnswersLength = this.selVerses.length;
                this.answers = [];
                this.correctCount = 0;
                if (!this.verse_dict || !this.question_dict || !this.readyLoad) {
                    this.manageModal('Content is still loading please wait a moment');
                    return; //show a friendly wait message and have the user reclick the start button
                }
                
                //for now
                // Add if statements to check if the elements exist before accessing their values
                const verseSelectionElement = document.querySelector('input[name="verseSelection"]:checked');
                if (verseSelectionElement) {
                    this.quizSettings.verseSelection = verseSelectionElement.value;
                }
                const selquizMode = [];
                const quizModeElement = document.querySelectorAll('input[name="quizMode"]:checked');
                if (quizModeElement) {
                    quizModeElement.forEach((checkboxqm) => {
                        selquizMode.push(checkboxqm.value);
                    });
                }
                let ischp = false;
                
                const selectedMonths = [];
                const monthCheckboxes = document.querySelectorAll('input[name="month"]:checked');
                if (monthCheckboxes) {
                    monthCheckboxes.forEach((checkbox) => {
                        selectedMonths.push(checkbox.value);
                    });
                }
                this.quizSettings.ischp = false;
                this.quizSettings.months = selectedMonths;
                const selectedChps = [];
                const ChpCheckboxes = document.querySelectorAll('input[name="chp"]:checked');
                if (ChpCheckboxes) {
                    ischp = true
                    this.quizSettings.ischp = true;
                    ChpCheckboxes.forEach((checkbox) => {
                        selectedChps.push(checkbox.value);
                    });
                }
                
                if(selectedChps.length === 0){
                   ischp = false;
                   this.quizSettings.ischp = false;
                     const ChpCheckboxes = document.querySelectorAll('input[name="chp"]')
                     ChpCheckboxes.checked = true;
                     ChpCheckboxes.forEach((checkbox) => {
                        selectedChps.push(checkbox.value);
                    });

                }else{
                    ischp = true;
                    this.quizSettings.ischp = true;
                }
                this.quizSettings.chapters = selectedChps;
                
                const numQuestionsElement = document.getElementById('numQuestions');
                if (numQuestionsElement) {
                    this.quizSettings.numQuestions = parseInt(numQuestionsElement.value);
                }
                
                const lenOfTimerElement = document.getElementById('secs');
                if (lenOfTimerElement) {
                    this.quizSettings.lenOfTimer = parseInt(lenOfTimerElement.value);
                }
                const speed_tOf_text = document.getElementById('speed');
                if (speed_tOf_text) {
                    if (typeof (parseFloat(speed_tOf_text.value)) != 'number') {
                        this.quizSettings.speed_tOf_text = 0;
                    } else {
                        this.quizSettings.speed_tOf_text = parseFloat(speed_tOf_text.value);
                    }
                }
                
                const selectedFlights = [];
                const flightCheckboxes = document.querySelectorAll('input[name="flight"]:checked');
                if (flightCheckboxes) {
                    flightCheckboxes.forEach((checkbox) => {
                        selectedFlights.push(checkbox.value);
                    });
                }
                
                this.quizSettings.flights = selectedFlights;
                const title = document.getElementsByTagName('title');
                if (title.value === 'Practice Hard Verses') {
                    //quizSettings.numQuestions = length(clientanswers);
                }
                
                if (this.quizSettings.flights.length === 0) {
                    this.quizSettings.flights = ['A', 'B', 'C', 'T'];
                }
                if (this.quizSettings.months.length === 0) {
                    this.quizSettings.months = this.quiMonths;
                }
                if(this.quizSettings.chapters.length === 0){
                   this.quizSettings.chapters = this.quizMonths.map(Month=>{
                       if( this.quizSettings.months.includes(Month[0])){
                        return Month[1].join(' ')
                       }
                    }).join(' ').split(' ')
                }
                this.quizSettings.quizMode = selquizMode;
                if (this.quizSettings.quizMode.includes('ftv') || this.quizSettings.quizMode.includes('quote')) {
                    // If the array includes either 'ftv' or 'quote', push the combined mode.
                    selquizMode.push('ftv/quote');
                }
                this.quizSettings.quizMode = selquizMode;
                console.log('Quiz Settings Saved:', this.quizSettings);
                this.next.style.display = 'none';
                
                if (this.quizSettings.numQuestions > 100 || this.quizSettings.numQuestions === 0) {
                    this.quizSettings.numQuestions = 20;
                }
                if (typeof (this.quizSettings.numQuestions) != 'number') {
                    this.quizSettings.numQuestions = 100;
                }
                if (typeof (this.quizSettings.lenOfTimer) != 'number') {
                    this.quizSettings.lenOfTimer = 0;
                }
                
                async function Selectdata() {
                    
                    if (this.dragEnabled) {
                        this.ver.style.display = 'none';
                    }
                    if (this.selverses) {
                        this.delog(this.question_dict, 'frist vd');
                        this.verse_dict = { ...this.verse_dict, ...this.question_dict };
                        this.delog(this.verse_dict, 'Vers dict after add');
                        const allQuestionsArray = Object.values(this.verse_dict)
                        this.updateClientInfo(allQuestionsArray, 'QuestionsToPrint', true);
                            this.updateClientInfo(this.quizSettings, "QuizSettings", true)
                        this.selVerses = Object.values(this.verse_dict).filter(Verse => {
                            
                            
                            
                            
                            let Test = this.quizSettings.months.includes(Verse.month) && this.quizSettings.flights.includes(Verse.flight) && this.quizSettings.quizMode.includes(Verse.type) && Verse.verse && this.quizSettings.chapters.includes(Verse.chapter)
                               
                            
                            return Test;
                                
                
                        })
                        //add the incorrect and correct propties to selVerses
                        
                    } else {
                        this.quizSettings.numQuestions = clientAnswersLength;
                        this.selVerses;
                        
                    //return;*//////////////////////////////////////////////
}
                }
                async function WaitForLoad() {
                    
                    
                    await Selectdata.bind(this)();
                    async function loadgen(d20 = 20) {
                        if (this.genQuiz) {
                            let F;
                            let Q;
                            let numQuizQuests = d20;
                            if (this.quizSettings.flights.includes('C')) {
                                Q = 0;
                                F = 5;
                            }
                            if (this.quizSettings.flights.includes('B')) {
                                Q = 0;
                                F = 5;
                            }
                            if (this.quizSettings.flights.includes('A')) {
                                Q = 2;
                                F = 3;
                            }
                            if (this.quizSettings.flights.includes('T')) {
                                Q = 3;
                                F = 2;
                            }
                            await this.generateQuiz(Q, F, numQuizQuests);
                            return;
                        } else {
                            return;
                        }
                    }
                    
                    this.delog(this.selVerses, 'selverses');
                    
                    this.speeddetext = this.quizSettings.speed_tOf_text;
                    this.Time = this.quizSettings.lenOfTimer;
                    this.running = true;
                    async function loadVerseDicts() {
                                 const {figureMonths} = this.hightestMonth(this.quizSettings.months)
                        this.verse_dict2 = this.fliterOutQs(Object.values(this.verse_dict), {m: figureMonths, f: this.quizSettings.selectedFlights, t: ['ftv/quote']})
                        
                        this.delog('question_dict', '2');
                        this.question_dict2 = this.fliterOutQs(Object.values(this.verse_dict), {m: figureMonths, f: this.quizSettings.selectedFlights, t: ['question', 'According to', 'SQ:']})
                        
                        this.quoteRefArr = this.verse_dict2.map(Verse => Verse.ref);
                        this.delog(this.question_dict2, this.verse_dict2, this.quoteRefArr, Object.values(this.verse_dict, 'verse dicts'));
                    }
                    
                    await loadVerseDicts.bind(this)();
                    if (this.quizSettings.verseSelection === "random") {
                        this.selVerses = this.shuffleArray(this.selVerses);
                    }
                    await loadgen.bind(this)();
                    
                   
                       
                   if(this.id('print')) {this.delog('print 101'); return;}
                    
                    await this.new_quote(
                        this.quizSettings.quizMode,
                        this.quizSettings.numQuestions,
                        this.quizSettings.verseSelection, this.speeddetext);
                    this.progressBar.style.width = '0%';
                    this.delog(this.selVerses);
                    this.dragElements();
                    //generateQuiz(2,3,20)
                    if (this.quizSettings.lenOfTimer === 0) {
                        this.timerbtn.style.display = 'none';
                    } else {
                        this.quiztimer(this.Time);
                    }

                    return;
                }
                
                
                await WaitForLoad.bind(this)();
                this.micBtn.addEventListener('click', async ()=>{
                    // Function to update your UI with the final text
                    const ver = this.id('verse')
function handleTranscription(text) {
    console.log("Transcribed Text:", text);
    micBtn.innerHTML= 'Getting text...'
    ver.value = text;
    // Example: document.getElementById('myTextArea').value += text + ' ';
}

// Function to update your UI when the microphone is on
function handleStart() {
    console.log("Recording started...");
    micBtn.classList.add = 'micListening'
    micBtn.innerHTML = 'Listening'
    // Example: document.getElementById('myStatus').textContent = 'Listening...';
}
function toStop(){
    ver.addEventListener('input', ()=>recognition.stop())
}
// Function to update your UI when the microphone is off
function handleEnd() {
    console.log("Recording ended.");
    micBtn.classList.remove = 'micListening'
    micBtn.innerHTML = 'Press For Mic'
    // Example: document.getElementById('myStatus').textContent = 'Ready.';
}

// Function to handle any errors
function handleError(error) {
    console.error("An error occurred:", error);
    // Example: alert('Recording failed due to: ' + error);
}

// Start the recording when a button is clicked
let currentRecognition = null;
this.micBtn.addEventListener('click', () => {
    this.vD.style.display = 'none';
                    this.vC.style.display = 'none';
                    this.ver.style.display = 'block';
                    this.dragEnabled = false;
    // Stop any existing session before starting a new one
    if (currentRecognition) {
        currentRecognition.stop();
        currentRecognition = null;
    }
    
    // Start the new recognition session
    currentRecognition = startVoiceRecognition(
        handleTranscription,
        handleStart,
        handleEnd,
        handleError, toStop
    );
});
                    //const micInput =  startVoiceRecognition()
                })
                this.Start();
                return;
            });
        }
        
        if (this.btnTOModal) {
            this.btnTOModal.addEventListener('click', () => {
                this.manageModal(`<div class="option-section">
                <h3 class="section-title">Set Quiz Settings</h3>
                <h3 class="section-title">Speed of Text (In Milliseconds)</h3>
                <div class="range-display-container">
                    <input type="range" id="speed1" name="numQuestions" value="0" min="0" max="4000">
                    <span id="speedValue1">0</span>
                </div>
            </div>
             <div class="option-section">
                        <h3 class="section-title">Length of Timer (Length of zero will be no timer)</h3>
                        <input type="number" id="secs1" name="numQuestions1" value="30" min="0" max="1000" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                    </div>
                    <div class="option-section">
                    <h3 class="section-title">Verse Selection</h3>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="type" value="d" id="d" >
                            <span class="radio-custom"></span>
                            Drag and Drop
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="type" value="t" id="t">
                            <span class="radio-custom"></span>
                            Text
                        </label>
                    </div>
                </div>`, true);
                
                
                const speedInput1 = this.id('speed1'); // Gets the range input element.
                const speedValueSpan1 = this.id('speedValue1'); // Gets the span element to display the value.
                `speedValueSpan1.textContent = speeddetext;
                speedValueSpan1.value = speeddetext;
                id(secs1).value = Time;`;
                if (this.dragEnabled) {
                    
                    this.id('d').checked = true;
                    this.id('t').checked = false;
                } else {
                    this.id('t').checked = true;
                    this.id('d').checked = false;
                }
                // Listen for the 'input' event, which fires continuously as the slider is moved.
                if (speedInput1) {
                    speedInput1.addEventListener('input', (event) => {
                        // Update the text content of the span with the current value of the input.
                        speedValueSpan1.textContent = event.target.value;
                    });
                }
            });
        }
        
        if (this.next) {
            this.next.addEventListener("click", async () => {
                //this.cnum = this.currentVerseIndex; // <--- ADD THIS LINE HERE
                this.upNumQ();
                this.id('submit').style.display = 'block';
                this.updateProgressBar();
                this.counterToMax += 1;
                
                if (this.selVerses[this.cnum].type != 'ftv/quote') this.selVerses[this.cnum].verse = this.selVerses[this.cnum].aq;
                
                await this.new_quote(
                    this.quizSettings.quizMode,
                    this.quizSettings.numQuestions,
                    this.quizSettings.verseSelection, this.speeddetext);
                //progressBar.style.width = '0%';
                //delog(selVerses)
                this.dragElements();
                //generateQuiz(2,3,20)
                if (this.quizSettings.lenOfTimer === 0) {
                    this.timerbtn.style.display = 'none';
                } else {
                    this.quiztimer(this.Time);
                }
            });
        }
    }
}

const app = new quizCompanion();
app.initializeQuiz();
app.startApp();
const QuizApp = new quizCompanion()
export { QuizApp }
/**
 * Asynchronously sets up the microphone, listens for a single utterance,
 * and returns the transcribed text.
 * * Note: This function requires user interaction (a button click) to start 
 * due to browser security policies for microphone access and speech recognition.
 * * @returns {Promise<string>} A Promise that resolves with the transcribed text.
 * Rejects with an Error if microphone access fails or 
 * speech recognition errors occur.


/* // --- Example Usage ---

async function compareUserVerse(correctVerse) {
    try {
        console.log("Awaiting user input...");
        // Comment: Call the function and wait for the transcribed text
        const userTranscription = await transcribeSpeechFromMic(); 

        console.log("User said:", userTranscription);
        console.log("Correct verse:", correctVerse);

        // Comment: Perform a simple word-for-word comparison (case and space insensitive)
        const cleanUser = userTranscription.trim().toLowerCase(); 
        const cleanCorrect = correctVerse.trim().toLowerCase();

        if (cleanUser === cleanCorrect) {
            console.log("Match! Word-for-word comparison successful.");
        } else {
            console.log("Mismatch. User transcription did not match the correct verse.");
        }

    } catch (error) {
        // Comment: Log any errors that occurred during the process
        console.error("Transcription failed:", error.message);
    }
}

// To run the comparison, you would call:
// compareUserVerse("For God so loved the world that he gave his only begotten Son.");
// The browser will then prompt the user for microphone access.
*/