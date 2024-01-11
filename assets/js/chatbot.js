 // Define the necessary functions and constants here
 const apiBaseUrl = "https://api.jugalbandi.ai/query-with-langchain-gpt4"; // Replace with your actual API base URL
 const uuidNumber = "5f0f570c-a949-11ee-89c9-42004e494300"; // Replace with your actual UUID number
 const errorMessage =
   "My apologies, I'm not available at the moment, however, feel free to contact our support team.";

 // Add the loader HTML as a string
 const loader = (
   <span className="loader">
     <span className="loader__dot"></span>
     <span className="loader__dot"></span>
     <span className="loader__dot"></span>
   </span>
 );
 function Chatbot() {
   const chatbotMessageWindowRef = React.useRef(null);
   const [isOpen, setIsOpen] = React.useState(false);  
   const [isLoading, setLoading] = React.useState(false);
   const [inputValue, setInputValue] = React.useState("");
   const [messages, setMessages] = React.useState([
     {
       type: "ai",
       content:
         "Hi there 🖐. I’m JJM bot, your virtual assistant. I'm here to help with your general enquiries.You can also ask me in Indian languages.",
     },
   ]);

   // Example: Function to toggle chat using useState Hook
   function toggleChat() {
     setIsOpen((prevOpen) => !prevOpen);
   }

   // scroll to bottom
   const scrollToBottom = () => {
     if (chatbotMessageWindowRef.current) {
       chatbotMessageWindowRef.current.scrollTop =
         chatbotMessageWindowRef.current.scrollHeight;
     }
   };

   //remove typing messages from list
   const removeLoader = () => {
     setMessages(messages.filter((message) => message.loading !== true));
   };

   React.useEffect(() => {
     scrollToBottom();
   }, [messages]);

   React.useEffect(() => {
     if (isLoading) {
       aiMessage(loader, isLoading);
     }
     if (isLoading === false) {
       removeLoader();
     }
   }, [isLoading]);

   //send a message
   const sendMessage = () => {
     if (inputValue.trim() !== "") {
       userMessage(inputValue);
       send(inputValue);
       setInputValue("");
     }
   };

   const userMessage = (content) => {
     setMessages((prevMessages) => [
       ...prevMessages,
       {
         type: "user",
         content,
       },
     ]);
   };

   const send = (inputValue) => {
     setLoading(true);
     console.log(
       "url",
       `${apiBaseUrl}?query_string=${inputValue}&uuid_number=${uuidNumber}`
     );
     //call API here
     fetch(
       `${apiBaseUrl}?query_string=${inputValue}&uuid_number=${uuidNumber}`
     )
       .then((response) => {
         if (!response.ok) {
           throw new Error(errorMessage);
         }
         return response.json();
       })
       .then((response) => {
         // console.log("res", response);
         aiMessage(response.answer, isLoading);
       })
       .catch((e) => {
         aiMessage(errorMessage, isLoading);
         //console.log(e.message);
       })
       .finally(() => {
         setLoading(false);
       });
   };

   //AI message function
   const aiMessage = (content, loading) => {
     setMessages((prevMessages) => [
       ...prevMessages,
       {
         type: "ai",
         content,
         loading,
       },
     ]);
   };

   // Example: Render function
   return (
     <div className={`chatbot ${!isOpen ? "chatbot--closed" : ""}`}>
       <div className="chatbot__header_Icon">
         <img
           id="chatboticon"
           src="./assets/images/chat-bot-new--icon-final.gif"
           alt="assistant-avatar"
           style={{ width: 140 }}
           onClick={toggleChat}
         />
       </div>
       {/* Your chatbot JSX structure here */}
       <div className={`chatbot ${!isOpen ? "chatbot--closed" : ""}`}>
         <div className="chatbot__message-window">
           <div className="chatbot__header">
             <div className="assistTxt">
               How can i assist you?{" "}
               <span className="askQue">Ask Questions</span>
             </div>
             <span className="closeChatbot" onClick={toggleChat}>
               <i className="fa fa-times closeicon" aria-hidden="true"></i>
             </span>
           </div>
           <div
             className="chatbot__message-window"
             ref={chatbotMessageWindowRef}
           >
             <ul className="chatbot__messages">
               {messages.map((message, index) => (
                 <li
                   key={index}
                   className={`is-${message.type} animation ${
                     message.loading ? "is-loading" : ""
                   }`}
                 >
                   {message.type === "ai" && (
                     <div className="is-ai__profile-picture">
                       <img
                         src="https://jaljeevanmission.gov.in//themes/edutheme/images/jjm_new_logo.svg"
                         alt="assistant-avatar"
                         style={{ width: 30 }}
                       />
                       {/* <svg className="icon-avatar" viewBox="0 0 32 32">
                 <use xlinkHref="#avatar" />
               </svg> */}
                     </div>
                   )}
                   <p className="chatbot__message">{message.content}</p>

                   <span
                     className={`chatbot__arrow chatbot__arrow--${
                       message.type === "ai" ? "left" : "right"
                     }`}
                   ></span>
                 </li>
               ))}
             </ul>
           </div>
         </div>
         <div className="chatbot__entry chatbot--closed">
           <input
             type="text"
             className="chatbot__input"
             placeholder="Type a message..."
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
             onKeyDown={(event) => {
               if (event.key === "Enter") sendMessage();
             }}
           />
           <i
             className="fa fa-paper-plane sent"
             aria-hidden="true"
             onClick={sendMessage}
           ></i>
         </div>
       </div>
     </div>
   );
 }

 // Render the Chatbot component
 ReactDOM.render(
   <Chatbot />,
   document.getElementById("chatbot-container")
 );