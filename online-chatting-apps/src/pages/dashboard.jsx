import { useState } from "react";
import { useEffect } from "react";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth, app } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoSettings } from "react-icons/io5";
const db = getFirestore();

export default function ChatRoom() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newHeight, setNewHeight] = useState(0);
  const [profile, setProfile] = useState({})

  async function fetchProfile() {
    try {
      let { data } = await axios({
        url: "http://localhost:3000/profile",
        method: "get",
        headers: {
          Authorization: localStorage.getItem("access_token"),
        },
      });
    //   console.log(data);
    setProfile(data.Profile)
    } catch (error) {}
  }

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user, `======`);
        setUser({
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setUser({
          email: localStorage.getItem("email"),
          displayName: localStorage.getItem("fullName"),
        });
      }
    });
    fetchProfile();
  }, []);

  useEffect(() => {
    document
      .querySelector(".flex.flex-col.h-full.overflow-x-auto.mb-4")
      .scrollTo(
        0,
        document.querySelector(".flex.flex-col.h-full.overflow-x-auto.mb-4")
          .scrollHeight
      );
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();

    setNewMessage(event.target[0].value);
    await addDoc(collection(db, "messages"), {
      email: user.email,
      imgUrl:
        profile.imgUrl,
      nickname: user.displayName,
      text: newMessage,
      timestamp: serverTimestamp(),
    });
    setNewMessage("");
  };

  console.log(profile);

  return (
    // <div>
    //   {user ? (
    // <>
    //   <div>
    //     Logged in as {user.displayName}
    //   </div>
    //   <input value={newMessage} onChange={e => setNewMessage(e.target.value)} />
    //   <button onClick={sendMessage}>
    //     Send Message
    //   </button>
    //   <button onClick={() => auth.signOut()}>Logout</button>
    //   {messages.map(msg => (
    //     <div key={msg.id}>
    //       <img src={msg.data.imgUrl} style={{
    //         width: 50,
    //       }} />
    //       {msg.data.text}
    //     </div>
    //   ))}
    // </>
    //   ):
    //   <button onClick={handleGoogleLogin}>Login With Google</button>
    // }
    // </div>
    <>
      {/* component */}
      <div className="flex h-screen antialiased text-gray-800">
        <div className="flex flex-row h-full w-full overflow-x-hidden">
          <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
            <div className="flex flex-row items-center justify-center h-12 w-full">
              <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div className="ml-2 font-bold text-2xl">QuickChat</div>
            </div>
            <div className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg">
              <div className="flex w-full place-content-end">
                <Link to="/profile">
                  <IoSettings className="size-6" />
                </Link>
              </div>
              <div className="h-20 w-20 rounded-full border overflow-hidden">
                <img
                    src={profile && profile.imgUrl}
                  alt="Avatar"
                  className="h-full w-full"
                />
              </div>
              <div className="text-sm font-semibold mt-2">
                {user && user.displayName}
              </div>
              {/* <div className="text-xs text-gray-500">Lead UI/UX Designer</div> */}
              <div className="flex flex-row items-center mt-3">
                <button
                  className="middle none center rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  data-ripple-light="true"
                  onClick={() => {
                    auth.signOut();
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-full p-6">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
              <div className="flex flex-col h-full overflow-x-auto mb-4">
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-12 gap-y-2">
                    {messages.map((msg) => {
                      return (
                        <div
                          className={
                            msg.data.email === user.email
                              ? "col-start-6 col-end-13 p-3 rounded-lg"
                              : "col-start-1 col-end-8 p-3 rounded-lg"
                          }
                        >
                          <div
                            className={
                              msg.data.email === user.email
                                ? "flex items-center justify-start flex-row-reverse"
                                : "flex flex-row items-center"
                            }
                          >
                            {msg.data.nickname}
                          </div>
                          <div
                            className={
                              msg.data.email === user.email
                                ? "flex items-center justify-start flex-row-reverse"
                                : "flex flex-row items-center"
                            }
                          >
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                              <img
                                src={msg.data.imgUrl}
                                alt="Avatar"
                                className="h-full w-full rounded-full"
                              />
                            </div>
                            <div
                              className={
                                msg.data.email === user.email
                                  ? "relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                                  : "relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                              }
                            >
                              <div>{msg.data.text}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* <div className="col-start-6 col-end-13 p-3 rounded-lg">
                      <div className="flex items-center justify-start flex-row-reverse">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                          A
                        </div>
                        <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                          <div>I'm ok what about you?</div>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                <div className="flex-grow ml-4">
                  <form onSubmit={sendMessage}>
                    <div className="relative w-full">
                      <input
                        type="text"
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
                <div className="ml-4">
                  <button className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0">
                    <span>Send</span>
                    <span className="ml-2">
                      <svg
                        className="w-4 h-4 transform rotate-45 -mt-px"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
