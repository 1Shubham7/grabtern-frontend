import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("../../components/Header"));
import axios from "axios";


function Index({ mentorDetail }) {
  const [showModal, setShowModal] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const { id,amount } = orderDetail;


  const options = {
    key: "rzp_test_3OYSLbNvYT5U0s",
    amount:amount,
    currency: "INR",
    name: "Grabtern",
    description: "Pay & Checkout this Session",
    image:
      "/whitelogo.png",
    order_id: id ,
    handler:async function (response) {
      console.log(response);
      const res=await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentors/bookSession/verifyOrder`, 
response
      );
      console.log(res);
      alert("This step of Payment Succeeded");
    },
    prefill: {
      //Here we are prefilling random contact
      contact: "9876543210",
      //name and email id, so while checkout
      name: "Aarib",
      email: "sayyedaribhussain4321@gmail.com",
    },
    theme: {
      color: "#2300a3",
    },
  };
  const razorpayObject = new Razorpay(options);
  console.log("razorpayObject here ",razorpayObject);
  razorpayObject.on("payment.failed", function (response) {
    console.log("razorpay failed response here",response);

    alert("This step of Payment Failed");
  });

  const handleBookSession = async (amount, currency,e) => {
    e.preventDefault();
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentors/bookSession/createOrder`,
      {
        amount: amount,
        currency: currency,
      }
    );
    console.log(response);
    const { data } = response;
    setOrderDetail(data);
    console.log("order details here", orderDetail);
    razorpayObject.open();
  };

  // document.getElementById('pay-button').onclick = function(e){
  // 	razorpayObject.open();
  // 	e.preventDefault();
  // }

  return (
    <>
      <Header navbarBackground={true} />
      <main style={{ marginTop: "119px" }}>
        {!mentorDetail ? (
          <p>Loading...</p>
        ) : (
          <div className="mentorDetail">
            <div className="container">
              {showModal === true ? (
                <div className="modalPopup">
                  <div className="modalPopupAfterRegistrationDone">
                    <i
                      onClick={() => setShowModal(false)}
                      style={{
                        cursor: "pointer",
                        marginLeft: "auto",
                        fontSize: "25px",
                      }}
                      className="fas fa-times"
                    ></i>
                    <p style={{ marginBottom: "0" }}>
                      Here is the link of the mentor detail that you can share
                      with your friends: <br />
                      <br />
                      <span
                        onClick={(e) => {
                          navigator.clipboard.writeText(e.target.innerText);
                          alert("Copied to clipboard!");
                        }}
                        style={{
                          backgroundColor: "whitesmoke",
                          width: "100%",
                          padding: "15px",
                        }}
                      >{`${process.env.NEXT_PUBLIC_FRONTEND_URL}/mentors/${mentorDetail.name}`}</span>
                    </p>
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        marginRight: "auto",
                        cursor: "pointer",
                        border: "none",
                        backgroundColor: "green",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "10px",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : null}
              <div className="row1">
                <img src={mentorDetail.mentorImg} />
                <i
                  class="fas fa-share-square"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowModal(true)}
                ></i>
              </div>
              <h1>{mentorDetail.name}</h1>
              <h3>
                {mentorDetail.internAt} | {mentorDetail.currentStatus}
              </h3>
              <ul
                className="contactLinks"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  margin: "20px 0",
                }}
              >
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "600",
                  }}
                >
                  <i class="fas fa-envelope"></i>
                  <a target="_blank" href={`mailto:${mentorDetail.email}`}>
                    {mentorDetail.email}
                  </a>
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "600",
                  }}
                >
                  <i class="fab fa-linkedin"></i>
                  <a target="_blank" href={mentorDetail.social.linkedin}>
                    {mentorDetail.social.linkedin}
                  </a>
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "600",
                  }}
                >
                  <i class="fab fa-twitter"></i>
                  <a target="_blank" href={mentorDetail.social.twitter}>
                    {mentorDetail.social.twitter}
                  </a>
                </li>
              </ul>
              <br />
              <h2 style={{ fontSize: "24px" }}>About</h2>
              <p>{mentorDetail.description}</p>
              <br />
              <h2 style={{ fontSize: "24px" }}>Sessions</h2>
              <ul className="bookSessions">
                {mentorDetail.bookSession.length !== 0 ? (
                  mentorDetail.bookSession.map((session) => (
                    <li>
                      <div
                        className="bookSessionHeader"
                        style={{ alignItems: "center" }}
                      >
                        <i
                          class={
                            session.sessionType === "video-meeting"
                              ? "fas fa-video"
                              : session.sessionType === "call-meeting"
                              ? "fas fa-phone"
                              : ""
                          }
                          style={{ fontSize: "25px" }}
                        ></i>
                        <div>
                          <h2>{session.sessionName}</h2>
                          <p>{session.sessionDescription}</p>
                        </div>
                      </div>
                      <div
                        className="bookSessionIcons"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "20px",
                        }}
                      >
                        <div>
                          <i className="far fa-clock"></i>
                          {session.sessionMeetingDuration} min
                        </div>
                        <div>
                          <i className="fas fa-rupee-sign"></i>
                          {session.priceSession}
                        </div>
                      </div>
                      <button
                        style={{ cursor: "pointer" }}
                        onClick={(e) => handleBookSession(session.priceSession*100, "INR",e)}
                      >
                        Book Session
                      </button>
                    </li>
                  ))
                ) : mentorDetail.bookSession.length === 0 ? (
                  <p>You not have book sessions yet</p>
                ) : null}
              </ul>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default Index;

export const getServerSideProps = async (context) => {
  const { mentorUsername } = context.params;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentors/mentorDetail/${mentorUsername}`;

  const { data: res } = await axios.get(url);
  if (res.message === "Invalid link") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {
        mentorDetail: null,
      },
    };
  }
  return {
    props: {
      mentorDetail: res.mentorDetail,
    },
  };
};
