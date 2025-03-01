import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useUser } from "./UserContext";
import { rabbitPhoto } from "./images";
import { RxCross2 } from "react-icons/rx";
import { FaChevronRight, FaComments } from "react-icons/fa";

const FriendsPage: React.FC = () => {
  const { userID, setPoints } = useUser();
  const [friends, setFriends] = useState<
    Array<{ Username: string; totalgot: number }>
  >([]);
  const [modalMessage, setModalMessage] = useState<string | null>(null); // Modal state
  const FRIEND_REWARD = 1000; // Points reward per new friend
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const inviteModalRef = useRef<HTMLDivElement | null>(null);
  const [animateModal, setAnimateModal] = useState(false); // Animation trigger

  console.log(friends);

  // Invitation link
  const invitationLink = `https://t.me/Laughinghyenabot/Hyena?startapp=${encodeURIComponent(
    userID
  )}`;

  const handleInvite = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(invitationLink)}`,
      "_blank"
    );
  };

  const setupInvitationLinkCopy = () => {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = invitationLink; // Set the value to the invitation link
    document.body.appendChild(tempTextArea); // Add it to the document
    tempTextArea.select(); // Select the text inside the text area
    document.execCommand("copy"); // Execute the copy command
    document.body.removeChild(tempTextArea); // Remove the temporary text area from the document
    showModal("Invitation link copied to clipboard!");
  };

  const showModal = (message: string) => {
    setModalMessage(message);
  };

  const closeModal = () => {
    setModalMessage(null);
  };

  // Function to update the `referrewarded` count
  const updateReferrewarded = async (newReferrewardedCount: number) => {
    const initData = window.Telegram.WebApp.initData || ""; // Get initData from Telegram WebApp
    try {
      await fetch("https://ELIYINbackend.ELIYINgangbot.com/update_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Init-Data": initData // Add initData to headers
        },
        body: JSON.stringify({
          UserId: userID,
          referrewarded: newReferrewardedCount.toString()
        })
      });
      console.log("referrewarded updated to", newReferrewardedCount);
    } catch (error) {
      console.error("Failed to update referrewarded:", error);
    }
  };

  // Logic to fetch friends and handle rewarding
  const fetchFriends = async () => {
    const initData = window.Telegram.WebApp.initData || ""; // Get initData from Telegram WebApp
    try {
      const response = await fetch(
        `https://ELIYINbackend.ELIYINgangbot.com/get_invitations?UserId=${userID}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-Telegram-Init-Data": initData // Add initData to headers
          }
        }
      );
      const data = await response.json();

      if (data) {
        const invitations = data.invitations || [];
        const totalFriendsCount = invitations.length;
        const referrewardedCount = data.referrewarded
          ? parseInt(data.referrewarded, 10)
          : 0;

        setFriends(invitations); // Update state with friends data

        // Store friends' names in localStorage
        localStorage.setItem(`friends_${userID}`, JSON.stringify(invitations));

        if (totalFriendsCount > referrewardedCount) {
          const newUnrewardedFriends = totalFriendsCount - referrewardedCount;
          const rewardPoints = newUnrewardedFriends * FRIEND_REWARD;

          setPoints((prevPoints) => prevPoints + rewardPoints);
          showModal(
            `You have earned ${rewardPoints} points for inviting ${newUnrewardedFriends} new friends!`
          );

          // Update the user's referrewarded count
          await updateReferrewarded(totalFriendsCount);
        }
      } else {
        // No data returned
        setFriends([]);
        localStorage.removeItem(`friends_${userID}`); // Clear localStorage if no friends
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Fetch friends data on component load
  useEffect(() => {
    if (userID) {
      // Load friends from localStorage
      const localFriends = localStorage.getItem(`friends_${userID}`);
      if (localFriends) {
        setFriends(JSON.parse(localFriends));
      }

      // Fetch friends from the database
      fetchFriends();
    } else {
      console.log("UserID not available");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  // Handle animation state
  useEffect(() => {
    if (isInviteModalOpen) {
      setTimeout(() => setAnimateModal(true), 50); // Add delay for smooth entry
    } else {
      setTimeout(() => setAnimateModal(false), 50); // Add delay for smooth entry
    }
  }, [isInviteModalOpen]);

  // const demoFriends = [
  //   { Username: "TahmindIbne", coin: 45 },
  //   { Username: "Raju", coin: 143 },
  //   { Username: "Sanju", coin: 150 }
  // ];

  return (
    <div
      className="relative text-white z-10"
      style={{
        // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${rabbitPhoto})`,
        background: "linear-gradient(135deg, #A07747, #664D2B)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
        textAlign: "center",
        zIndex: 99999999999,
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="w-full max-w-xl flex flex-col h-[94vh] gap-6 md:justify-center pb-20 overflow-y-scroll hide-scrollbar">
        {/* Header Section */}
        <div className="text-white flex flex-col text-center mt-7 px-4 z-40">
          <h1 className="font-robotoCondensed mb-3 tracking-wide font-bold text-4xl text-start uppercase ">
            Invite friends
          </h1>
          <h1 className="text-2xl font-[400] text-white/80 text-start font-robotoCondensed uppercase ">
            <span className="text-white font-[500]">Share </span>
            Your Invitation <br />
            Link &{" "}
            <span className="text-white font-[500]">GET 1000 HYENA </span>
          </h1>
        </div>

        <div className="flex items-center justify-center relative w-[90%] mt-4">
          {/* <LiaWolfPackBattalion className="text-[170px] text-black" /> */}
          <img
            src={rabbitPhoto}
            alt="ELIYIN image "
            className="h-[140px] w-[140px] rounded-3xl -ml-28 animate-pulse"
            style={{ transform: "rotate(-10deg)" }}
          />

          <div className="absolute top-5 z-30 right-3">
            <img
              src={rabbitPhoto}
              alt="Ghost"
              className="h-[140px] w-[140px] rounded-xl rotate-12 animate-pulse opacity-80"
              style={{ transform: "rotate(10deg)" }}
            />
          </div>
        </div>

        {/* Friends */}

        <div className="flex flex-col gap-2 z-30">
          <div className="pb-2">
            <h2 className="text-white mx-6 text-[25px] text-[Poppins] font-sans font-semibold z-50">
              {friends?.length} Friends
            </h2>
          </div>
          {friends?.length > 0 ? (
            <div className=" mx-1 flex flex-col gap-2 z-50">
              {friends?.map((friend, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between text-white px-2 py-2 border border-white/40 bg-opacity-60 backdrop-filter backdrop-blur-lg p-2  shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden z-50"
                  >
                    <div className="flex items-center">
                      <div
                        className={`${
                          friend?.Username.startsWith("T")
                            ? "bg-green-600"
                            : friend?.Username.startsWith("A")
                            ? "bg-orange-600"
                            : friend?.Username.startsWith("R")
                            ? "bg-blue-700"
                            : "bg-gray-400"
                        } rounded-full w-10 h-10 flex items-center justify-center z-50`}
                      >
                        <h1 className="font-[Poppins] font-semibold text-[Poppins] text-white z-50">
                          {friend?.Username.slice(0, 2).toUpperCase()}
                        </h1>
                      </div>
                      <h2 className="text-[20px] text-sm text-[Poppins]font-sans font-semibold ml-2 z-50">
                        {friend?.Username}
                      </h2>
                    </div>
                    <div className="text-[20px] font-sans font-semibold z-50">
                      <span className="text-[20px] font-[Poppins] font-semibold z-50">
                        +1000
                      </span>
                      <span className="text-[20px] text-md z-50"> HYENA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white text-center z-50">
              No friends invited yet.
            </p>
          )}
        </div>

        {/* Buttons */}

        <div className="flex items-center justify-center  mb-3 mt-5 z-50">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="text-white border w-[86%] py-1 rounded-lg text-[20px] font-sans pb-2 border-white/70"
            // className="px-6 py-3 text-white rounded-full text-lg font-semibold mb-8 shadow-lg hover:scale-105 transition-transform"
            style={{
              // backgroundImage: "linear-gradient(to right, #FFD700, #EA2E33)",
              backgroundImage: "linear-gradient(to right, #A07747, #664D2B)"
            }}
          >
            Invite Friends
          </button>
        </div>
      </div>

      {/* Modal Component */}
      {modalMessage && <Modal message={modalMessage} onClose={closeModal} />}

      {/* {isInviteModalOpen && (
        <div
          ref={inviteModalRef}
          style={{
            backdropFilter: "blur(64px)",
            border: "1px solid #FFFFFF33",
            background: "black",
          }}
          className={`fixed  left-1/2 transform -translate-x-1/2  md:max-w-xl bg-black bg-opacity-50  justify-around  z-50 text-xs bottom-0 flex flex-col items-center animate-bounce-once   w-full  transition-transform duration-700 ease-in-out pb-24 ${
            isInviteModalOpen
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-full opacity-0 scale-95"
          } text-white p-6 rounded-t-lg shadow-lg`}
        >
          <div className="space-y-3 w-full flex flex-col items-center">
            <div
              className="flex items-center w-full  justify-between p-2 rounded-lg "
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.24)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className=" flex items-center justify-center z-50 w-full">
                <div className=" text-white  rounded-lg w-full">
                  <div className="flex justify-between items-center mb-4 w-full">
                    <h2 className="text-lg font-semibold text-end w-[60%]">
                      Invite friends
                    </h2>
                    <button
                      onClick={() => setIsInviteModalOpen(false)}
                      className="text-gray-400 hover:text-gray-300 w-[20%] text-2xl"
                    >
                      &times;
                    </button>
                  </div>
                  <button
                    className="w-full bg-white text-black py-2 rounded-lg mb-4"
                    onClick={setupInvitationLinkCopy}
                  >
                    Copy invite link
                  </button>
                  <button
                    className="w-full bg-white text-black  py-2 rounded-lg "
                    onClick={handleInvite}
                  >
                    Share invite link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
      {isInviteModalOpen && (
        <>
          {/* Modal Component */}
          {modalMessage && (
            <Modal message={modalMessage} onClose={closeModal} />
          )}

          {/* Background Blur Overlay */}
          <div
            className={`fixed inset-0 bg-[#141414] bg-opacity-50 backdrop-blur-md z-40 w-full h-full transition-opacity duration-300 ${
              animateModal ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setIsInviteModalOpen(false)} // Close modal when clicking outside
          ></div>

          <div
            ref={inviteModalRef}
            style={{
              boxShadow: "0px 0px 10px #493545"
            }}
            className={`fixed left-1/2 bottom-0 transform -translate-x-1/2 md:max-w-xl w-full bg-[#151516] text-white p-4 rounded-t-2xl z-50 transition-all duration-500 ease-in-out pb-24 ${
              animateModal
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <div className="w-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 px-4">
                <h2 className="text-lg font-semibold">Invite</h2>
                <button
                  onClick={() => setIsInviteModalOpen(false)}
                  className="text-white text-2xl"
                >
                  <RxCross2 />
                </button>
              </div>

              {/* Options */}
              <div className="bg-[#2E2214] rounded-lg shadow-md p-4">
                {/* Option 1 */}
                <div
                  onClick={handleInvite}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-[#2c2c2e] px-2 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 text-lg">
                      <FaComments className="text-gray-300 text-lg" />
                    </span>
                    <span className="text-white">Send message</span>
                  </div>
                  <span className="text-gray-400">
                    <FaChevronRight />
                  </span>
                </div>

                <hr className="border-gray-700 my-2" />
                {/* Option 2 */}
                <div
                  onClick={setupInvitationLinkCopy}
                  className="flex items-center justify-between py-2 cursor-pointer hover:bg-[#2c2c2e] px-2 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300 text-lg">🔗</span>
                    <span className="text-white">Copy Link</span>
                  </div>
                  <span className="text-gray-400">
                    <FaChevronRight />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FriendsPage;
