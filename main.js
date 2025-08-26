
    
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
    const quotesFTVs = `Matthew 1:21 C Quote/FTV She will bear a son, and you shall call his name Jesus, for he will save his people from their sins.
Matthew 1:22-23 A Quote/FTV All this took place to fulfill what the Lord had spoken by the prophet: "Behold, the virgin shall conceive and bear a son, and they shall call his name Immanuel" (which means, God with us).
Matthew 2:06 T Quote/FTV "And you, O Bethlehem, in the land of Judah, are by no means least among the rulers of Judah; for from you shall come a ruler who will shepherd my people Israel.'"
Matthew 2:10 C Quote/FTV When they saw the star, they rejoiced exceedingly with great joy.
Matthew 2:11 B Quote/FTV And going into the house, they saw the child with Mary his mother, and they fell down and worshiped him. Then, opening their treasures, they offered him gifts, gold and frankincense and myrrh.
Matthew 2:23 A Quote/FTV And he went and lived in a city called Nazareth, so that what was spoken by the prophets might be fulfilled, that he would be called a Nazarene.
Matthew 3:03 C Quote/FTV For this is he who was spoken of by the prophet Isaiah when he said, "The voice of one crying in the wilderness: 'Prepare the way of the Lord; make his paths straight.'"
Matthew 3:11 T Quote/FTV "I baptize you with water for repentance, but he who is coming after me is mightier than I, whose sandals I am not worthy to carry. He will baptize you with the Holy Spirit and fire.
Matthew 3:16-17 A Quote/FTV And when Jesus was baptized, immediately he went up from the water, and behold, the heavens were opened to him, and he saw the Spirit of God descending like a dove and coming to rest on him; and behold, a voice from heaven said, "This is my beloved Son, with whom I am well pleased."
Matthew 3:17 B Quote/FTV and behold, a voice from heaven said, "This is my beloved Son, with whom I am well pleased.
Matthew 4:04 B Quote/FTV But he answered, "It is written, "'Man shall not live by bread alone, but by every word that comes from the mouth of God.'"
Matthew 4:10 T Quote/FTV Then Jesus said to him, "Be gone, Satan! For it is written, "'You shall worship the Lord your God and him only shall you serve.'"
Matthew 4:16 A Quote/FTV the people dwelling in darkness have seen a great light, and for those dwelling in the region and shadow of death, on them a light has dawned."
Matthew 4:17 B Quote/FTV From that time Jesus began to preach, saying, "Repent, for the kingdom of heaven is at hand."
Matthew 4:19 C Quote/FTV And he said to them, "Follow me, and I will make you fishers of men."
Matthew 4:23 A Quote/FTV And he went throughout all Galilee, teaching in their synagogues and proclaiming the gospel of the kingdom and healing every disease and every affliction among the people.
Matthew 5:06 B Quote/FTV Blessed are those who hunger and thirst for righteousness, for they shall be satisfied.
Matthew 5:16 C Quote/FTV In the same way, let your light shine before others, so that thay may see your good works and give glory to your Father who is in heaven.
Matthew 5:18 T Quote/FTV For truly, I say to you, until heaven and earth pass away, not an iota, not a dot, will pass from the Law until all is accomplished.
Matthew 5:44-45 T Quote/FTV But I say to you, Love your enemies and pray for those who persecute you, so that you may be sons of your Father who is in heaven. For he makes his sun rise on the evil and on the good, and sends rain on the just and on the unjust.
Matthew 6:09-10 B Quote/FTV Pray then like this: "Our Father in heaven, hallowed be your name. Your kingdom come, your will be done, on earth as it is in heaven.
Matthew 6:11-13 A Quote/FTV Give us this day our daily bread, and forgive us our debts, as we also have forgiven our debtors. And lead us not into temptation, but deliver us from evil.
Matthew 6:14-15 A Quote/FTV For if you forgive others their trespasses, your heavenly Father will also forgive you, but if you do not forgive others their trespasses, neither will your Father forgive your trespasses.
Matthew 6:19-20 T Quote/FTV "Do not lay up for yourselves treasures on earth, where moth and rust destroy and where thieves break in and steal, but lay up for yourselves treasures in heaven, were neither moth nor rust destroys and where thieves do not break in and steal.
Matthew 6:21 C Quote/FTV For where your treasure is, there your heart will be also.
Matthew 6:24 B Quote/FTV "No one can serve two masters, for either he will hate the one and love the other, or he will be devoted to the one and despise the other. You cannot serve God and money.
Matthew 6:33 C Quote/FTV But seek first the kingdom of God and his righteousness, and all these things will be added to you.
Matthew 6:34 B Quote/FTV "Therefore do not be anxious about tomorrow, for tomorrow will be anxious for itself. Sufficient for the day is its own trouble.
Matthew 7:05 A Quote/FTV You hypocrite, first take the log out of your own eye, and then you will see clearly to take the speck out of your brother's eye.
Matthew 7:07 B Quote/FTV "Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.
Matthew 7:12 C Quote/FTV So whatever you wish that others would do to you, do also to them, for this is the Law and the prophets.
Matthew 7:13-14 A Quote/FTV "Enter by the narrow gate. For the gate is wide and the way is easy that leads to destruction, and those who enter by it are many. For the gate is narrow and the way is hard that leads to life, and those who find it are few.
Matthew 7:21 T Quote/FTV "Not everyone who says to me, 'Lord, Lord,' will enter the kingdom of heaven, but the one who does the will of my Father who is in heaven.
Matthew 7:24-25 A Quote/FTV Everyone then who hears these words of mine and does them will be like a wise man who built his house on the a rock. And the rain fell, and the floods came, and the winds blew and beat on that house, but it did not fall, because it had been founded on the rock.
Matthew 8:16-17 T Quote/FTV That evening they brought to him many who were oppressed by demons, and he cast out the spirits with a word and healed all who were sick. This was to fulfill what was spoken by the prophet Isaiah: "He took our illnesses and bore our diseases."
Matthew 8:27 C Quote/FTV And the men marveled, saying, "What sort of man is this, that even winds and sea obey him?"
Matthew 9:06 C Quote/FTV But that you may know that the Son of Man has authority on earth to forgive sins" - he then said to the paralytic - "Rise, pick up your bed and go home."
Matthew 9:12-13 T Quote/FTV But when he heard it, he said, "Those who are well have no need of a physician, but those who are sick. Go and learn what this means: 'I desire mercy, and not sacrifice.' For I came not to call the righteous, but sinners."
Matthew 9:36 B Quote/FTV When he saw the crowds, he had compassion for them, because they were harassed and helpless, like sheep without a shepherd.
Matthew 9:37-38 T Quote/FTV Then he said to his disciples, "The harvest is plentiful, but the laborers are few; therefore pray earnestly to the Lord of the harvest to send out laborers into his harvest.
Matthew 10:07 C Quote/FTV And proclaim as you go, saying, 'The kingdom of heaven is at hand.'
Matthew 10:07-08 A Quote/FTV And proclaim as you go, saying, 'The kingdom of heaven is at hand.' Heal the sick, raise the dead, cleanse lepers, cast out demons. You received without paying; give without pay.
Matthew 10:16 A Quote/FTV Behold, I am sending you out as sheep in the midst of wolves, so be wise as serpents and innocent as doves.
Matthew 10:22 A Quote/FTV and you will be hated by all for ny name's sake. But the one who endures to the end will be saved.
Matthew 10:28 T Quote/FTV And do not fear those who kill the body but cannot kill the soul. Rather fear him who can destroy both soul and body in hell.
Matthew 10:32-33 A Quote/FTV So everyone who acknowledges me before men, I also will acknowledge before my Father who is in heaven, but whoever denies me before men, I also will deny before my Father who is in heaven.
Matthew 10:38 B Quote/FTV And whoever does not take his cross and follow me is not worthy of me.
Matthew 11:28 C Quote/FTV Come to me, all who labor and are heavy laden, and I will give you rest.
Matthew 11:29 C Quote/FTV Take my yoke upon you, and learn from me, for I am gentle and lowly in heart, and you will find rest for your souls.
Matthew 11:30 B Quote/FTV For my yoke is easy, and my burden is light.
Matthew 11:04-05 T Quote/FTV And Jesus answered them, "Go and tell John what you hear and see: the blind receive their sight and the lame walk, lepers are cleansed and the deaf hear, and the dead are raised up, and the poor have good news preached to them.
Matthew 12:08 C Quote/FTV For the Son of Man is lord of the Sabbath.
Matthew 12:18 T Quote/FTV "Behold, my servant whom I have chosen, my beloved with whom my soul is well pleased. I will put my Spirit upon him, and he will proclaim justice to the Gentiles.
Matthew 12:35 B Quote/FTV The good person out of his good treasure brings forth good, and the evil person out of his evil treasure brings forth evil.
Matthew 12:36-37 T Quote/FTV I tell you, on the day of judgment people will give account for every careless word they speak, for by your words you will be justified, and by your words you will be condemned."
Matthew 12:40 C Quote/FTV For just as Jonah was three days and three nights in the belly of the great fish, so will the Son of Man be three days and three nights in the heart of the earth.
Matthew 12:41 B Quote/FTV The men of Ninevah will rise up at the judgment with this generation and condemn it, for they repented at the preaching of Jonah, and behold, something greater than Jonah is here.
Matthew 12:42 T Quote/FTV The queen of the South will rise up at the judgement with this generation and condemn it, for she came from the ends of the earth to hear the wisdom of Solomon, and behold, something greater than Solomon is here.
Matthew 12:50 B Quote/FTV For whoever does the will of my Father in heaven is my brother and sister and mother.
this is a missing quote why? idk
Matthew 13:13 B Quote/FTV This is why I speak to them in parables, because seeing they do not see, and hearing they do not hear, nor do they understand.
Matthew 13:17 A Quote/FTV For truly, I say to you, many prophets and righteous people longed to see what you see, and did not see it, and to hear what you hear, and did not hear it.
Matthew 13:20-21 A Quote/FTV As for what was sown on rocky ground, this is the one who hears the word and immediately receives it with joy, yet he has no root in himself, but endures for a while, and when tribulation or persecution arises on account of the word, immediately he falls away.
Matthew 13:22 A Quote/FTV As for what was sown among thorns, this is the one who hears the word, but the cares of the world and the deceitfulness of riches choke the word, and it proves unfruitful.
Matthew 13:23 C Quote/FTV As for what was sown on good soil, this is the one who hears the word and understands it. He indeed bears fruit and yields, in one case a hundredfold, in another sixty, and in another thirty.
Matthew 13:30 T Quote/FTV Let both grow together until the harvest, and at harvest time I will tell the reapers, "Gather the weeds first and bind them in bundles to be burned, but gather the wheat into my barn."
Matthew 13:31-32 T Quote/FTV He put another parable before them, saying, "The kingdom of heaven is like a grain of mustard seed that a man took and sowed in his field. It is the smallest of all seeds, but when it has grown it is larger than all the garden plants and becomes a tree, so that the birds of the air come and make nests in its branches."
Matthew 13:34 C Quote/FTV All these things Jesus said to the crowds in parables; indeed, he said nothing to them without a parable.
Matthew 13:35 A Quote/FTV This was to fulfill what was spoken by the prophet: "I will open my mouth in parables; I will utter what has been hidden since the foundation of the world."
Matthew 13:44 C Quote/FTV The kingdom of heaven is like treasure hidden in a field, which a man found and covered up. Then in his joy he goes and sells all that he has and buys that field.
Matthew 13:45-46 B Quote/FTV Again, the kingdom of heaven is like a merchant in search of fine pearls, who, on finding one pearl of great value, went and sold all that he had and bought it.
Matthew 13:52 T Quote/FTV And he said to them, "Therefore every scribe who has been trained for the kingdom of heaven is like a master of a house, who brings out of his treasure what is new and what is old."
Matthew 13:57-58 B Quote/FTV And they took offense at him. But Jesus said to them, "A prophet is not without honor except in his hometown and in his own household." And he did not do many works there, because of their unbelief.
Matthew 13:58 C Quote/FTV And he did not do many mighty works there, because of their unbelief.
Matthew 14:14 B Quote/FTV When he went ashore he saw a great crowd, and he had compassion on them and healed their sick.
Matthew 14:16 C Quote/FTV But Jesus said, "They need not go away; you give them something to eat."
Matthew 14:20 A Quote/FTV And they all ate and were satisfied. And they took up twelve baskets full of the broken pieces left over.
Matthew 14:27 B Quote/FTV But immediately Jesus spoke to them, saying, "Take heart; it is I. Do not be afraid."
Matthew 14:32-33 T Quote/FTV And when they got into the boat, the wind ceased. And those in the boat worshiped him, saying., "Truly you are the Son of God."
Matthew 14:35-36 T Quote/FTV And when the men of that place recognized him, they sent around to all that region and brought to him all who were sick and implored him that they might only touch the fringe of his garment. And as many as touched it were made well.
Matthew 15:07-08 A Quote/FTV You hypocrites! Well did Isaiah prophesy of you, when he said: "'This people honors me with their lips, but their heart is far from me; in vain do they worship me, teaching as doctrines the commandments of men.'"
Matthew 15:10-11 A Quote/FTV And he called the people to him and said to them, "Hear and understand: It is not what goes into the mouth that defiles a person, but what comes out of the mouth; this defiles a person."
Matthew 15:14 B Quote/FTV Let them alone; they are blind guides. And if the blind lead the blind, both will fall into a pit.
Matthew 15:19-20 T Quote/FTV For out of the heart come evil thoughts, murder, adultery, sexual immorality, theft, false witness, slander. These are what defile a person. But to eat with unwashed hands does not defile anyone.
Matthew 15:30-31 T Quote/FTV And great crowds came to him, bringing with them the lame, the blind, the crippled, the mute, and many others, and they put them at his feet, and he healed them, so that the crowd wondered, when they saw the mute speaking, the crippled healthy, the lame walking, and the blind seeing. And they glorified the God of Israel.
Matthew 15:32 T Quote/FTV Then Jesus called his disciples to him and said, "I have compassion on the crowd because they have been with me now three days and have nothing to eat. And I am unwilling to send them away hungry, lest they faint on the way."
Matthew 15:37 C Quote/FTV And they all ate and were satisfied. And they took up seven baskets full of the broken pieces left over.
Matthew 15:38 B Quote/FTV Those who ate were four thousand men, besides women and children.
Matthew 16:04 A Quote/FTV An evil and adulterous generation seeks for a sign, but no sign will be give to it except the sign of Jonah." So he left them and departed.
Matthew 16:06 B Quote/FTV Jesus said to them, "Watch and beware of the leaven of the Pharisees and Sadducees.
Matthew 16:12 B Quote/FTV Then they understood that he did not tell them to beware of the leaven of bread, but of the teaching of the Pharisees and Sadducees.
Matthew 16:16 C Quote/FTV Simon Peter replied, "You are the Christ, a Son of the living God."
Matthew 16:18 B Quote/FTV And I tell you, you are Peter, and on this rock I will build my church, and the gates of hell shall not prevail against it.
Matthew 16:19 T Quote/FTV I will give you the keys of the kingdom of heaven, and whatever you bind on earth shall be bound in heaven, and whatever you loose on earth shall be loosed in heaven.
Matthew 16:21 T Quote/FTV From that time Jesus began to show his disciples that he must go to Jerusalem and suffer many things from the elders and chief priests and scribes, and be killed, and on the third day be raised.
Matthew 16:23 A Quote/FTV But he turned and said to Peter, "Get behind me, Satan! You are a hindrance to me. For you are not setting your mind on the things of God, but on the things of man."
Matthew 16:24 C Quote/FTV Then Jesus told his disciples, "If anyone would come after me, let him deny himself and take up his cross and follow me.
Matthew 16:25 C Quote/FTV For whoever would save his life will lose it, but whoever loses his life for my sake will find it.
Matthew 16:26 C Quote/FTV For what will it profit a man if he gains the whole world and forfeits his soul? Or what shall a man give in return for his soul?
Matthew 16:27 A Quote/FTV For the Son of Man is going to come with his angels in the glory of his Father, and then he will repay each person acording to what he has done.
Jonah 1:09 C Quote/FTV And he said to them, "I am a Hebrew, and I fear the LORD, the God of heaven, who made the sea and the dry land."
Jonah 1:16 B Quote/FTV Then the men feared the LORD exceedingly, and they offered a sacrifice to the LORD and made vows.
Jonah 1:17 C Quote/FTV And the LORD appointed a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights.
Jonah 2:07 B Quote/FTV When my life was fainting away, I remembered the LORD, and my prayer came to you, into your holy temple.
Jonah 2:08 C Quote/FTV Those who pay regard to vain idols forsake their hope of steadfast love.
Jonah 2:09 B Quote/FTV But I with the voice of thanksgiving will sacrifice to you; what I have vowed I will pay. Salvation belongs to the LORD.
Jonah 3:03 B Quote/FTV So Jonah arose and went to Ninevah, according to the word of the LORD. Now Ninevah was an exceedingly great city, three days' journey in breadth.
Jonah 3:05 C Quote/FTV And the people of Ninevah believed God. They called for a fast and put on sackcloth, from the greatest of them to the least of them.
Jonah 3:10 B Quote/FTV When God saw what they did, how they turned from their evil way, God relented of the disaster that he had said he would do to them, and he did not do it.
Jonah 4:2b C Quote/FTV for I knew that you are a gracious God and merciful, slow to anger and abounding in steadfast love, and relenting from disaster.
Matthew 5:11-12 T Quote/FTV Blessed are you when others revile you and persecute you and utter all kinds of evil against you falsely on my account. Rejoice and be glad, for your reward is great in heaven, for so they persecuted the prophets who were before you.
Matthew 5:13 A Quote/FTV You are the salt of the earth, but if salt has lost its taste, how shall its saltiness be restored? It is no longer good for anything except to be thrown out and trampled under people's feet.
Matthew 5:14-15 A Quote/FTV You are the light of the world. A city set on a hill cannot be hidden. Nor do people light a lamp and put it under a basket, but on a stand, and it gives light to all in the house.
Matthew 5:17 T Quote/FTV Do not think that I have come to abolish the Law or the Prophets; I have not come to abolish them but to fulfill them.
Matthew 5:23-24 A Quote/FTV So if you are offering your gift at the altar and there remember that your brother has something against you, leave your gift there before the altar and go. First be reconciled to your brother, and then come and offer your gift.
Matthew 5:37 T Quote/FTV Let what you say be simply 'Yes' or 'No'; anything more than this comes from evil.
Matthew 6:03-04 T Quote/FTV But when you give to the needy, do not let your left hand know what your right hand is doing, so that your giving my be in secret. And your Father who sees in secret will reward you.
Matthew 6:25 A Quote/FTV Therefore I tell you, do not be anxious about your life, what you will eat or what you will drink, nor about your body, what you will put on. Is not life more than food, and the body more than clothing?
Matthew 7:01-02 T Quote/FTV Judge not, that you be not judged. For with the judgment you pronounce you will be judged, and with the measure you use it will be measured to you.
Matthew 7:26-27 A Quote/FTV And everyone who hears these words of mine and does not do them will be like a foolish man who built his house on the sand. And the rain fell, and the floods came, and the winds blew and beat against that house, and it fell, and great was the fall of it.`;
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
    const data = quotesFTVs.trim().split("\n"); // spilts by new lines
    const verse_dict = {}; // place to store all the data
    let c = 0;// counter
    let selVerses =[];
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

            verse_dict[c] = {
                flight: flight1,
                verse: verse1,
                ref: ref1,
                month: monthName,
                type: 'ftv/quote',
                numVerses: numverses
            };



        }
    }


        console.log(verse_dict[1].ref);
        console.log(verse_dict);
        console.log(verse_dict[2].numVerses);
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