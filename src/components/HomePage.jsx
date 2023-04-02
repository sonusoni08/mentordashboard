import React from 'react'
import "./HomePage.css"
import userImage from "../images/user.png"
import { Link } from "react-router-dom";


function HomePage() {
    return (
        <div class="row justify-content-center">
            <h1 className='text-center'>Mentors</h1>
            <div class="row text-center justify-content-center">
                <div class="cards_item max-width col-sm-6">
                    <div class="card">
                        <div class="card_image"><img src={userImage} /></div>
                        <div class="card_content p-4">
                            <h2 class="card_title">Mentor 1</h2>
                            <p class="card_text">CSE Department</p>
                            <Link to = "/mentor1" class = "home-dashboard"><button class="btn btn-primary">Dashboard</button></Link>
                        </div>
                    </div>
                </div>
                <div class="cards_item max-width col-sm-6">
                    <div class="card">
                        <div class="card_image"><img src={userImage} /></div>
                        <div class="card_content p-4">
                            <h2 class="card_title">Mentor 2</h2>
                            <p class="card_text">CSE Department</p>
                            <Link to = "/mentor2" class = "home-dashboard"><button class="btn btn-primary">Dashboard</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage