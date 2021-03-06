import React from 'react';
import { Link } from 'react-router';

const FullNavBar = (props) => {
  let destinations = ["flashcards", "notes", "reminders"]
  let destinationsHTML = destinations.map(dest =>{
    let linkClassName = "";
    if(props.pathname.includes(dest)){
      linkClassName += " nav-active-link"
    }
    return(
      <li key={dest} className={`nav-list-item ${linkClassName}`}>
        <Link to={`/${dest}`}>
          {dest[0].toUpperCase() + dest.slice(1)}
        </Link>
      </li>
    )
  })

  let darkModeToggle = (<i className="far fa-sun fa-lg"></i>)
  if(props.darkMode){
    darkModeToggle = (<i className="far fa-moon fa-lg"></i>)
  }

  return(
    <div>
      <div className="top-bar">
        <div className="top-bar-left">
          <ul className="menu">
            <li className="menu-text nav-list-item"><Link id="title-link" to="/">Manabu</Link></li>
            {destinationsHTML}
          </ul>
        </div>
        <div className="top-bar-right">
          <ul className="menu">
            <li className="nav-list-item" onClick={props.toggleDarkMode}>
              {darkModeToggle}
            </li>
            <li className="nav-list-item">
              <Link href='/users/profile'>
              <i
                className="fas fa-user-circle fa-lg">
              </i>
            </Link>
            </li>
            <li className="nav-list-item" onClick={props.signOut}>Sign Out</li>
          </ul>
        </div>
      </div>
      <div className="grid-x body">
        <div className="cell small-22 small-offset-1 medium-20 medium-offset-2">
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default FullNavBar;
