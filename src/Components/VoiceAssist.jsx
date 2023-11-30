import React, { useEffect,useState } from 'react'
import {api_key} from '../config'
import speech,{ useSpeechRecognition } from 'react-speech-recognition';
import './VoiceAssist.css';
import mic from"../Assests/mic.png";
function VoiceAssist() {
    const{listening,transcript} = useSpeechRecognition();
    const [thinking,setThinking] = useState(false);
    const [aitext,setAitext] = useState('');
    const synth = window.speechSynthesis;
    const stopspeech = () => {
        synth.cancel();
    };
    async function callGpt3(msg){
        // synth.cancel();
        setThinking(true);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${api_key}`,
            },
            body: JSON.stringify({
                messages:[
                    {
                        role:"user",
                        content:msg,
                    }
                ],
                model:"gpt-3.5-turbo"
            }),
        });
        const data = await response.json();
        setThinking(false);
        console.log(data);
        
        return data.choices[0].message.content;
    }
    useEffect(()=>{
        if(transcript && !listening){
            callGpt3(transcript).then((response)=>{
                
                const utterance = new SpeechSynthesisUtterance(response);
                synth.speak(utterance);
                setAitext(response);
            });
        }
    },[transcript,listening])
  return (
    <div className='voiceassist'>
      {listening ? <p>Listening...</p> : <p>Press the mic and hold</p>}
      <img  onClick={() =>{speech.startListening();stopspeech()}} src={mic} alt='microphone' className='MIC'></img>

    {
        transcript && <p>You :{transcript}</p>
    }
    {
        thinking && <p>Thinking...</p>
    }
    {
        (aitext && (!thinking && !listening)  ) && <p>AI : {aitext}</p>
    }
    </div>
  )
}

export default VoiceAssist
