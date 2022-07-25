import React from 'react';
import {useState, useEffect, useRef} from 'react';
import randomWords from 'random-words'

const NUM_OF_WORDS = 200
const SECONDS = 100

function App() {

  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(generateWords())
  },[])

  const [count, setCount] = useState(SECONDS)

  const[currentInput, setCurrentInput] = useState("")

  const[currentWordIndex, setCurrentWordIndex] = useState(0);
  const[correct, setCorrect] = useState(0)
  const[incorrect, setIncorrect] = useState(0)
  const[status,setStatus] = useState("waiting")
  const inputRef = useRef(null)
  const[currentChar, setCurrentChar] = useState("")
  const[currentCharIndex, setCurrentCharIndex] = useState(-1)

  useEffect(() => {
    if(status === 'started')
    {
      inputRef.current.focus()
    }
  }, [status])

  function generateWords()
  {
    return Array(NUM_OF_WORDS).fill(null).map(() => randomWords())
  }

  function startHanlder(){
    if(status === 'finished')
    {
      setCurrentInput("")
      setWords(generateWords())
      setCurrentWordIndex(0)
      setCorrect(0)
      setIncorrect(0)
      setCurrentChar("")
      setCurrentCharIndex(-1)
    }
    if(status !== 'started')
    {
      setStatus("started")
      if(count !== SECONDS)
      {
        setCount(SECONDS)
      }
    let interval = setInterval(() => {
      setCount(prevCount => {
        if(prevCount === 0 )
          {
            setStatus("finished")
            setCurrentInput("")
            clearInterval(interval)
          }
          else{
            return prevCount-1
          }
      })
    }, 500)
    }
  }

  function handleKeyDown({keyCode, key}){
    if(keyCode === 32)
    {
      // blank/mistakenly  pressed shift need to be handled
      checkMatch()
      setCurrentInput("");
      setCurrentWordIndex(prev => prev+1)
      setCurrentCharIndex(-1)
      
    }else if(keyCode === 8)
    {
      setCurrentChar("")
      setCurrentCharIndex(currentCharIndex - 1)
    }
    else{
      setCurrentChar(key)
      setCurrentCharIndex(currentCharIndex + 1)
    }
  }

  function checkMatch(){
    const wordToMatch = words[currentWordIndex]
    const doesItMatch = wordToMatch === currentInput.trim()
    if(doesItMatch)
    {
      setCorrect(correct+1)
    }
    else{
      setIncorrect(incorrect+1)
    }
  }

  function getCharClass(wordIdx, charIdx, char)
  {
    if(wordIdx === currentWordIndex && charIdx === currentCharIndex)
    {
      //console.log('cond 1 true')
      if(char === currentChar)
      {
       // console.log('cond 2 true')
        return 'has-background-success'
      }
      // else if(wordIdx === currentWordIndex && currentCharIndex >= words[currentWordIndex].length())
      // {
      //   return 'has-background-danger'
      // }
      else{
       // console.log('condition 3 true')
        return 'has-background-danger'
      }
    }
    else{
      //console.log('condition 4 true')
      return ''
    }
  }
  return (
    <div className="App">

      {status === 'started' && (
        <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
           <h2>{count}</h2>
         </div>
         <div className="card">
           <div className="card-component">
             <div className="content">
               {words.map((word,wordIdx) => (
                 <span key={wordIdx}>
                   <span>
                     {
                       word.split("").map((char,charIdx) => (
                           <span class={getCharClass(wordIdx, charIdx, char)} key={charIdx}>
                             {char}
                           </span>
                       ))
                     }
                   </span>
                   <span> </span>
                 </span>
               ))}
             </div>
           </div>
         </div>
        </div>
      )}
      
       
       <div className="section">
        <button className="button is-fullwidth is-info" onClick={startHanlder}>Start</button>
        <div className="control is-expanded section">
          <input ref={inputRef} disabled={status !== "started"} type="text" className="input" onKeyDown={handleKeyDown} value={currentInput} onChange={e => setCurrentInput(e.target.value)} />
       </div>
       
      </div>

      {status === 'finished' && (
        <div className="section">
        <div className="column">
          <div className="column has-text-centered">
            <p className="is-size-5">Words Per Minute</p>
            <p className="has-text-primary is-size-1">{correct}</p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5">Accuracy</p>
            <p className="has-text-primary has-text-info is-size-1">{Math.round(correct/(correct+incorrect)*100)}</p>
          </div>
        </div>
        </div>
        )}
      
      
    </div>
  );
}

export default App;
