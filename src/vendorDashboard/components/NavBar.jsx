import React from 'react'

const NavBar = ({showLoginHandler,showRegisterHandler, showLogOut, logOutHandler}) => {

  const firmName = localStorage.getItem('firmName')

  return (
    <div className="navSection">
        <div className="company">
            <img src="https://res.cloudinary.com/dlutckjoc/image/upload/v1761800088/ChatGPT_Image_Oct_30_2025_10_15_10_AM_cfdkzt.png" alt="brand" className='brand' />
        </div>
        <div className="firmName">
          <h4>Firmname : {firmName}</h4>
        </div>
        <div className="userAuth">
          {!showLogOut ? 
          <>
            <span onClick={showLoginHandler}>Login/</span>
            <span onClick={showRegisterHandler}>Register</span>
          </>: <span onClick={logOutHandler}>Logout</span>
          }
        </div>
    </div>
  )
}

export default NavBar