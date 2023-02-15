import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import feedbackAbi from "./abis/contractsData/Feedback.json";

const contractAddress = "0x557e6f0619DcA5B58064F7fEd7F2C0434cB785cc";
const contractAbi = feedbackAbi.abi;

const getWallet = () => window.ethereum;
const eth = getWallet();

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [message, getMessage] = useState("");
  const [allFeedbacks, getFeedbacks] = useState([]);
  let [checkAcct, setCheck] = useState("");

  const connectWallet = async () => {
    if (typeof eth !== "undefined") {
      const accounts = await eth.request({
        method: "eth_requestAccounts",
      });

      setCheck(1);

      setCurrentAccount(accounts[0]);
      alert("Hey 👋 " + accounts[0]);
    } else {
      alert("🔴Metamask Not Installed🔴");
    }
  };

  const disconnect = function () {
    setCheck(2);
  };

  // Adding feedback to contract
  const newFeedback = async function () {
    document.querySelector("textarea").value = "";
    const validText = /^\S+.*$/;
    let _message = message;
    if (
      message !== "" &&
      message !== " " &&
      validText.test(
        message
          .toString()
          .trim()
          .replace(/(\r\n|\n|\r)/gm, " ")
      )
    ) {
      _message = _message.replace(/(\r\n|\n|\r)/gm, "... ");
      try {
        if (eth) {
          const provider = new ethers.providers.Web3Provider(eth);
          const signer = provider.getSigner();
          const feedbackContract = new ethers.Contract(
            contractAddress,
            contractAbi,
            signer
          );
          const setFeedback = await feedbackContract.setFeedback(_message);
          await setFeedback.wait();
          // feedbacks();
        } else {
          alert("🔴Connect Wallet!🔴");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // calling feedbacks from contract
  const feedbacks = async function () {
    try {
      if (eth) {
        const provider = new ethers.providers.Web3Provider(eth);
        const signer = provider.getSigner();
        const feedbackContract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );

        const getAllFeedbacks = await feedbackContract.getAllFeedback();

        let cleanedFeedback = [];
        let recentFeedback = [];

        for (let i = getAllFeedbacks.length - 1; i >= 0; i--) {
          recentFeedback.push(getAllFeedbacks[i]);
        }

        recentFeedback.forEach(({ user, timestamp, feedback }) => {
          cleanedFeedback.push({
            user: user,
            timestamp: new Date(timestamp * 1000),
            feedback: feedback,
          });
        });

        getFeedbacks(cleanedFeedback);
      } else {
        alert("🔴Connect Wallet!🔴");
      }
    } catch (error) {
      console.log(error);
    }
  };
  feedbacks();

  // Setting page parameters
  const [currentPage, setCurrentPage] = useState(1);
  const [xPerPage, setxPerPage] = useState(5);

  const totalx = allFeedbacks.length;
  const totalPages = Math.ceil(totalx / xPerPage);

  const start = (currentPage - 1) * xPerPage;
  const end = start + xPerPage;

  // To display the feedbacks
  const display = allFeedbacks.slice(start, end);

  // To view next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // To view the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // To go back first page
  const firstPage = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="app">
      <div className="wallet">
        {checkAcct !== 1 && (
          <button className="connect" onClick={connectWallet}>
            connect wallet
          </button>
        )}
        {checkAcct == 1 && (
          <button className="disconnect" onClick={disconnect}>
            disconnect
          </button>
        )}
        <div>
          {checkAcct == 1 && (
            <p className="wallet-address"> {currentAccount}</p>
          )}
        </div>
      </div>
      <div className="first">
        <h1 className="page-header">🕸️Anonymous Feedback Dapp🕸️</h1>
        <p className="sub">
          🔴WARNING: Might contain 🔞CONTENTS🔞... Read at your own risk/will!🔴
        </p>

        <p className="message">Okay... Nobody knows it's you so... 🙈🙉🙊</p>
      </div>
      <div className="input">
        <p className="mgs">Get that sh** off yo chest!💭</p>
        <textarea
          onChange={(e) => getMessage(e.target.value)}
          name="feedback"
          rows="10"
          cols="50"
          form="feedbackForm"
        ></textarea>
        {checkAcct !== 1 && <h4>Connect wallet to submit feedback</h4>}
        {checkAcct == 1 && (
          <div>
            <button
              className="submit"
              onClick={newFeedback}
              form="feedbackForm"
            >
              ENTER
            </button>
          </div>
        )}
      </div>
      {/* {checkAcct == 1 && <div className="line"></div>} */}

      <div className="lists">
        <div className="line"></div>
        <h5>👀👀👀</h5>
        {display.map((feedback, index) => {
          return (
            <div
              key={index}
              className={"list"}
              style={{
                backgroundColor: "darkgoldenrod",
                margin: "10px",
                padding: "10px",
                border: "1px solid black",
                fontWeight: "bold",
              }}
            >
              <div className="type">
                User:
                {feedback.user.toString().slice(0, 2) +
                  "*****" +
                  feedback.user.toString().slice(37)}
              </div>
              <div className="type">Time: {feedback.timestamp.toString()}</div>
              <p className="text">Message: {feedback.feedback}</p>
            </div>
          );
        })}
        {currentPage < totalPages && (
          <button onClick={nextPage} className="pages">
            View More ...
          </button>
        )}
        {currentPage > 1 && (
          <button onClick={prevPage} className="pages">
            {"<<<"}
          </button>
        )}
        {currentPage > 1 && (
          <button onClick={firstPage} className="pages">
            Back to first page
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
