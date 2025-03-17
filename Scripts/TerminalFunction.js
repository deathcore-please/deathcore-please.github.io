
// All previous outputs from commands and such
let OutputsText = "";
// Lets user scroll through the past outputs
let ScrollOffset = 0;

// String to store the current text input
let InputText = "";
// Dictionary to store info about the text blinker
let Blinker = {Index: 0, Time: Date.now() * 0.001};

// Current directory
let Directory = "C:/Users/guest";

// Stores weather to render plasma or normal terminal
let DisplayPlasma = false;

// Function to give text for rendering
function GetText()
{
    // Text to be displayed
    let FinalText = "";

    if (Time < 5 || OutputsText.split("\n").length < 19) // If in boot sequence
    {
        BootSequence();
        FinalText = OutputsText;
    }

    else if (!DisplayPlasma) // If not in boot sequence
    {
        // Trim the previous output to be displayed
        let Lines = OutputsText.split("\n");
        FinalText += Lines.slice(ScrollOffset, Math.min(ScrollOffset + 30, Lines.length)).join("\n");

        // Check if command input is on screen
        if (ScrollOffset + 30 >= Lines.length)
        {
            if ((Date.now() * 0.001 - Blinker.Time) % 1 < 0.5) // Show blinker
            {
                FinalText += `${Directory}> ${InputText.slice(0, Blinker.Index)}█${InputText.slice(Blinker.Index + 1, InputText.length)}`;
            }

            else // Dont show blinker
            {
                FinalText += `${Directory}> ${InputText}`;
            }
        }
    }

    else
    {
        return GetTextPlasma();
    }

    return FinalText;
}

// Function to handle key press and text input
function KeyPressed(key)
{
    if (DisplayPlasma)
    {
        if (key === "Escape")
        {
            DisplayPlasma = false;
        }
    }

    else if (Time > 5)
    {
        let LinesCount = OutputsText.split("\n").length;

        if (key.length === 1 && InputText.length + Directory.length + 3 < 55) // Add character
        {
            InputText = InputText.slice(0, Blinker.Index) + key.toLowerCase() + InputText.slice(Blinker.Index, InputText.length);
            Blinker = {Index: Blinker.Index + 1, Time: Date.now() * 0.001}; // Update blinker pos and reset its time
            if (ScrollOffset < LinesCount - 30) {ScrollOffset = Math.max(0, LinesCount - 30);} // Reset the scroll if off screen
        }
        
        else if (key === "Backspace" && InputText && Blinker.Index > 0) // Remove character
        {
            InputText = InputText.slice(0, Blinker.Index - 1) + InputText.slice(Blinker.Index, InputText.length);
            Blinker = {Index: Blinker.Index - 1, Time: Date.now() * 0.001}; // Update blinker pos and reset its time
            if (ScrollOffset < LinesCount - 30) {ScrollOffset = Math.max(0, LinesCount - 30);} // Reset the scroll if off screen
        }

        else if (key === "ArrowLeft") // Move blinker left
        {
            Blinker = {Index: Math.max(0, Blinker.Index - 1), Time: Date.now() * 0.001};
        }

        else if (key === "ArrowRight") // Move blinker right
        {
            Blinker = {Index: Math.min(InputText.length, Blinker.Index + 1), Time: Date.now() * 0.001};
        }

        else if (key === "ArrowUp") // Scroll text upwards
        {
            ScrollOffset = Math.max(0, ScrollOffset - 1);
        }

        else if (key === "ArrowDown") // Scroll text downwards
        {
            ScrollOffset = Math.min(LinesCount - 1, ScrollOffset + 1);
        }

        else if (key === "Tab") // Auto complete
        {
            AutoComplete(); // Complete input text
            Blinker = {Index: InputText.length, Time: Date.now() * 0.001}; // Update blinker pos and reset its time
            if (ScrollOffset < LinesCount - 30) {ScrollOffset = Math.max(0, LinesCount - 30);} // Reset the scroll if off screen
        }

        else if (key === "Enter") // Submit text
        {
            OutputsText += `${Directory}> ${InputText}\n`;
            ExecuteCommand();

            InputText = "";
            Blinker = {Index: 0, Time: Date.now() * 0.001};

            LinesCount = OutputsText.split("\n").length;
            if (ScrollOffset < LinesCount - 30) {ScrollOffset = Math.max(0, LinesCount - 30);}
        }
    }
}

