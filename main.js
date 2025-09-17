const quizApp = (function() {
    const id = (word) => {
        let word1 = document.getElementById(word);
        return word1

    }
    let running = true;
    let genQuiz = false;
    const testIsGenQuiz = id('isGenQuiz');
    if(testIsGenQuiz){
        genQuiz = true;
    }
    const speedInput = id('speed'); // Gets the range input element.
            const speedValueSpan = id('speedValue'); // Gets the span element to display the value.
            
            // Listen for the 'input' event, which fires continuously as the slider is moved.
            speedInput.addEventListener('input', (event) => {
                // Update the text content of the span with the current value of the input.
                speedValueSpan.textContent = event.target.value;
            });
            
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
    
    async function loadQuestions(){
        try{
            const questResponse = await fetch('QuestioniTBQN.txt')
            if(!questResponse.ok){
                throw new Error(`Questions failed fetch ${questResponse.status}`)

            }
            const questionsText = await  questResponse.text()
            console.log('data from questions has been loaded as text', questionsText)
            const returnQ = await processQuestions(questionsText)
            delog(returnQ)
            return returnQ


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
            const returnq = await processQuotes(data);
            return returnq
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
     function findUniqueTriggerWord(ARRAY, obj, currentVerseNumber, len = 5, CHAR = false) {
        if (!Array.isArray(ARRAY) || typeof obj !== 'object' || obj === null) {
            console.error('Invalid input: ARRAY must be an array and obj must be an object.');
            return [null, -1];
        }
    let verses = [];
        // CORRECTED: Use Object.entries() to access the key (verse number)
        if(CHAR){
             verses = Object.entries(obj)
            // Filter out the current verse and verse 60
            .filter(([key, value]) => key !== String(currentVerseNumber))
            .map(([key, item]) => item.verse.split(''));

        }else{
         verses = Object.entries(obj)
            // Filter out the current verse and verse 60
            .filter(([key, value]) => key !== String(currentVerseNumber) && key !== '60')
            .map(([key, item]) => item.verse.split(' '));
        }
    
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
    let question_dict2 = [];
        let verse_dict2 = []
    let Time;
    let exANs = [];
    let altans = [];
    let cleanans =[];
    let speeddetext;
    let ftvTriggerI;
    let trigChar;
    let question_dict = []
    let QUEST;
    let randwords = [];
    let qs = [];
    
    let currerentVerse;
    let startTimer = false;
    let counterToMax = 0;
    let questTypes = ['ftv', 'quote']
    const quizSettings = {};
    const quiMonths =  ['october', 'november', 'december', 'january', 'february', 'march'];
    const quizMonths = [
        ['october', [1, 2, 3, 4, 5]],
        ['november', [6, 7, 8, 9]], 
        ['december', [10, 11, 12]],
        ['january', [13, 14]],
        ['february', [15, 16]],
        ['march', ['jonah']]
    ];
   let isrendered = false;
    let TimeLeft = 30;
    let dragEnabled = true;
    let deblog = true;
    let cnum = 0;
    let timerid;
    let globalquestype;
    let quest;
    let ftv;
    const morebtn = id("More")
    const next = id('next');
    const btnTOModal = id('BTN')
    const vD = id('versedrop')
    const vC = id('verse-con');
    //let clientanswers = {}
    let clientanswers =  updateClientInfo(null, 'objOFWrongAnswers/Right', false) || {};
    console.log(clientanswers)
    let correctCount =0;
    const plsc = id('pleasebtn');
    let answers = [];
    let remainingText = '';
    let numverses = 1;
    let verse_dict;
    let ANS;
    let readyLoad =   false
    let ANS2;
    let isquote = false;
    let isftv = false;
    const ver = id('verse');
    const timerbtn = id('timer');
     // spilts by new lines
     // place to store all the data
    let c = 0;// counter
    let selVerses =[];
     
const delog = (...args) =>{
    if (deblog) {
    console.log(...args)
}
}    
    async function processQuestions(data) {
    const dataSplit = data.trim().split('\n');
    let questiondict = {};

   const regex = /^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ:|According to) )?(.*)$/;
    
    for (let val of dataSplit){
        const match = val.match(/^(\w+ \d+:\d+[\w\d-]*) (\w) (?:(SQ:|According to) )?(.*)$/);
        c+= 1;
         // check if a match was found
        if(match){
        
            //const monthIndex = Math.floor((c - 1) / 20);
            let monthName;
            const ref1 = match[1];
            let splitref = ref1.split(' ');
            let book = splitref[0];
            let chapter = splitref[1].split(':');
            chapter = chapter[0];
            if (book === 'Matthew') {
                // Find the month array that contains the chapter number
                const foundMonthArray = quizMonths.find(month => {
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
   async function processQuotes(quotesFTVs) {
        
        const data = quotesFTVs.trim().split("\n");
        let versedict = {};
        let c2 = 0;
        for (let val of data) {
   
        // simple macth method word, digit:digit , word, Quote/FTV word
            val = val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) Quote\/FTV (.*)$/);
        //example regex for questions
        // val.match(/^(\w+ \d+:\d+\w*\-?\d*) (\w) (?:(SQ|According to (?:\w+ \d+:\d+\w*\-?\d*))) (.*)$/)
        
        c2 ++;
        c += 1;
        if (val) {

         // Now, we correctly assign the month based on the verse number
            const monthIndex = Math.floor((c2 - 1) / 20);
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
        try {
            question_dict = await loadQuestions();
            verse_dict = await loadQuotes();
            console.log('Loaded question_dict:', question_dict);
            console.log('Loaded verse_dict:', verse_dict);
            if (!verse_dict || !question_dict) {
                console.error('Failed to load verse_dict. Exiting quiz initialization.');
                return;
            }
            readyLoad = true;
        } catch (error) {
            console.error('Error initializing quiz:', error);
        }
    }
    
         initializeQuiz();


        function manageModal(mtxt="hi", set=false, modalid='settings', mcon="modaldiv", closebtn='closeModalBtn'){
            const modal = id(modalid);
            const modalContent = id(mcon)
            const closeBtn = id(closebtn);
            modalContent.innerHTML = mtxt;
            closeBtn.style.display = 'none'
            
            closeBtn.style.display = 'block'
            running = false
            clearInterval(timerid);
            const secsInput2= document.getElementById('secs1');
            const speedInput2 = document.getElementById('speed1');
            const sv = id('speedValue1');
            
            if (secsInput2 && Time) {
                secsInput2.value = Time;
            }
            if (speedInput2 && speeddetext && sv) {
                speedInput2.value = speeddetext;
                sv.textContent = speeddetext;

            }
            modal.showModal();
            
                closeBtn.addEventListener('click', () =>{
                closeBtn.style.display = 'none'
                modal.close();
                if(set){
                    const lenOfTimerElement1 = document.getElementById('secs1');
                    if (lenOfTimerElement1) {
                        Time = parseInt(lenOfTimerElement1.value);
                    }
                    const speed_tOf_text1 = document.getElementById('speed1');
                    if (speed_tOf_text1) {
                        if(typeof(parseFloat(speed_tOf_text1.value)) != 'number')  { quizSettings.speed_tOf_text = 0}else{
                        speeddetext = parseFloat(speed_tOf_text1.value);}
                    }
                    let textType;
                    const MODE = document.querySelector('input[name="type"]:checked');
                if (MODE) {
                    textType = MODE.value;
                }
           
           
            running = true;
            if(isrendered){quiztimer(TimeLeft);}
                if (textType === 't'){
                    vD.style.display ='none';
                    vC.style.display = 'none';
                    ver.style.display = 'block';
                   
                    dragEnabled = false
                }else{
                    vD.innerHTML = '';
                    vC.innerHTML = '';
                    ver.value = '';
                    vD.style.display ='block';
                    vC.style.display = 'block';
                    ver.style.display = 'none';
                    
                    if(isrendered){dragElements();};
                    dragEnabled = true

                }

                }
                })
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
                vD.classList.add('correct')
                vD.classList.remove('incorrect')
                vD.classList.remove('blueborder')
                vC.classList.add('correct')
                vC.classList.remove('incorrect')
                vC.classList.remove('blueborder')
                ver.classList.add('correct')
                ver.classList.remove('incorrect')
                ver.classList.remove('blueborder')
            } else if (result === 'wrong') {
                clientanswers[versetype].wrong += 1;
                vD.classList.add('incorrect')
                vD.classList.remove('correct')
                vD.classList.remove('blueborder')
                vC.classList.add('incorrect')
                vC.classList.remove('correct')
                vC.classList.remove('blueborder')
                ver.classList.add('incorrect')
                ver.classList.remove('correct')
                ver.classList.remove('blueborder')
            }
        
            console.log(clientanswers); // Log the object to see the updated data.
            ver.ariaDisabled = 'true';
        }
        
        function mapTchar(originalString, strippedIndex) {
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
function findTrigChar(list, _verse, vn, lEn=9000){

let unique = true;

let og_v = _verse.split('')

let k = 1

let l = 1

let _q;

let f = true

_q = stripChar(_verse)

_q= _q.split('')

for(let i = 0; i < lEn; i++){

//list.forEach(v =>{


for(v of list){

// = true;

if(stripChar(v.verse) === stripChar(_verse) ){

///// unique = false

//f = false

continue

}



let Q = stripChar(v.verse)

Q = Q.split('')



//const charToStrip = new Set(['!', '/', ';', ':', '.', '"', "'", ',', '-', '(', ')', '?', ' ']);



if(_q.slice(0, k).join('') === Q.slice(0, k).join('')){

unique = false

break;


}



}

//})

if(!unique){


unique = true;


k++

}else{

let m = 0;

let n = 0;

delog(k,'num found');
delog('this is map', mapTchar(og_v, k))

return mapTchar(og_v, k -1);

for(let o of og_v){

if(o === _q[m]){

m++;



}

n++;

if(m === k){

delog(n,'n')

return [n, og_v[n]]

}

}

//return k

}

}

return 'no';



};
let list= 'h';
const verseToFind = "Hello, World! This is a test.";
//const k = findTrigChar(list, verseToFind);

 //const originalIndex = mapTchar(strippedVerse, verseToFind, k - 1);
// Placeholder for delog and stripChar functions to make the code runnable.
// In your actual application, tuld be properly defined.

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


    function delay_text(txt, elm = 'p', par = 'quizHeader', delay = 0, COLOR = 0, id1 = 'false', id2= 'f') {
        return new Promise((resolve) => {
        const parent = id(par);
isrendered = false;
        const textElement = document.createElement(elm);
        textElement.innerHTML = '';
        if (typeof(COLOR) === 'string') {
            textElement.style.color = COLOR;
        }
        parent.appendChild(textElement);
    
        const timeouts = [];
        let isStopped = false;
        let totalDelay = 0;
        let ANS2 = false;
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
                    isrendered = true
                    ver.disabled = false
                    resolve()
                    return;
                }
                isStopped = true;
                for (const timeoutId of timeouts) {
                    clearTimeout(timeoutId);
                }
                const remainingWords = words.slice(wordIndex);
                if(selVerses[cnum].type != 'SQ:')
                console.log('Remaining words:', remainingWords); // Debugging log
                const remainingText = remainingWords.join(' ');
                const tx = currentHTML + remainingText;
                startTimer = true;
                quest = remainingText + ' ' + quest;
                ANS = remainingText + ' ' + ANS;
                document.getElementById('pleasefinish').style.display = 'block'; 
                ver.placeholder = "Don't forget to enter the last word on the screen";
                
                window.removeEventListener('keydown', stopAnimation);
            }
        };
        window.addEventListener('keydown', stopAnimation);
    
        // This is the core logic of the whole code
        function typeWriter() {
            if (isStopped || wordIndex >= words.length) {
                window.removeEventListener('keydown', stopAnimation);
                isrendered = true
                ver.disabled = false;
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
            if (CHArNUm === id2) {
                if (!isHighlighted2) {
                    currentHTML += '<span class="highlight-char">';
                    isHighlighted2 = true;
                }
            } else {
                if (isHighlighted2) {
                    currentHTML += '</span>';
                    isHighlighted2 = false;
                }
            }
    
            currentHTML += char;
            //console.log('Current HTML:', currentHTML, 'char', char); // Debugging log
            textElement.innerHTML = currentHTML;
            CHArNUm++
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
    function checkAlt(ogphars) {
        // This variable will hold the modified string.
        let switched = stripChar(ogphars);
    
        // A standard for loop is used to iterate through the alternative answers.
        for (let i = 0; i < altans.length; i++) {
            // Gets the current alternative phrase from the altans array.
            const altPhrase = stripChar(altans[i]);
            // Gets the corresponding correct answer.
            const correctPhrase = stripChar(corspondAns[i]);
    
            // Creates a regular expression to find the alternative phrase globally and case-insensitively.
            // The escape function ensures special characters in the phrase are handled correctly.
            const escapedAlt = altPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
         
function manageAnswer(ans,  issplit=false, og =''){
    //removes () and[] from answers
    let inAns;
    let lastWord;
    let altPhar ='';
      exANs = [];
     altans = [];
    cleanans = [];
     corspondAns =[]
    let isAlt = false;
    let isEx = false;
   
    //iterator 
    let ii = 0;
    //let exANs = null;
    if(!issplit){ inAns = ans.split(' ')}else{
         inAns = ans;
    }
   //if(inAns.includes('(') || inAns.includes('[')){
    for(let i of inAns){
        if(i.includes('[') || isEx){
            //maybe
            isEx = true
            exANs.push(i);
            if(i.includes(']')){
                isEx = false
            }
            

        }else if(i.includes('(') || isAlt){
        //i.includes('(') || isAlt){
            //altans.pop()
            isAlt = true
            
            altPhar += `${i} `;
             if(i.includes(')') || i.includes(',')){
              
                corspondAns.push(lastWord);
                altans.push(altPhar);
                altPhar = '';


             }
            if(i.includes(')')){
                isAlt = false;
                
                  //altans.push(altPhar.join(' '));
            }
            //
        }else{
            //altans.push(i)
             lastWord = i
            cleanans.push(i)
        }
    ii++;
    
       



    }
    const switched = checkAlt(og)
    return [cleanans, altans, corspondAns, exANs, switched]
   

}

    const test9 = manageAnswer('the child (Jesus the r, ruler) is going to the place (city) to see [and go]', false, 'the Jesus the r is going to the city')
    delog(test9, 'test m ans');


    function remover(pharse){


    }
    function ad(pr, ar, nu){
        for(let i =0; i < nu; i++){
           ar.push(pr);
        }
        

    }
   async function generateQuiz(quoteC = 3, ftvC = 2, lengthQuiz){
        // quotes and ftvs
        let qf = [];
        //questions
       
        let atC = Math.floor(Math.random() * 4 +1)
        let sqC = Math.floor(Math.random() * 4 +1)
        const lenQ = lengthQuiz - quoteC + ftvC;
        const alrand = sqC + atC;
        let qC = lengthQuiz - alrand; 
        //adds the stuff
        ad('question',qs, qC)
        ad('SQ:',qs, sqC)
        ad('According to',qs, atC)
        ad('quote',qf, quoteC)
        ad('ftv',qf, ftvC)
        qf = shuffleArray(qf);
        qs = shuffleArray(qs);
        let qfnum = 1;
        let ii = 0;
        let rAt = selVerses.filter(Verse=> Verse.type === 'According to' );
        let rSq = selVerses.filter(Verse=> Verse.type === 'SQ:' )    
        let rQ = selVerses.filter(Verse=> Verse.type === 'question' )
        let rFQ =  selVerses.filter(Verse=> Verse.type === 'ftv/quote' )  
        selVerses =[]                                     
        for(let i = 0; i < lengthQuiz; i++){
            if(i === qfnum){
                //declare ftv globally
                //ftv = qs[ii]
              
                   const yV =  shuffleArray(rFQ, true)[0]
                   yV.type = qf[ii];
                   selVerses.push(yV)
                qfnum += 4;
                ii++
            }else{
                if(qs[i] === 'question'){
                    selVerses.push(shuffleArray(rQ, true)[0])
                }else if(qs[i] === 'SQ:'){
                    selVerses.push(shuffleArray(rSq, true)[0]);
                }else{
                    selVerses.push(shuffleArray(rAt, true)[0]);
                }
                
            }

        }
        delog(selVerses, 'hope')
return
       
    }
    function clear(par3) {
        morebtn.style.display = 'none';
        vD.classList.remove('correct', 'incorrect');
        vD.classList.add('blueborder')
        vC.classList.remove('correct', 'incorrect');
        vC.classList.add('blueborder')
        ver.classList.remove('correct', 'incorrect');
        ver.classList.add('blueborder')
        vC.innerHTML = '';
        vD.innerHTML = '';
        ver.placeholder = 'Enter Answer'
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

        delog('quest valur at checkans:', quest, ANS)
        let inVerse = ver.value
        id('correctbtn').style.display = "none";
        id('incorrectbtn').style.display = "none";

        plsc.style.display = 'none';
        if(selVerses[cnum].type === 'ftv/quote'){                                                     
        //console.log(quest);
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
           
            //vC.innerHTML =`${ver.value} \n \nCorrect Answer: ${QUEST}?\n${ANS}`;// Correctly add a record to the answers array
            answers.push({
                verse: selVerses[cnum],
                correct: false
            });
            

            correct('wrong')
            return false;
        }
    }else if(!dragEnabled){
        
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
      return str.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=?\-_`~()'"]/g, '').replace(/\s{2,}/g, ' ');
    };
  
    const normalizedUser = normalize(userAnswer); // Normalize the user's answer.
    const normalizedCorrect = normalize(correctAnswer); // Normalize the correct answer.
  
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
  
   
        delog('quest valur at checkans after AI:', ANS)
        let result = manageAnswer(inVerse)[4];
       result = checkAdvancedAnswer(inVerse, ANS);
         delog('Result of advanced check:', result); // Log the result for debugging.
         if (result === 'Correct') {
            id('correctbtn').style.display = "block";
            // Correctly add a record to the answers array
            answers.push({
                verse: selVerses[cnum],
                correct: true,
                
            });
            correctCount ++;
           correct('right')
            return true;
        } else if(result === 'Incorrect'){
            id('incorrectbtn').style.display = "block";
            ver.value =`${ver.value} \n \nCorrect Answer: ${QUEST}?\n${ANS}`;
             //vC.innerHTML =`${ver.value} \n \nCorrect Answer:${QUEST}?\n${ANS}`;
            // Correctly add a record to the answers array
            answers.push({
                verse: selVerses[cnum],
                correct: false
            });
            

            correct('wrong')
            return false;
        }else{
           morebtn.style.display = 'block';


        }


    }else{
        // drag and drop elements
        const Blocks = Array.from(vD.children);
        entered_words = Blocks.map(Block => { 
            return Block.textContent.trim();
        })
        if (stripChar(entered_words.join(' ')) === stripChar(ANS)) {
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
            ver.value =`${ver.value} \n \nCorrect Answer: ${QUEST}?\n${ANS}`;
            vC.innerHTML =`Correct Answer: ${QUEST}?\n${ANS}`;
            // Correctly add a record to the answers array
            answers.push({
                verse: selVerses[cnum],
                correct: false,
                //type: selVerses[cnum].type
            });
            

            correct('wrong')
            return false;
        }
        

    }

    }




   


      function quiztimer(timeleft=30){
        if (!running){
            clearInterval(timerid);
            TimeLeft = timeleft;
    return}
          if(timerid){clearInterval(timerid);}
          timerid = setInterval(()=>{
          timerbtn.textContent = timeleft;
              timeleft --;
              TimeLeft = timeleft;

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
        vC.style.display = 'none'
        vD.style.display = 'none';
        
        clearInterval(timerid);
    clear('quizHeader');
    
        // Hide quiz scene and show start scene
        document.getElementsByTagName('main')[1].style.display = 'none';
    
        timerbtn.style.display = 'none'
        // Clear the quiz header content
        const quizHeader = id('quizHeader');
        quizHeader.innerText= ''
        delog(clientanswers)
        // Clear the verse input text area
        ver.value = '';
        progressBar.style.display ='none'
        id('progressBar2').style.display ='none'
        ver.style.display = 'none'
        // Hide the buttons and 'please wait' message
        id('next').style.display ='none';
        id('pleasefinish').style.display = 'none';
        id('pleasebtn').style.display = 'none';
        id('More').style.display = 'none';
        ver.value = '';
        //id(par3).innerHTML = '';
        id('submit').style.display = 'none';
        id('BTN').style.display = 'none';
        id('correctbtn').style.display = "none";
        id('incorrectbtn').style.display = "none";
        plsc.style.display = 'none';
        running = false
        updateClientInfo(clientanswers, 'objOFWrongAnswers/Right', true)
        // Display summary
        const totalQuestions = quizSettings.numQuestions;
        const correctAnswers = correctCount;
    
        delay_text(`Quiz Complete!`, 'h2', 'quizHeader', 0, 'green');
        delay_text(`Your score: ${correctAnswers} out of ${totalQuestions}`, 'p', 'quizHeader', 0);
         //console.log(answers)
        if (answers.some(a => !a.correct)) {
            delay_text(`You missed the following verses:`, 'h3', 'quizHeader', 0);
            answers.forEach(answer => {
                if (!answer.correct) {
                delay_text(`${answer.verse.ref}`, 'h6','quizHeader',0,'purple');
                if(answer.verse.type === 'ftv/quote'){
                delay_text(`${answer.verse.verse}`, 'h6', 'quizHeader', 0); 
                }else{
                const aAQ = answer.verse.aq.split('?')
                delay_text(`${aAQ[0]}?`, 'h6', 'quizHeader', 0); 
                delay_text(`${aAQ[1]}`, 'h6', 'quizHeader', 0); 
                }
                }
            });
        }
    id('restart').style.display = 'block'
    
    };
    function shuffleArray(array, itemOfArray=false) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        if(itemOfArray){
            const r = Math.floor(Math.random()* array.length)
            const rand_itemOfarray = array[r]
            return [rand_itemOfarray, array]
        }
        return array;
    }
let currentQNum = 2;
function upNumQ(params = currentQNum) {
id('questionNumber').textContent = currentQNum
currentQNum ++;
    
}
     const new_quote = async (_ftv ='quote', maxnum = 20, rand = 'random', speed= 0) => {
        next.style.display = 'none';
    if (counterToMax === maxnum) {
            showQuizSummary();
            return;} // Stop the function here
        let phars = '';
       
            if (currentVerseIndex >= selVerses.length) {
                currentVerseIndex = 1;
            }
            cnum = currentVerseIndex;
            currentVerseIndex++;
        
         ftv = selVerses[cnum].type;
         
         let vtype;
        if (quizSettings.quizMode.includes('ftv')) {
            vtype = 'ftv';
            isftv = true;
        }
        
        if (quizSettings.quizMode.includes('quote')) {
            vtype = 'quote';
            isquote = true;
        }
        
        if (isquote && isftv && ftv === 'ftv/quote') {
            vtype = 'both';
        }

        

       

         if(ftv === 'ftv/quote'){
            ftv = vtype

         }

        if (ftv === 'both') {
            const randtype = Math.floor(Math.random() * questTypes.length);
            ftv = questTypes[randtype];
            globalquestype = questTypes[randtype];
        }
        /* still used  */

       
        
        
       //let question_dict2 = question_dict;
        clear('quizHeader');
        const qh = 'quizHeader';
        currerentVerse = selVerses[cnum];
        ftvTriggerI;
        let tChar ='no';
         //if(selVerses[cnum].type === 'ftv/quote'){
         if (true){
        if (ftv === 'ftv') {
            globalquestype = 'ftv';
            const verseText = selVerses[cnum].verse;
            const words = verseText.split(' ');
            const first_5 = words.slice(0, 5);
            ftvTriggerI = findUniqueTriggerWord(words, verse_dict2, cnum , 5)[1];
            phars = first_5.join(' ')
            quest = words.slice(5).join(' ');
            delog(quest)
            if(quest) tChar = findTrigChar(verse_dict2, phars, 0, phars.split('').length)
            //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
              
            await delay_text(`Finish the Verse:`,'h4','quizHeader',0, 'purple', 5);
        } else if (ftv === 'quote') {
            globalquestype = 'quote';
            const verseData = selVerses[cnum];
            phars = verseData.ref;
            quest = verseData.verse;
            tChar = findTrigChar(verse_dict2, quest, 0)
            //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
            
            await delay_text(`${selVerses[cnum].numVerses} Verse Quote:`,'h4','quizHeader',0,'purple');
        } 
        else if(ftv ==='SQ:'){
             const aq = selVerses[cnum].verse
        selVerses[cnum].aq = aq
        globalquestype = 'sq';
        const getaq = selVerses[cnum].verse.split('?');
        QUEST = getaq[0];
        ANS = getaq[1];
        phars = `${QUEST}?`;
        selVerses[cnum].verse = QUEST;
        QUEST = QUEST.split(' ')
        tChar = findTrigChar(question_dict2, QUEST.join(' '), 0, QUEST.join(' ').split('').length)
        ftvTriggerI = findUniqueTriggerWord(QUEST, question_dict2, cnum , QUEST.length)[1];
        QUEST = QUEST.join(' ');
        if(!ANS){
            manageModal('Opps a error happen please reset error code(ANS404)')
        }
        `if(ANS.includes('(')){
          const sA =  ANS.split('(');
          ANS2 = sA[1];
          ANS = sA[0];
        }
        if(ANS.includes('[')){
            ANS =  ANS.split('[')[0]
            
          }`
        //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
        await delay_text(`Situation Question:`,'h4','quizHeader',0,'purple');
        

        }
        else if(ftv === 'According to'){
             const aq = selVerses[cnum].verse
        selVerses[cnum].aq = aq
        globalquestype = 'at';
        const getaq = selVerses[cnum].verse.split('?');
        QUEST = getaq[0];
        ANS = getaq[1];
        phars = `According To: ${QUEST}?`;
        selVerses[cnum].verse = QUEST;
        QUEST = QUEST.split(' ')
        tChar = findTrigChar(question_dict2, QUEST.join(' '), 0, QUEST.join(' ').split('').length)
        //ftvTriggerI = findUniqueTriggerWord(QUEST, question_dict2, cnum , QUEST.length)[1];
        QUEST = QUEST.join(' ');
        
        if(!ANS){
            manageModal('Opps a error happen please reset; error code(ANS404)')
        }
        
        //trigChar = findUniqueTriggerWord(QUEST.split(''), question_dict2, cnum , QUEST.length)[1];
        await delay_text(`Question`,'h4','quizHeader',0,'purple');
        
        }
        else if(ftv === 'question'){
        const aq = selVerses[cnum].verse
        selVerses[cnum].aq = aq
        globalquestype = 'q';
        const getaq = selVerses[cnum].verse.split('?');
        QUEST = getaq[0];
        ANS = getaq[1];
        phars = `${QUEST}?`;
        selVerses[cnum].verse = QUEST;
        QUEST = QUEST.split(' ')
        tChar = findTrigChar(question_dict2, QUEST.join(' '), 0, QUEST.join(' ').split('').length)
        ftvTriggerI = findUniqueTriggerWord(QUEST, question_dict2, cnum , QUEST.length)[1];
        QUEST = QUEST.join(' ');
        if(!ANS){
            manageModal('Opps a error happen please reset error code(ANS404)')
        }
        
          
        //trigChar = findUniqueTriggerWord(QUEST.join(' ').split(''), question_dict2, cnum , QUEST.length)[1];
        await delay_text(`Question`,'h4','quizHeader',0,'purple');
        
        }
        else {
console.log('failed at new', ftv)
        }

         }
         startTimer = false;
         delog(tChar);
        await delay_text(`${phars}`, 'p', 'quizHeader', speed, 'black', ftvTriggerI, tChar);
        
        // Update the progress bar after a new question is loaded
        return quest, phars;
    };


    function setupDropZone(containerId) {
        
        const container = document.getElementById(containerId);
        //clear all child blocks
        if(dragEnabled === false){
            
container.style.display = 'none';
            return}

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
        return container;
    }
    

//delog('random words', randwords);
    // This function initializes the draggable word blocks for the quiz.
    function setupDropZone(containerId) {
        
        const container = document.getElementById(containerId);
        //clear all child blocks
        if(dragEnabled === false){
            
container.style.display = 'none';
            return}

        // Re-adding the drag-and-drop event listeners for the container.
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
        return container;
    }
    

// This function initializes the clickable and draggable word blocks for the quiz.
function dragElements(){
    if(dragEnabled === false){setupDropZone('verse-con');
        setupDropZone('versedrop');
    return
 };

    // Get the container for the draggable words.
    const draggableContainer = document.getElementById('verse-con');
    const dropContainer = document.getElementById('versedrop');
    
    // Split the verse into individual words to create separate buttons.
    const rnum = Math.floor(Math.random() * 3 + 1);
    let blocks;
    if(selVerses[cnum].type != 'ftv/quote'){
        blocks = ANS.split(' ');
        blocks = manageAnswer(blocks, true)[0]
    selVerses.forEach(itemSelected => {
        const randWord = shuffleArray(itemSelected.verse.split(' '), true)[0];
        randwords.push(randWord);
    });
    delog('random words', randwords);
for(let i =0; i < rnum; i++){
    
    let randWORD = shuffleArray(randwords, true)[0];
    blocks.push(randWORD);
    delog('random word added', randWORD)

};
    }else{
        blocks = quest.split(' ')
    }

    blocks = shuffleArray(blocks);
    let idIndex = 0;
    delog('block' , blocks)
    // Iterate over each word block to create a new button element.
    blocks.forEach(block => {
        // Create a new button for each word.
        const button = document.createElement('button');
        // Set the text content of the button, adding a space for separation.
        if(block != ''){
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
        if(block.textContent != '  '){
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
    setupDropZone('verse-con');
    setupDropZone('versedrop');

    // Add a listener to the new button to log IDs.
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
    if(selVerses[cnum].type === 'ftv/quote'){
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
    }else
    
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
};
}

            const startButton = id('startQuizButton');
            startButton.addEventListener('click', async (event) => {
                event.preventDefault();
                const clientAnswersLength = Object.keys(clientanswers).length;
                answers = [];
                correctCount = 0;
                if(!verse_dict || !question_dict || !readyLoad){
                    manageModal('Content is still loading please wait a moment')
                    return //show a friendly wait message and have the user reclick the start button 
                    
                }
                
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
                    quizSettings.speed_tOf_text = parseFloat(speed_tOf_text.value);}
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
             quizSettings.quizMode = selquizMode;
             if (quizSettings.quizMode.includes('ftv') || quizSettings.quizMode.includes('quote')) {
                // If the array includes either 'ftv' or 'quote', push the combined mode.
                selquizMode.push('ftv/quote');
            }
            quizSettings.quizMode = selquizMode;
                console.log('Quiz Settings Saved:', quizSettings);
                next.style.display = 'none';
                

                
                if (quizSettings.numQuestions > 100 || quizSettings.numQuestions === 0)
                { quizSettings.numQuestions = 20}
                if(typeof(quizSettings.numQuestions) != 'number')  { quizSettings.numQuestions = 100}
                if(typeof(quizSettings.lenOfTimer) != 'number')  { quizSettings.lenOfTimer = 0}
                
                async function Selectdata(){
                

                    
                    if(dragEnabled){
                        ver.style.display = 'none';
                    }
                if (selverses){
                    delog(question_dict, 'frist vd')
                    verse_dict = {...verse_dict, ...question_dict}
                    delog(verse_dict, 'Vers dict after add')

                    selVerses = Object.values(verse_dict).filter(Verse =>{
                        
                       
                        const Test =  quizSettings.months.includes(Verse.month) && quizSettings.flights.includes(Verse.flight) && quizSettings.quizMode.includes(Verse.type) && Verse.verse;
                     if(Test){
                        return Test
                     }else{
                        //delog(Verse)
                     }
                    });
                    
                    }else{
                        quizSettings.numQuestions = clientAnswersLength;
                        selVerses = [];
                        Object.keys(clientanswers).forEach(key => {
    if (typeof key === 'string') {
        const typeref = key.split('@');
        if (typeref.length === 3) {
            const type3 = typeref[0];
            const ref3 = typeref[1]                                                                                                                                                                           
            const numv3 = typeref[2];
            const verseObj = Object.values(verse_dict).find(Verse => Verse.ref === ref3 && Verse.type === type3);
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

}

return;
                    };
        async function WaitForLoad(){
            

        await Selectdata();
        async function loadgen(){
            if(genQuiz){
                let F;
                let Q;
                if(quizSettings.flights === 'T'){
                    Q = 3;
                    F = 2
                    
                }else if(quizSettings.flights === 'C'){
                    Q = 2;
                    F = 3
                    
                } else if(quizSettings.flights === 'B'){
                    Q = 2;
                    F = 3
                    
                } else if(quizSettings.flights === 'A'){
                    Q = 2;
                    F = 3
                    
                } 
                 await generateQuiz();
                return
            }else{
                return
            }
        }
        await loadgen()
delog(selVerses, 'selverses')
    
    speeddetext = quizSettings.speed_tOf_text;
    Time = quizSettings.lenOfTimer
    running = true
    async function loadVerseDicts (){
        verse_dict2 = selVerses.filter(itemsel2=>{
         return itemsel2.type === 'ftv/quote'
      })
      delog('question_dict','2')
       question_dict2 = selVerses.filter(itemsel=>{
          return itemsel.type !== 'ftv/quote'
      })
      delog(question_dict2, verse_dict2);
  };

  await loadVerseDicts();
   if (quizSettings.verseSelection === "random") {
            selVerses = shuffleArray(selVerses);
        } 
       
         await new_quote(
        quizSettings.quizMode,
        quizSettings.numQuestions,
        quizSettings.verseSelection, speeddetext)
        progressBar.style.width = '0%';
        delog(selVerses)
        dragElements();
        //generateQuiz(2, 3, 20)
        if (quizSettings.lenOfTimer === 0){ timerbtn.style.display = 'none'} else{
                quiztimer(Time)} 
                return;
        }
        
                
        await WaitForLoad();

                 Start();
                 return;
            });

            btnTOModal.addEventListener('click', () =>{
                    manageModal(`<div class="option-section">
                <h3 class="section-title">Set Quiz Settings</h3>
                <h3 class="section-title">Speed of Text (In Milliseconds)</h3>
                <div class="range-display-container">
                    <!-- This is your existing range input. -->
                    <input type="range" id="speed1" name="numQuestions" value="0" min="0" max="4000">
                    <!-- Add a new span element to display the current value. -->
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
                </div>`
            , true);
           
           
            const speedInput1 = id('speed1'); // Gets the range input element.
            const speedValueSpan1 = id('speedValue1'); // Gets the span element to display the value.
            `speedValueSpan1.textContent = speeddetext;
            speedValueSpan1.value = speeddetext;
            id(secs1).value = Time;`
            if(dragEnabled){
            
            id('d').checked = true
            id('t').checked = false
                    }else{
                    id('t').checked = true
                    id('d').checked = false
            }
            // Listen for the 'input' event, which fires continuously as the slider is moved.
            speedInput1.addEventListener('input', (event) => {
                // Update the text content of the span with the current value of the input.
                speedValueSpan1.textContent = event.target.value;
            });
            })
            
                                        
            next.addEventListener("click", async () => {
                upNumQ();
                submitButton.style.display = 'block';
                updateProgressBar();
                counterToMax += 1;

                 if(selVerses[cnum].type != 'ftv/quote') selVerses[cnum].verse = selVerses[cnum].aq;
                
                await new_quote(
                    quizSettings.quizMode,
                    quizSettings.numQuestions,
                    quizSettings.verseSelection, speeddetext)
                    //progressBar.style.width = '0%';
                    //delog(selVerses)
                    dragElements();
                    //generateQuiz(2,3,20)
                    if (quizSettings.lenOfTimer === 0){ timerbtn.style.display = 'none'} else{
                            quiztimer(Time)
                        } 
                    
            });

            
        }
    };


})();
quizApp.start(); 

//-- why are LOOKING at my code you are not allowed to read this message so u must tun an d i will kill u inn ur sllp imenat sllep no sllepp no sleep 


//----------------------------quizApp.start(); 



