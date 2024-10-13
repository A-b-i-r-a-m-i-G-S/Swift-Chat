import React, { useContext, useEffect, useState } from 'react'
import './ChatBot.css'
import assets from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import upload from '../../lib/upload'
import { toast } from 'react-toastify'

const ChatBox = () => {
  const { userData, messagesId, messages, chatUser, setMessages, chatVisible, setChatVisible } = useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date()
          })
        })

        const userIds = [chatUser.rId, userData.id];
        console.log(userIds);
        const updatePromises = userIds.map(async (id) => {
          const userChatRef = doc(db, 'chats', id);
          const userChatSnapshot = await getDoc(userChatRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            console.log("User Chat Data:", userChatData); // Log entire chat data
            const chatIndex = userChatData.chatData.findIndex(c => c.messageId === messagesId);
            console.log(`Looking for messageId: ${messagesId}, Chat Index: ${chatIndex}`, userChatData.chatData); // Debugging log

            if (chatIndex !== -1) {
              userChatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
              userChatData.chatData[chatIndex].updatedAt = Date.now();

              if (userChatData.chatData[chatIndex].rId === userData.id) {
                userChatData.chatData[chatIndex].messageSeen = false;
              }

              try {
                await updateDoc(userChatRef, {
                  chatData: userChatData.chatData
                });
                console.log("Updated chat data:", userChatData.chatData); // Log updated data
              } catch (error) {
                console.error("Error updating chat data:", error);
              }
            } else {
              console.error(`No chat found for messageId: ${messagesId}`);
            }
          } else {
            console.error(`Chat not found for userId: ${id}`);
          }
        })
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error)
    }

    setInput("");
  }

  const sendImage = async (e) => {
    try {
      const fileURL = await upload(e.target.files[0]);
      if (fileURL && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: fileURL,
            createdAt: new Date()
          })
        })
        const userIds = [chatUser.rId, userData.id];
        console.log(userIds);
        const updatePromises = userIds.map(async (id) => {
          const userChatRef = doc(db, 'chats', id);
          const userChatSnapshot = await getDoc(userChatRef);

          if (userChatSnapshot.exists()) {
            const userChatData = userChatSnapshot.data();
            console.log("User Chat Data:", userChatData); // Log entire chat data
            const chatIndex = userChatData.chatData.findIndex(c => c.messageId === messagesId);
            console.log(`Looking for messageId: ${messagesId}, Chat Index: ${chatIndex}`, userChatData.chatData); // Debugging log

            if (chatIndex !== -1) {
              userChatData.chatData[chatIndex].lastMessage = "image";
              userChatData.chatData[chatIndex].updatedAt = Date.now();

              if (userChatData.chatData[chatIndex].rId === userData.id) {
                userChatData.chatData[chatIndex].messageSeen = false;
              }

              try {
                await updateDoc(userChatRef, {
                  chatData: userChatData.chatData
                });
                console.log("Updated chat data:", userChatData.chatData); // Log updated data
              } catch (error) {
                console.error("Error updating chat data:", error);
              }
            } else {
              console.error(`No chat found for messageId: ${messagesId}`);
            }
          } else {
            console.error(`Chat not found for userId: ${id}`);
          }
        })
      }
    } catch (error) {

    }
  }

  const convertTimeStamp = (timestamp) => {
    let date = timestamp.toDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    if (hour > 12) {
      return hour - 12 + ":" + minute + "PM";
    }
    return hour + ":" + minute + "AM";
  }

  useEffect(() => {
    if (messagesId) {
        const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
            if (res.exists()) {
                const data = res.data();
                if (data.messages) { 
                    setMessages(data.messages.reverse());
                } else {
                    console.error("Messages not found in the document");
                    setMessages([]);
                }
            } else {
                console.error(`No document found with ID: ${messagesId}`);
                setMessages([]);
            }
        });

        return () => {
            unSub();
        }
    } else {
        setMessages([]);
    }
}, [messagesId]);


  return chatUser ? (
    <div className={`chat-box ${chatVisible ? "" : "hidden"}`}>
      <div className="chat-user">
        <img src={chatUser.userData.avatar} alt="" />
        <p>{chatUser.userData.name} {Date.now() - chatUser.userData.lastSeen <= 60000 ? <img src={assets.green_dot} className='dot'/> : null}</p>
        <img src={assets.help_icon} className='help' alt="" />
        <img onClick={()=>setChatVisible(false)} src={assets.arrow_icon} className='arrow' alt="" />
      </div>

      <div className="chat-msg">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
            {msg["image"]
              ? <img className="msg-image" src={msg.image} alt="" />
              :
              <p className='msg'>{msg.text}</p>
            }

            <div>
              <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt="" />
              <p>{convertTimeStamp(msg.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='chat-input'>
        <input type="text" placeholder='Start chatting' onChange={(e) => setInput(e.target.value)} value={input} />
        <input type="file" id='image' accept='image/png, image/jpeg' hidden onChange={sendImage} />
        <label htmlFor='image'>
          <img src={assets.gallery_icon} alt="" />
        </label>
        <img src={assets.send_button} onClick={sendMessage} alt="" />
      </div>
    </div>
  )
    :
    <div className={`chat-welcome ${chatVisible ? "" : "hidden"}`}>
      <img src={assets.logo_icon} alt="" />
      <p>Chat Anytime Anywhere</p>
    </div>
}

export default ChatBox