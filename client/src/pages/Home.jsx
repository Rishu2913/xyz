import "./Home.css";

import edunaLogo from "../assests/eduna-logo.png";
import homeIcon from "../assests/home.png";
import exploreIcon from "../assests/explore.png";
import worldsIcon from "../assests/worlds.png";
import communityIcon from "../assests/community.png";
import eventsIcon from "../assests/events.png";
import { Link } from "react-router-dom";

import homepage from "../assests/homepage.png";
import exploreYourWorlds from "../assests/explore-your-worlds.png";

import library from "../assests/library.png";
import code from "../assests/code.png";
import connect from "../assests/connect.png";
import arena from "../assests/arena.png";

function Home() {
    return (
        <>
            {/* ================= HEADER ================= */}

            <header className="header">

                {/* EDUNA LOGO */}
                <a href="/" className="logo">
                    <img src={edunaLogo} alt="EDUNA" />
                </a>

                {/* NAVIGATION */}
                <nav className="navigation">

                    <a href="/" className="nav-item active">
                        <img src={homeIcon} alt="" />
                        <span>Home</span>
                    </a>

                    <a href="#" className="nav-item">
                        <img src={exploreIcon} alt="" />
                        <span>Explore</span>
                    </a>

                    <a href="#" className="nav-item">
                        <img src={worldsIcon} alt="" />
                        <span>Worlds</span>
                    </a>

                    <a href="#" className="nav-item">
                        <img src={communityIcon} alt="" />
                        <span>Community</span>
                    </a>

                    <a href="#" className="nav-item">
                        <img src={eventsIcon} alt="" />
                        <span>Events</span>
                    </a>

                </nav>

                {/* RIGHT SIDE */}
                <div className="header-right">

                    {/* SEARCH */}
                    <div className="search-box">
                        <span className="search-icon">⌕</span>

                        <input
                            type="text"
                            placeholder="Search..."
                        />
                    </div>

                    {/* LOGIN */}
                    <Link to="/login" className="login-btn">
                        Login
                    </Link>

                    <Link to="/login" className="started-btn">
                        Get Started
                    </Link>

                </div>

            </header>

            {/* ================= HERO IMAGE ================= */}

            <main>

                <section className="hero">

                    <img
                        src={homepage}
                        alt="EDUNA Learning Multiverse"
                        className="hero-image"
                    />

                </section>

            </main>

            {/* ================= EXPLORE YOUR WORLDS ================= */}

            <section className="worlds-section">

                {/* SECTION HEADER */}

                <div className="worlds-header">

                    <div className="worlds-title">

                        <img
                            src={exploreYourWorlds}
                            alt="Explore Your Worlds"
                            className="worlds-heading-image"
                        />

                    </div>

                    <a href="/worlds" className="view-worlds-btn">
                        View All Worlds
                        <span>→</span>
                    </a>

                </div>

                {/* WORLD CARDS */}

                <div className="world-cards">

                    {/* LIBRARY */}

                    <a href="/library" className="world-card">

                        <div className="card-image">

                            <img
                                src={library}
                                alt="Library"
                            />

                        </div>

                        <h3>Library</h3>

                        <p>
                            Books, notes, papers
                            <br />
                            and more.
                        </p>

                        <span className="card-arrow library-arrow">
                            →
                        </span>

                    </a>

                    {/* CODE */}

                    <a href="/code" className="world-card">

                        <div className="card-image">

                            <img
                                src={code}
                                alt="Code"
                            />

                        </div>

                        <h3>Code</h3>

                        <p>
                            DSA, challenges
                            <br />
                            &amp; projects.
                        </p>

                        <span className="card-arrow code-arrow">
                            →
                        </span>

                    </a>

                    {/* CONNECT */}

                    <a href="/connect" className="world-card">

                        <div className="card-image">

                            <img
                                src={connect}
                                alt="Connect"
                            />

                        </div>

                        <h3>Connect</h3>

                        <p>
                            Meet, Discuss
                            <br />
                            and Collaborate.
                        </p>

                        <span className="card-arrow connect-arrow">
                            →
                        </span>

                    </a>

                    {/* ARENA */}

                    <a href="/arena" className="world-card">

                        <div className="card-image">

                            <img
                                src={arena}
                                alt="Arena"
                            />

                        </div>

                        <h3>Arena</h3>

                        <p>
                            Competitions, Quizzes
                            <br />
                            &amp; Leaderboards.
                        </p>

                        <span className="card-arrow arena-arrow">
                            →
                        </span>

                    </a>

                </div>

            </section>
        </>
    );
}

export default Home;