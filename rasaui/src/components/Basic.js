import './chatBot.css';
import react, { useEffect, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { BiBot, BiUser } from 'react-icons/bi';

function Basic() {
    const [chat, setChat] = useState([]); // menyimpan data chat antara user dan bot
    const [inputMessage, setInputMessage] = useState(''); // menyimpan data inputan text user
    const [botTyping, setbotTyping] = useState(false); // flag fetch data untuk response bot
    const recognition = new window.webkitSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const synth = window.speechSynthesis;

    recognition.continuous = true;
    recognition.lang = "id";
    recognition.interimResults = false;

    // scroll messageArea
    useEffect(() => {
        const objDiv = document.getElementById('messageArea');
        objDiv.scrollTop = objDiv.scrollHeight;
    }, [chat])

    useEffect(() => {
        if (isListening) {
            recognition.start();
            recognition.onresult = (event) => {
                let textResult = '';
                textResult = event.results[event.results.length - 1][0].transcript;
                setInputMessage(textResult);
            };
        } else {
            recognition.stop();
        }

        return () => {
            recognition.stop();
        };
    }, [isListening]);

    useEffect(() => {
        if (isListening && inputMessage.trim() !== "") {
            const name = "customer"; // init nama user
            const request_temp = { sender: "user", sender_id: name, msg: inputMessage }; // json data chat user yang disimpen di variable chat

            if (inputMessage !== "") { // error handling
                setChat(chat => [...chat, request_temp]); // append data chat
                setbotTyping(true); // ganti state bot
                setInputMessage(''); // inisialisasi ulang untuk variabel input user
                rasaAPI(name, inputMessage); // fetch data response bot menggunakan Rasa api
            }
        }
    }, [isListening, inputMessage]);

    // handle ketika user mengirim input text
    const handleSubmit = (evt) => {
        evt.preventDefault();
        const name = "customer"; // init nama user
        const request_temp = { sender: "user", sender_id: name, msg: inputMessage }; // json data chat user yang disimpen di variable chat

        if (inputMessage !== "") { // error handling
            setChat(chat => [...chat, request_temp]); // append data chat
            setbotTyping(true); // ganti state bot
            setInputMessage(''); // inisialisasi ulang untuk variabel input user
            rasaAPI(name, inputMessage); // fetch data response bot menggunakan Rasa api
        }
    }

    // rasa api untuk mengambil data response bot
    const rasaAPI = async function handleClick(name, msg) {
        // post input message
        await fetch('http://localhost:5005/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'charset': 'UTF-8',
            },
            credentials: "same-origin",
            body: JSON.stringify({ "sender": name, "message": msg }),
        })
            .then(response => response.json())
            .then((response) => { // ambil output model
                if (response) {
                    console.log(response);
                    const temp = response[0];
                    const recipient_id = temp["recipient_id"];
                    const recipient_msg = temp["text"];
                    // json data chat bot yang disimpen di variable chat
                    const response_temp = { sender: "bot", recipient_id: recipient_id, msg: recipient_msg };
                    setbotTyping(false); // ganti state

                    let utterance = new SpeechSynthesisUtterance(recipient_msg);
                    utterance.lang = 'id-ID';
                    synth.speak(utterance);
                    setChat(chat => [...chat, response_temp]); // append data chat
                }
            })
    }

    const toggleListening = () => {
        setIsListening(prevState => !prevState);
    };

    const stylecard = {
        maxWidth: '35rem',
        border: '1px solid black',
        paddingLeft: '0px',
        paddingRight: '0px',
        borderRadius: '30px',
        boxShadow: '0 16px 20px 0 rgba(0,0,0,0.4)'

    }
    const styleHeader = {
        height: '4.5rem',
        borderBottom: '1px solid black',
        borderRadius: '30px 30px 0px 0px',
        backgroundColor: '#8012c4',

    }
    const styleFooter = {
        //maxWidth : '32rem',
        borderTop: '1px solid black',
        borderRadius: '0px 0px 30px 30px',
        backgroundColor: '#8012c4',


    }
    const styleBody = {
        paddingTop: '10px',
        height: '28rem',
        overflowY: 'a',
        overflowX: 'hidden',

    }

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">

                    <div className="card" style={stylecard}>
                        <div className="cardHeader text-white" style={styleHeader}>
                            <h1 style={{ marginBottom: '0px' }}>Receptionist Assistant</h1>
                            {botTyping ? <h6>Bot Typing....</h6> : null}
                        </div>
                        <div className="cardBody" id="messageArea" style={styleBody}>

                            <div className="row msgarea">
                                {/* menampilkan chat antara user dan bot */}
                                {chat.map((user, key) => (
                                    <div key={key}>
                                        {user.sender === 'bot' ?
                                            (

                                                <div className='msgalignstart'>
                                                    <BiBot className="botIcon" /><h5 className="botmsg">{user.msg}</h5>
                                                </div>

                                            )
                                            : (
                                                <div className='msgalignend'>
                                                    <h5 className="usermsg">{user.msg}</h5><BiUser className="userIcon" />
                                                </div>
                                            )
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="cardFooter text-white" style={styleFooter}>
                            <div className="row">
                                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                                    <div className="col-10" style={{ paddingRight: '0px' }}>
                                        <input onChange={e => setInputMessage(e.target.value)} value={inputMessage} type="text" className="msginp"></input>
                                    </div>
                                    <div className="col-2" style={{ display: 'flex' }}>
                                        <button type="submit" className="circleBtn" ><IoMdSend className="sendBtn" /></button>
                                        <button onClick={toggleListening} className="circleBtn">
                                            {isListening ? 'Stop' : 'Start'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Basic;