function BootSequence()
{
    OutputsText = "";
    let LoadingChars = ["-", "\\", "|", "/"];
    if (Time > 0.1) { OutputsText += "█           ██████╗  █████╗  ██████╗  █████╗          █  \n"; }
    if (Time > 0.3) { OutputsText += "█           ██╔══██╗██╔══██╗██╔══██╗██╔════╝          █  \n"; }
    if (Time > 0.5) { OutputsText += "█  . . . .  ██████╔╝███████║██████╔╝█████╗   . . . .  █  \n"; }
    if (Time > 0.7) { OutputsText += "█           ██╔══██╗██╔══██║██╔═══╝  ╚═══██╗          █  \n"; }
    if (Time > 0.9) { OutputsText += "█           ██║  ██║██║  ██║██║ ██████████╔╝          █  \n"; }
    if (Time > 1.1) { OutputsText += "█           ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════════╝           █  \n\n\n"; }

    if (Time > 1.1) {OutputsText += "Welcome to uranium_potato-OS 2.9.0 x86_64\n";}
    if (Time > 1.2) {OutputsText += "Type 'help' to list available commands\n\n\n";}
    if (Time > 1.7) {OutputsText += `Loading ${LoadingChars[Math.ceil((Math.min(3.7, Time) % 0.4) / 0.1) - 1]} ${Math.ceil(Math.min(100, (Time - 1.7) / 0.02))}%\n`;}
    if (Time > 3.7) {OutputsText += ".\n";}
    if (Time > 3.8) {OutputsText += ".\n";}
    if (Time > 3.9) {OutputsText += ".\n";}
    if (Time > 4.0) {OutputsText += "Complete!\n\n";}

    ScrollOffset = Math.min(OutputsText.split("\n").length - 1, ScrollOffset);
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

// File system structure (unchanged)
const FileSystem = {
    "root": {type: "directory", contents: {

        "projects": {type: "directory", contents: {
            "projects.txt": {type: "file", content: "This folder contains links to some of the projects I\nhave developed over my 5+ years of coding. This is just\na small selection of the many projects I've worked on,\nwith several others not making the list. Please note\nthat some of these projects are unfinished—either\nbecause I lacked the necessary skills at the time or\nsimply moved on to more interesting challenges.\nHowever, rest assured I plan to revisit and polish these\nprojects in the future, improving their code with my\ncurrent level of expertise. Some projects might not be\nup on GitHub for various reasons, in which case I will\nprovide alternate links to know more about these\nprojects. Some projects' details are also mentioned in\n'C:/Users/guest/skills'."},
            "object_detector.lnk": {type: "link", content: "https://github.com/deathcore-please/YOLOv8-GUI"},
            "project_wordle.lnk": {type: "link", content: "https://github.com/deathcore-please/Wordle-A2C"},
            "guinea_pig.lnk": {type: "link", content: "https://www.instagram.com/p/CKyzZ4wnPSy/"},
            "personal_website.lnk": {type: "link", content: "https://github.com/deathcore-please/deathcore-please.github.io"},
            "reward_system.lnk": {type: "link", content: "https://gitlab.com/interview-project2311410/reward-system"},
            "adventure_catto.lnk": {type: "link", content: "adventure_catto.pdf"},
        }},
        "skills": {type: "directory", contents: {
            "python.txt": {type: "file", content: "I have primarily used Python in my projects, including\nmachine learning, game development, and web applications.\nIn my YOLOv8 Image Detector, I combined Python with\nOpenCV, PyTorch, and PyQT to create a standalone\napplication that detects objects in images, video\nfiles, and live camera feeds. In my Wordle Solver,\nI implemented a reinforcement learning model to play a\ncustom version of Wordle, using convolutional neural\nnetworks to process the game’s grid and training an\nagent with the advantage actor-critic algorithm. I also\nbuilt an Airline Delay Detection Model, where I used\nPython libraries such as NumPy, Pandas, and Matplotlib\nto process airline data and experiment with multiple\nsupervised learning models, including random forests,\nlogistic regression, and support vector machines."},
            "django.txt": {type: "file", content: "I worked with Django during my Software Development\nInternship at Osmosys Software Solutions, where I\ncontributed to the backend of a web application. I\ndeveloped REST APIs using Django’s REST framework\nand helped create microservices that communicated\nwith the front-end system. I used Postman to test API\nendpoints before integrating them into the system.\nOne of my tasks was to help develop an authentication\nsystem that used role-based access control to define\ndifferent levels of user permissions. I also worked on\nintegrating an AI-powered chatbot with a ChatGPT API,\nwhere Django was used to manage backend processes\nand store chat histories."},
            "webgl.txt": {type: "file", content: "This website that I have built is my entire WebGL2\nexperience on paper, although I dedicated a lot of\ntime into actually learning and practicing it. During\nmy practice, I have done quite a lot of small-scale\nprojects to experiment and explore WebGL2. After\nbuilding this project from pure self-learning with no\nacademic course on WebGL2, I am currently building\nmore advanced projects that are 3-D interactive models\non a much larger scale with the help of Unreal Engine\nand Unity."},
            "opencv.txt": {type: "file", content: "I used OpenCV extensively in my YOLOv8 Image Detector\nproject, where it was responsible for processing input\nimages and video feeds. I used OpenCV to handle\nreal-time image processing tasks such as resizing,\ncolor conversion, and feature extraction before\npassing the data to the YOLOv8 model for object\ndetection, segmentation, and pose estimation. The\napplication allowed users to upload an image or video\nfile or use their system camera to detect various\nobjects, such as humans, vehicles, and animals. I also\nintegrated OpenCV with PyQT to create an interactive\nuser interface that allowed users to adjust model\nsettings and view detection results."},
            "love2d.txt": {type: "file", content: "I developed Adventure Catto, a game built with LOVE2D\nand Lua, designed to teach young students how to code\nin Python through interactive gameplay. I used the\nTiled framework for level design and integrated\nlibraries such as Windfall for world-building and Cupid\nfor debugging. In addition to game development, I\nused this project as a controlled testing environment\nfor an AI agent that learned how to code in Python by\nplaying the game. I implemented reinforcement learning\ntechniques using Q-tables, allowing the agent to\nimprove its performance over multiple playthroughs."},
            "fpv.txt": {type: "file", content: "I have hands-on experience with FPV drones, both in\nhardware and research on autonomous drone racing.\nAs a Technology Associate at the Indian Flying\nCommunity, I worked with flight controllers using\nfirmware such as iNav, Betaflight, and KISS. I fine-tuned\nPID parameters to improve flight stability and performed\nfirmware updates on STM32-based controllers. I also\nworked on optimizing drone builds, ensuring clean wiring\nand minimal electrical interference. In addition to\nworking with physical drones, I conducted research on\nautomating FPV drone racing using machine learning.\nMy research involved reinforcement learning techniques\nsuch as Deep Q-Networks and Convolutional Neural\nNetworks to train drones to navigate racecourses\nefficiently."},
            "web_dev.txt": {type: "file", content: "During my Front-End Development Internship at DRDO,\nI developed an automated form submission system that\nimproved workflow efficiency by reducing the time\nrequired for data entry. I built the front-end interface\nusing HTML, CSS, and JavaScript, while MySQL was used\nfor backend storage. I also optimized form validation\nand submission processes, which reduced errors and\nimproved system response times. The final system\nprocessed submissions 24% faster than the previous\nmethod, and I documented the improvements in a\n24-page report. Also, this website that I've built uses\nHTML and CSS to build the modern-aesthetic look part\nof it with, what I feel, are pretty cute animations\nwhich are subtle yet aesthetic."},
            "mysql.txt": {type: "file", content: "I have worked with MySQL in several projects that\nrequired structured data storage. During my internship\nat DRDO, I used XAMPP and MySQL to store form\nsubmission data and created a system where HTML and\nSQL were linked to manage user inputs efficiently. In\nmy Airline Delay Detection Model, I worked with large\ndatasets containing flight records, cleaning and\nprocessing the data using Pandas and NumPy before\nstoring structured information in a MySQL database.\nI have also worked with SQLite and other relational\ndatabase management systems in different projects."},
            "pytorch.txt": {type: "file", content: "I used PyTorch in multiple machine learning projects,\nparticularly in reinforcement learning and deep\nlearning experiments. In my Wordle RL Solver, I used\nPyTorch to train an agent that learned how to play a\ncustom version of Wordle. I implemented a convolutional\nneural network to analyze the spatial structure of the\nWordle grid and trained the agent using an advantage\nactor-critic algorithm. I also used Random Network\nDistillation to encourage the agent to explore new game\nstates instead of repeating the same strategies. After\n80,000 training episodes, the agent achieved a stable\nreward range of 10.2 to 11.0, indicating that it had\nlearned an optimal policy."},
            "tensorflow.txt": {type: "file", content: "Although I prefer using PyTorch over TensorFlow for\nmost of my listed projects, my experience in deep\nlearning and reinforcement learning makes me familiar\nwith its functionalities. I have worked with deep\nlearning frameworks such as PyTorch, so I understand\nTensorFlow’s core components, including the Keras API\nfor neural network design, TensorFlow Datasets for\nhandling large datasets, and GPU acceleration for\ntraining models. If I work on a project that requires\nTensorFlow, I would be able to apply my understanding\nof deep learning architectures and model optimization\ntechniques pretty quickly."},

        }},

        "about.txt": {type: "file", content: "I am a software developer and machine learning engineer\nwith an MSc in Computer Science from the University of\nBath (finished as a valedictorian with a Distinction).\n\nMy expertise spans machine learning, deep learning,\nautomation, and reinforcement learning, with\napplications in computer vision, predictive analytics,\nand autonomous systems. I have developed object\ndetection models, AI-driven decision-making systems,\nand UAV control frameworks using tools like ROS2, DL,\nOpenCV, and PyTorch."},
        "experience.txt": {type: "file", content: "As a fresher, I have completed a few internships and\nresearch interests. A brief summary of each role below\ncan be found in my resume (start resume.lnk).\n\nThese roles are as follows:\n\n- Teaching Assistant, Bennett Uni (Jun 2022 – Jul 2023)\n- Research Assistant, Bennett Uni (Feb 2022 – Apr 2023)\n- Software Dev Intern, Osmosys (Mar 2022 - Jun 2022)\n- Technology Associate, IFC (Jan 2020 - Oct 2022)\n- Front End Intern, CABS/DRDO (Mar 2021 - Jul 2021)"},
        "research.txt": {type: "file", content: "My ability to actively engage in and contribute to\nwriting and publishing research papers has been aptly\nshowcased as I have been involved in writing and\npublishing research papers independently, with a recent\nsubmission titled --Machine Learning Based Approach in\nAutomating FPV Racing and Freestyle-- at Springer\npublications awaiting peer-review largely on my own\ninitiative with minimum supervision. This was a largely\nqualitative research with certain test results being\nquantitative, based on comparison studies and surveying\nexisting technology in AI and ML which are potent enough\nto be used in automating the niche field of FPV drones.\n\n Additionally, I am currently working on another paper,\n--Streamlining Multirotor Control Interface: Supporting\nSingle Handed Control for Independent Movement of Each\nAxis in 3-D Space--, which further demonstrates my\nresearch expertise in data collection, AI and working in\na multidisciplinary field. This is primarily a survey\nand proof-of-concept research that builds on a novel\nprototype"},
        "resume.lnk": {type: "link", content: "raps_resume_uk.pdf"},
        "plasma.exe": {type: "executable", content: "plasma"},
    }},
};

function ListFiles()
{
    // Move to current folder
    let DirectoryContents = FileSystem.root;
    for (let Dir of Directory.slice(15).split("/").filter(Boolean)) {DirectoryContents = DirectoryContents.contents[Dir];}

    // Print directory being listed
    OutputsText += `\nC:/../${Directory.split("/").slice(-1)}`;

    // Print each file
    const Files = Object.keys(DirectoryContents.contents);
    for (let [Index, File] of Files.entries()) {OutputsText += `\n${Index == Files.length - 1 ? "┗" : "┣"}${File.includes(".") ? "━▷" : "━━━━"} ${File}`;}

    OutputsText += "\n\n";
}

function ChangeDirectory(InputDirectory)
{
    let CurrentDirectory = Directory.slice(15).split("/").filter(Boolean);

    // Go back a folder
    if (InputDirectory === "..") {CurrentDirectory.pop();}
    
    // Return to root folder
    else if (InputDirectory === "/") {CurrentDirectory = [];}
    
    // Move to new folder
    else
    {
        // Move to current folder
        let DirectoryContents = FileSystem.root;
        for (let Dir of CurrentDirectory) {DirectoryContents = DirectoryContents.contents[Dir];}

        // Add new folder to path
        if (DirectoryContents.contents[InputDirectory] && DirectoryContents.contents[InputDirectory].type === "directory")
        {CurrentDirectory.push(InputDirectory);}
        
        // Desired path dousnt exist
        else {OutputsText += `\ncd: '${InputDirectory}' No such directory\n\n`;return;}
    }

    Directory = `C:/Users/guest${CurrentDirectory.length ? "/" : ""}${CurrentDirectory.join("/")}`;
}

function StartFile(InputFile)
{
    // Move to current folder
    let DirectoryContents = FileSystem.root;
    for (let Dir of Directory.slice(15).split("/").filter(Boolean)) {DirectoryContents = DirectoryContents.contents[Dir];}

    // Perform action based on what file is opened
    if (DirectoryContents.contents[InputFile] && DirectoryContents.contents[InputFile].type === "file")
    {
        OutputsText += `\n${DirectoryContents.contents[InputFile].content}\n\n`;
    }

    else if (DirectoryContents.contents[InputFile] && DirectoryContents.contents[InputFile].type === "link")
    {
        OutputsText += `\nRedirecting to '${DirectoryContents.contents[InputFile].content}'\n\n`;
        window.open(DirectoryContents.contents[InputFile].content);
    }

    else if (DirectoryContents.contents[InputFile] && DirectoryContents.contents[InputFile].type === "executable")
    {
        OutputsText += `\n'${InputFile}' Started successfully\n\n`;
        DisplayPlasma = true;
    }
    
    // Selected file dousnt exist
    else {OutputsText += `\nstart: '${InputFile}' No such file\n\n`;}
}

// Modified ExecuteCommand function
function ExecuteCommand()
{
    const [Command, ...Arguments] = InputText.split(" ");

    if (Command)
    {
        ComputerBeep.play();
        ComputerBeep.currentTime = 0;
    }

    switch (Command)
    {
        case "ls":
            if (Arguments.length) {OutputsText += "\nError: 'ls' doesn't accept any arguments\n\n";}
            else {ListFiles();}
            break;

        case "cd":
            if (Arguments.length > 1) {OutputsText += "\nError: 'cd' doesn't accept more that one argument\n\n";}
            else {ChangeDirectory(Arguments[0]);}
            break;

        case "start":
            if (Arguments.length > 1) {OutputsText += "\nError: 'start' doesn't accept more that one argument\n\n";}
            else {StartFile(Arguments[0]);}
            break;

        case "clear":
            if (Arguments.length) {OutputsText += "\nError: 'clear' doesn't accept any arguments\n\n";}
            else {BootSequence();}
            break;

        case "help":
            if (Arguments.length) {OutputsText += "\nError: 'help' doesn't accept any arguments\n\n";}
            else {OutputsText += "\nPress 'tab' for auto complete and press 'esc' to exit\na program (.exe file)\n\nLS       Lists current directory contents\nCD       Change directory, '..' moves back, '/' to root\nSTART    Opens specified file in current directory\nCLEAR    Clears all previous terminal outputs\nUP ARROW Scrolls the page up\nDOWN ARROW Scrolls the page down\n\n";}
            break;

        case "":
            break;

        default:
            OutputsText += `\nCommand not found '${Command}'\n\n`;
    }
}
  
// Autocomplete function
function AutoComplete()
{
    const [Command, ...Arguments] = InputText.split(" ");
    const CommandsList = ["ls", "cd", "start", "clear"];
    
    // Auto completing a command
    if (!Arguments.length)
    {
        const CompletededCommand = CommandsList.filter(Element => Element.startsWith(Command));
        if (CompletededCommand.length) {InputText = CompletededCommand[0]};
    }
  
    // Auto comepleting a file name
    if (["cd", "start"].includes(Command) && Arguments.length < 2)
    {
        // Move to current folder
        let DirectoryContents = FileSystem.root;
        for (let Dir of Directory.slice(15).split("/").filter(Boolean)) {DirectoryContents = DirectoryContents.contents[Dir];}

        // Possible file names
        const PossibleCompletions = Object.keys(DirectoryContents.contents).filter(Item => Item.startsWith(Arguments));
        if (PossibleCompletions.length) {InputText = `${Command} ${PossibleCompletions[0]}`;}
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

function GetTextPlasma()
{
    const Letters = [" ", "_", "a", "b", "c", "ö", "õ", "ö", "#", "$", "%", "1", "2", "3", "A", "B", "C"];
    let Text = "";

    for (let Row = 1; Row < 31; Row++)
    {
        for (let Col = 1; Col < 56; Col++)
        {
            const Intensity = GetIntensityPlasma(Row / 30, Col / 55);
            Text += Letters[Math.max(Math.min(Math.floor(Intensity) - 1, Letters.length - 1), 0)];
        }

        Text += "\n";
    }

    return Text
}

function GetIntensityPlasma(Row, Col)
{ 
    let Intensity = 0.0;

    Intensity += 0.7 * Math.sin(0.5 * Row + Time / 5);
    Intensity += 3 * Math.sin(1.6 * Col + Time / 5);
    Intensity += 1 * Math.sin(10 * (Col * Math.sin(Time / 2) + Row * Math.cos(Time / 5)) + Time / 2);

    const CyclicX = Row + 0.5 * Math.sin(Time / 2);
    const CyclicY = Col + 0.5 * Math.cos(Time / 4);

    Intensity += 0.4 * Math.sin(Math.sqrt(100 * CyclicX ** 2 + 100 * CyclicY ** 2 + 1) + Time);
    Intensity += 0.9 * Math.sin(Math.sqrt(75 * CyclicX ** 2 + 25 * CyclicY ** 2 + 1) + Time);
    Intensity += -1.4 * Math.sin(Math.sqrt(256 * CyclicX ** 2 + 25 * CyclicY ** 2 + 1) + Time);
    Intensity += 0.3 * Math.sin(0.5 * Col + Row + Math.sin(Time));

    return 17 * (0.5 + 0.499 * Math.sin(Intensity)) * (0.7 + Math.sin(Time) * 0.3);
}
