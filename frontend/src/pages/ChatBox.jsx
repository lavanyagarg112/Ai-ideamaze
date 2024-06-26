import React, { useEffect, useState } from 'react'

import Query from '../components/chat/QueryChat'
import Response from '../components/chat/ResponseChat'

import classes from './Home.module.css'

const ChatBox = ({messages = [], addMessage, newBranch, userName, latest, handleClick}) => {

  const currentLatest = messages[messages.length - 1]
  const [children, setChildren] = useState(false)

  const [showQuery, setShowQuery] = useState(false)
  const [showAssistantQuery, setShowAssistantQuery] = useState(false)

  const handlenewConvoClick = () => {
    setShowAssistantQuery(true)
  }

  const handlenewContextClick = () => {
    setShowQuery(true)
  }

  const handleNewBranch = (id, canChange, message) => {
    newBranch(id, canChange, message)
    setShowQuery(false)
    setShowAssistantQuery(false)
  }


  const checkChildren = async (checkid) => {
    const data = {
      username: userName,
      id: checkid
    }
    const responseFetch = await fetch(`${process.env.REACT_APP_API_URL}/check-children`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    const responseMessage = await responseFetch.json()
    console.log('exists:', !responseMessage.exists)
    setChildren(responseMessage.exists)

  }

  useEffect(() => {
    currentLatest && checkChildren(currentLatest.id);
  }, [currentLatest]);

  return (
    <div className={classes.scrollablecontent}>
      <Query text={'To create a new idea branch, click on the relevant box, and then, click on "Generate New Idea" to explore a new idea branch. \n\nTo continue the conversation from any previous branch, click on the last box of that branch.'} onClick={() => newBranch('0', false, '')} canChange={false} />
      <Query text={`Username: ${userName}`} onClick={() => newBranch('0', false, '')} canChange={false} />
      <div>
        {console.log("messages: ", messages)}
        {messages.length === 0 ? messages : messages.map((message) => {
          if (message.role === 'user') {
            return <Query key={message.id} text={message.text} onClick={() => handleClick(message.id)} canChange={false}/>
          } else if (message.role === 'assistant') {
            return <Response key={message.id} text = {message.text} onClick={() => handleClick(message.id)} />
          } else {
            return
          }
        }
        )}
        {console.log("LATEST: ", currentLatest)}
        {(currentLatest && !children) || latest.length === 0  ? (
          messages.length === 0
          ? <Query text='add query here' onClick={(message) => handleNewBranch('0', true, message)} canChange={true} />
          : <Query text='add query here' onClick={(message) => handleNewBranch(currentLatest.id, true, message)} canChange={true} addNew={() => addMessage(currentLatest.parent_id)} />
        ) : currentLatest.role === 'user' && checkChildren(currentLatest.id)
          ? (!showQuery ? (<div className={classes.buttonArea}> 
            <button onClick={() => addMessage(currentLatest.id)} className={classes.button}>Generate New Idea</button>
            <button onClick={handlenewContextClick} className={classes.button}>Add more context</button>
          </div>) :
          <Query text='add query here' onClick={(message) => handleNewBranch(currentLatest.id, true, message)} canChange={true} addNew={() => addMessage(currentLatest.parent_id)} />)
          : (!showAssistantQuery ? (<div className={classes.buttonArea}> 
              <button onClick={() => addMessage(currentLatest.parent_id)} className={classes.button}>Give me a different idea</button>
              <button onClick={handlenewConvoClick} className={classes.button}>Continue new conversation</button>
            </div>) : (
            <Query text='add query here' onClick={(message) => handleNewBranch(currentLatest.id, true, message)} canChange={true} addNew={() => addMessage(currentLatest.parent_id)} />))
        }

        

      </div>
    </div>
  )
}

export default ChatBox
